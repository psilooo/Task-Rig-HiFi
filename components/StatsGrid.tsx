import React from 'react';
import { STATS_DATA } from '../constants';
import { Reveal } from './ui/Reveal';
import { ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import { CyberCard } from './ui/CyberCard';

export const StatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
      {STATS_DATA.map((stat, index) => (
        <Reveal key={stat.label} delay={index * 0.1} className="h-full">
          <div className="group relative h-full min-h-[160px] bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 p-6 flex flex-col justify-between">
            
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-700 group-hover:border-orange-500/50 transition-colors"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-zinc-700 group-hover:border-orange-500/50 transition-colors"></div>

            <div className="relative z-10 flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                <h4 className="font-mono text-zinc-500 text-[10px] tracking-[0.2em] uppercase">
                  {stat.label}
                </h4>
              </div>
              <BarChart3 size={14} className="text-zinc-800 group-hover:text-zinc-600 transition-colors" />
            </div>
            
            <div className="relative z-10 mt-auto">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-bold text-5xl text-white tracking-tighter leading-none group-hover:text-orange-500 transition-colors duration-300">
                    {stat.value}
                </span>
                {stat.unit && <span className="text-xl font-heading text-zinc-600">{stat.unit}</span>}
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50">
                 <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">ID: 0{index + 1}</span>
                 {stat.trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-mono font-bold ${stat.trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(stat.trend)}%
                    </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};