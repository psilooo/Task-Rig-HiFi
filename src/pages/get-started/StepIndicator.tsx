import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PHASES } from '../../constants/integrations';

interface StepIndicatorProps {
  currentPhase: number;  // 1-4
  totalPhases?: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentPhase,
  totalPhases = 4,
}) => {
  // Endowed progress: phase 1 (just arrived) = 15%, each phase adds roughly equal chunks
  const progressPercent = Math.min(
    15 + ((currentPhase - 1) / totalPhases) * 85,
    100
  );

  return (
    <div className="w-full space-y-3">
      {/* Continuous progress bar */}
      <div className="relative h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
          initial={{ width: '15%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step markers */}
      <div className="flex justify-between">
        {PHASES.map((phase) => {
          const isActive = phase.num === currentPhase;
          const isComplete = phase.num < currentPhase;

          return (
            <div
              key={phase.num}
              className="flex items-center gap-2"
            >
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono
                  transition-colors duration-300
                  ${isComplete
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : isActive
                      ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400'
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-600'
                  }
                `}
              >
                {isComplete ? <Check className="w-3 h-3" /> : phase.num}
              </div>
              <span
                className={`
                  hidden sm:inline text-xs font-mono transition-colors duration-300
                  ${isComplete ? 'text-emerald-400' : isActive ? 'text-orange-400' : 'text-zinc-600'}
                `}
              >
                {phase.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
