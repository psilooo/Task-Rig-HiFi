import React from 'react';
import { Reveal } from './ui/Reveal';
import { Bot, Zap, Shield, ChevronRight, Terminal, LayoutGrid, Network, Globe, Cpu, Check, Database, Lock } from 'lucide-react';
import { Hero } from './Hero';
import { TaskRigLogo } from './ui/TaskRigLogo';

interface LandingPageProps {
    onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-hidden selection:bg-orange-500/30">
            {/* Fixed Background Grid */}
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

            {/* Navigation - Fixed Top */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <TaskRigLogo className="h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                        <div className="font-heading font-bold text-2xl tracking-tight text-white mt-1">TASK RIG</div>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#protocol" className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors">Protocol</a>
                        <a href="#features" className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors">Capabilities</a>
                        <a href="#pricing" className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors">Access</a>
                    </div>
                    <button
                        onClick={onLoginClick}
                        className="group flex items-center gap-2 px-5 py-2 border border-zinc-800 hover:border-orange-500/50 bg-zinc-900 text-zinc-300 hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-sm"
                    >
                        Login
                        <ChevronRight size={14} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                    </button>
                </div>
            </nav>

            {/* Hero Section - Padding handled internally by Hero component to align with fixed nav */}
            <Hero onLoginClick={onLoginClick} />

            {/* Trusted / Status Strip */}
            <div className="border-b border-white/5 bg-zinc-900/30 relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">
                        <span>Trusted By Automated Systems Corp</span>
                        <div className="flex items-center flex-wrap gap-4 md:gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="flex items-center gap-2"><Globe size={16} /> Nexus Global</span>
                            <span className="flex items-center gap-2"><Cpu size={16} /> Core Dynamics</span>
                            <span className="flex items-center gap-2"><Network size={16} /> Hyper Grid</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Operational Protocol Section */}
            <section id="protocol" className="py-24 px-6 relative overflow-hidden z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 md:mb-24 text-center">
                        <Reveal>
                            <span className="font-mono text-orange-500 text-xs uppercase tracking-widest mb-2 block">/// System Architecture</span>
                            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">Operational Protocol</h2>
                        </Reveal>
                    </div>

