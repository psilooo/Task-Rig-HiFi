import React from 'react';
import clsx from 'clsx';

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  decoration?: boolean;
}

export const CyberCard: React.FC<CyberCardProps> = ({ children, className, title, decoration = true }) => {
  return (
    <div className={clsx("relative bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-md flex flex-col", className)}>
      {/* Technical Corners (L-Brackets) */}
      {decoration && (
        <>
          <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-orange-500/60 z-10"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-orange-500/60 z-10"></div>
          
          {/* Subtle Crosshairs */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700/50"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700/50"></div>
        </>
      )}
      
      {title && (
        <div className="mb-4 flex items-center justify-between border-b border-zinc-800/50 pb-3 px-6 pt-6 shrink-0">
          <h3 className="font-heading font-bold text-lg md:text-xl tracking-wide text-zinc-100 uppercase flex items-center gap-2">
            <span className="w-1 h-4 bg-orange-500/80 rounded-sm"></span>
            {title}
          </h3>
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
          </div>
        </div>
      )}
      
      <div className={clsx("relative z-0 flex-1 min-h-0 flex flex-col", title ? "px-6 pb-6" : "p-6")}>
        {children}
      </div>
    </div>
  );
};