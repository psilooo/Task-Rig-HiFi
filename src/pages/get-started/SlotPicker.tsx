import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, CalendarDays, Clock } from 'lucide-react';

interface SlotsByDate {
  [date: string]: { slots: string[] };
}

interface SlotPickerProps {
  selected: string | null;
  onSelect: (slot: string) => void;
}

function formatDateHeading(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';

  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export const SlotPicker: React.FC<SlotPickerProps> = ({ selected, onSelect }) => {
  const [slots, setSlots] = useState<SlotsByDate>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateIndex, setDateIndex] = useState(0);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/calendar?timezone=${encodeURIComponent(timezone)}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      // Filter out dates with no slots
      const filtered: SlotsByDate = {};
      for (const [date, val] of Object.entries(data)) {
        const v = val as { slots: string[] };
        if (v.slots?.length > 0) filtered[date] = v;
      }
      setSlots(filtered);
    } catch {
      setError('Could not load available times. We\'ll reach out to schedule your walkthrough.');
    } finally {
      setLoading(false);
    }
  }, [timezone]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const dates = Object.keys(slots).sort();
  const currentDate = dates[dateIndex];
  const currentSlots = currentDate ? slots[currentDate]?.slots ?? [] : [];

  if (loading) {
    return (
      <div className="border border-zinc-800 rounded-sm p-8 flex flex-col items-center gap-3">
        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
        <p className="text-zinc-500 font-mono text-xs">Loading available times...</p>
      </div>
    );
  }

  if (error || dates.length === 0) {
    return (
      <div className="border border-zinc-800 rounded-sm p-6 text-center space-y-2">
        <p className="text-zinc-400 font-mono text-sm">
          {error || 'No available times right now.'}
        </p>
        <p className="text-zinc-500 font-mono text-xs">
          We'll reach out within 24 hours to schedule your walkthrough.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 rounded-sm overflow-hidden">
      {/* Date navigator */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <button
          onClick={() => setDateIndex((i) => Math.max(0, i - 1))}
          disabled={dateIndex === 0}
          className="p-1 text-zinc-400 hover:text-white disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-3.5 h-3.5 text-orange-500" />
          <span className="font-mono text-sm text-white font-medium">
            {formatDateHeading(currentDate)}
          </span>
        </div>
        <button
          onClick={() => setDateIndex((i) => Math.min(dates.length - 1, i + 1))}
          disabled={dateIndex === dates.length - 1}
          className="p-1 text-zinc-400 hover:text-white disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Time slots grid */}
      <div className="p-3 max-h-[240px] overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-3 gap-2"
          >
            {currentSlots.map((slot) => {
              const isSelected = selected === slot;
              return (
                <button
                  key={slot}
                  onClick={() => onSelect(slot)}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-sm font-mono text-xs transition-all ${
                    isSelected
                      ? 'bg-orange-500/15 border border-orange-500/50 text-orange-400'
                      : 'bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                  }`}
                >
                  {isSelected && <Clock size={12} />}
                  {formatTime(slot)}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Selected confirmation */}
      {selected && (
        <div className="px-4 py-2.5 border-t border-zinc-800 bg-emerald-500/5">
          <p className="text-emerald-400 font-mono text-xs flex items-center gap-2">
            <Clock size={12} />
            {formatDateHeading(selected.split('T')[0])} at {formatTime(selected)}
          </p>
        </div>
      )}
    </div>
  );
};
