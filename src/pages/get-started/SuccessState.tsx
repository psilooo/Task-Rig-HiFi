import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LeadData } from '../../types';

const WALKTHROUGH_ITEMS: Record<string, string> = {
    'missed-calls':  'How AI handles your inbound calls 24/7',
    'slow-response': 'Automated lead response in under 60 seconds',
    'scheduling':    'Self-serve booking that fills your calendar',
    'after-hours':   'Your virtual front desk — nights, weekends, holidays',
    'manual-work':   'Automating estimates, dispatch, and follow-ups',
    'reviews':       'Hands-free review requests after every job',
};

const DEFAULT_ITEMS = [
    'How AI handles your inbound calls 24/7',
    'Automated lead response in under 60 seconds',
    'Self-serve booking that fills your calendar',
];

interface SuccessStateProps {
    data: LeadData;
}

export const SuccessState: React.FC<SuccessStateProps> = ({ data }) => {
    const firstName = data.contactName.split(' ')[0];

    const walkthroughTopics = data.painPoints.length > 0
        ? data.painPoints
              .map((key) => WALKTHROUGH_ITEMS[key])
              .filter(Boolean)
        : DEFAULT_ITEMS;

    const businessLabel = data.businessName || 'your business';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="space-y-6 text-center"
        >
            {/* Animated green checkmark */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
            >
                <Check className="w-8 h-8 text-emerald-400" />
            </motion.div>

            {/* Heading */}
            <div>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-white tracking-tight mb-2">
                    You're all set, {firstName}!
                </h2>
                <p className="font-mono text-sm text-zinc-400">
                    {data.appointmentSlot
                        ? 'Your walkthrough is confirmed.'
                        : <>We'll reach out to <span className="text-zinc-300">{data.contactEmail}</span> within 24 hours.</>
                    }
                </p>
            </div>

            {/* What we'll cover card */}
            <div className="border border-zinc-800 rounded-sm text-left">
                <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        What we'll cover in your walkthrough
                    </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                    {walkthroughTopics.map((topic) => (
                        <div key={topic} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span className="font-mono text-sm text-zinc-300">{topic}</span>
                        </div>
                    ))}
                    <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span className="font-mono text-sm text-zinc-300">
                            Live demo customized for {businessLabel}
                        </span>
                    </div>
                </div>
            </div>

            {/* SMS note */}
            {data.contactPhone && (
                <p className="font-mono text-xs text-zinc-500">
                    We just texted a confirmation to{' '}
                    <span className="text-zinc-400">{data.contactPhone}</span>
                </p>
            )}

            {/* Back to home link */}
            <div>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 font-mono text-xs uppercase tracking-widest transition-colors no-underline"
                >
                    <ArrowLeft size={14} />
                    Back to home
                </Link>
            </div>
        </motion.div>
    );
};
