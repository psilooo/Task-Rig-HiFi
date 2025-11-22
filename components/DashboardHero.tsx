import React from 'react';
import { Reveal } from './ui/Reveal';
import { TimeRange } from '../types';
import clsx from 'clsx';
import { Activity, Radio } from 'lucide-react';

interface DashboardHeroProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({ timeRange, setTimeRange }) => {
  const ranges: TimeRange[] = ['1d', '1w', '1m', '1y'];

  return (
    <div className="relative pt-28 pb-8">
      {/* Top Technical Line */}
      <div className="absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between w-full gap-6">
          
          {/* Left: Mission Title */}
          <Reveal className="w-full lg:w-auto">
            <div className="flex items-center gap-3 mb-2">
                 <div className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-mono font-bold uppercase tracking-widest">
                    Live Feed
                 </div>
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Grid Sector 4</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white tracking-tight uppercase leading-none">
              Command <span className="text-zinc-500">Deck</span>
            </h1>
          </Reveal>
          
          {/* Right: Controls & Status */}
          <Reveal delay={0.1} className="w-full lg:w-auto flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 border-t lg:border-t-0 border-zinc-800 pt-6 lg:pt-0">
             
             {/* Range Selector - Technical Switch Look */}
             <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1 rounded-sm">
                <span className="px-3 text-[10px] font-mono text-zinc-600 uppercase tracking-wider border-r border-zinc-800 mr-1">Range</span>
                {ranges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={clsx(
                      "px-3 py-1 font-mono text-[10px] font-bold uppercase transition-all duration-200 min-w-[40px]",
                      timeRange === range 
                        ? "bg-zinc-800 text-white shadow-inner" 
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                    )}
                  >
                    {range}
                  </button>
                ))}
             </div>

             {/* Live Status */}
             <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Uptime</div>
                    <div className="text-lg font-heading font-bold text-white leading-none">99.9%</div>
                </div>
                <div className="w-px h-8 bg-zinc-800 hidden md:block"></div>
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                         <Activity size={18} />
                         {/* Corner Ticks */}
                         <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-emerald-500/50"></div>
                         <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-emerald-500/50"></div>
                    </div>
                    <div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">Signal</div>
                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Strong
                        </div>
                    </div>
                </div>
             </div>

          </Reveal>
          
        </div>
      </div>
    </div>
  );
};