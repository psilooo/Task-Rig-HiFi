import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from './ui/Reveal';
import { DotMatrixLogo } from './DotMatrixLogo';
import { MeshGradient } from '@mesh-gradient/react';

interface HeroProps {
    onLoginClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {
    return (
        <section className="relative min-h-[100svh] flex flex-col bg-zinc-950 overflow-clip">

            {/* Background — WebGL mesh gradient */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <MeshGradient
                    className="w-full h-full opacity-[0.14]"
                    options={{
                        colors: ['#09090b', '#f97316', '#ea580c', '#09090b'],
                        animationSpeed: 0.3,
                        seed: 3,
                    }}
                />
            </div>

            {/* Top-edge scan line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent z-30" />

            {/* Corner bracket accents (desktop) */}
            <div className="absolute inset-0 pointer-events-none hidden md:block z-10">
                <div className="absolute top-24 left-6 w-3 h-3 border-t border-l border-orange-500/30" />
                <div className="absolute top-24 right-6 w-3 h-3 border-t border-r border-orange-500/30" />
                <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-orange-500/30" />
                <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-orange-500/30" />
            </div>

            {/* Gear panel — right column, desktop only */}
            <div className="absolute inset-y-0 right-0 w-[33%] pointer-events-none hidden md:flex items-center justify-center z-[5]">
                {/* System Core label */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2">
                    <span className="font-mono text-[9px] text-orange-500/40 uppercase tracking-[0.3em]">System Core</span>
                </div>

                {/* Gear logo */}
                <div className="mix-blend-screen opacity-90 scale-[2.0] -translate-x-[25%]">
                    <DotMatrixLogo />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-start pt-4 md:items-center relative z-20 w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-8">

                {/* Left content column */}
                <div className="w-full md:w-[63%] flex flex-col items-center md:items-start text-center md:text-left md:mt-10">

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
                        <h1 className="font-heading font-bold text-[1.75rem] sm:text-[2.25rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.0] text-zinc-100 tracking-wide flex flex-col items-center md:items-start relative z-10 w-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            <span>YOUR BUSINESS,</span>
                            <span className="text-zinc-300 relative">
                                NEVER OFFLINE
                            </span>
                        </h1>
                    </Reveal>

                    {/* Subtitle */}
                    <Reveal delay={0.2}>
                        <div className="max-w-[460px] mt-5 mb-6 md:mt-6 md:mb-7">
                            <p className="font-mono text-sm md:text-base text-zinc-400 leading-[1.6] tracking-wide">
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

                        </div>
                    </Reveal>
                </div>
            </div>

        </section>
    );
};
