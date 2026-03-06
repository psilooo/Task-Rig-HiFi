import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, ArrowRight } from 'lucide-react';
import { INDUSTRIES } from '../../../constants/industries';
import { staggerContainer, staggerItem } from '../animations';
import type { LeadData } from '../../../types';

/* ── Pain-point to action mapping ────────────────────────── */

const PAIN_POINT_ACTIONS: Record<string, string> = {
    'missed-calls':   'Answer 100% of inbound calls with AI — even at 2 AM',
    'slow-response':  'Respond to every lead in under 60 seconds, automatically',
    'scheduling':     'Let customers self-book into your calendar via text or chat',
    'after-hours':    'Run a 24/7 virtual front desk that never clocks out',
    'manual-work':    'Automate estimates, follow-ups, and dispatch paperwork',
    'reviews':        'Request and respond to reviews after every completed job',
};

const DEFAULT_ACTIONS = [
    'Answer 100% of inbound calls with AI — even at 2 AM',
    'Respond to every lead in under 60 seconds, automatically',
    'Run a 24/7 virtual front desk that never clocks out',
];

/* ── Impact estimate helper ──────────────────────────────── */

function getImpactEstimates(painPoints: string[], teamSize: string) {
    let hoursPerWeek = 0;
    if (painPoints.includes('missed-calls'))  hoursPerWeek += 6;
    if (painPoints.includes('slow-response')) hoursPerWeek += 4;
    if (painPoints.includes('scheduling'))    hoursPerWeek += 5;
    if (painPoints.includes('after-hours'))   hoursPerWeek += 8;
    if (painPoints.includes('manual-work'))   hoursPerWeek += 10;
    if (painPoints.includes('reviews'))       hoursPerWeek += 3;

    const multiplier =
        teamSize === '50+'   ? 2.5 :
        teamSize === '16–50' ? 2   :
        teamSize === '6–15'  ? 1.5 : 1;

    return Math.round((hoursPerWeek || 8) * multiplier);
}

/* ── Phase 3: Preview ────────────────────────────────────── */

interface Phase3PreviewProps {
    data: LeadData;
}

export const Phase3Preview: React.FC<Phase3PreviewProps> = ({ data }) => {
    const industryLabel =
        INDUSTRIES.find((i) => i.id === data.industry)?.label ?? (data.customIndustry || 'Your business');

    const actions =
        data.painPoints.length > 0
            ? data.painPoints.map((id) => PAIN_POINT_ACTIONS[id]).filter(Boolean)
            : DEFAULT_ACTIONS;

    const hoursPerWeek = getImpactEstimates(data.painPoints, data.teamSize);

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="border border-zinc-800 rounded-sm overflow-hidden"
        >
            {/* ── Header ──────────────────────────────────── */}
            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
                <motion.div variants={staggerItem} className="flex items-center gap-2 mb-2">
                    <Zap size={14} className="text-orange-400" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Your Operations Preview
                    </span>
                </motion.div>

                <motion.p variants={staggerItem} className="text-sm font-heading text-zinc-200">
                    {data.businessName || industryLabel}
                </motion.p>

                <motion.p variants={staggerItem} className="font-mono text-[10px] text-zinc-500 mt-0.5">
                    {industryLabel}
                    {data.teamSize ? ` · ${data.teamSize} people` : ''}
                </motion.p>
            </div>

            {/* ── Action Items ────────────────────────────── */}
            <div className="px-5 py-4 space-y-2.5">
                {actions.map((action, i) => (
                    <motion.div
                        key={action}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                        className="flex items-start gap-2.5"
                    >
                        <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-zinc-200">{action}</span>
                    </motion.div>
                ))}
            </div>

            {/* ── Impact Estimates ────────────────────────── */}
            <div className="px-5 py-4 border-t border-zinc-800 grid grid-cols-3 gap-4 text-center">
                <motion.div variants={staggerItem}>
                    <p className="text-xl font-heading text-orange-400">~{hoursPerWeek}hrs</p>
                    <p className="text-[10px] font-mono text-zinc-500">saved / week</p>
                </motion.div>
                <motion.div variants={staggerItem}>
                    <p className="text-xl font-heading text-orange-400">&lt;60s</p>
                    <p className="text-[10px] font-mono text-zinc-500">response time</p>
                </motion.div>
                <motion.div variants={staggerItem}>
                    <p className="text-xl font-heading text-orange-400">24/7</p>
                    <p className="text-[10px] font-mono text-zinc-500">coverage</p>
                </motion.div>
            </div>

            {/* ── CTA Prompt ─────────────────────────────── */}
            <motion.div
                variants={staggerItem}
                className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between"
            >
                <span className="font-mono text-xs text-zinc-400">
                    See how this works — book a free walkthrough
                </span>
                <ArrowRight size={14} className="text-orange-400" />
            </motion.div>
        </motion.div>
    );
};
