import React from 'react';
import { motion } from 'framer-motion';
import { Check, Phone, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INDUSTRIES } from '../../constants/industries';
import type { LeadData } from '../../types';

export const SuccessState: React.FC<{ data: LeadData }> = ({ data }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
        {/* Checkmark */}
        <div className="text-center mb-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
                <Check className="text-emerald-500" size={28} />
            </motion.div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-2">
                You're All Set
            </h2>
            <p className="font-mono text-sm text-zinc-400">
                Your TaskRig setup for <span className="text-orange-400">{data.businessName || 'your business'}</span> is being configured.
            </p>
            <p className="font-mono text-xs text-zinc-500 mt-2">
                We'll reach out within 24 hours.
            </p>
        </div>

        {/* Summary card */}
        <div className="border border-zinc-800/50 bg-zinc-950/40 rounded-sm overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-zinc-800/50">
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Summary</span>
            </div>
            <div className="p-5 space-y-3 font-mono text-sm">
                {data.businessName && (
                    <div className="flex justify-between"><span className="text-zinc-500">Business</span><span className="text-zinc-300">{data.businessName}</span></div>
                )}
                {data.industries.length > 0 && (
                    <div className="flex justify-between"><span className="text-zinc-500">Industry</span><span className="text-zinc-300">{data.industries.map(id => INDUSTRIES.find(i => i.id === id)?.label || data.customIndustry).join(', ')}</span></div>
                )}
                {data.teamSize && (
                    <div className="flex justify-between"><span className="text-zinc-500">Team Size</span><span className="text-zinc-300">{data.teamSize}</span></div>
                )}
                {data.desiredIntegrations.length > 0 && (
                    <div className="flex justify-between"><span className="text-zinc-500">Integrations</span><span className="text-zinc-300">{data.desiredIntegrations.length} selected</span></div>
                )}
                {data.painPoints.length > 0 && (
                    <div className="flex justify-between"><span className="text-zinc-500">Focus Areas</span><span className="text-zinc-300">{data.painPoints.length} identified</span></div>
                )}
            </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
                href="tel:+18442222486"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-400 text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] no-underline"
            >
                <Phone size={14} />
                Call Now
            </a>
            <a
                href="tel:+18442222486"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-zinc-700 hover:border-orange-500/40 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm no-underline"
            >
                <Calendar size={14} />
                Schedule a Call
            </a>
        </div>

        <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 font-mono text-xs uppercase tracking-widest transition-colors no-underline">
                <ArrowLeft size={14} />
                Back to Home
            </Link>
        </div>
    </motion.div>
);
