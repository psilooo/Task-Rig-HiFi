import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
    Users,
    Clock, GitBranch, CalendarCheck, Layers, Globe,
    ChevronDown, Check, Phone,
    Star, ArrowRight,
    Bot, Send, User,
    Sparkles,
    Link2,
    MessageSquare,
    Terminal,
    Plus,
    Minus,
    Quote,
    TrendingUp
} from 'lucide-react';
import { Hero } from './Hero';
import { TaskRigLogo } from './ui/TaskRigLogo';

interface LandingPageProps {
    onLoginClick: () => void;
}

// ─── Shared Animation Primitives ───────────────────────────────────

const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
        className={className}
    >
        {children}
    </motion.div>
);

const SectionBadge: React.FC<{ text: string }> = ({ text }) => (
    <div className="inline-flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em]">{text}</span>
    </div>
);

const GlassCard: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({ children, className = '', hover = true }) => (
    <div className={`p-6 md:p-8 border border-white/10 bg-white/[0.03] backdrop-blur-md rounded-lg transition-all duration-300 ${hover ? 'hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(255,106,21,0.08)] hover:bg-white/[0.05]' : ''} ${className}`}>
        {children}
    </div>
);

// ─── Animated Counter ──────────────────────────────────────────────

const AnimatedCounter: React.FC<{ value: string; duration?: number }> = ({ value, duration = 2 }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const [display, setDisplay] = useState('0');

    // Parse numeric part and suffix
    const numMatch = value.match(/^([<>]?)(\d+\.?\d*)(.*)/);
    const prefix = numMatch?.[1] || '';
    const target = numMatch ? parseFloat(numMatch[2]) : 0;
    const suffix = numMatch?.[3] || '';
    const isDecimal = value.includes('.');

    useEffect(() => {
        if (!isInView) return;
        const start = performance.now();
        const step = (now: number) => {
            const elapsed = (now - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            setDisplay(isDecimal ? current.toFixed(1) : Math.round(current).toString());
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, target, duration, isDecimal]);

    return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

// ─── Typing Chat Bubble ────────────────────────────────────────────

const TypingBubble: React.FC<{ text: string; sender: string; delay: number; isInView: boolean }> = ({ text, sender, delay, isInView }) => {
    const [phase, setPhase] = useState<'hidden' | 'typing' | 'visible'>('hidden');
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        if (!isInView) return;
        const showTimer = setTimeout(() => setPhase('typing'), delay * 1000);
        return () => clearTimeout(showTimer);
    }, [isInView, delay]);

    useEffect(() => {
        if (phase !== 'typing') return;
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayText(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(interval);
                setPhase('visible');
            }
        }, 12);
        return () => clearInterval(interval);
    }, [phase, text]);

    if (phase === 'hidden') return null;

    const isAi = sender === 'ai';
    const isSystem = sender === 'system';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex ${isSystem ? 'justify-center' : isAi ? 'justify-start' : 'justify-end'}`}
        >
            {isSystem ? (
                <div className="w-full text-center py-2 px-3 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-400">
                    {phase === 'typing' ? displayText : text}
                    {phase === 'typing' && <span className="animate-pulse ml-0.5">|</span>}
                </div>
            ) : (
                <div className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm font-mono leading-relaxed ${isAi
                    ? 'bg-orange-500/10 border border-orange-500/20 text-zinc-300 rounded-bl-sm'
                    : 'bg-zinc-800 text-zinc-200 rounded-br-sm'
                    }`}>
                    {isAi && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Bot size={10} className="text-orange-500" />
                            <span className="text-[9px] text-orange-500 uppercase tracking-wider">Task Rig AI</span>
                        </div>
                    )}
                    {phase === 'typing' ? (
                        <>{displayText}<span className="animate-pulse ml-0.5 text-orange-500">|</span></>
                    ) : text}
                </div>
            )}
        </motion.div>
    );
};


