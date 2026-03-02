import React from 'react';
import { motion } from 'framer-motion';
import { Check, Phone, Calendar, ArrowLeft, Building2, Users, Wrench, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INDUSTRIES } from '../../constants/industries';
import { INTEGRATIONS } from '../../constants/integrations';
import type { LeadData } from '../../types';

const SummaryRow: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-800/30 last:border-0">
        <Icon size={14} className="text-orange-500/60 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
            <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">{label}</div>
            <div className="font-mono text-sm text-zinc-300 mt-0.5 truncate">{value}</div>
        </div>
    </div>
);

export const SuccessState: React.FC<{ data: LeadData }> = ({ data }) => {
    const industryNames = data.industries
        .map(id => id === 'other' ? data.customIndustry : INDUSTRIES.find(i => i.id === id)?.label)
        .filter(Boolean)
        .join(', ');

    const integrationNames = data.desiredIntegrations
        .map(id => INTEGRATIONS.find(i => i.id === id)?.label)
        .filter(Boolean);

    return (
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
                    We'll reach out to <span className="text-zinc-400">{data.contactEmail}</span> within 24 hours.
                </p>
            </div>

            {/* Summary card */}
            <div className="border border-zinc-800/50 bg-zinc-950/40 rounded-sm overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-zinc-800/50">
                    <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Summary</span>
                </div>
                <div className="px-5 py-2">
                    {data.businessName && (
                        <SummaryRow icon={Building2} label="Business" value={data.businessName} />
                    )}
                    {industryNames && (
                        <SummaryRow icon={Wrench} label="Industry" value={industryNames} />
                    )}
                    {data.teamSize && (
                        <SummaryRow icon={Users} label="Team Size" value={data.teamSize} />
                    )}
                    {integrationNames.length > 0 && (
                        <SummaryRow icon={Wrench} label="Integrations" value={`${integrationNames.length} selected`} />
                    )}
                    {data.contactName && (
                        <SummaryRow icon={Mail} label="Contact" value={`${data.contactName} · ${data.contactEmail}`} />
                    )}
                </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <a
                    href="tel:+18442222486"
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-4 min-h-[44px] bg-orange-500 hover:bg-orange-400 text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] no-underline"
                >
                    <Phone size={14} />
                    Call Now
                </a>
                <a
                    href="tel:+18442222486"
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-4 min-h-[44px] border border-zinc-700 hover:border-orange-500/40 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm no-underline"
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
};
