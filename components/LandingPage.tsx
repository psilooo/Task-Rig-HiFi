import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail, MessageSquare, Facebook, CalendarDays, Users, BarChart3,
    Wrench, Scale, Building2, HardHat, Home, Pipette, Car, Scissors,
    Clock, GitBranch, CalendarCheck, Layers, Globe, PhoneCall,
    Zap, Activity, Shield, Rocket,
    UserPlus, Brain, Link, Play,
    ChevronDown, ChevronRight, Check, Phone,
    Star, ArrowRight, Twitter, Linkedin, Github,
    Bot, Sparkles, Send, User,
    MonitorSmartphone
} from 'lucide-react';
import { Hero } from './Hero';
import { TaskRigLogo } from './ui/TaskRigLogo';

interface LandingPageProps {
    onLoginClick: () => void;
}

// Scroll reveal wrapper
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
        className={className}
    >
        {children}
    </motion.div>
);

// Section badge component
const SectionBadge: React.FC<{ text: string }> = ({ text }) => (
    <div className="inline-flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em]">{text}</span>
    </div>
);

// Glass card component
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({ children, className = '', hover = true }) => (
    <div className={`p-6 md:p-8 border border-white/10 bg-white/[0.03] backdrop-blur-md rounded-lg transition-all duration-300 ${hover ? 'hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(255,106,21,0.08)] hover:bg-white/[0.05]' : ''} ${className}`}>
        {children}
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const yearlyDiscount = 0.8;

    const integrations = [
        { icon: Mail, title: 'Email', desc: 'Auto-respond to customer emails with context-aware AI replies' },
        { icon: MessageSquare, title: 'Live Chat', desc: 'Embed a chat widget on your site for instant customer support' },
        { icon: Facebook, title: 'Facebook Messenger', desc: 'Handle Messenger inquiries directly from your dashboard' },
        { icon: CalendarDays, title: 'Google Calendar', desc: 'Book and manage appointments without back-and-forth' },
        { icon: Users, title: 'CRM Systems', desc: 'Sync conversations and contacts with your existing CRM' },
        { icon: BarChart3, title: 'Analytics', desc: 'Track response times, satisfaction scores, and resolution rates' },
    ];

    const industries = [
        { icon: Wrench, title: 'Home Services', desc: 'HVAC, plumbing, electrical, and general contractors' },
        { icon: Scale, title: 'Law Firms', desc: 'Client intake, scheduling, and case status updates' },
        { icon: Building2, title: 'Property Management', desc: 'Tenant requests, maintenance coordination, and leasing' },
        { icon: HardHat, title: 'Construction', desc: 'Subcontractor scheduling and client communication' },
        { icon: Home, title: 'Real Estate', desc: 'Lead qualification, showing coordination, and follow-ups' },
        { icon: Pipette, title: 'Plumbing', desc: 'Emergency dispatch, estimates, and appointment booking' },
        { icon: Car, title: 'Automotive', desc: 'Service scheduling, parts inquiries, and status updates' },
        { icon: Scissors, title: 'Salons', desc: 'Online booking, reminders, and waitlist management' },
    ];

    const features = [
        { icon: Clock, title: '24/7 AI Responses', desc: 'Never miss a lead. Your AI agent responds to every inquiry around the clock.' },
        { icon: GitBranch, title: 'Smart Routing', desc: 'Urgent issues go to humans. Routine questions get instant AI answers.' },
        { icon: CalendarCheck, title: 'Appointment Booking', desc: 'Customers book directly in your calendar. No phone tag required.' },
        { icon: Layers, title: 'Multi-Channel Support', desc: 'One inbox for email, chat, and Messenger. Unified conversation history.' },
        { icon: Globe, title: '30+ Languages', desc: 'Serve customers in their preferred language, automatically detected.' },
        { icon: PhoneCall, title: 'Call Analytics', desc: 'Track every interaction with detailed analytics and sentiment scoring.' },
    ];

    const detailedFeatures = [
        {
            title: 'Handles Multiple Conversations Simultaneously',
            desc: 'While your team sleeps, Task Rig manages dozens of customer conversations at once across email, chat, and Messenger. Each customer gets a personalized response within seconds, not hours.',
            visual: (
                <div className="space-y-3">
                    {[
                        { name: 'Sarah M.', channel: 'Chat', status: 'Responding...' },
                        { name: 'Mike T.', channel: 'Email', status: 'Resolved' },
                        { name: 'Linda K.', channel: 'Messenger', status: 'Booking apt...' },
                    ].map((conv, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.15 }}
                            className="flex items-center justify-between p-3 bg-zinc-800/50 border border-white/5 rounded-md">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-mono text-zinc-300">{conv.name[0]}</div>
                                <div>
                                    <div className="text-sm text-white font-mono">{conv.name}</div>
                                    <div className="text-[10px] text-zinc-500 font-mono uppercase">{conv.channel}</div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-mono uppercase tracking-wider ${conv.status === 'Resolved' ? 'text-emerald-400' : 'text-orange-400'}`}>{conv.status}</span>
                        </motion.div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Understands Customer Context',
            desc: 'Task Rig remembers past interactions, service history, and preferences. When a returning customer reaches out, the AI already knows their name, address, and previous issues.',
            visual: (
                <div className="p-4 bg-zinc-800/50 border border-white/5 rounded-md space-y-3">
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
                        <div key={i} className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-500">{item.label}</span>
                            <span className="text-zinc-300">{item.value}</span>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Takes Action Automatically',
            desc: 'Beyond just answering questions, Task Rig takes real action. It books appointments, sends confirmations, updates your CRM, and escalates issues that need human attention.',
            visual: (
                <div className="space-y-2">
                    {[
                        { action: 'Appointment booked', time: '2s ago', icon: CalendarCheck },
                        { action: 'Confirmation sent', time: '2s ago', icon: Send },
                        { action: 'CRM updated', time: '1s ago', icon: Users },
                        { action: 'Follow-up scheduled', time: 'just now', icon: Clock },
                    ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12 }}
                            className="flex items-center gap-3 p-2.5 bg-zinc-800/50 border border-white/5 rounded-md">
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
            title: 'Learns and Improves Over Time',
            desc: 'The more conversations Task Rig handles, the smarter it gets. It learns your business terminology, common questions, and the tone your customers prefer.',
            visual: (
                <div className="p-4 bg-zinc-800/50 border border-white/5 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Accuracy Over Time</span>
                        <span className="text-xs font-mono text-emerald-400">+12% this month</span>
                    </div>
                    <div className="flex items-end gap-1 h-20">
                        {[40, 48, 52, 58, 62, 68, 72, 76, 82, 88, 91, 95].map((h, i) => (
                            <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
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
    ];

    const chatExamples = [
        {
            title: 'Booking Request',
            messages: [
                { sender: 'customer', text: 'Hi, I need to schedule an AC repair. My unit stopped blowing cold air.' },
                { sender: 'ai', text: "I'd be happy to help you schedule an AC repair! I can see you're located in the Phoenix area. We have availability tomorrow between 9 AM-12 PM or Thursday 2 PM-5 PM. Which works better for you?" },
                { sender: 'customer', text: 'Tomorrow morning works.' },
                { sender: 'ai', text: "You're all set! I've booked a technician for tomorrow, Feb 21, between 9 AM-12 PM. You'll receive a confirmation text shortly. Is there anything else I can help with?" },
            ],
        },
        {
            title: 'FAQ Answer',
            messages: [
                { sender: 'customer', text: 'Do you offer free estimates for roof repairs?' },
                { sender: 'ai', text: 'Yes! We offer free estimates for all residential roof repairs. Our inspector will assess the damage, take photos, and provide a detailed quote within 24 hours. Would you like to schedule an inspection?' },
                { sender: 'customer', text: 'Yes please, sometime this week.' },
                { sender: 'ai', text: "I've checked our availability. We can send an inspector Wednesday at 10 AM or Friday at 2 PM. Which do you prefer?" },
            ],
        },
        {
            title: 'Urgent Routing',
            messages: [
                { sender: 'customer', text: 'There is water pouring from my ceiling right now! I need emergency help!' },
                { sender: 'ai', text: "I understand this is an emergency. I'm immediately routing you to our on-call team. In the meantime, please locate your main water shut-off valve and turn it off to minimize damage. A team member will call you within 2 minutes." },
                { sender: 'system', text: 'Escalated to on-call technician. Priority: URGENT. ETA: 2 minutes.' },
            ],
        },
    ];

    const benefits = [
        { icon: Shield, metric: '99.9%', label: 'Uptime', title: 'Always Available', desc: 'Your AI never calls in sick, never takes a break. Customers get help any time of day or night.' },
        { icon: Zap, metric: '<2s', label: 'Response Time', title: 'Instant Responses', desc: 'No hold music, no wait times. Every customer gets an immediate, relevant response.' },
        { icon: MonitorSmartphone, metric: '3+', label: 'Channels', title: 'Multi-Channel', desc: 'Email, live chat, and Facebook Messenger all managed from a single dashboard.' },
        { icon: Rocket, metric: '5 min', label: 'Setup Time', title: 'Easy Setup', desc: 'Connect your channels, upload your FAQs, and go live in minutes. No developers needed.' },
    ];

    const setupSteps = [
        { num: '01', title: 'Create Account', desc: 'Sign up in 30 seconds. No credit card required for your free trial.' },
        { num: '02', title: 'Train Your AI', desc: 'Upload your FAQs, service descriptions, and pricing. The AI learns your business instantly.' },
        { num: '03', title: 'Connect Channels', desc: 'Link your email, add the chat widget, and connect Facebook Messenger.' },
        { num: '04', title: 'Go Live', desc: 'Flip the switch. Your AI agent starts handling customer inquiries immediately.' },
    ];

    const testimonials = [
        {
            quote: "Task Rig cut our response time from 4 hours to under 30 seconds. We're booking 40% more jobs because leads aren't going cold while waiting for a callback.",
            name: 'Marcus Johnson',
            title: 'Owner',
            company: 'Johnson HVAC Services',
            metric: '+40% bookings',
        },
        {
            quote: "Our intake process used to take 20 minutes per client call. Now Task Rig handles initial screening and scheduling automatically. My staff focuses on actual casework.",
            name: 'Rebecca Alvarez',
            title: 'Managing Partner',
            company: 'Alvarez & Associates Law',
            metric: '3x faster intake',
        },
        {
            quote: "Managing 200+ units was a nightmare for tenant communication. Now maintenance requests come in via chat, get triaged by AI, and dispatched to the right vendor automatically.",
            name: 'Derek Simmons',
            title: 'Operations Director',
            company: 'Apex Property Group',
            metric: '60% fewer calls',
        },
    ];

    const pricingTiers = [
        {
            name: 'Starter',
            price: 49,
            desc: 'Perfect for solo operators and small teams just getting started.',
            features: ['1 AI Agent', '500 conversations/mo', 'Email + Chat', 'Basic analytics', 'Email support'],
            cta: 'Start Free Trial',
            highlighted: false,
        },
        {
            name: 'Business Pro',
            price: 99,
            desc: 'Everything growing businesses need to automate customer service.',
            features: ['3 AI Agents', 'Unlimited conversations', 'Email + Chat + Messenger', 'Advanced analytics', 'Calendar integration', 'CRM sync', 'Priority support'],
            cta: 'Start Free Trial',
            highlighted: true,
        },
        {
            name: 'Enterprise',
            price: 299,
            desc: 'For organizations that need maximum power and customization.',
            features: ['Unlimited AI Agents', 'Unlimited conversations', 'All channels + API access', 'Custom AI training', 'Dedicated account manager', 'White-label option', 'SLA guarantee', '24/7 phone support'],
            cta: 'Contact Sales',
            highlighted: false,
        },
    ];

    const faqItems = [
        {
            q: 'How does the AI learn about my business?',
            a: 'During setup, you upload your FAQs, service descriptions, pricing, and any other relevant information. Task Rig uses this to build a custom knowledge base. The AI also learns from every conversation it handles, continuously improving its responses.',
        },
        {
            q: 'Will customers know they are talking to an AI?',
            a: 'That is up to you. You can configure the AI to introduce itself as an assistant, or let it respond naturally. Most customers care more about getting fast, accurate help than who or what is providing it.',
        },
        {
            q: 'What happens when the AI cannot answer a question?',
            a: 'Task Rig intelligently routes conversations it cannot handle to your team. It provides a full summary of the conversation so your staff can pick up seamlessly without the customer repeating themselves.',
        },
        {
            q: 'Can I customize the AI responses and tone?',
            a: 'Absolutely. You can set the tone (professional, friendly, casual), add custom responses for specific questions, and create rules for how the AI handles different situations. You stay in full control.',
        },
        {
            q: 'How long does setup take?',
            a: 'Most businesses are up and running in under 30 minutes. Connect your channels, upload your knowledge base, and the AI is ready to go. No technical expertise required.',
        },
        {
            q: 'Is my customer data secure?',
            a: 'Yes. All data is encrypted in transit and at rest. We are SOC 2 compliant and never use your customer data to train models for other businesses. Your data stays yours.',
        },
    ];

    const footerLinks = {
        Product: ['Features', 'Integrations', 'Pricing', 'Changelog'],
        Resources: ['Documentation', 'API Reference', 'Blog', 'Case Studies'],
        Company: ['About', 'Careers', 'Contact', 'Partners'],
        Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-hidden selection:bg-orange-500/30">
            {/* Fixed Background Grid */}
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

            {/* Navigation - Fixed Top */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <TaskRigLogo className="h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                        <div className="font-heading font-bold text-2xl tracking-tight text-white">TASK RIG</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="tel:+15551234567"
                            className="group flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-sm"
                        >
                            <Phone size={14} className="transition-colors" />
                            Call Demo
                        </a>
                        <button
                            onClick={onLoginClick}
                            className="group flex items-center gap-2 px-5 py-2 border border-zinc-800 hover:border-orange-500/50 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-sm"
                        >
                            Login
                            <ChevronRight size={14} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <Hero onLoginClick={onLoginClick} />


            {/* ============================================================ */}
            {/* 1. TRUSTED BY */}
            {/* ============================================================ */}
            <div className="border-b border-white/5 bg-zinc-900/20 relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-zinc-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em]">
                            <span className="text-zinc-600">Trusted by 500+ businesses</span>
                            <div className="hidden md:block w-px h-4 bg-zinc-800" />
                            <div className="flex items-center flex-wrap justify-center gap-6 md:gap-10">
                                {['Apex Plumbing Co.', 'Ironclad HVAC', 'Summit Legal Group', 'Keystone Properties', 'Trident Auto'].map((name, i) => (
                                    <motion.span key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                        className="hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">{name}</motion.span>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>


            {/* ============================================================ */}
            {/* 2. INTEGRATIONS */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <SectionBadge text="Integrations" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Powerful Integrations</h2>
                            <p className="mt-4 text-zinc-400 font-mono text-sm max-w-xl mx-auto">Connect the tools your business already uses. Task Rig fits right into your workflow.</p>
                        </ScrollReveal>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {integrations.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.08}>
                                <GlassCard className="h-full">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-5">
                                        <item.icon size={20} className="text-orange-500" />
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wide mb-2">{item.title}</h3>
                                    <p className="text-zinc-400 text-sm font-mono leading-relaxed">{item.desc}</p>
                                </GlassCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>


            {/* ============================================================ */}
            {/* 3. INDUSTRY SOLUTIONS */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 bg-zinc-900/20 border-y border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <SectionBadge text="Industries" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Built for Businesses Like Yours</h2>
                            <p className="mt-4 text-zinc-400 font-mono text-sm max-w-xl mx-auto">Task Rig is designed for blue-collar and service businesses that rely on customer communication.</p>
                        </ScrollReveal>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {industries.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.06}>
                                <div className="group p-5 border border-white/5 bg-white/[0.02] rounded-lg hover:border-orange-500/20 hover:bg-white/[0.04] transition-all duration-300 text-center">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800/80 flex items-center justify-center mb-3 mx-auto group-hover:bg-orange-500/10 transition-colors">
                                        <item.icon size={18} className="text-zinc-400 group-hover:text-orange-500 transition-colors" />
                                    </div>
                                    <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wide mb-1">{item.title}</h3>
                                    <p className="text-zinc-500 text-[11px] font-mono leading-relaxed">{item.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>


            {/* ============================================================ */}
            {/* 4. HOW IT WORKS (Features) */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <SectionBadge text="Features" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Everything You Need</h2>
                            <p className="mt-4 text-zinc-400 font-mono text-sm max-w-xl mx-auto">Powerful features that work together to automate your customer service.</p>
                        </ScrollReveal>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.08}>
                                <GlassCard className="h-full">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-5">
                                        <item.icon size={20} className="text-orange-500" />
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wide mb-2">{item.title}</h3>
                                    <p className="text-zinc-400 text-sm font-mono leading-relaxed">{item.desc}</p>
                                </GlassCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>


            {/* ============================================================ */}
            {/* 5. DETAILED AI FEATURES */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 bg-zinc-900/20 border-y border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <ScrollReveal>
                            <SectionBadge text="AI Capabilities" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Smarter Than a Chatbot</h2>
                            <p className="mt-4 text-zinc-400 font-mono text-sm max-w-xl mx-auto">Task Rig doesn't just answer questions. It understands, acts, and learns.</p>
                        </ScrollReveal>
                    </div>
                    <div className="space-y-24">
                        {detailedFeatures.map((feature, i) => (
                            <div key={i} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:direction-rtl' : ''}`}>
                                <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                                    <ScrollReveal>
                                        <h3 className="font-heading font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-4">{feature.title}</h3>
                                        <p className="text-zinc-400 font-mono text-sm leading-relaxed">{feature.desc}</p>
                                    </ScrollReveal>
                                </div>
                                <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                                    <ScrollReveal delay={0.15}>
                                        <div className="p-1 border border-white/5 rounded-lg bg-zinc-900/50">
                                            <div className="p-5">
                                                {feature.visual}
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ============================================================ */}
            {/* 6. CHAT EXAMPLES */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <SectionBadge text="See It In Action" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Real Conversations</h2>
                            <p className="mt-4 text-zinc-400 font-mono text-sm max-w-xl mx-auto">Here's how Task Rig handles real customer interactions, automatically.</p>
                        </ScrollReveal>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {chatExamples.map((example, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div className="border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-lg overflow-hidden h-full flex flex-col">
                                    <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">{example.title}</span>
                                    </div>
                                    <div className="p-5 space-y-3 flex-1">
                                        {example.messages.map((msg, j) => (
                                            <div key={j} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                                                {msg.sender === 'system' ? (
                                                    <div className="w-full text-center py-2 px-3 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-400">
                                                        {msg.text}
                                                    </div>
                                                ) : (
                                                    <div className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm font-mono leading-relaxed ${msg.sender === 'customer'
                                                        ? 'bg-zinc-800 text-zinc-200 rounded-br-sm'
                                                        : 'bg-orange-500/10 border border-orange-500/20 text-zinc-300 rounded-bl-sm'
                                                        }`}>
                                                        {msg.sender === 'ai' && (
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <Bot size={10} className="text-orange-500" />
                                                                <span className="text-[9px] text-orange-500 uppercase tracking-wider">Task Rig AI</span>
                                                            </div>
                                                        )}
                                                        {msg.text}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>


            {/* ============================================================ */}
            {/* 7. WHY TASK RIG (Benefits) */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 bg-zinc-900/20 border-y border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <SectionBadge text="Why Task Rig" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Results That Speak</h2>
                        </ScrollReveal>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {benefits.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <GlassCard className="h-full text-center">
                                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 mx-auto">
                                        <item.icon size={22} className="text-orange-500" />
                                    </div>
                                    <div className="font-heading font-bold text-3xl text-white mb-1">{item.metric}</div>
                                    <div className="font-mono text-[10px] text-orange-500 uppercase tracking-widest mb-3">{item.label}</div>
                                    <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wide mb-2">{item.title}</h3>
                                    <p className="text-zinc-400 text-sm font-mono leading-relaxed">{item.desc}</p>
                                </GlassCard>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>


            {/* ============================================================ */}
            {/* 8. SETUP STEPS */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <SectionBadge text="Getting Started" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Live in 4 Steps</h2>
                        </ScrollReveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {setupSteps.map((step, i) => (
                            <ScrollReveal key={i} delay={i * 0.12}>
                                <div className="relative">
                                    {i < setupSteps.length - 1 && (
                                        <div className="hidden md:block absolute top-8 left-[calc(100%+0.25rem)] w-[calc(100%-1rem)] h-px bg-zinc-800">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <div className="font-heading font-bold text-5xl text-orange-500/20 mb-3">{step.num}</div>
                                        <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wide mb-2">{step.title}</h3>
                                        <p className="text-zinc-400 text-sm font-mono leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>


            {/* ============================================================ */}
            {/* 9. TESTIMONIALS */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 bg-zinc-900/20 border-y border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <SectionBadge text="Testimonials" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Trusted by Teams</h2>
                        </ScrollReveal>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <GlassCard className="h-full flex flex-col">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} size={14} className="text-orange-500 fill-orange-500" />
                                        ))}
                                    </div>
                                    <p className="text-zinc-300 text-sm font-mono leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-white text-sm font-heading font-bold uppercase">{t.name}</div>
                                            <div className="text-zinc-500 text-[11px] font-mono">{t.title}, {t.company}</div>
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


            {/* ============================================================ */}
            {/* 10. PRICING */}
            {/* ============================================================ */}
            <section id="pricing" className="py-24 md:py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <ScrollReveal>
                            <SectionBadge text="Pricing" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-zinc-400 font-mono text-sm max-w-xl mx-auto mb-8">Start free. Upgrade when you're ready. No hidden fees.</p>

                            {/* Billing Toggle */}
                            <div className="inline-flex items-center gap-3 bg-zinc-900/80 border border-white/10 rounded-full p-1">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${billingCycle === 'monthly' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${billingCycle === 'yearly' ? 'bg-orange-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Yearly
                                    <span className="ml-1.5 text-[9px] text-orange-400">-20%</span>
                                </button>
                            </div>
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
                                        <span className="font-heading font-bold text-4xl text-white">
                                            ${billingCycle === 'yearly' ? Math.round(tier.price * yearlyDiscount) : tier.price}
                                        </span>
                                        <span className="text-zinc-500 font-mono text-sm">/mo</span>
                                        {billingCycle === 'yearly' && (
                                            <span className="text-zinc-600 font-mono text-xs ml-2 line-through">${tier.price}</span>
                                        )}
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


            {/* ============================================================ */}
            {/* 11. FAQ */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 bg-zinc-900/20 border-y border-white/5 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <ScrollReveal>
                            <SectionBadge text="FAQ" />
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Common Questions</h2>
                        </ScrollReveal>
                    </div>
                    <div className="space-y-3">
                        {faqItems.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.05}>
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
                </div>
            </section>


            {/* ============================================================ */}
            {/* 12. FINAL CTA */}
            {/* ============================================================ */}
            <section className="py-24 md:py-32 px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center relative">
                    {/* Glow behind */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

                    <ScrollReveal>
                        <SectionBadge text="Get Started" />
                        <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-4">
                            Ready to Transform Your Customer Service?
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
            </section>


            {/* ============================================================ */}
            {/* 13. FOOTER */}
            {/* ============================================================ */}
            <footer className="bg-zinc-950 pt-20 pb-10 px-6 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Footer Top */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-10 mb-16">
                        {/* Brand + Newsletter */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <TaskRigLogo className="h-6 w-auto text-orange-500" />
                                <div className="font-heading font-bold text-xl tracking-tight text-white">TASK RIG</div>
                            </div>
                            <p className="text-zinc-500 font-mono text-xs leading-relaxed mb-6">
                                AI-powered customer service for blue-collar businesses. Handle email, chat, and Messenger automatically.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 px-3 py-2 bg-zinc-900 border border-white/10 rounded-md text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                                />
                                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-md transition-colors">
                                    Join
                                </button>
                            </div>
                        </div>

                        {/* Link Columns */}
                        {Object.entries(footerLinks).map(([heading, links]) => (
                            <div key={heading}>
                                <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wide mb-4">{heading}</h4>
                                <ul className="space-y-2.5">
                                    {links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-zinc-500 hover:text-orange-500 font-mono text-xs transition-colors">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                            &copy; 2026 Task Rig Systems Inc. All Rights Reserved.
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-zinc-600 hover:text-orange-500 transition-colors"><Twitter size={16} /></a>
                            <a href="#" className="text-zinc-600 hover:text-orange-500 transition-colors"><Linkedin size={16} /></a>
                            <a href="#" className="text-zinc-600 hover:text-orange-500 transition-colors"><Github size={16} /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
