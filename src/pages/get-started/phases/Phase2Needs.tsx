import React from 'react';
import { motion } from 'framer-motion';
import {
    PhoneOff, Clock, CalendarX, Moon, ClipboardList, Star,
} from 'lucide-react';
import { PAIN_POINTS } from '../../../constants/industries';
import { TEAM_SIZES } from '../../../constants/integrations';
import {
    labelClass, chipBaseClass, chipSelectedClass, chipUnselectedClass,
} from '../../../components/forms/styles';
import { staggerItem } from '../animations';
import type { LeadData } from '../../../types';

/* ── Icon mapping for string-based PAIN_POINTS ────────────── */
const ICON_MAP: Record<string, React.ElementType> = {
    PhoneOff,
    Clock,
    CalendarX,
    Moon,
    ClipboardList,
    Star,
};

const MAX_PAIN_POINTS = 3;

/* ── Phase 2: Needs ───────────────────────────────────────── */

interface Phase2NeedsProps {
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
}

export const Phase2Needs: React.FC<Phase2NeedsProps> = ({ data, update }) => {
    const atMax = data.painPoints.length >= MAX_PAIN_POINTS;

    const togglePainPoint = (id: string) => {
        const current = data.painPoints;
        if (current.includes(id)) {
            update({ painPoints: current.filter((p) => p !== id) });
        } else if (!atMax) {
            update({ painPoints: [...current, id] });
        }
    };

    const toggleTeamSize = (size: string) => {
        update({ teamSize: data.teamSize === size ? '' : size });
    };

    return (
        <div className="space-y-8">
            {/* ── Pain Points ─────────────────────────────────── */}
            <motion.div variants={staggerItem}>
                <label className={labelClass}>
                    What's your biggest challenge right now?
                </label>
                <p className="font-mono text-xs text-zinc-500 mb-3">
                    Pick up to 3 — we'll focus on what matters most
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PAIN_POINTS.map((pain) => {
                        const Icon = ICON_MAP[pain.icon];
                        const isSelected = data.painPoints.includes(pain.id);
                        const isDisabled = atMax && !isSelected;

                        return (
                            <button
                                key={pain.id}
                                onClick={() => togglePainPoint(pain.id)}
                                disabled={isDisabled}
                                className={`group flex items-center gap-2.5 w-full px-3.5 py-2.5 ${chipBaseClass} ${
                                    isSelected
                                        ? chipSelectedClass
                                        : isDisabled
                                            ? 'border-zinc-800/50 text-zinc-600 cursor-not-allowed opacity-40'
                                            : chipUnselectedClass
                                }`}
                            >
                                {Icon && (
                                    <Icon
                                        size={14}
                                        className={
                                            isSelected
                                                ? 'text-orange-500'
                                                : isDisabled
                                                    ? 'text-zinc-700'
                                                    : 'text-zinc-600 group-hover:text-zinc-400'
                                        }
                                    />
                                )}
                                <span
                                    className={`font-mono text-xs ${
                                        isSelected
                                            ? 'text-orange-400'
                                            : isDisabled
                                                ? 'text-zinc-600'
                                                : 'text-zinc-400'
                                    }`}
                                >
                                    {pain.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── Team Size ───────────────────────────────────── */}
            <motion.div variants={staggerItem}>
                <label className={labelClass}>
                    How big is your team?
                </label>
                <div className="flex flex-wrap gap-2">
                    {TEAM_SIZES.map((size) => (
                        <button
                            key={size}
                            onClick={() => toggleTeamSize(size)}
                            className={`px-3 py-1.5 font-mono text-xs ${chipBaseClass} ${
                                data.teamSize === size
                                    ? chipSelectedClass
                                    : chipUnselectedClass
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
