import React from 'react';
import { Tab } from '../types';
import clsx from 'clsx';
import { Power, Terminal } from 'lucide-react';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      {/* Angular Container */}
      <div className="pointer-events-auto bg-zinc-950/90 backdrop-blur-md border border-zinc-800 flex items-center shadow-xl shadow-black/50 clip-path-slant-bottom">
        
        {/* Decorative Left Edge */}
        <div className="px-3 border-r border-zinc-800 h-full flex items-center text-zinc-600">
           <Terminal size={14} />
        </div>

        <div className="flex p-1 gap-1">
          <button
            onClick={() => onTabChange(Tab.AGENT)}
            className={clsx(
              "px-6 py-1.5 font-mono text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 relative overflow-hidden group",
              activeTab === Tab.AGENT
                ? "text-black bg-orange-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
          >
             <span className="relative z-10">Ops_Center</span>
             {/* Selection Indicator */}
             {activeTab === Tab.AGENT && (
                <div className="absolute inset-0 border-2 border-white/20 z-20"></div>
             )}
          </button>

          <button
            onClick={() => onTabChange(Tab.ACCOUNT)}
            className={clsx(
              "px-6 py-1.5 font-mono text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 relative overflow-hidden",
              activeTab === Tab.ACCOUNT
                ? "text-black bg-orange-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <span className="relative z-10">Config</span>
            {activeTab === Tab.ACCOUNT && (
                <div className="absolute inset-0 border-2 border-white/20 z-20"></div>
             )}
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="absolute right-4 md:right-8 top-4 pointer-events-auto">
        <button
          onClick={onLogout}
          className="group flex items-center gap-2 px-4 py-2 bg-zinc-950/80 border border-zinc-800 hover:border-red-900/50 backdrop-blur-md transition-all duration-300 hover:bg-red-950/10"
        >
          <span className="hidden md:inline text-[10px] font-mono font-bold text-zinc-500 group-hover:text-red-500 uppercase tracking-widest transition-colors">
            Term_Session
          </span>
          <Power size={14} className="text-zinc-600 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </header>
  );
};