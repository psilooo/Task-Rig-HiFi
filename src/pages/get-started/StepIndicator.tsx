import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PHASES } from '../../constants/integrations';

export const StepIndicator: React.FC<{
    currentStep: number;
    completedSteps: Set<number>;
}> = ({ currentStep, completedSteps }) => (
    <div className="flex items-center gap-1 sm:gap-2 w-full">
        {PHASES.map((phase, i) => {
            const isComplete = completedSteps.has(phase.num);
            const isActive = phase.num === currentStep;
            const isPast = phase.num < currentStep;

            return (
                <React.Fragment key={phase.num}>
                    <div className="flex-1 min-w-0">
                        {/* Segment bar */}
                        <div className="relative h-1 rounded-full overflow-hidden bg-zinc-800">
                            {(isComplete || isActive || isPast) && (
                                <motion.div
                                    className="absolute inset-y-0 left-0 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: isComplete || isPast ? '100%' : '50%' }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    style={{
                                        background: isComplete || isPast
                                            ? 'rgb(16, 185, 129)'
                                            : 'rgb(249, 115, 22)',
                                        boxShadow: isComplete || isPast
                                            ? '0 0 8px rgba(16, 185, 129, 0.4)'
                                            : '0 0 8px rgba(249, 115, 22, 0.4)',
                                    }}
                                />
                            )}
                        </div>
                        {/* Label row */}
                        <div className="flex items-center gap-1.5 mt-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono font-bold transition-all duration-300 ${
                                isComplete || isPast
                                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                                    : isActive
                                        ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.2)]'
                                        : 'bg-zinc-900 border border-zinc-700 text-zinc-600'
                            }`}>
                                {isComplete || isPast ? <Check size={10} /> : phase.num}
                            </div>
                            <span className={`font-mono text-[10px] uppercase tracking-widest truncate transition-colors duration-300 ${
                                isActive
                                    ? 'text-orange-400'
                                    : isComplete || isPast
                                        ? 'text-emerald-400/70'
                                        : 'text-zinc-600'
                            }`}>
                                {phase.title}
                            </span>
                        </div>
                    </div>
                    {i < PHASES.length - 1 && (
                        <div className={`w-px h-6 self-start mt-0 transition-colors duration-300 ${
                            isPast || isComplete ? 'bg-emerald-500/20' : 'bg-zinc-800'
                        }`} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);