export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [activeFeature, setActiveFeature] = useState(0);
    const chatRef = useRef<HTMLDivElement>(null);
    const chatInView = useInView(chatRef, { once: true, margin: '-100px' });

    // ─── Data ──────────────────────────────────────────────────────

    const featureTabs = [
        {
            icon: Clock, label: '24/7 AI',
            title: 'Always-On AI Responses',
            desc: 'Never miss a lead. Your AI agent responds to every inquiry around the clock with context-aware answers tailored to your business.',
            visual: (
                <div className="space-y-3">
                    {[
                        { name: 'Sarah M.', channel: 'Chat', status: 'Responding...', color: 'text-orange-400' },
                        { name: 'Mike T.', channel: 'Email', status: 'Resolved', color: 'text-emerald-400' },
                        { name: 'Linda K.', channel: 'Messenger', status: 'Booking apt...', color: 'text-orange-400' },
                    ].map((conv, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }}
                            className="flex items-center justify-between p-3 bg-zinc-800/60 border border-white/5 rounded-md">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-mono text-zinc-300">{conv.name[0]}</div>
                                <div>
                                    <div className="text-sm text-white font-mono">{conv.name}</div>
                                    <div className="text-[10px] text-zinc-500 font-mono uppercase">{conv.channel}</div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-mono uppercase tracking-wider ${conv.color}`}>{conv.status}</span>
                        </motion.div>
                    ))}
                </div>
            ),
        },
        {
            icon: GitBranch, label: 'Smart Routing',
            title: 'Intelligent Escalation',
            desc: 'Urgent issues go to humans instantly. Routine questions get immediate AI answers. Every conversation is triaged in real-time.',
            visual: (
                <div className="space-y-2">
                    {[
                        { action: 'Appointment booked', time: '2s ago', icon: CalendarCheck },
                        { action: 'Confirmation sent', time: '2s ago', icon: Send },
                        { action: 'CRM updated', time: '1s ago', icon: Users },
                        { action: 'Follow-up scheduled', time: 'just now', icon: Clock },
                    ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.1 }}
                            className="flex items-center gap-3 p-2.5 bg-zinc-800/60 border border-white/5 rounded-md">
                            <div className="w-6 h-6 rounded bg-orange-500/10 flex items-center justify-center">
                                <item.icon size={12} className="text-orange-500" />
                            </div>
                            <span className="text-sm font-mono text-zinc-300 flex-1">{item.action}</span>
                            <span className="text-[10px] font-mono text-zinc-600">{item.time}</span>
                        </motion.div>
                    ))}
                </div>
            ),
        },
        {
            icon: Globe, label: '30+ Languages',
            title: 'Multilingual by Default',
            desc: 'Serve customers in their preferred language, automatically detected. No configuration required — just seamless communication across borders.',
            visual: (
                <div className="p-4 bg-zinc-800/60 border border-white/5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Accuracy Over Time</span>
                        <span className="text-xs font-mono text-emerald-400">+12% this month</span>
                    </div>
                    <div className="flex items-end gap-1 h-20">
                        {[40, 48, 52, 58, 62, 68, 72, 76, 82, 88, 91, 95].map((h, i) => (
                            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                                className="flex-1 bg-gradient-to-t from-orange-500/40 to-orange-500/80 rounded-t-sm" />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[9px] font-mono text-zinc-600">Month 1</span>
                        <span className="text-[9px] font-mono text-zinc-600">Month 12</span>
                    </div>
                </div>
            ),
        },
        {
            icon: CalendarCheck, label: 'Booking',
            title: 'Direct Appointment Booking',
            desc: 'Customers book directly into your calendar. No phone tag required. The AI handles scheduling, confirmations, and reminders automatically.',
            visual: (
                <div className="p-4 bg-zinc-800/60 border border-white/5 rounded-md space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                        <User size={14} className="text-orange-500" />
                        <span className="text-sm font-mono text-white">Customer Profile</span>
                    </div>
                    {[
                        { label: 'Name', value: 'James Rodriguez' },
                        { label: 'Last Service', value: 'AC Repair - Jan 15' },
                        { label: 'Lifetime Value', value: '$2,340' },
                        { label: 'Satisfaction', value: '4.8 / 5.0' },
                    ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.1 }}
                            className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-500">{item.label}</span>
                            <span className="text-zinc-300">{item.value}</span>
                        </motion.div>
                    ))}
                </div>
            ),
        },
    ];

    const chatMessages = [
        { sender: 'customer', text: 'Hi, I need to schedule an AC repair. My unit stopped blowing cold air.' },
        { sender: 'ai', text: "I'd be happy to help you schedule an AC repair! I can see you're located in the Phoenix area. We have availability tomorrow between 9 AM-12 PM or Thursday 2 PM-5 PM. Which works better for you?" },
        { sender: 'customer', text: 'Tomorrow morning works.' },
        { sender: 'ai', text: "You're all set! I've booked a technician for tomorrow, Feb 21, between 9 AM-12 PM. You'll receive a confirmation text shortly. Is there anything else I can help with?" },
    ];

    const testimonials = [
        {
            quote: "Task Rig cut our response time from 4 hours to under 30 seconds. We're booking 40% more jobs because leads aren't going cold.",
            name: 'Marcus Johnson',
            title: 'Owner, Johnson HVAC Services',
            metric: '+40% bookings',
        },
        {
            quote: "Our intake process used to take 20 minutes per client call. Now Task Rig handles screening and scheduling automatically.",
            name: 'Rebecca Alvarez',
            title: 'Managing Partner, Alvarez & Associates',
            metric: '3x faster intake',
        },
        {
            quote: "Managing 200+ units was a nightmare. Now maintenance requests come in via chat, get triaged by AI, and dispatched automatically.",
            name: 'Derek Simmons',
            title: 'Operations Director, Apex Property Group',
            metric: '60% fewer calls',
        },
    ];

    const pricingTiers = [
        {
            name: 'Starter',
            price: 49,
            desc: 'Perfect for solo operators and small teams.',
            features: ['1 AI Agent', '500 conversations/mo', 'Email + Chat', 'Basic analytics', 'Email support'],
            cta: 'Start Free Trial',
            highlighted: false,
        },
        {
            name: 'Business Pro',
            price: 99,
            desc: 'Everything growing businesses need.',
            features: ['3 AI Agents', 'Unlimited conversations', 'All channels', 'Advanced analytics', 'Calendar integration', 'CRM sync', 'Priority support'],
            cta: 'Start Free Trial',
            highlighted: true,
        },
        {
            name: 'Enterprise',
            price: 299,
            desc: 'Maximum power and customization.',
            features: ['Unlimited AI Agents', 'Unlimited conversations', 'All channels + API', 'Custom AI training', 'Dedicated manager', 'White-label option', 'SLA guarantee'],
            cta: 'Contact Sales',
            highlighted: false,
        },
    ];

    const faqItems = [
        { q: 'How does the AI learn about my business?', a: 'During setup, you upload your FAQs, service descriptions, pricing, and any other relevant information. Task Rig uses this to build a custom knowledge base. The AI also learns from every conversation it handles, continuously improving its responses.' },
        { q: 'Will customers know they are talking to an AI?', a: 'That is up to you. You can configure the AI to introduce itself as an assistant, or let it respond naturally. Most customers care more about getting fast, accurate help than who is providing it.' },
        { q: 'What happens when the AI cannot answer a question?', a: 'Task Rig intelligently routes conversations it cannot handle to your team. It provides a full summary so your staff can pick up seamlessly without the customer repeating themselves.' },
        { q: 'Can I customize the AI responses and tone?', a: 'Absolutely. You can set the tone (professional, friendly, casual), add custom responses for specific questions, and create rules for different situations. You stay in full control.' },
        { q: 'How long does setup take?', a: 'Most businesses are up and running in under 30 minutes. Connect your channels, upload your knowledge base, and the AI is ready to go. No technical expertise required.' },
        { q: 'Is my customer data secure?', a: 'Yes. All data is encrypted in transit and at rest. We are SOC 2 compliant and never use your customer data to train models for other businesses. Your data stays yours.' },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-hidden selection:bg-orange-500/30">
            {/* Fixed Background Grid */}
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

            {/* Navigation - Fixed Top */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-14 md:h-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex justify-between items-center">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 md:gap-3 cursor-pointer">
                        <TaskRigLogo className="h-5 md:h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                        <div className="font-heading font-bold text-base md:text-2xl tracking-tight text-white whitespace-nowrap">TASK RIG</div>
                    </button>
                    <div className="flex items-center gap-2 md:gap-3">
                        <a
                            href="tel:+15551234567"
                            className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 bg-orange-500 hover:bg-orange-600 text-white font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all rounded-sm"
                        >
                            <Phone size={12} className="md:hidden transition-colors" />
                            <Phone size={14} className="hidden md:block transition-colors" />
                            Call Demo
                        </a>
                        <button
                            onClick={onLoginClick}
                            className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 border border-zinc-800 hover:border-orange-500/50 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all rounded-sm"
                        >
                            Login
                            <ArrowRight size={12} className="md:hidden text-zinc-500 group-hover:text-orange-500 transition-colors" />
                            <ArrowRight size={14} className="hidden md:block text-zinc-500 group-hover:text-orange-500 transition-colors" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <Hero onLoginClick={onLoginClick} />


            {/* ════════════════════════════════════════════════════════════════
                SECTION 2+3: PRODUCT SHOWCASE — Features & Live Demo
                Unified two-panel layout with shared visual container
            ════════════════════════════════════════════════════════════════ */}
            <section className="pt-4 pb-24 md:pt-6 md:pb-32 px-4 md:px-6 relative z-10" ref={chatRef}>
                {/* Ambient glow effects */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/[0.03] blur-[180px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    {/* Unified header */}
                    <div className="text-center mb-12 md:mb-16">
                        <ScrollReveal>
                            <SectionBadge text="Product Showcase" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight">
                                Smarter Than a Chatbot.
                            </h2>
                            <p className="mt-5 text-zinc-400 font-mono text-sm max-w-2xl mx-auto leading-relaxed">
                                Task Rig doesn't just answer questions — it understands context, takes action, and learns your business. Watch it handle a real customer booking in real-time.
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Shared visual container */}
                    <ScrollReveal>
                        <div className="relative border border-white/[0.07] rounded-2xl bg-gradient-to-br from-white/[0.03] via-zinc-950/80 to-white/[0.02] backdrop-blur-sm overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.4)]">
                            {/* Inner glow accent along top edge */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

                            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

                                {/* ── LEFT PANEL: Features ── */}
                                <div className="lg:col-span-5 p-6 md:p-8 lg:p-10 flex flex-col">
                                    {/* Panel label */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em]">How It Works</span>
                                    </div>

                                    {/* Vertical Tab Buttons */}
                                    <div className="flex flex-row lg:flex-col gap-2 mb-6 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                                        {featureTabs.map((tab, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveFeature(i)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeFeature === i
                                                    ? 'bg-orange-500/10 border border-orange-500/30 shadow-[0_0_20px_rgba(255,106,21,0.06)]'
                                                    : 'bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                                    }`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${activeFeature === i ? 'bg-orange-500/20' : 'bg-zinc-800/60'}`}>
                                                    <tab.icon size={16} className={activeFeature === i ? 'text-orange-500' : 'text-zinc-500'} />
                                                </div>
                                                <div>
                                                    <div className={`font-heading font-bold text-sm uppercase tracking-wide transition-colors ${activeFeature === i ? 'text-white' : 'text-zinc-400'}`}>{tab.label}</div>
                                                    <div className="text-[11px] font-mono text-zinc-600 hidden lg:block mt-0.5">{tab.title}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Active Feature Detail */}
                                    <div className="flex-1 flex flex-col min-h-[420px]">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeFeature}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                className="flex-1 flex flex-col"
                                            >
                                                <h3 className="font-heading font-bold text-xl md:text-2xl text-white uppercase tracking-tight mb-3">{featureTabs[activeFeature].title}</h3>
                                                <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-5">{featureTabs[activeFeature].desc}</p>

                                                {/* Visual preview */}
                                                <div className="p-1 border border-white/5 rounded-lg bg-zinc-900/50 mb-5">
                                                    <div className="p-4">
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
                                <div className="lg:col-span-5 p-6 md:p-8 lg:p-10 flex flex-col">
                                    {/* Panel label */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em]">See It In Action</span>
                                    </div>

                                    {/* Chat window */}
                                    <div className="flex-1 flex flex-col border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.3)]">
                                        {/* Title bar */}
                                        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                                </div>
                                                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider ml-2">Live Chat — Booking</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[9px] font-mono text-emerald-500/70 uppercase tracking-wider">Online</span>
                                            </div>
                                        </div>
                                        {/* Messages */}
                                        <div className="p-5 space-y-3 flex-1 min-h-[360px]">
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
                                        <div className="px-5 py-3 border-t border-white/5 flex items-center gap-3 bg-zinc-900/20">
                                            <div className="flex-1 h-9 rounded-md bg-zinc-800/40 border border-white/5 flex items-center px-3">
                                                <span className="text-zinc-600 font-mono text-xs">Type a message...</span>
                                            </div>
                                            <div className="w-9 h-9 rounded-md bg-orange-500/10 flex items-center justify-center">
                                                <Send size={14} className="text-orange-500" />
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


            {/* ════════════════════════════════════════════════════════════════
                INTEGRATION PARTNERS + SYSTEM STATUS (Techno-Brutalism)
            ════════════════════════════════════════════════════════════════ */}
            <div className="border-y-2 border-zinc-800 relative z-10 bg-zinc-950">
                <div className="max-w-7xl mx-auto">
                    {/* Status bar header */}
                    <div className="border-b border-zinc-800 px-4 md:px-6 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-500" />
                            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em]">System Status</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em]">Live</span>
                    </div>

                    {/* Integration Partners + System Stats */}
                    <ScrollReveal>
                        <div className="grid grid-cols-1 md:grid-cols-5">
                            {/* Integration Partners — 3 columns */}
                            {[
                                { name: 'Twilio', desc: 'SMS, voice & WhatsApp messaging', tag: 'COMMS' },
                                { name: 'Zendesk', desc: 'Helpdesk ticketing & CRM sync', tag: 'CRM' },
                                { name: 'Stripe', desc: 'Payment processing & invoicing', tag: 'PAY' },
                            ].map((partner, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                                    className="border-b md:border-b-0 md:border-r border-zinc-800 p-5 md:p-6 group hover:bg-zinc-900/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Link2 size={10} className="text-orange-500/60" />
                                            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.2em]">Integration</span>
                                        </div>
                                        <span className="font-mono text-[9px] text-orange-500/60 uppercase tracking-wider border border-orange-500/20 px-1.5 py-0.5">{partner.tag}</span>
                                    </div>
                                    <div className="font-mono font-bold text-2xl md:text-3xl text-white tracking-tight mb-1.5">{partner.name}</div>
                                    <div className="font-mono text-[11px] text-zinc-500 leading-relaxed">{partner.desc}</div>
                                </motion.div>
                            ))}

                            {/* System Stats — 2 columns */}
                            {[
                                { value: '99.9%', label: 'Platform Uptime', tag: 'SLA' },
                                { value: '<2s', label: 'Avg Response', tag: 'LAT' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={`stat-${i}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.24 + i * 0.08 }}
                                    className={`border-b md:border-b-0 border-zinc-800 ${i < 1 ? 'md:border-r' : ''} p-5 md:p-6 group hover:bg-zinc-900/50 transition-colors`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.2em]">{stat.label}</span>
                                        <span className="font-mono text-[9px] text-orange-500/60 uppercase tracking-wider border border-orange-500/20 px-1.5 py-0.5">{stat.tag}</span>
                                    </div>
                                    <div className="font-mono font-bold text-3xl md:text-4xl text-white tracking-tight">
                                        <AnimatedCounter value={stat.value} duration={2} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* Company ticker strip */}
                    <ScrollReveal delay={0.15}>
                        <div className="border-t border-zinc-800 px-4 md:px-6 py-3 flex items-center gap-4">
                            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.3em] flex-shrink-0 border-r border-zinc-800 pr-4">Clients</span>
                            <div className="flex-1 flex items-center justify-between">
                                {['APEX PLUMBING', 'IRONCLAD HVAC', 'SUMMIT LEGAL', 'KEYSTONE PROP.', 'TRIDENT AUTO', 'BRIGHTPATH DENTAL', 'FORGE CONST.', 'VERTEX REALTY'].map((name, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
                                        className="font-mono text-[10px] text-zinc-500 tracking-wider whitespace-nowrap"
                                    >
                                        {name}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>


            {/* ════════════════════════════════════════════════════════════════
                SECTION 4: TESTIMONIALS — Immersive Stacked Cards
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-4 md:px-6 relative z-10 overflow-hidden">
                {/* Ambient background effects */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-orange-500/[0.03] blur-[150px] rounded-full" />
                    <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-orange-500/[0.02] blur-[120px] rounded-full" />
                </div>

                {/* Decorative vertical lines */}
                <div className="absolute inset-0 pointer-events-none hidden lg:block">
                    <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-zinc-800/50 to-transparent" />
                    <div className="absolute top-0 right-[15%] w-px h-full bg-gradient-to-b from-transparent via-zinc-800/50 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto relative">
                    {/* Section header with asymmetric layout */}
                    <div className="mb-16 md:mb-20">
                        <ScrollReveal>
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                <div>
                                    <SectionBadge text="Field Reports" />
                                    <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[0.95]">
                                        Operators<br />
                                        <span className="text-zinc-500">Report In</span>
                                    </h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="font-mono text-[10px] text-emerald-500/80 uppercase tracking-[0.2em]">Verified Reviews</span>
                                    </div>
                                    <div className="h-4 w-px bg-zinc-800" />
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} size={10} className="text-orange-500 fill-orange-500" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Testimonials — staggered asymmetric cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
                        {testimonials.map((t, i) => {
                            const colSpans = ['lg:col-span-5', 'lg:col-span-4', 'lg:col-span-3'];
                            const topOffsets = ['lg:mt-0', 'lg:mt-12', 'lg:mt-6'];
                            return (
                                <ScrollReveal key={i} delay={i * 0.12} className={`${colSpans[i]} ${topOffsets[i]}`}>
                                    <motion.div
                                        whileHover={{ y: -4, transition: { duration: 0.3 } }}
                                        className="group relative h-full"
                                    >
                                        {/* Card */}
                                        <div className="relative p-6 md:p-8 border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl rounded-xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:border-orange-500/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                                            {/* Top accent line */}
                                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Corner brackets */}
                                            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Header row */}
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-2">
                                                    <Quote size={14} className="text-orange-500/60" />
                                                    <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.25em]">Testimony #{String(i + 1).padStart(2, '0')}</span>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, j) => (
                                                        <Star key={j} size={8} className="text-orange-500 fill-orange-500" />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quote text */}
                                            <div className="relative flex-1 mb-6">
                                                <div className="absolute -top-2 -left-1 text-orange-500/10 font-body text-6xl leading-none select-none">"</div>
                                                <p className="text-zinc-300 text-sm font-mono leading-[1.8] relative z-10 pl-3 border-l-2 border-orange-500/20">
                                                    {t.quote}
                                                </p>
                                            </div>

                                            {/* Metric highlight */}
                                            <div className="mb-5 p-3 bg-orange-500/[0.06] border border-orange-500/10 rounded-lg flex items-center gap-3">
                                                <TrendingUp size={14} className="text-orange-500 flex-shrink-0" />
                                                <span className="font-heading font-bold text-lg text-orange-400 uppercase tracking-wide">{t.metric}</span>
                                            </div>

                                            {/* Author */}
                                            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-heading font-bold text-sm text-orange-500">
                                                    {t.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="text-white text-sm font-heading font-bold uppercase tracking-wide">{t.name}</div>
                                                    <div className="text-zinc-500 text-[11px] font-mono">{t.title}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>
                            );
                        })}
                    </div>

                    {/* Bottom stat bar */}
                    <ScrollReveal delay={0.3}>
                        <div className="mt-12 md:mt-16 border border-white/[0.07] bg-white/[0.02] backdrop-blur-md rounded-xl overflow-hidden">
                            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
                                {[
                                    { value: '2,400+', label: 'Active Operators' },
                                    { value: '4.9/5', label: 'Average Rating' },
                                    { value: '98%', label: 'Retention Rate' },
                                    { value: '<30s', label: 'Avg. Response' },
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 md:p-6 text-center group hover:bg-white/[0.02] transition-colors">
                                        <div className="font-heading font-bold text-2xl md:text-3xl text-white tracking-tight mb-1">
                                            <AnimatedCounter value={stat.value} duration={2} />
                                        </div>
                                        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════════════
                SECTION 5: PRICING
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <ScrollReveal>
                            <SectionBadge text="Pricing" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-zinc-400 font-mono text-sm max-w-xl mx-auto">Start free. Upgrade when you're ready. No hidden fees.</p>
                        </ScrollReveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {pricingTiers.map((tier, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div className={`relative p-6 md:p-8 rounded-lg flex flex-col h-full border transition-all ${tier.highlighted
                                    ? 'border-orange-500/40 bg-white/[0.04] backdrop-blur-md shadow-[0_0_40px_rgba(255,106,21,0.1)]'
                                    : 'border-white/10 bg-white/[0.02] backdrop-blur-md'
                                    }`}>
                                    {tier.highlighted && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="mb-6">
                                        <h3 className="font-heading font-bold text-2xl text-white uppercase tracking-wide">{tier.name}</h3>
                                        <p className="text-zinc-500 text-xs font-mono mt-1">{tier.desc}</p>
                                    </div>
                                    <div className="mb-6 flex items-baseline gap-1">
                                        <span className="font-heading font-bold text-4xl text-white">${tier.price}</span>
                                        <span className="text-zinc-500 font-mono text-sm">/mo</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {tier.features.map((feat, j) => (
                                            <li key={j} className="flex items-center gap-2.5 text-sm font-mono text-zinc-400">
                                                <Check size={14} className={tier.highlighted ? 'text-orange-500' : 'text-zinc-600'} />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`w-full py-3 font-heading font-bold uppercase tracking-widest text-sm transition-all rounded-md ${tier.highlighted
                                        ? 'bg-orange-500 hover:bg-orange-600 text-black shadow-[0_0_20px_rgba(255,106,21,0.2)]'
                                        : 'border border-zinc-700 hover:border-orange-500/50 text-zinc-300 hover:text-white'
                                        }`}>
                                        {tier.cta}
                                    </button>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════════════
                SECTION 6: FAQ — Terminal-Style Knowledge Base
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-4 md:px-6 relative z-10 border-t border-white/5 overflow-hidden">
                {/* Ambient effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/[0.02] blur-[180px] rounded-full pointer-events-none" />

                {/* Horizontal scan line effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                    <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent animate-scan-vertical" />
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* Header — split layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:mb-16">
                        <div className="lg:col-span-5">
                            <ScrollReveal>
                                <SectionBadge text="Knowledge Base" />
                                <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-[3.5rem] text-white uppercase tracking-tight leading-[0.95] mb-4">
                                    Intel<br />
                                    <span className="text-zinc-500">Briefing</span>
                                </h2>
                                <p className="text-zinc-500 font-mono text-xs leading-relaxed max-w-sm">
                                    Everything you need to know before deploying Task Rig. Select a query to access detailed intelligence.
                                </p>
                            </ScrollReveal>
                        </div>
                        <div className="lg:col-span-7 hidden lg:flex items-end justify-end">
                            <ScrollReveal delay={0.15}>
                                <div className="flex items-center gap-6 text-zinc-600 font-mono text-[10px] uppercase tracking-[0.2em]">
                                    <span className="flex items-center gap-2">
                                        <Terminal size={10} className="text-orange-500/60" />
                                        {faqItems.length} Entries Loaded
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <MessageSquare size={10} className="text-orange-500/60" />
                                        Quick Access
                                    </span>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>

                    {/* FAQ grid — two-column on desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-20 md:mb-28">
                        {faqItems.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.05}>
                                <div className={`group relative border rounded-lg overflow-hidden transition-all duration-500 ${
                                    openFaq === i
                                        ? 'border-orange-500/30 bg-orange-500/[0.04] shadow-[0_0_30px_rgba(255,106,21,0.06)]'
                                        : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03]'
                                }`}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-start gap-4 p-5 md:p-6 text-left"
                                    >
                                        {/* Index number */}
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                                            openFaq === i
                                                ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(255,106,21,0.3)]'
                                                : 'bg-zinc-800/80 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-400'
                                        }`}>
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        {/* Question text */}
                                        <div className="flex-1 min-w-0">
                                            <span className={`font-mono text-sm leading-snug block transition-colors duration-300 ${
                                                openFaq === i ? 'text-orange-400' : 'text-zinc-200'
                                            }`}>
                                                {item.q}
                                            </span>
                                        </div>

                                        {/* Toggle icon */}
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 mt-0.5 ${
                                            openFaq === i
                                                ? 'bg-orange-500/20 text-orange-500'
                                                : 'bg-zinc-800/50 text-zinc-600 group-hover:text-zinc-400'
                                        }`}>
                                            {openFaq === i ? <Minus size={12} /> : <Plus size={12} />}
                                        </div>
                                    </button>

                                    {/* Answer panel */}
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.25rem] md:pl-[4.75rem]">
                                                    <div className="relative">
                                                        {/* Decorative left line */}
                                                        <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/40 via-orange-500/20 to-transparent" />
                                                        <p className="text-zinc-400 text-sm font-mono leading-[1.8]">
                                                            {item.a}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* ── Final CTA ── */}
                    <div className="relative">
                        {/* CTA background container */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-500/[0.06] blur-[120px] rounded-full" />
                        </div>

                        <ScrollReveal>
                            <div className="relative border border-white/[0.08] bg-zinc-900/30 backdrop-blur-xl rounded-2xl overflow-hidden">
                                {/* Top glow line */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

                                {/* Corner accents */}
                                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-orange-500/40" />
                                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-orange-500/40" />
                                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-orange-500/40" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-orange-500/40" />

                                <div className="px-6 py-16 md:px-12 md:py-20 text-center relative">
                                    <div className="max-w-2xl mx-auto">
                                        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                            <span className="font-mono text-[10px] text-orange-400 uppercase tracking-[0.2em]">Awaiting Your Command</span>
                                        </div>

                                        <h2 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-5 leading-[0.95]">
                                            Ready to Deploy<br />
                                            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">Intelligent Operations?</span>
                                        </h2>
                                        <p className="text-zinc-400 font-mono text-sm max-w-lg mx-auto mb-10 leading-relaxed">
                                            Join 2,400+ operators using Task Rig to respond faster, book more jobs, and never miss a customer inquiry.
                                        </p>
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                            <button
                                                onClick={onLoginClick}
                                                className="group relative px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-heading font-bold uppercase tracking-widest text-sm transition-all rounded-md shadow-[0_0_25px_rgba(255,106,21,0.25)] hover:shadow-[0_0_40px_rgba(255,106,21,0.35)] flex items-center gap-2 overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                                <span className="relative z-10 flex items-center gap-2">
                                                    Start Free Trial
                                                    <ArrowRight size={16} />
                                                </span>
                                            </button>
                                            <a
                                                href="tel:+15551234567"
                                                className="px-8 py-3.5 border border-zinc-700 hover:border-orange-500/40 text-zinc-300 hover:text-white font-heading font-bold uppercase tracking-widest text-sm transition-all rounded-md flex items-center gap-2 group"
                                            >
                                                Schedule Demo
                                                <Phone size={14} className="group-hover:text-orange-500 transition-colors" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom glow line */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-zinc-950 pt-16 pb-10 px-6 border-t border-zinc-800 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col items-center mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <TaskRigLogo className="h-6 w-auto text-zinc-700" />
                        <div className="font-heading font-bold text-2xl tracking-tight text-zinc-600">TASK RIG</div>
                    </div>
                    <p className="text-zinc-500 font-mono text-sm max-w-sm text-center leading-relaxed mb-8">
                        Advanced AI orchestration for the modern service economy. Built for speed, security, and scale.
                    </p>
                    <div className="flex gap-6">
                        <a href="/privacy" className="text-zinc-500 hover:text-orange-500 font-mono text-xs uppercase tracking-wider transition-colors border-b border-transparent hover:border-orange-500/30 pb-1">Privacy Protocol</a>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                        © 2026 Task Rig Systems Inc. All Rights Reserved.
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-900"></div>
                        <span className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">Systems Normal</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
