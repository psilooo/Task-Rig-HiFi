import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, ArrowRight,
    Send,
    Sparkles,
    Layers,
} from 'lucide-react';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { TypingBubble } from '../../components/chat/TypingBubble';

interface FeatureTab {
    icon: React.FC<{ size?: number; className?: string }>;
    label: string;
    title: string;
    desc: string;
    visual: React.ReactNode;
}

interface ProductShowcaseProps {
    featureTabs: FeatureTab[];
    activeFeature: number;
    featureProgress: number;
    handleFeatureClick: (index: number) => void;
    chatRef: React.RefObject<HTMLDivElement>;
    chatInView: boolean;
    chatMessages: { sender: string; text: string }[];
    featureSectionRef: React.RefObject<HTMLDivElement>;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
    featureTabs,
    activeFeature,
    featureProgress,
    handleFeatureClick,
    chatRef,
    chatInView,
    chatMessages,
    featureSectionRef,
}) => {
    return (
        <section className="py-8 md:py-10 px-4 md:px-6 relative z-10" ref={chatRef}>
            {/* Ambient glow effects */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/[0.03] blur-[180px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Unified header */}
                <div className="text-center mb-5 md:mb-6">
                    <ScrollReveal>
                        <div className="inline-flex items-center mb-3">
                            <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em]">Task Rig is</span>
                        </div>
                        <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-white uppercase tracking-tight">
                            Smarter Than a Chatbot.
                        </h2>
                        <p className="mt-3 text-zinc-400 font-mono text-sm max-w-2xl mx-auto leading-relaxed">
                            Task Rig doesn't just answer questions — it understands context, takes action, and learns your business.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Shared visual container */}
                <ScrollReveal>
                    <div className="relative border border-white/[0.07] rounded-2xl bg-gradient-to-br from-white/[0.03] via-zinc-950/80 to-white/[0.02] backdrop-blur-sm overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.4)]">
                        {/* Inner glow accent along top edge */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0">

                            {/* ── LEFT PANEL: Features ── */}
                            <div ref={featureSectionRef} className="lg:col-span-5 p-4 md:p-5 lg:p-6 flex flex-col">
                                {/* Panel label */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em]">How It Works</span>
                                </div>

                                {/* Vertical Tab Buttons */}
                                <div className="flex flex-row lg:flex-col gap-1.5 mb-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                                    {featureTabs.map((tab, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleFeatureClick(i)}
                                            className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-300 whitespace-nowrap flex-shrink-0 overflow-hidden focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950 ${activeFeature === i
                                                ? 'border border-orange-500/30 shadow-[0_0_20px_rgba(255,106,21,0.06)]'
                                                : 'bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                                }`}
                                        >
                                            {/* Progress bar fill */}
                                            <div
                                                className={`absolute inset-0 rounded-lg origin-left ${activeFeature === i ? 'bg-orange-500/10' : ''}`}
                                                style={{
                                                    transform: activeFeature === i ? `scaleX(${featureProgress})` : 'scaleX(0)',
                                                    transformOrigin: 'left',
                                                }}
                                            />
                                            <div className={`relative z-10 w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${activeFeature === i ? 'bg-orange-500/20' : 'bg-zinc-800/60'}`}>
                                                <tab.icon size={14} className={activeFeature === i ? 'text-orange-500' : 'text-zinc-500'} />
                                            </div>
                                            <div className="relative z-10">
                                                <div className={`font-heading font-bold text-xs uppercase tracking-wide transition-colors ${activeFeature === i ? 'text-white' : 'text-zinc-400'}`}>{tab.label}</div>
                                                <div className="text-[10px] font-mono text-zinc-600 hidden lg:block mt-0.5">{tab.title}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Active Feature Detail */}
                                <div className="flex-1 flex flex-col">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeFeature}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -12 }}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                            className="flex-1 flex flex-col"
                                        >
                                            <h3 className="font-heading font-bold text-lg md:text-xl text-white uppercase tracking-tight mb-2">{featureTabs[activeFeature].title}</h3>
                                            <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-4">{featureTabs[activeFeature].desc}</p>

                                            {/* Visual preview */}
                                            <div className="p-1 border border-white/5 rounded-lg bg-zinc-900/50 mb-4">
                                                <div className="p-3">
                                                    {featureTabs[activeFeature].visual}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Static badges — same across all tabs, so kept outside AnimatePresence */}
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                                            <Sparkles size={12} className="text-orange-500" />
                                            <span>AI-Powered</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                                            <Layers size={12} className="text-orange-500" />
                                            <span>Multi-Channel</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── VERTICAL DIVIDER (desktop) ── */}
                            <div className="hidden lg:flex lg:col-span-2 items-center justify-center relative">
                                {/* Gradient line */}
                                <div className="w-px h-[80%] bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />
                                {/* Center connector dot */}
                                <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-orange-500/20 bg-zinc-950 flex items-center justify-center shadow-[0_0_20px_rgba(255,106,21,0.1)]">
                                    <ArrowRight size={14} className="text-orange-500" />
                                </div>
                            </div>

                            {/* ── HORIZONTAL DIVIDER (mobile) ── */}
                            <div className="lg:hidden flex items-center justify-center py-4 px-6">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                                <div className="mx-4 w-8 h-8 rounded-full border border-orange-500/20 bg-zinc-950 flex items-center justify-center shadow-[0_0_15px_rgba(255,106,21,0.1)]">
                                    <ChevronDown size={12} className="text-orange-500" />
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-orange-500/20 via-transparent to-transparent" />
                            </div>

                            {/* ── RIGHT PANEL: Live Chat Demo ── */}
                            <div className="lg:col-span-5 p-4 md:p-5 lg:p-6 flex flex-col">
                                {/* Panel label */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em]">See It In Action</span>
                                </div>

                                {/* Chat window */}
                                <div className="flex-1 flex flex-col border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.3)]">
                                    {/* Title bar */}
                                    <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                            </div>
                                            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider ml-2">Live Chat — Booking</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[9px] font-mono text-emerald-500/70 uppercase tracking-wider">Online</span>
                                        </div>
                                    </div>
                                    {/* Messages */}
                                    <div className="p-4 space-y-2.5 flex-1 h-[300px] md:h-auto md:min-h-[280px]">
                                        {chatMessages.map((msg, i) => (
                                            <TypingBubble
                                                key={i}
                                                text={msg.text}
                                                sender={msg.sender}
                                                delay={i * 1.8}
                                                isInView={chatInView}
                                            />
                                        ))}
                                    </div>
                                    {/* Input bar */}
                                    <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-3 bg-zinc-900/20">
                                        <div className="flex-1 h-8 rounded-md bg-zinc-800/40 border border-white/5 flex items-center px-3">
                                            <span className="text-zinc-600 font-mono text-xs">Type a message...</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                                            <Send size={13} className="text-orange-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inner glow accent along bottom edge */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};