                    <div className="relative">
                        {/* Central Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-zinc-800 md:left-1/2 md:-translate-x-1/2 z-0"></div>

                        <div className="space-y-20">
                            {/* Step 1 */}
                            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="md:text-right order-2 md:order-1 pl-16 md:pl-0">
                                    <Reveal>
                                        <h3 className="font-heading font-bold text-3xl text-white mb-4 uppercase">1. Ingestion</h3>
                                        <p className="font-mono text-zinc-400 text-sm leading-relaxed mb-4">
                                            Connect your existing CRM, Email, and VoIP streams. The Rig creates a unified data lake, standardizing input formats for AI processing.
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-[10px] font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest">
                                            <Database size={12} />
                                            Data Normalization
                                        </div>
                                    </Reveal>
                                </div>
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-2 border-orange-500 z-10 rounded-full box-content shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
                                <div className="order-1 md:order-2 pl-16 md:pl-0">
                                    <Reveal delay={0.1}>
                                        <div className="p-6 border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm rounded-sm">
                                            <div className="font-mono text-[10px] text-zinc-500 mb-2">INPUT STREAM</div>
                                            <div className="flex gap-2">
                                                {['Twilio', 'SendGrid', 'Salesforce'].map(t => (
                                                    <span key={t} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs font-mono">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </Reveal>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="order-2 pl-16 md:pl-0 md:text-right md:order-1">
                                    <Reveal delay={0.1}>
                                        <div className="p-6 border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm rounded-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"></div>
                                            <div className="font-mono text-[10px] text-zinc-500 mb-2">PROCESSING CORE</div>
                                            <div className="space-y-2">
                                                <div className="h-2 bg-zinc-800 rounded w-3/4"></div>
                                                <div className="h-2 bg-zinc-800 rounded w-1/2"></div>
                                                <div className="h-2 bg-zinc-800 rounded w-5/6"></div>
                                            </div>
                                        </div>
                                    </Reveal>
                                </div>
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-2 border-white z-10 rounded-full box-content"></div>
                                <div className="order-1 pl-16 md:pl-0 md:order-2">
                                    <Reveal>
                                        <h3 className="font-heading font-bold text-3xl text-white mb-4 uppercase">2. Execution</h3>
                                        <p className="font-mono text-zinc-400 text-sm leading-relaxed mb-4">
                                            Autonomous agents analyze intent and sentiment. They draft responses, schedule appointments, and route complex tickets to human supervisors.
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-[10px] font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest">
                                            <Cpu size={12} />
                                            Neural Routing
                                        </div>
                                    </Reveal>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="md:text-right order-2 md:order-1 pl-16 md:pl-0">
                                    <Reveal>
                                        <h3 className="font-heading font-bold text-3xl text-white mb-4 uppercase">3. Settlement</h3>
                                        <p className="font-mono text-zinc-400 text-sm leading-relaxed mb-4">
                                            Completed tasks are logged, analytics are updated in real-time, and the system self-optimizes based on resolution metrics.
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-[10px] font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest">
                                            <Lock size={12} />
                                            Secure Log
                                        </div>
                                    </Reveal>
                                </div>
                                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-950 border-2 border-emerald-500 z-10 rounded-full box-content"></div>
                                <div className="order-1 md:order-2 pl-16 md:pl-0">
                                    <Reveal delay={0.1}>
                                        <div className="p-6 border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm rounded-sm">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                <div className="font-mono text-[10px] text-zinc-500">TASK COMPLETE</div>
                                            </div>
                                            <div className="font-heading text-2xl text-white">98.4% <span className="text-sm text-zinc-500">Efficiency</span></div>
                                        </div>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 relative bg-zinc-900/30 border-y border-zinc-800/50 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <Reveal>
                            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-white uppercase tracking-tight">System Capabilities</h2>
                            <div className="h-1 w-20 bg-orange-500"></div>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature Cards */}
                        {[
                            { icon: Bot, title: "Autonomous Agents", desc: "Self-learning models that handle complex customer interactions, negotiation, and scheduling 24/7." },
                            { icon: Zap, title: "Real-time Ops", desc: "Live monitoring of all dispatch and communication channels with sub-millisecond latency." },
                            { icon: Shield, title: "Secure Core", desc: "Enterprise-grade encryption for all client data and logs. SOC2 compliant infrastructure." },
                            { icon: Terminal, title: "Command Line", desc: "Direct interface access for advanced operators. Script custom workflows on the fly." },
                            { icon: LayoutGrid, title: "Neural Routing", desc: "AI-driven dispatch algorithms that optimize field technician routes and job allocation." },
                            { icon: Network, title: "Omni-Link", desc: "Unified communication stream integrating SMS, Email, VoIP, and Social channels." }
                        ].map((feature, idx) => (
                            <Reveal key={idx} delay={idx * 0.1} className="h-full">
                                <div className="group h-full p-6 md:p-8 border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/80 backdrop-blur-sm transition-all hover:border-orange-500/30 rounded-sm flex flex-col">
                                    <div className="w-12 h-12 bg-zinc-950 rounded-sm flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-orange-500/50 transition-colors shadow-lg">
                                        <feature.icon className="text-orange-500" size={24} />
                                    </div>
                                    <h3 className="font-heading font-bold text-2xl mb-3 text-zinc-100 uppercase tracking-wide">{feature.title}</h3>
                                    <p className="text-zinc-500 text-sm font-mono leading-relaxed">{feature.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing / Access */}
            <section id="pricing" className="py-24 px-6 bg-zinc-900/50 border-b border-white/5 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <Reveal>
                            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4 text-white uppercase tracking-tight">Select Access Protocol</h2>
                            <p className="text-zinc-400 font-body text-lg">Choose the operational capacity that fits your organization's scale.</p>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Tier 1 */}
                        <Reveal delay={0} className="h-full">
                            <div className="h-full p-6 md:p-8 border border-zinc-800 bg-zinc-950 rounded-sm flex flex-col">
                                <div className="mb-4">
                                    <h3 className="font-mono text-orange-500 uppercase tracking-widest text-xs mb-2">Unit</h3>
                                    <div className="font-heading font-bold text-4xl text-white">Scout</div>
                                </div>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">$49</span>
                                    <span className="text-zinc-500 font-mono text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['1 Autonomous Agent', 'Basic CRM Sync', 'Email Support', '1k Tasks/mo'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
                                            <Check size={14} className="text-zinc-600" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-3 border border-zinc-700 hover:border-orange-500 text-zinc-300 hover:text-orange-500 font-heading font-bold uppercase tracking-widest transition-all text-sm">
                                    Deploy Scout
                                </button>
                            </div>
                        </Reveal>

                        {/* Tier 2 */}
                        <Reveal delay={0.1} className="h-full">
                            <div className="h-full p-6 md:p-8 border border-orange-500/30 bg-zinc-900/80 rounded-sm flex flex-col relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                    Recommended
                                </div>
                                <div className="mb-4">
                                    <h3 className="font-mono text-orange-500 uppercase tracking-widest text-xs mb-2">Squad</h3>
                                    <div className="font-heading font-bold text-4xl text-white">Operator</div>
                                </div>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">$129</span>
                                    <span className="text-zinc-500 font-mono text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['5 Autonomous Agents', 'Full CRM Integration', 'Priority Neural Routing', 'Unlimited Tasks', 'Voice Processing'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-mono">
                                            <Check size={14} className="text-orange-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-black font-heading font-bold uppercase tracking-widest transition-all text-sm shadow-lg hover:shadow-orange-500/20">
                                    Deploy Operator
                                </button>
                            </div>
                        </Reveal>

                        {/* Tier 3 */}
                        <Reveal delay={0.2} className="h-full">
                            <div className="h-full p-6 md:p-8 border border-zinc-800 bg-zinc-950 rounded-sm flex flex-col">
                                <div className="mb-4">
                                    <h3 className="font-mono text-zinc-500 uppercase tracking-widest text-xs mb-2">Fleet</h3>
                                    <div className="font-heading font-bold text-4xl text-white">Commander</div>
                                </div>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">Custom</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {['Unlimited Agents', 'Custom API Access', 'Dedicated Server', 'White Labeling', '24/7 Eng Support'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
                                            <Check size={14} className="text-zinc-600" /> {item}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-3 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white font-heading font-bold uppercase tracking-widest transition-all text-sm">
                                    Contact Sales
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-zinc-950 pt-20 pb-10 px-6 border-t border-zinc-800 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 bg-zinc-800 rounded-sm"></div>
                            <div className="font-heading font-bold text-2xl tracking-tight text-white">TASK RIG</div>
                        </div>
                        <p className="text-zinc-500 font-mono text-sm max-w-xs leading-relaxed">
                            Advanced AI orchestration for the modern service economy. Built for speed, security, and scale.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-heading font-bold uppercase tracking-wider mb-6">Platform</h4>
                        <ul className="space-y-3">
                            {['Intelligence', 'Infrastructure', 'Security', 'Changelog'].map(item => (
                                <li key={item}><a href="#" className="text-zinc-500 hover:text-orange-500 font-mono text-xs uppercase tracking-wider transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-heading font-bold uppercase tracking-wider mb-6">Legal</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="/privacy" className="text-zinc-500 hover:text-orange-500 font-mono text-xs uppercase tracking-wider transition-colors">Privacy Protocol</a>
                            </li>
                            {['Terms of Service', 'SLA', 'Data Usage'].map(item => (
                                <li key={item}><a href="#" className="text-zinc-500 hover:text-orange-500 font-mono text-xs uppercase tracking-wider transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                        © 2025 Task Rig Systems Inc. All Rights Reserved.
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