import React from 'react';
import { motion } from 'framer-motion';
import {
    Star,
    Quote,
    TrendingUp,
} from 'lucide-react';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { SectionBadge } from '../../components/ui/SectionBadge';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { TESTIMONIALS } from '../../constants/pricing';

export const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-10 md:py-14 px-4 md:px-6 relative z-10 overflow-visible">
            {/* Ambient background effects — overflow-visible so glow bleeds into adjacent sections */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-orange-500/[0.03] blur-[150px] rounded-full" />
                <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-orange-500/[0.02] blur-[120px] rounded-full" />
            </div>

            {/* Decorative vertical lines */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block">
                <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-zinc-800/50 to-transparent" />
                <div className="absolute top-0 right-[15%] w-px h-full bg-gradient-to-b from-transparent via-zinc-800/50 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto relative">
                {/* Section header with asymmetric layout */}
                <div className="mb-6 md:mb-8">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div>
                                <SectionBadge text="What Our Clients Say" />
                                <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-white uppercase tracking-tight leading-[0.95]">
                                    Testimonials
                                </h2>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Testimonials — equal-width cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                    {TESTIMONIALS.map((t, i) => {
                        return (
                            <ScrollReveal key={i} delay={i * 0.12}>
                                <motion.div
                                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                                    className="group relative h-full"
                                >
                                    {/* Card */}
                                    <div className="relative p-5 md:p-6 border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl rounded-xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:border-orange-500/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
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
                                            <p className="text-zinc-300 text-base font-mono leading-[1.8] relative z-10">
                                                {t.quote}
                                            </p>
                                        </div>

                                        {/* Metric highlight */}
                                        <div className="mb-5 p-3 bg-orange-500/[0.06] rounded-lg flex items-center gap-3">
                                            <TrendingUp size={14} className="text-orange-500 flex-shrink-0" />
                                            <span className="font-heading font-bold text-base text-orange-400 uppercase tracking-wide">{t.metric}</span>
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
                    <div className="mt-10 md:mt-14 border border-white/[0.07] bg-white/[0.02] backdrop-blur-md rounded-xl overflow-hidden">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
                            {[
                                { value: '2,400+', label: 'Active Operators', animated: true },
                                { value: '4.9/5', label: 'Average Rating', animated: false },
                                { value: '98%', label: 'Retention Rate', animated: true },
                                { value: '<30s', label: 'Avg. Response', animated: true },
                            ].map((stat, i) => (
                                <div key={i} className="p-3 md:p-5 text-center group hover:bg-white/[0.02] transition-colors">
                                    <div className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight mb-1">
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
    );
};
