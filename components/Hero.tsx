import React from 'react';
import { Reveal } from './ui/Reveal';
import { DotMatrixLogo } from './DotMatrixLogo';

interface HeroProps {
    onLoginClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {
    return (
        <section className="relative min-h-[85vh] flex flex-col bg-zinc-950 overflow-hidden">

            {/* Background Image & Ambience */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                {/* Noise Background */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay"></div>

                {/* Central Canvas Logo */}
                <div className="absolute inset-0 flex items-center justify-center scale-[1.2] origin-center mix-blend-screen opacity-80 mt-10">
                    <DotMatrixLogo />
                </div>

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
                    {/* Top Left Crosshair */}
                    <div className="absolute top-[28%] left-[16%] flex items-center justify-center">
                        <div className="absolute w-[17px] h-[1px] bg-zinc-600/60"></div>
                        <div className="absolute w-[1px] h-[17px] bg-zinc-600/60"></div>
                    </div>
                    {/* Orange Vertical Line - Top Left */}
                    <div className="absolute top-0 left-[16%] w-[1px] h-[26%] bg-[#FF6A15] shadow-[0_0_8px_rgba(255,106,21,0.8)]"></div>

                    {/* Bottom Left Crosshair */}
                    <div className="absolute bottom-[28%] left-[16%] flex items-center justify-center">
                        <div className="absolute w-[17px] h-[1px] bg-zinc-600/60"></div>
                        <div className="absolute w-[1px] h-[17px] bg-zinc-600/60"></div>
                    </div>
                    {/* Orange Horizontal Line - Bottom Left */}
                    <div className="absolute bottom-[28%] left-0 w-[14%] h-[1px] bg-[#FF6A15] shadow-[0_0_8px_rgba(255,106,21,0.8)]"></div>

                    {/* Top Right Crosshair */}
                    <div className="absolute top-[28%] right-[16%] flex items-center justify-center">
                        <div className="absolute w-[17px] h-[1px] bg-zinc-600/60"></div>
                        <div className="absolute w-[1px] h-[17px] bg-zinc-600/60"></div>
                    </div>
                    {/* Orange Horizontal Line - Top Right */}
                    <div className="absolute top-[28%] right-0 w-[14%] h-[1px] bg-[#FF6A15] shadow-[0_0_8px_rgba(255,106,21,0.8)]"></div>

                    {/* Bottom Right Crosshair */}
                    <div className="absolute bottom-[28%] right-[16%] flex items-center justify-center">
                        <div className="absolute w-[17px] h-[1px] bg-zinc-600/60"></div>
                        <div className="absolute w-[1px] h-[17px] bg-zinc-600/60"></div>
                    </div>
                    {/* Orange Vertical Line - Bottom Right */}
                    <div className="absolute bottom-0 right-[16%] w-[1px] h-[26%] bg-[#FF6A15]"></div>
                </div>


                <div className="w-full relative z-20 flex justify-center">

                    {/* CENTER COLUMN: Main Action Area */}
                    <div className="relative flex flex-col items-center text-center max-w-2xl w-[600px] shrink-0 mt-8">

                        {/* Badge Context */}
                        <Reveal>
                            <div className="inline-flex items-center gap-3 mb-4 px-3 py-1 border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full shadow-[0_0_5px_rgba(234,88,12,1)]"></span>
                                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">System Ready</span>
                            </div>
                        </Reveal>

                        {/* Main Title - Adjusted Spacing and Typography to match Figma */}
                        <Reveal delay={0.1}>
                            <h1 className="font-heading font-bold text-[4.5rem] md:text-[5rem] lg:text-[5.5rem] leading-[1.0] text-zinc-100 tracking-wide flex flex-col items-center relative z-10 w-full">
                                <span className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">DEPLOY INTELLIGENT</span>
                                <span className="text-zinc-300 relative"
                                    style={{ textShadow: '0 0 25px rgba(255, 255, 255, 0.5), 0 0 50px rgba(255, 255, 255, 0.3)' }}>
                                    WORKFORCE
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
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">

                                <button className="relative w-full sm:w-auto px-8 py-3 bg-zinc-950/40 border border-zinc-700 hover:border-zinc-400 text-zinc-300 hover:text-white font-mono text-[11px] font-bold uppercase tracking-widest transition-all clip-path-slant flex justify-center items-center gap-3 group backdrop-blur-md">
                                    <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors pointer-events-none block"></div>
                                    VIEW MANIFEST
                                    <svg width="14" height="10" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 opacity-60 group-hover:opacity-100">
                                        <path d="M1 6H14M14 6L9 1M14 6L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                                    </svg>
                                </button>

                                <button
                                    onClick={onLoginClick}
                                    className="relative w-full sm:w-auto px-12 py-3 bg-[#FF6A15] hover:bg-[#ff853f] text-black font-mono font-bold text-[11px] uppercase tracking-widest transition-all group clip-path-slant shadow-[0_0_20px_rgba(255,106,21,0.25)] hover:shadow-[0_0_30px_rgba(255,106,21,0.4)] flex justify-center items-center gap-3"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                                    <span className="relative z-10 flex items-center gap-2">
                                        INITIALIZE
                                        <svg width="14" height="10" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 opacity-80 group-hover:opacity-100">
                                            <path d="M1 6H14M14 6L9 1M14 6L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                                        </svg>
                                    </span>
                                </button>

                            </div>
                        </Reveal>
                    </div>



                </div>
            </div>
        </section>
    );
};