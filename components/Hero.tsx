import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './ui/Reveal';
import { DotMatrixLogo } from './DotMatrixLogo';
import { DynamicNoise } from './DynamicNoise';

interface HeroProps {
    onLoginClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {
    return (
        <section className="relative min-h-[100svh] flex flex-col bg-zinc-950 overflow-clip">

            {/* Background — noise + dual offset glows */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <DynamicNoise opacity={0.10} />

                {/* Left glow — under text column */}
                <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] md:w-[600px] md:h-[400px] bg-orange-500/[0.05] blur-[180px] rounded-full" />

                {/* Right glow — behind gear */}
                <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[300px] h-[250px] md:w-[500px] md:h-[350px] bg-orange-600/[0.03] blur-[150px] rounded-full" />
            </div>

            {/* Top-edge scan line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent z-30" />

            {/* Corner bracket accents (desktop) */}
            <div className="absolute inset-0 pointer-events-none hidden md:block z-10">
                <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-orange-500/30" />
                <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-orange-500/30" />
                <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-orange-500/30" />
                <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-orange-500/30" />
            </div>

            {/* Gear panel — right column, desktop only */}
            <div className="absolute inset-y-0 right-0 w-[45%] pointer-events-none hidden md:flex items-center justify-center z-[5]">
                {/* Vertical left-edge divider */}
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />

                {/* Inner corner accents */}
                <div className="absolute top-8 left-4 w-2.5 h-2.5 border-t border-l border-orange-500/20" />
                <div className="absolute bottom-8 left-4 w-2.5 h-2.5 border-b border-l border-orange-500/20" />
                <div className="absolute top-8 right-4 w-2.5 h-2.5 border-t border-r border-orange-500/20" />
                <div className="absolute bottom-8 right-4 w-2.5 h-2.5 border-b border-r border-orange-500/20" />

                {/* System Core label */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <span className="font-mono text-[9px] text-orange-500/40 uppercase tracking-[0.3em]">System Core</span>
                </div>

                {/* Gear logo */}
                <div className="mix-blend-screen opacity-90 scale-[1.05]">
                    <DotMatrixLogo />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-start pt-4 md:items-center relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">

                {/* Left content column */}
                <div className="w-full md:w-[52%] flex flex-col items-center md:items-start text-center md:text-left md:mt-10">

                    {/* Mobile gear — above text, in flow */}
                    <div className="md:hidden flex items-center justify-center mix-blend-screen opacity-80 scale-[0.7] -mb-14">
                        <DotMatrixLogo />
                    </div>

                    {/* Section badge */}
                    <Reveal delay={0.05}>
                        <div className="inline-flex items-center mb-4">
                            <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em]">AI Operations Platform</span>
                        </div>
                    </Reveal>

                    {/* Main Title */}
                    <Reveal delay={0.1}>
                        <h1 className="font-heading font-bold text-[1.75rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.0] text-zinc-100 tracking-wide flex flex-col items-center md:items-start relative z-10 w-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            <span>YOUR BUSINESS,</span>
                            <span className="text-zinc-300 relative">
                                NEVER OFFLINE
                            </span>
                        </h1>
                    </Reveal>

                    {/* Subtitle */}
                    <Reveal delay={0.2}>
                        <div className="max-w-[480px] mt-5 mb-6 md:mt-8 md:mb-8">
                            <p className="font-mono text-base text-zinc-400 leading-[1.6] tracking-wide">
                                AI agents that answer calls, respond to messages, book jobs, and manage your systems — 24/7, across every platform your business runs on.
                            </p>
                        </div>
                    </Reveal>

                    {/* CTA + Trust Signal */}
                    <Reveal delay={0.3}>
                        <div className="flex flex-col items-center md:items-start gap-4 w-full">

                            <Link
                                to="/get-started"
                                className="relative w-full sm:w-auto px-14 py-4 bg-[#FF6A15] hover:bg-[#ff853f] text-black font-mono font-bold text-sm uppercase tracking-widest transition-all group clip-path-slant shadow-[0_0_20px_rgba(255,106,21,0.25)] hover:shadow-[0_0_30px_rgba(255,106,21,0.4)] flex justify-center items-center gap-3 no-underline focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    GET STARTED
                                    <svg width="14" height="10" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 opacity-80 group-hover:opacity-100">
                                        <path d="M1 6H14M14 6L9 1M14 6L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                                    </svg>
                                </span>
                            </Link>

                            {/* Trust Signal — compact stat bar */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-4 opacity-80">
                                <div className="flex items-center gap-1.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6A15" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                    <span className="font-heading text-zinc-200 text-sm">4.9/5</span>
                                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">Rating</span>
                                </div>
                                <div className="w-px h-3 bg-zinc-800" />
                                <div className="flex items-center gap-1.5">
                                    <span className="font-heading text-zinc-200 text-sm">2,400+</span>
                                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">Active Operators</span>
                                </div>
                                <div className="w-px h-3 bg-zinc-800" />
                                <div className="flex items-center gap-1.5">
                                    <span className="font-heading text-zinc-200 text-sm">&lt;30s</span>
                                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wide">Avg Response</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Bottom connector dot */}
            <div className="relative z-10 flex flex-col items-center pb-4">
                <div className="relative w-px h-10 md:h-16 bg-gradient-to-b from-orange-500/30 via-orange-500/10 to-transparent overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-500/60 shadow-[0_0_12px_rgba(255,106,21,0.4)] animate-[connector-dot_2s_ease-in-out_infinite]" />
                </div>
            </div>
        </section>
    );
};
