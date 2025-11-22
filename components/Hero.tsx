import React from 'react';
import { Reveal } from './ui/Reveal';
import { ArrowRight, Activity } from 'lucide-react';

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
                <Activity size={12} />
                SYS.ONLINE
             </span>
             <span className="hidden md:inline w-px h-3 bg-zinc-800"></span>
             <span className="hidden md:inline text-zinc-400">GRID: ALPHA-7</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>Link Stable</span>
            </div>
            <span className="text-zinc-600">V.2.4.1</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-24 items-center">

            {/* LEFT COLUMN: Telemetry (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-col gap-12 items-end text-right opacity-60">
                <div className="space-y-1">
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Active Nodes</div>
                    <div className="text-3xl font-heading text-zinc-400">8,492</div>
                </div>
                {/* Decorative Divider */}
                <div className="w-24 h-[1px] bg-gradient-to-l from-zinc-700 to-transparent"></div>
                <div className="space-y-1">
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Protocol</div>
                    <div className="text-xl font-mono text-orange-500">INIT_SEQ_09</div>
                </div>
            </div>

            {/* CENTER COLUMN: Main Action Area */}
            <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto">
                
                {/* ANIMATED BRACKETS - Replacing broken radar */}
                
                {/* Left Bracket */}
                <div className="absolute -left-8 md:-left-12 top-0 bottom-0 w-8 hidden md:block pointer-events-none">
                    {/* Vertical Line */}
                    <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
                    {/* Horizontal Ticks */}
                    <div className="absolute top-[15%] right-0 w-3 h-[1px] bg-zinc-700"></div>
                    <div className="absolute bottom-[15%] right-0 w-3 h-[1px] bg-zinc-700"></div>
                    {/* Scanning Laser */}
                    <div className="absolute top-0 right-[-1px] w-[2px] h-16 bg-orange-500/80 blur-[1px] animate-scan-vertical shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                </div>

                {/* Right Bracket */}
                <div className="absolute -right-8 md:-right-12 top-0 bottom-0 w-8 hidden md:block pointer-events-none">
                     {/* Vertical Line */}
                     <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
                     {/* Horizontal Ticks */}
                     <div className="absolute top-[15%] left-0 w-3 h-[1px] bg-zinc-700"></div>
                     <div className="absolute bottom-[15%] left-0 w-3 h-[1px] bg-zinc-700"></div>
                     {/* Scanning Laser Reverse */}
                     <div className="absolute bottom-0 left-[-1px] w-[2px] h-16 bg-orange-500/80 blur-[1px] animate-scan-vertical-reverse shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                </div>

                {/* Badge */}
                <Reveal>
                    <div className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 border border-zinc-800/60 rounded-sm bg-zinc-900/30 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">System Ready</span>
                    </div>
                </Reveal>

                {/* Main Title */}
                <Reveal delay={0.1}>
                    <h1 className="font-heading font-bold text-6xl md:text-7xl lg:text-8xl leading-[0.9] uppercase text-white mb-8 tracking-tighter relative z-10">
                        Deploy <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600">Intelligent</span> <br/>
                        <span className="text-orange-600 relative inline-block">
                            Workforce
                            {/* Glitch/Glow overlay */}
                            <span className="absolute inset-0 text-orange-600 opacity-20 blur-md animate-pulse">Workforce</span>
                        </span>
                    </h1>
                </Reveal>

                {/* Subtitle */}
                <Reveal delay={0.2}>
                    <div className="max-w-[420px] mx-auto mb-10">
                         <p className="font-mono text-xs md:text-sm text-zinc-500 leading-relaxed">
                            Eliminate inefficiencies. Deploy autonomous agents to handle dispatch, logistics, and client negotiations.
                         </p>
                    </div>
                </Reveal>

                {/* Actions */}
                <Reveal delay={0.3}>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <button 
                            onClick={onLoginClick}
                            className="relative px-8 py-4 bg-orange-600 hover:bg-orange-500 text-black font-heading font-bold text-lg uppercase tracking-widest transition-all group clip-path-slant shadow-[0_0_30px_rgba(234,88,12,0.25)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)]"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative flex items-center gap-3">
                                Initialize <ArrowRight size={18} />
                            </span>
                        </button>
                        
                        <button className="group px-8 py-4 border border-zinc-800 hover:border-zinc-600 bg-zinc-950/50 text-zinc-500 hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                            <span className="w-1 h-1 bg-zinc-600 group-hover:bg-orange-500 transition-colors"></span>
                            View Manifest
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* RIGHT COLUMN: Telemetry (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-col gap-12 items-start text-left opacity-60">
                <div className="space-y-1">
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Network Load</div>
                    <div className="text-3xl font-heading text-zinc-400">12%</div>
                </div>
                {/* Decorative Divider */}
                <div className="w-24 h-[1px] bg-gradient-to-r from-zinc-700 to-transparent"></div>
                 <div className="space-y-1">
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Latency</div>
                    <div className="text-xl font-mono text-emerald-500">14ms</div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};