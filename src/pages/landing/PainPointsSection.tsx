import React from 'react';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { SectionBadge } from '../../components/ui/SectionBadge';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { PAIN_POINT_STATS } from '../../constants/pricing';

export const PainPointsSection: React.FC = () => {
    return (
        <section className="py-10 md:py-14 px-4 md:px-6 relative z-10">
            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-orange-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Section header — left-aligned to match testimonials */}
                <div className="mb-6 md:mb-8">
                    <ScrollReveal>
                        <SectionBadge text="The Reality" />
                        <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-white uppercase tracking-tight leading-[0.95]">
                            What Happens While<br />
                            <span className="text-zinc-500">You're on a Job</span>
                        </h2>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                    {/* ── LEFT: Hero stat card ── */}
                    <ScrollReveal className="lg:col-span-5">
                        <div className="relative border border-white/[0.07] rounded-2xl bg-gradient-to-br from-white/[0.03] via-zinc-950/80 to-white/[0.02] backdrop-blur-sm overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.3)] h-full flex flex-col justify-between p-5 md:p-6 lg:p-8">
                            {/* Top glow line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

                            {/* Corner accents */}
                            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-orange-500/20" />
                            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-orange-500/20" />

                            <div>
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    <span className="font-mono text-[10px] text-orange-500 uppercase tracking-[0.2em]">Speed to Lead</span>
                                </div>
                                <div className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-orange-500 tracking-tight leading-none mb-3">
                                    <AnimatedCounter value="21x" duration={2.5} />
                                </div>
                                <p className="font-mono text-sm text-zinc-400 leading-[1.7] max-w-sm">
                                    Leads contacted within 5 minutes are <span className="text-white">21 times more likely</span> to convert into paying customers. The average small business takes over 24 hours to follow up.
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/[0.06]">
                                <p className="font-mono text-xs text-zinc-600 leading-relaxed">
                                    Source: Lead Response Management Study, InsideSales.com
                                </p>
                            </div>

                            {/* Bottom glow line */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                        </div>
                    </ScrollReveal>

                    {/* ── RIGHT: Three supporting stat cards ── */}
                    <div className="lg:col-span-7 flex flex-col gap-4 md:gap-5">
                        {PAIN_POINT_STATS.map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div className="relative border border-white/[0.07] rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-sm overflow-hidden group hover:border-white/[0.12] transition-all duration-500">
                                    {/* Top accent */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-orange-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="flex items-start gap-6 md:gap-8 p-5 md:p-7">
                                        {/* Stat — fixed width, centered */}
                                        <div className="flex-shrink-0 w-[5.5rem] md:w-[6.5rem] pt-1 text-center">
                                            <div className="font-heading font-bold text-2xl md:text-3xl text-orange-500 tracking-tight leading-none">
                                                <AnimatedCounter value={item.stat} duration={2} />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-heading font-bold text-sm text-white uppercase tracking-wide mb-2">
                                                {item.title}
                                            </div>
                                            <p className="font-mono text-[13px] text-zinc-500 leading-[1.7]">
                                                {item.desc}
                                            </p>
                                            <p className="font-mono text-[10px] text-zinc-700 mt-3">
                                                {item.source}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
