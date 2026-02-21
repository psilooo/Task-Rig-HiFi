import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
    Mail, MessageSquare, Facebook, CalendarDays, Users, BarChart3,
    Wrench, Scale, Building2, Home, Car,
    Clock, GitBranch, CalendarCheck, Layers, Globe, PhoneCall,
    Zap, Shield, Rocket,
    ChevronDown, Check, Phone,
    Star, ArrowRight,
    Bot, Send, User,
    MonitorSmartphone, Sparkles
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

const SectionDivider: React.FC<{ flip?: boolean }> = ({ flip = false }) => (
    <div className="relative z-10 h-px w-full">
        <div className={`absolute inset-x-0 h-px ${flip ? 'bg-gradient-to-r from-transparent via-orange-500/20 to-transparent' : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'}`} />
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

    const industryShowcase = [
        {
            icon: Wrench,
            title: 'Home Services',
            tagline: 'HVAC, Electrical, Plumbing & More',
            description: 'AI handles service calls, dispatches technicians, and books follow-ups — so you never lose a lead to voicemail again.',
            tools: [
                { icon: PhoneCall, name: 'VoIP Dispatch' },
                { icon: CalendarDays, name: 'Smart Scheduling' },
                { icon: Users, name: 'CRM Sync' },
                { icon: MessageSquare, name: 'Live Chat' },
            ],
            stat: { value: '40%', label: 'More bookings' },
        },
        {
            icon: Scale,
            title: 'Law Firms',
            tagline: 'Client Intake, Scheduling & Case Routing',
            description: 'Automate client screening, schedule consultations, and route inquiries to the right attorney — 24/7, in any language.',
            tools: [
                { icon: Mail, name: 'Email Intake' },
                { icon: CalendarDays, name: 'Consultation Booking' },
                { icon: Users, name: 'Case Management' },
                { icon: Globe, name: 'Multilingual' },
            ],
            stat: { value: '3x', label: 'Faster intake' },
        },
        {
            icon: Building2,
            title: 'Property Management',
            tagline: 'Maintenance, Leasing & Tenant Communication',
            description: 'Tenants submit requests via chat, AI triages by urgency, and dispatches maintenance crews automatically.',
            tools: [
                { icon: MessageSquare, name: 'Tenant Chat' },
                { icon: Wrench, name: 'Work Orders' },
                { icon: BarChart3, name: 'Analytics' },
                { icon: Mail, name: 'Notifications' },
            ],
            stat: { value: '60%', label: 'Fewer calls' },
        },
        {
            icon: Car,
            title: 'Automotive',
            tagline: 'Service Booking, Estimates & Follow-ups',
            description: 'From oil changes to major repairs — AI qualifies the job, provides estimates, and books the bay.',
            tools: [
                { icon: CalendarDays, name: 'Bay Scheduling' },
                { icon: PhoneCall, name: 'Call Handling' },
                { icon: Users, name: 'Customer History' },
                { icon: BarChart3, name: 'Revenue Tracking' },
            ],
            stat: { value: '2x', label: 'Service capacity' },
        },
        {
            icon: Home,
            title: 'Real Estate',
            tagline: 'Lead Capture, Showings & Follow-up',
            description: 'Capture leads from every channel, qualify buyer intent, and schedule showings without lifting a finger.',
            tools: [
                { icon: Globe, name: 'Lead Capture' },
                { icon: CalendarDays, name: 'Showing Scheduler' },
                { icon: Mail, name: 'Drip Campaigns' },
                { icon: Facebook, name: 'Social Inbox' },
            ],
            stat: { value: '5x', label: 'Lead response speed' },
        },
    ];
    const [activeIndustry, setActiveIndustry] = useState(0);

    const chatMessages = [
        { sender: 'customer', text: 'Hi, I need to schedule an AC repair. My unit stopped blowing cold air.' },
        { sender: 'ai', text: "I'd be happy to help you schedule an AC repair! I can see you're located in the Phoenix area. We have availability tomorrow between 9 AM-12 PM or Thursday 2 PM-5 PM. Which works better for you?" },
        { sender: 'customer', text: 'Tomorrow morning works.' },
        { sender: 'ai', text: "You're all set! I've booked a technician for tomorrow, Feb 21, between 9 AM-12 PM. You'll receive a confirmation text shortly. Is there anything else I can help with?" },
    ];

    const metrics = [
        { value: '99.9%', label: 'Uptime', icon: Shield },
        { value: '<2s', label: 'Response Time', icon: Zap },
        { value: '40%', label: 'More Bookings', icon: Rocket },
        { value: '500+', label: 'Businesses', icon: MonitorSmartphone },
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
                SECTION 1: SOCIAL PROOF MARQUEE
            ════════════════════════════════════════════════════════════════ */}
            <div className="bg-zinc-900/30 relative z-10 overflow-hidden">
                <div className="py-6">
                    <ScrollReveal>
                        <div className="flex items-center justify-center gap-8 mb-4">
                            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-zinc-800" />
                            <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.25em]">Trusted by 500+ businesses</span>
                            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-zinc-800" />
                        </div>
                    </ScrollReveal>
                    <div className="marquee-track">
                        <div className="marquee-content">
                            {[...Array(2)].map((_, setIdx) => (
                                <React.Fragment key={setIdx}>
                                    {['Apex Plumbing Co.', 'Ironclad HVAC', 'Summit Legal Group', 'Keystone Properties', 'Trident Auto', 'BrightPath Dental', 'Forge Construction', 'Vertex Realty'].map((name, i) => (
                                        <span key={`${setIdx}-${i}`} className="text-zinc-500 font-mono text-xs uppercase tracking-[0.15em] whitespace-nowrap px-8 hover:text-zinc-300 transition-colors cursor-default">
                                            {name}
                                            <span className="text-orange-500/30 ml-8">///</span>
                                        </span>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            {/* Gradient divider: marquee → features */}
            <SectionDivider />

            {/* ════════════════════════════════════════════════════════════════
                SECTION 2: FEATURES + HOW IT WORKS (Interactive Tabs)
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 px-6 relative z-10">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14 md:mb-16">
                        <ScrollReveal>
                            <SectionBadge text="How It Works" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight">
                                Smarter Than<br className="hidden md:block" /> a Chatbot
                            </h2>
                            <p className="mt-5 text-zinc-400 font-mono text-sm max-w-lg mx-auto leading-relaxed">
                                Task Rig doesn't just answer questions. It understands context, takes action, and learns your business.
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Tabbed Feature Explorer */}
                    <ScrollReveal>
                        <div className="flex flex-col items-center">
                            {/* Tab Buttons - Centered Row */}
                            <div className="flex flex-wrap justify-center gap-2 mb-10 overflow-x-auto pb-2 w-full">
                                {featureTabs.map((tab, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveFeature(i)}
                                        className={`flex items-center gap-3 px-5 py-4 rounded-lg text-left transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeFeature === i
                                            ? 'bg-orange-500/10 border border-orange-500/30 shadow-[0_0_20px_rgba(255,106,21,0.06)]'
                                            : 'bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${activeFeature === i ? 'bg-orange-500/20' : 'bg-zinc-800/60'}`}>
                                            <tab.icon size={18} className={activeFeature === i ? 'text-orange-500' : 'text-zinc-500'} />
                                        </div>
                                        <div>
                                            <div className={`font-heading font-bold text-sm uppercase tracking-wide transition-colors ${activeFeature === i ? 'text-white' : 'text-zinc-400'}`}>{tab.label}</div>
                                            <div className="text-[11px] font-mono text-zinc-600 hidden md:block mt-0.5">{tab.title}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Active Feature Content - Centered Below */}
                            <div className="w-full max-w-4xl">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeFeature}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                            <div className="text-center md:text-left">
                                                <h3 className="font-heading font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-4">{featureTabs[activeFeature].title}</h3>
                                                <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-6">{featureTabs[activeFeature].desc}</p>
                                                <div className="flex items-center justify-center md:justify-start gap-4">
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
                                            <div className="p-1 border border-white/5 rounded-lg bg-zinc-900/50">
                                                <div className="p-5">
                                                    {featureTabs[activeFeature].visual}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>


            {/* Transition: features → industries */}
            <div className="relative z-10 py-10 md:py-14">
                <ScrollReveal>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-px h-10 bg-gradient-to-b from-transparent to-orange-500/30" />
                        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.25em]">See how it fits your world</span>
                        <div className="w-px h-10 bg-gradient-to-b from-orange-500/30 to-transparent" />
                    </div>
                </ScrollReveal>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 3: INDUSTRIES + INTEGRATIONS (Interactive Showcase)
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 px-6 relative z-10 bg-white/[0.01]">
                {/* Background accents */}
                <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-orange-500/[0.015] blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-orange-500/[0.01] blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-14 md:mb-16">
                        <ScrollReveal>
                            <SectionBadge text="Built For You" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight">
                                Your Industry.<br className="hidden md:block" /> Your Tools.
                            </h2>
                            <p className="mt-5 text-zinc-400 font-mono text-sm max-w-lg mx-auto leading-relaxed">
                                Select your industry to see exactly how Task Rig fits into your workflow.
                            </p>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal>
                        {/* Industry Selector - Pill Navigation */}
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 md:mb-16">
                            {industryShowcase.map((industry, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndustry(i)}
                                    className={`group relative flex items-center gap-2.5 px-4 md:px-6 py-3 md:py-3.5 rounded-full font-heading font-bold text-xs md:text-sm uppercase tracking-wide transition-all duration-300 ${
                                        activeIndustry === i
                                            ? 'bg-orange-500 text-black shadow-[0_0_30px_rgba(249,115,22,0.3)]'
                                            : 'bg-white/[0.03] border border-white/10 text-zinc-400 hover:border-orange-500/30 hover:text-zinc-200 hover:bg-white/[0.05]'
                                    }`}
                                >
                                    <industry.icon size={16} className={activeIndustry === i ? 'text-black' : 'text-zinc-500 group-hover:text-orange-500 transition-colors'} />
                                    <span className="hidden sm:inline">{industry.title}</span>
                                    <span className="sm:hidden">{industry.title.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>

                        {/* Active Industry Showcase */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndustry}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-md">
                                    {/* Decorative glow behind the card */}
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/[0.06] blur-[100px] rounded-full pointer-events-none" />
                                    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-500/[0.04] blur-[80px] rounded-full pointer-events-none" />

                                    <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-0">
                                        {/* Left: Industry Info (3 cols) */}
                                        <div className="lg:col-span-3 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                                            {/* Industry Icon + Title */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                                    {React.createElement(industryShowcase[activeIndustry].icon, { size: 26, className: 'text-orange-500' })}
                                                </div>
                                                <div>
                                                    <h3 className="font-heading font-bold text-2xl md:text-3xl text-white uppercase tracking-tight">
                                                        {industryShowcase[activeIndustry].title}
                                                    </h3>
                                                    <p className="font-mono text-[11px] text-orange-500/70 uppercase tracking-wider mt-0.5">
                                                        {industryShowcase[activeIndustry].tagline}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-8 max-w-lg">
                                                {industryShowcase[activeIndustry].description}
                                            </p>

                                            {/* Stat Badge */}
                                            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-orange-500/[0.08] border border-orange-500/20">
                                                <span className="font-heading font-bold text-2xl md:text-3xl text-orange-500">
                                                    {industryShowcase[activeIndustry].stat.value}
                                                </span>
                                                <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                                                    {industryShowcase[activeIndustry].stat.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right: Connected Tools (2 cols) */}
                                        <div className="lg:col-span-2 p-8 md:p-12 lg:p-10 bg-white/[0.02] border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col justify-center">
                                            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-6">Connected Tools</div>
                                            <div className="space-y-3">
                                                {industryShowcase[activeIndustry].tools.map((tool, i) => (
                                                    <motion.div
                                                        key={`${activeIndustry}-${i}`}
                                                        initial={{ opacity: 0, x: 16 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                        className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 hover:bg-white/[0.06] transition-all duration-300"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors flex-shrink-0">
                                                            <tool.icon size={18} className="text-orange-500" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="font-heading font-bold text-sm text-zinc-200 uppercase tracking-wide">{tool.name}</span>
                                                        </div>
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Setup Steps */}
                                            <div className="mt-8 pt-6 border-t border-white/5">
                                                <div className="flex items-center justify-between">
                                                    {['Connect', 'Train', 'Launch'].map((step, i) => (
                                                        <React.Fragment key={i}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[9px] font-mono font-bold text-orange-500">
                                                                    {i + 1}
                                                                </div>
                                                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{step}</span>
                                                            </div>
                                                            {i < 2 && (
                                                                <div className="flex-1 mx-2 h-px bg-gradient-to-r from-orange-500/20 to-transparent" />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </ScrollReveal>
                </div>
            </section>


            {/* Transition: industries → chat demo */}
            <div className="relative z-10 py-10 md:py-14 bg-gradient-to-b from-white/[0.01] to-transparent">
                <ScrollReveal>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/10" />
                        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.25em]">But don't take our word for it</span>
                        <div className="w-px h-10 bg-gradient-to-b from-white/10 to-transparent" />
                    </div>
                </ScrollReveal>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 4: LIVE DEMO - Animated Chat (Full-Width Star Section)
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 px-6 relative z-10" ref={chatRef}>
                {/* Radial gradient background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(255,106,21,0.04),transparent)] pointer-events-none" />

                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <ScrollReveal>
                            <SectionBadge text="See It In Action" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight">
                                Real Conversations
                            </h2>
                            <p className="mt-5 text-zinc-400 font-mono text-sm max-w-md mx-auto leading-relaxed">
                                Watch how Task Rig handles a real customer booking — from first message to confirmation.
                            </p>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal>
                        <div className="max-w-2xl mx-auto">
                            {/* Chat window chrome */}
                            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.3)]">
                                {/* Title bar */}
                                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                        </div>
                                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider ml-2">Live Chat — Booking Request</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-mono text-emerald-500/70 uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                                {/* Messages */}
                                <div className="p-6 space-y-4 min-h-[320px]">
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
                    </ScrollReveal>
                </div>
            </section>


            {/* Gradient divider: chat → metrics */}
            <SectionDivider flip />


            {/* ════════════════════════════════════════════════════════════════
                SECTION 5: METRICS + TESTIMONIALS (Merged)
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 px-6 relative z-10 bg-white/[0.015]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-orange-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto">
                    {/* Metrics Bar */}
                    <ScrollReveal>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden mb-16 md:mb-20">
                            {metrics.map((m, i) => (
                                <div key={i} className="bg-zinc-950 p-8 md:p-10 text-center group hover:bg-white/[0.02] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/15 transition-colors">
                                        <m.icon size={18} className="text-orange-500" />
                                    </div>
                                    <div className="font-heading font-bold text-3xl md:text-4xl text-white mb-1">
                                        <AnimatedCounter value={m.value} />
                                    </div>
                                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{m.label}</div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* Testimonials */}
                    <div className="text-center mb-12">
                        <ScrollReveal>
                            <SectionBadge text="Results" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">
                                What Teams Are Saying
                            </h2>
                        </ScrollReveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <GlassCard className="h-full flex flex-col">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} size={12} className="text-orange-500 fill-orange-500" />
                                        ))}
                                    </div>
                                    <p className="text-zinc-300 text-sm font-mono leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-white text-sm font-heading font-bold uppercase">{t.name}</div>
                                            <div className="text-zinc-500 text-[11px] font-mono">{t.title}</div>
                                        </div>
                                        <div className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] font-mono text-orange-400 uppercase tracking-wider">
                                            {t.metric}
                                        </div>
                                    </div>
                                </GlassCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>


            {/* Transition: testimonials → pricing */}
            <div className="relative z-10 py-10 md:py-14 bg-gradient-to-b from-white/[0.015] to-transparent">
                <ScrollReveal>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-px h-10 bg-gradient-to-b from-transparent to-orange-500/20" />
                        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.25em]">Ready to get started?</span>
                        <div className="w-px h-10 bg-gradient-to-b from-orange-500/20 to-transparent" />
                    </div>
                </ScrollReveal>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                SECTION 6: PRICING
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
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


            {/* Gradient divider: pricing → FAQ */}
            <SectionDivider flip />

            {/* ════════════════════════════════════════════════════════════════
                SECTION 7: FAQ + FINAL CTA (Merged)
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 px-6 relative z-10 bg-white/[0.01]">
                <div className="max-w-3xl mx-auto">
                    {/* FAQ */}
                    <div className="text-center mb-14">
                        <ScrollReveal>
                            <SectionBadge text="FAQ" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Common Questions</h2>
                        </ScrollReveal>
                    </div>
                    <div className="space-y-3 mb-20 md:mb-24">
                        {faqItems.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.04}>
                                <div className="border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-5 text-left group"
                                    >
                                        <span className="font-mono text-sm text-white pr-4">{item.q}</span>
                                        <ChevronDown
                                            size={16}
                                            className={`text-zinc-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-orange-500' : ''}`}
                                        />
                                    </button>
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: openFaq === i ? 'auto' : 0,
                                            opacity: openFaq === i ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 text-zinc-400 text-sm font-mono leading-relaxed border-t border-white/5 pt-4">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Final CTA */}
                    <div className="text-center relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

                        <ScrollReveal>
                            <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-4">
                                Ready to Transform<br />Your Customer Service?
                            </h2>
                            <p className="text-zinc-400 font-mono text-sm max-w-lg mx-auto mb-10">
                                Join 500+ businesses that use Task Rig to respond faster, book more jobs, and never miss a customer inquiry.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={onLoginClick}
                                    className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-heading font-bold uppercase tracking-widest text-sm transition-all rounded-md shadow-[0_0_20px_rgba(255,106,21,0.2)] hover:shadow-[0_0_30px_rgba(255,106,21,0.3)] flex items-center gap-2"
                                >
                                    Start Free Trial
                                    <ArrowRight size={16} />
                                </button>
                                <a
                                    href="tel:+15551234567"
                                    className="px-8 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-heading font-bold uppercase tracking-widest text-sm transition-all rounded-md flex items-center gap-2"
                                >
                                    Schedule Demo
                                    <Phone size={14} />
                                </a>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>


            {/* Gradient divider: CTA → footer */}
            <SectionDivider />

            {/* Footer */}
            <footer className="bg-zinc-950 pt-16 pb-10 px-6 relative z-10">
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
