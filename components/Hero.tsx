import React from 'react';
import { Reveal } from './ui/Reveal';
import { DotMatrixLogo } from './DotMatrixLogo';

interface HeroProps {
    onLoginClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {
    return (
        <section className="relative min-h-[85vh] flex flex-col bg-zinc-950 overflow-hidden">

            {/* Background Grid & Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Main Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] opacity-20"></div>

                {/* Subtle Central Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-600/5 blur-[100px] rounded-full"></div>
            </div>

            {/* Telemetry Bar - Positioned to sit flush under the 80px (h-20) Nav */}
            <div className="mt-20 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-sm flex justify-between items-center px-6 md:px-12 py-2.5 z-30 text-[10px] font-mono text-zinc-500 uppercase tracking-widest shadow-lg shadow-black/50">
                <div className="flex items-center gap-8">
                    <span className="text-orange-500 flex items-center gap-2 font-bold">
                        {/* Custom waveform icon replacing lucide Activity for a more 'raw' look closer to Figma */}
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6L3 6L5 2L8 10L11 6L15 6" stroke="#f97316" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                        </svg>
                        SYS.ONLINE
                    </span>
                    <span className="hidden md:inline w-px h-3 bg-zinc-800"></span>
                    <span className="hidden md:inline text-zinc-400">GRID: ALPHA-7</span>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span>
                        <span className="text-zinc-400">LINK STABLE</span>
                    </div>
                    <span className="text-zinc-600">V.2.4.1</span>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 flex items-center justify-center relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 py-12">

                {/* Absolute HUD Accents - mimicking the fine lines and crosshairs in Figma */}
                <div className="absolute inset-0 pointer-events-none hidden md:block">
                    {/* Center Vertical/Horizontal grid frame context */}
                    <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-zinc-800/30"></div>
                    <div className="absolute top-0 bottom-0 right-[20%] w-[1px] bg-zinc-800/30"></div>

                    {/* Crosshairs near center block */}
                    <div className="absolute top-[38%] left-[20%] -translate-x-1/2 -translate-y-1/2 text-zinc-600 font-mono text-xs">+</div>
                    <div className="absolute bottom-[28%] left-[20%] -translate-x-1/2 translate-y-1/2 text-zinc-600 font-mono text-xs">+</div>

                    <div className="absolute top-[38%] right-[20%] translate-x-1/2 -translate-y-1/2 text-zinc-600 font-mono text-xs">+</div>
                    <div className="absolute bottom-[28%] right-[20%] translate-x-1/2 translate-y-1/2 text-zinc-600 font-mono text-xs">+</div>

                    {/* Orange tracking lines on edges of center block */}
                    <div className="absolute top-[38%] left-[27%] w-[2px] h-16 bg-orange-600/50 shadow-[0_0_10px_rgba(234,88,12,0.3)]"></div>
                    <div className="absolute bottom-[20%] left-[27%] w-[2px] h-16 bg-orange-600/50 shadow-[0_0_10px_rgba(234,88,12,0.3)]"></div>
                    <div className="absolute top-[38%] right-[27%] w-[2px] h-16 bg-orange-600/50 shadow-[0_0_10px_rgba(234,88,12,0.3)]"></div>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 items-center">

                    {/* LEFT COLUMN: Telemetry (Hidden on Mobile) */}
                    <div className="hidden lg:flex flex-col gap-12 items-end text-right z-10 w-full pr-8">
                        <div className="space-y-1">
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Nodes</div>
                            <div className="text-3xl font-heading text-zinc-300">8,492</div>
                        </div>
                        {/* Decorative Divider removed as per Figma design which has clean space */}
                        <div className="space-y-1">
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Protocol</div>
                            <div className="text-xl font-mono text-orange-600 tracking-wider">INIT_SEQ_09</div>
                        </div>
                    </div>

                    {/* CENTER COLUMN: Main Action Area */}
                    <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto z-20 w-[600px] shrink-0">

                        {/* Badge Context */}
                        <Reveal>
                            <div className="inline-flex items-center gap-3 mb-4 px-3 py-1 border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full shadow-[0_0_5px_rgba(234,88,12,1)]"></span>
                                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">System Ready</span>
                            </div>
                        </Reveal>

                        {/* Central Canvas Logo */}
                        <div className="relative mb-6 -mt-12 scale-[1.1] origin-bottom mix-blend-screen overflow-visible">
                            <DotMatrixLogo />
                        </div>

                        {/* Main Title - Adjusted Spacing and Typography to match Figma */}
                        <Reveal delay={0.1}>
                            <h1 className="font-heading font-bold text-[5rem] md:text-[5.5rem] lg:text-[6rem] leading-[0.85] uppercase text-zinc-100 tracking-tight flex flex-col items-center relative z-10 w-full">
                                <span className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Deploy</span>
                                <span className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Intelligent</span>
                                <span className="text-orange-500 mt-1 relative mix-blend-screen"
                                    style={{ textShadow: '0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(249, 115, 22, 0.2)' }}>
                                    Workforce
                                </span>
                            </h1>
                        </Reveal>

                        {/* Subtitle */}
                        <Reveal delay={0.2}>
                            <div className="max-w-[480px] mx-auto mt-10 mb-12">
                                <p className="font-mono text-[13px] text-zinc-400 leading-[1.8] tracking-widest">
                                    Eliminate inefficiencies. Deploy autonomous agents to handle dispatch, logistics, and client negotiations.
                                </p>
                            </div>
                        </Reveal>

                        {/* Actions - Reordered and restyled */}
                        <Reveal delay={0.3}>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">

                                <button className="relative w-full sm:w-auto px-10 py-4 border border-zinc-700 bg-transparent text-zinc-300 hover:text-white hover:border-zinc-500 font-mono text-xs font-bold uppercase tracking-widest transition-all clip-path-slant flex justify-center items-center gap-3 group">
                                    {/* Inner glow effect on border */}
                                    <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors pointer-events-none block"></div>
                                    <span className="w-1.5 h-1.5 bg-zinc-600 group-hover:bg-zinc-400 transition-colors block"></span>
                                    View Manifest
                                </button>

                                <button
                                    onClick={onLoginClick}
                                    className="relative w-full sm:w-auto px-10 py-4 bg-orange-600 hover:bg-orange-500 text-black font-heading font-bold text-lg uppercase tracking-widest transition-all group clip-path-slant shadow-[0_0_30px_rgba(234,88,12,0.25)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] flex justify-center items-center gap-3"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                                    <span className="relative z-10 flex items-center gap-2">
                                        Initialize
                                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
                                            <path d="M1 6H14M14 6L9 1M14 6L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                                        </svg>
                                    </span>
                                </button>

                            </div>
                        </Reveal>
                    </div>

                    {/* RIGHT COLUMN: Telemetry (Hidden on Mobile) */}
                    <div className="hidden lg:flex flex-col gap-12 items-start text-left z-10 w-full pl-8">
                        <div className="space-y-1">
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Network Load</div>
                            <div className="text-3xl font-heading text-zinc-400">12%</div>
                        </div>
                        {/* Decorative Divider removed */}
                        <div className="space-y-1">
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Latency</div>
                            <div className="text-xl font-mono text-emerald-500">14ms</div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};