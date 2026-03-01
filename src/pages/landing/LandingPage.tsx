import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, MotionConfig } from 'framer-motion';
import {
    Users,
    Clock, GitBranch, CalendarCheck, Globe,
    Phone,
    ArrowRight,
    Send, User,
} from 'lucide-react';
import { TaskRigLogo } from '../../components/ui/TaskRigLogo';
import { Footer } from '../../components/layout/Footer';
import { CHAT_MESSAGES } from '../../constants/pricing';
import { HeroSection } from './HeroSection';
import { IntegrationMarquee } from './IntegrationMarquee';
import { PainPointsSection } from './PainPointsSection';
import { ProductShowcase } from './ProductShowcase';
import { TestimonialsSection } from './TestimonialsSection';
import { PricingSection } from './PricingSection';
import { FaqSection } from './FaqSection';

interface LandingPageProps {
    onLoginClick: () => void;
}

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

    const [isAnnual, setIsAnnual] = useState(false);

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

    const chatMessages = CHAT_MESSAGES;

    return (
        <MotionConfig reducedMotion="user">
        <div className="min-h-[100svh] bg-zinc-950 text-zinc-100 relative overflow-x-clip selection:bg-orange-500/30">
            {/* Fixed Background Grid + Noise Dither */}
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>
            <div className="fixed inset-0 noise-dither opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"></div>

            {/* Navigation - Fixed Top */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-14 md:h-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex justify-between items-center">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 md:gap-3 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950">
                        <TaskRigLogo className="h-5 md:h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                        <div className="font-heading font-bold text-base md:text-2xl tracking-tight text-white whitespace-nowrap">TASK RIG</div>
                    </button>
                    <div className="flex items-center gap-2 md:gap-3">
                        <a
                            href="tel:+18442222486"
                            className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-2 bg-orange-500 hover:bg-orange-600 text-white font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all rounded-sm focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950"
                        >
                            <Phone size={12} className="md:hidden transition-colors" />
                            <Phone size={14} className="hidden md:block transition-colors" />
                            Call Demo
                        </a>
                        <button
                            onClick={onLoginClick}
                            className="group flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-2 border border-zinc-800 hover:border-orange-500/50 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all rounded-sm focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950"
                        >
                            Login
                            <ArrowRight size={12} className="md:hidden text-zinc-500 group-hover:text-orange-500 transition-colors" />
                            <ArrowRight size={14} className="hidden md:block text-zinc-500 group-hover:text-orange-500 transition-colors" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <HeroSection onLoginClick={onLoginClick} />


            {/* Integration Partners Marquee */}
            <IntegrationMarquee />


            {/* Pain Points Section */}
            <PainPointsSection />


            {/* Product Showcase */}
            <ProductShowcase
                featureTabs={featureTabs}
                activeFeature={activeFeature}
                featureProgress={featureProgress}
                handleFeatureClick={handleFeatureClick}
                chatRef={chatRef}
                chatInView={chatInView}
                chatMessages={chatMessages}
                featureSectionRef={featureSectionRef}
            />



            {/* Testimonials */}
            <TestimonialsSection />

            {/* ── Visual connector: Testimonials → Pricing ── */}
            <div className="relative z-10 flex flex-col items-center -my-2 md:-my-4">
                <div className="relative w-px h-12 md:h-20 bg-gradient-to-b from-orange-500/30 via-orange-500/10 to-transparent overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-500/60 shadow-[0_0_12px_rgba(255,106,21,0.4)] animate-[connector-dot_2s_ease-in-out_infinite]" />
                </div>
            </div>

            {/* Pricing */}
            <PricingSection isAnnual={isAnnual} setIsAnnual={setIsAnnual} />


            {/* FAQ + Final CTA */}
            <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />


            {/* Footer */}
            <Footer />
        </div>
        </MotionConfig>
    );
};
