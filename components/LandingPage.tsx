import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
    TrendingUp,
    AlertTriangle,
    DollarSign,
    Zap,
    ShieldAlert
} from 'lucide-react';
import { Hero } from './Hero';
import { TaskRigLogo } from './ui/TaskRigLogo';
import { Footer } from './Footer';

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
    const [featureProgress, setFeatureProgress] = useState(0);
    const featureTimerRef = useRef<number | null>(null);
    const featureStartRef = useRef<number>(0);
    const featurePausedRef = useRef(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const chatInView = useInView(chatRef, { once: true, margin: '-100px' });
    const featureSectionRef = useRef<HTMLDivElement>(null);
    const featureSectionInView = useInView(featureSectionRef, { margin: '-100px' });

    const FEATURE_DURATION = 10000; // 10 seconds per tab

    // Auto-advance feature tabs with progress bar
    useEffect(() => {
        if (!featureSectionInView) {
            featurePausedRef.current = true;
            if (featureTimerRef.current) {
                cancelAnimationFrame(featureTimerRef.current);
                featureTimerRef.current = null;
            }
            return;
        }

        featurePausedRef.current = false;
        featureStartRef.current = performance.now();
        setFeatureProgress(0);

        const tick = (now: number) => {
            if (featurePausedRef.current) return;
            const elapsed = now - featureStartRef.current;
            const progress = Math.min(elapsed / FEATURE_DURATION, 1);
            setFeatureProgress(progress);

            if (progress >= 1) {
                setActiveFeature(prev => (prev + 1) % 4);
                featureStartRef.current = performance.now();
                setFeatureProgress(0);
            }
            featureTimerRef.current = requestAnimationFrame(tick);
        };

        featureTimerRef.current = requestAnimationFrame(tick);

        return () => {
            if (featureTimerRef.current) {
                cancelAnimationFrame(featureTimerRef.current);
            }
        };
    }, [featureSectionInView, activeFeature]);

    const handleFeatureClick = (index: number) => {
        setActiveFeature(index);
        setFeatureProgress(0);
        featureStartRef.current = performance.now();
    };

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

    const [isAnnual, setIsAnnual] = useState(false);

    const pricingTiers = [
        {
            name: 'Starter',
            tagline: 'For solo operators & small home service businesses.',
            prices: { monthly: 297, annual: 248 },
            features: [
                { text: '24/7 AI Voice Receptionist', emph: ' — answers every call, captures leads' },
                { text: 'Website Chat Widget', emph: ' — engages visitors 24/7' },
                { text: 'Google Review Automation', emph: ' — every review replied to automatically' },
                { text: 'Up to ', emph: '150 voice minutes', suffix: ' / month' },
                { text: 'Client dashboard — call logs & basic analytics' },
                { text: '1 dedicated phone number' },
                { text: 'CASL compliant setup' },
                { text: 'Email support' },
            ],
            overage: 'Overage: $0.35/additional minute',
            ctaText: 'Book a Free Demo',
            setupFee: '+ $197 one-time setup fee',
            highlighted: false,
            colorScheme: 'green',
        },
        {
            name: 'Premium',
            tagline: 'Your front office, fully automated. Calls, bookings & follow-ups handled.',
            prices: { monthly: 597, annual: 497 },
            features: [
                { text: 'Everything in Starter', emph: ', plus:' },
                { text: 'Up to ', emph: '400 voice minutes', suffix: ' / month' },
                { text: 'Automated booking workflow', emph: ' — AI sends SMS booking link mid-call' },
                { text: 'CRM integration', emph: ' — GoHighLevel, calendar sync, contact records' },
                { text: 'Follow-up sequences', emph: ' — missed call text-back, appointment reminders' },
                { text: 'Custom AI persona', emph: ' — branded voice & script tailored to your business' },
                { text: 'Advanced dashboard — bookings, lead conversion, call outcomes' },
                { text: 'Priority email + chat support' },
                { text: 'Onboarding call included' },
            ],
            overage: 'Overage: $0.30/additional minute',
            ctaText: 'Get Your AI Built',
            setupFee: '+ $397 one-time setup fee',
            highlighted: true,
            colorScheme: 'blue',
        },
        {
            name: 'Enterprise',
            tagline: 'Multi-location operations & high-volume businesses.',
            prices: { monthly: '1,197', annual: '997' },
            features: [
                { text: 'Everything in Premium', emph: ', plus:' },
                { text: 'Unlimited minutes', emph: ' — up to 1,200/mo, custom above that' },
                { text: 'Multi-location support', emph: ' — separate AI agents per location' },
                { text: 'Bilingual support', emph: ' — English + French (EN/FR)' },
                { text: 'Custom integrations', emph: ' — existing CRM, dispatch & scheduling tools' },
                { text: 'Dedicated account manager' },
                { text: 'Monthly performance review calls' },
                { text: 'Uptime SLA guarantee' },
                { text: 'Priority phone support' },
            ],
            overage: '',
            ctaText: 'Book a Strategy Call',
            setupFee: '+ $797 one-time setup fee (scoped per client)',
            highlighted: false,
            colorScheme: 'silver',
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
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-clip selection:bg-orange-500/30">
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
                            href="tel:+18442222486"
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
                            <div className="relative flex-1 overflow-hidden">
                                <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
                                    {['APEX PLUMBING', 'IRONCLAD HVAC', 'SUMMIT LEGAL', 'KEYSTONE PROP.', 'TRIDENT AUTO', 'BRIGHTPATH DENTAL', 'FORGE CONST.', 'VERTEX REALTY'].map((name, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
                                            className="font-mono text-[10px] text-zinc-500 tracking-wider whitespace-nowrap flex-shrink-0"
                                        >
                                            {name}
                                        </motion.span>
                                    ))}
                                </div>
                                {/* Fade gradient on right edge to hint at scrollability */}
                                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-zinc-950 pointer-events-none md:hidden" />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>


            {/* ════════════════════════════════════════════════════════════════
                THREAT ASSESSMENT — HUD-style pain points
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-4 md:px-6 relative z-10">
                {/* Ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20">
                        <ScrollReveal>
                            <SectionBadge text="Threat Assessment" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight">
                                Your Business Has<br />
                                <span className="text-zinc-500">Blind Spots</span>
                            </h2>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal>
                        <div className="relative border border-white/[0.07] rounded-2xl bg-gradient-to-br from-white/[0.03] via-zinc-950/80 to-white/[0.02] backdrop-blur-sm overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.4)]">
                            {/* Top glow line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

                            {/* Header bar */}
                            <div className="border-b border-white/[0.06] px-5 md:px-8 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert size={12} className="text-red-500" />
                                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em]">System Diagnostics</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="font-mono text-[10px] text-red-500/80 uppercase tracking-[0.2em]">4 Issues Detected</span>
                                </div>
                            </div>

                            {/* 2x2 Card Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:odd:divide-x divide-white/[0.06]">
                                {[
                                    {
                                        label: 'RESPONSE GAP',
                                        stat: '78%',
                                        desc: 'of leads go cold within 5 minutes of first contact',
                                        severity: 'CRITICAL',
                                        icon: AlertTriangle,
                                    },
                                    {
                                        label: 'AFTER-HOURS VOID',
                                        stat: '62%',
                                        desc: 'of customer inquiries arrive outside business hours',
                                        severity: 'WARNING',
                                        icon: Clock,
                                    },
                                    {
                                        label: 'REVENUE LEAK',
                                        stat: '$1,200',
                                        desc: 'average lifetime value lost per dropped customer',
                                        severity: 'CRITICAL',
                                        icon: DollarSign,
                                    },
                                    {
                                        label: 'MANUAL OVERLOAD',
                                        stat: '23',
                                        suffix: ' hrs/wk',
                                        desc: 'spent on repetitive tasks AI handles instantly',
                                        severity: 'WARNING',
                                        icon: Zap,
                                    },
                                ].map((card, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-60px' }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                                        className={`relative p-6 md:p-8 group hover:bg-white/[0.02] transition-colors ${i < 2 ? 'md:border-b md:border-white/[0.06]' : ''} ${i % 2 === 0 ? 'md:border-r md:border-white/[0.06]' : ''}`}
                                    >
                                        {/* Corner brackets */}
                                        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Label + Severity */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${card.severity === 'CRITICAL' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                                                    <card.icon size={14} className={card.severity === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'} />
                                                </div>
                                                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">{card.label}</span>
                                            </div>
                                            <span className={`font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-sm ${card.severity === 'CRITICAL'
                                                ? 'text-red-400 border-red-500/30 bg-red-500/10'
                                                : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                                            }`}>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span className={`w-1 h-1 rounded-full animate-pulse ${card.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                                    {card.severity}
                                                </span>
                                            </span>
                                        </div>

                                        {/* Stat */}
                                        <div className="font-heading font-bold text-4xl md:text-5xl text-white tracking-tight mb-3">
                                            <AnimatedCounter value={card.stat + (card.suffix || '')} duration={2} />
                                        </div>

                                        {/* Description */}
                                        <p className="font-mono text-sm text-zinc-500 leading-relaxed">
                                            {card.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Terminal prompt footer */}
                            <div className="border-t border-white/[0.06] px-5 md:px-8 py-3 flex items-center gap-3">
                                <span className="font-mono text-[11px] text-zinc-600">&gt;</span>
                                <span className="font-mono text-[11px] text-orange-500/80 tracking-wide">task-rig --deploy --resolve-all</span>
                                <span className="w-1.5 h-4 bg-orange-500/70 animate-pulse" />
                            </div>

                            {/* Bottom glow line */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                        </div>
                    </ScrollReveal>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════════════
                SECTION 2+3: PRODUCT SHOWCASE — Features & Live Demo
                Unified two-panel layout with shared visual container
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-4 md:px-6 relative z-10" ref={chatRef}>
                {/* Ambient glow effects */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/[0.03] blur-[180px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    {/* Unified header */}
                    <div className="text-center mb-16 md:mb-20">
                        <ScrollReveal>
                            <SectionBadge text="Product Showcase" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight">
                                Smarter Than a Chatbot.
                            </h2>
                            <p className="mt-5 text-zinc-400 font-mono text-base max-w-2xl mx-auto leading-relaxed">
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
                                <div ref={featureSectionRef} className="lg:col-span-5 p-6 md:p-8 lg:p-10 flex flex-col">
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
                                                onClick={() => handleFeatureClick(i)}
                                                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 whitespace-nowrap flex-shrink-0 overflow-hidden ${activeFeature === i
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
                                                <div className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${activeFeature === i ? 'bg-orange-500/20' : 'bg-zinc-800/60'}`}>
                                                    <tab.icon size={16} className={activeFeature === i ? 'text-orange-500' : 'text-zinc-500'} />
                                                </div>
                                                <div className="relative z-10">
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
                                                <p className="text-zinc-400 font-mono text-base leading-relaxed mb-5">{featureTabs[activeFeature].desc}</p>

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
                                        <div className="p-5 space-y-3 flex-1 h-[360px] md:h-auto md:min-h-[360px]">
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
                MID-PAGE CTA — Capture prospects convinced by the demo
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-4 md:px-6 relative z-10 border-y border-white/5">
                <div className="max-w-7xl mx-auto text-center">
                    <ScrollReveal>
                        <h2 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-6">
                            Ready to Stop Missing Calls?
                        </h2>
                        <p className="text-zinc-400 font-mono text-base max-w-xl mx-auto mb-10 leading-relaxed">
                            See how Task Rig answers, books, and follows up — so you never lose another lead.
                        </p>
                        <Link
                            to="/get-started"
                            className="relative inline-flex px-14 py-4 bg-[#FF6A15] hover:bg-[#ff853f] text-black font-mono font-bold text-sm uppercase tracking-widest transition-all group clip-path-slant shadow-[0_0_20px_rgba(255,106,21,0.25)] hover:shadow-[0_0_30px_rgba(255,106,21,0.4)] justify-center items-center gap-3 no-underline"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                GET STARTED
                                <svg width="14" height="10" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 opacity-80 group-hover:opacity-100">
                                    <path d="M1 6H14M14 6L9 1M14 6L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                                </svg>
                            </span>
                        </Link>
                    </ScrollReveal>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════════════
                SECTION 4: TESTIMONIALS — Immersive Stacked Cards
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-4 md:px-6 relative z-10 overflow-clip">
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
                                        Testimonials
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

                    {/* Testimonials — equal-width cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                        {testimonials.map((t, i) => {
                            return (
                                <ScrollReveal key={i} delay={i * 0.12}>
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
                                                <p className="text-zinc-300 text-base font-mono leading-[1.8] relative z-10 pl-3 border-l-2 border-orange-500/20">
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
                                    { value: '2,400+', label: 'Active Operators', animated: true },
                                    { value: '4.9/5', label: 'Average Rating', animated: false },
                                    { value: '98%', label: 'Retention Rate', animated: true },
                                    { value: '<30s', label: 'Avg. Response', animated: true },
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 md:p-6 text-center group hover:bg-white/[0.02] transition-colors">
                                        <div className="font-heading font-bold text-2xl md:text-3xl text-white tracking-tight mb-1">
                                            {stat.animated ? <AnimatedCounter value={stat.value} duration={2} /> : stat.value}
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
                SECTION 5: PRICING (Integrated from taskrig_pricing.html)
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">

                {/* Header */}
                <ScrollReveal className="w-full">
                    <div className="flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.18em] text-orange-500 uppercase mb-5">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        Pricing
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    </div>
                    <h2 className="font-heading font-bold text-[clamp(2.25rem,6vw,4.5rem)] leading-none text-center tracking-[-0.02em] text-white uppercase mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="font-mono text-[13px] text-zinc-500 text-center tracking-[0.04em] mb-16">
                        Fully built for you. Live in 48 hours. Cancel anytime. No hidden fees.
                    </p>
                </ScrollReveal>

                {/* Annual toggle */}
                <ScrollReveal delay={0.1} className="w-full">
                    <div className="flex items-center justify-center gap-[12px] mb-[52px]">
                        <span className={`font-mono text-[12px] tracking-[0.08em] transition-colors leading-none pt-0.5 ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>

                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            type="button"
                            className={`w-[44px] h-[24px] rounded-[12px] border relative transition-colors duration-200 outline-none focus:outline-none ${isAnnual ? 'bg-orange-500 border-orange-500' : 'bg-zinc-900 border-zinc-700'}`}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            <div className={`absolute top-[3px] left-[3px] w-[16px] h-[16px] rounded-full bg-white transition-transform duration-200 ${isAnnual ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                        </button>

                        <div className="flex items-center gap-3">
                            <span className={`font-mono text-[12px] tracking-[0.08em] transition-colors leading-none pt-0.5 ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>Annual</span>
                            <span className="font-mono text-[10px] font-bold text-orange-500 bg-orange-500/[0.12] border border-orange-500 px-2 py-0.5 rounded leading-none pt-[3px] tracking-[0.06em]">
                                Save 2 Months
                            </span>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] items-start w-full">
                    {pricingTiers.map((tier, i) => {
                        const isFeatured = tier.highlighted;

                        // Dynamic Color mapping
                        const getTagColors = (scheme?: string) => {
                            switch (scheme) {
                                case 'green': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
                                case 'blue': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
                                case 'silver': return 'text-zinc-300 bg-zinc-300/[0.08] border-zinc-300/25';
                                default: return 'text-zinc-300 bg-zinc-800/50 border-zinc-700/50';
                            }
                        };

                        const getCheckColor = (scheme?: string) => {
                            switch (scheme) {
                                case 'green': return '#34d399';
                                case 'blue': return '#60a5fa';
                                case 'silver': return '#ffffff';
                                default: return '#d4d4d8';
                            }
                        };

                        return (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div className={`relative p-[36px] md:p-[32px] lg:p-[36px] border rounded-[12px] flex flex-col h-full bg-zinc-950 transition-all duration-300 ${isFeatured ? 'border-orange-500 transform -translate-y-[8px] hover:-translate-y-[12px] bg-[linear-gradient(160deg,rgb(28,18,8)_0%,rgb(9,9,11)_60%)]' : 'border-zinc-800 hover:border-zinc-700 hover:-translate-y-[4px]'}`}>
                                    {isFeatured && (
                                        <>
                                            <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 bg-orange-500 text-white font-mono text-[10px] font-bold tracking-[0.14em] uppercase px-4 py-[3px] pt-[4px] rounded-[12px] whitespace-nowrap z-10 leading-none">
                                                Most Popular
                                            </div>
                                            {/* Orange glow under-layer */}
                                            <div className="absolute inset-[-1px] rounded-[12px] bg-[linear-gradient(135deg,rgb(245,98,15)_0%,transparent_60%)] opacity-15 pointer-events-none" />
                                        </>
                                    )}

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="self-start">
                                            <div className={`inline-block font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-0.5 rounded border font-bold mb-3 ${getTagColors(tier.colorScheme)}`}>
                                                {tier.name}
                                            </div>
                                        </div>

                                        <h3 className="font-heading font-black text-[22px] tracking-[-0.01em] text-white uppercase mb-1.5">{tier.name}</h3>
                                        <p className="font-mono text-[11px] text-zinc-500 tracking-[0.04em] mb-7 leading-relaxed flex-shrink-0 min-h-[40px]">{tier.tagline}</p>

                                        <div className="flex items-end gap-1 mb-1.5">
                                            <span className="font-mono text-[13px] text-zinc-500 pb-2">$</span>
                                            <span className="font-heading font-black text-[52px] leading-none text-white tracking-[-0.03em]">
                                                {isAnnual ? tier.prices.annual : tier.prices.monthly}
                                            </span>
                                            <span className="font-mono text-[13px] text-zinc-500 pb-2 tracking-[0.04em]">CAD /mo</span>
                                        </div>
                                        <div className="font-mono text-[11px] text-orange-500 mb-[32px] min-h-[16px] tracking-[0.04em]">
                                            {isAnnual ? 'Billed annually — saves 2 months' : ''}
                                        </div>

                                        <ul className="flex flex-col gap-[12px] mb-[32px] flex-1 list-none p-0">
                                            {tier.features.map((feat, j) => (
                                                <li key={j} className="flex items-start gap-[10px] text-[14px] text-zinc-300 leading-[1.45]">
                                                    <svg className="flex-shrink-0 mt-[3px] w-4 h-4" viewBox="0 0 16 16" fill="none">
                                                        <circle cx="8" cy="8" r="7.5" stroke={getCheckColor(tier.colorScheme)} strokeOpacity="0.3" />
                                                        <path d="M5 8l2 2 4-4" stroke={getCheckColor(tier.colorScheme)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span>
                                                        {feat.text && feat.emph ? (
                                                            <>
                                                                {feat.text.startsWith('Everything') ? <span className="font-bold text-white">{feat.text}</span> : <span>{feat.text}</span>}
                                                                {feat.emph && !feat.text.startsWith('Everything') ? <span className="font-bold text-white">{feat.emph}</span> : <span>{feat.emph}</span>}
                                                                {feat.suffix && <span>{feat.suffix}</span>}
                                                            </>
                                                        ) : (
                                                            feat.text
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="font-mono text-[10px] text-zinc-500 tracking-[0.04em] mt-1 mb-[24px]">
                                            {tier.overage}
                                        </div>

                                        <div className="h-px bg-zinc-800 w-full mb-[24px]"></div>

                                        <Link to="/get-started" className="no-underline block w-full">
                                            <div className={`block w-full py-[14px] rounded-[8px] font-mono text-[12px] font-bold tracking-[0.12em] uppercase text-center transition-all cursor-pointer ${isFeatured
                                                ? 'bg-orange-500 text-white shadow-[0_4px_24px_rgba(245,98,15,0.25)] hover:bg-orange-600 hover:shadow-[0_4px_32px_rgba(245,98,15,0.55)] hover:-translate-y-px border-none'
                                                : tier.name === 'Enterprise'
                                                    ? 'bg-transparent border border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-200'
                                                    : 'bg-transparent border border-zinc-700 text-zinc-200 hover:border-white hover:text-white hover:bg-white/[0.04]'
                                                }`}>
                                                {tier.ctaText}
                                            </div>
                                        </Link>

                                        <div className="font-mono text-[10px] text-zinc-500 text-center mt-2.5 tracking-[0.06em]">
                                            {tier.setupFee}
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>

                {/* Bottom strip */}
                <ScrollReveal delay={0.2} className="w-full">
                    <div className="mt-12 flex items-center justify-center gap-x-8 gap-y-4 flex-wrap">
                        {['No long-term contracts', 'CASL & PIPEDA compliant', 'Live in 48 hours', 'Canadian-built & managed', 'Cancel anytime'].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-zinc-500">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-orange-500"><path d="M7 1l1.5 3.5H13l-3.5 2.5 1.5 4L7 9 3 11l1.5-4L1 4.5h4.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                                {item}
                            </div>
                        ))}
                    </div>
                </ScrollReveal>
            </section>


            {/* ════════════════════════════════════════════════════════════════
                SECTION 6: FAQ — Terminal-Style Knowledge Base
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-4 md:px-6 relative z-10 border-t border-white/5 overflow-clip">
                {/* Ambient effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/[0.02] blur-[180px] rounded-full pointer-events-none" />

                {/* Horizontal scan line effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                    <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent animate-scan-vertical" />
                </div>

                <div className="max-w-7xl mx-auto">
                    {/* Header — split layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 md:mb-20">
                        <div className="lg:col-span-5">
                            <ScrollReveal>
                                <SectionBadge text="Knowledge Base" />
                                <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-[3.5rem] text-white uppercase tracking-tight leading-[0.95] mb-4">
                                    Common<br />
                                    <span className="text-zinc-500">Questions</span>
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
                                <motion.div
                                    layout
                                    transition={{ layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                                    className={`group relative border rounded-lg overflow-hidden transition-[border-color,background-color,box-shadow] duration-500 ${openFaq === i
                                    ? 'border-orange-500/30 bg-orange-500/[0.04] shadow-[0_0_30px_rgba(255,106,21,0.06)]'
                                    : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03]'
                                    }`}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-start gap-4 p-5 md:p-6 text-left"
                                    >
                                        {/* Index number */}
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${openFaq === i
                                            ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(255,106,21,0.3)]'
                                            : 'bg-zinc-800/80 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-400'
                                            }`}>
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        {/* Question text */}
                                        <div className="flex-1 min-w-0">
                                            <span className={`font-mono text-sm leading-snug block transition-colors duration-300 ${openFaq === i ? 'text-orange-400' : 'text-zinc-200'
                                                }`}>
                                                {item.q}
                                            </span>
                                        </div>

                                        {/* Toggle icon */}
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 mt-0.5 ${openFaq === i
                                            ? 'bg-orange-500/20 text-orange-500'
                                            : 'bg-zinc-800/50 text-zinc-600 group-hover:text-zinc-400'
                                            }`}>
                                            {openFaq === i ? <Minus size={12} /> : <Plus size={12} />}
                                        </div>
                                    </button>

                                    {/* Answer panel */}
                                    <AnimatePresence initial={false}>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
                                </motion.div>
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
                                            Join 2,400+ home service businesses using Task Rig to respond faster, book more jobs, and never miss a customer inquiry.
                                        </p>
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                            <Link
                                                to="/get-started"
                                                className="relative w-full sm:w-auto px-12 py-3 bg-orange-500 hover:bg-orange-400 text-black font-mono font-bold text-[11px] uppercase tracking-widest transition-all group clip-path-slant shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] flex justify-center items-center gap-3 no-underline"
                                            >
                                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                                                <span className="relative z-10 flex items-center gap-2">
                                                    GET STARTED
                                                    <svg width="14" height="10" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 opacity-80 group-hover:opacity-100">
                                                        <path d="M1 6H14M14 6L9 1M14 6L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                                                    </svg>
                                                </span>
                                            </Link>
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
            <Footer />
        </div>
    );
};
