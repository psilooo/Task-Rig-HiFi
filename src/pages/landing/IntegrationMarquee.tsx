import React from 'react';
import { MARQUEE_INTEGRATIONS } from '../../constants/integrations';

export const IntegrationMarquee: React.FC = () => {
    return (
        <div className="relative z-10 bg-zinc-950 overflow-x-clip overflow-y-visible">
            {/* Top scan line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
            {/* Bottom scan line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.02] via-transparent to-orange-500/[0.02] pointer-events-none" />

            {/* Corner accents */}
            <div className="absolute top-2 left-3 md:left-6 w-2.5 h-2.5 border-t border-l border-orange-500/30" />
            <div className="absolute top-2 right-3 md:right-6 w-2.5 h-2.5 border-t border-r border-orange-500/30" />
            <div className="absolute bottom-2 left-3 md:left-6 w-2.5 h-2.5 border-b border-l border-orange-500/30" />
            <div className="absolute bottom-2 right-3 md:right-6 w-2.5 h-2.5 border-b border-r border-orange-500/30" />

            {/* Label */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-3 z-20">
                <span className="font-mono text-[9px] text-orange-500/60 uppercase tracking-[0.3em]">Integrations</span>
            </div>

            {(() => {
                const integrations = MARQUEE_INTEGRATIONS;
                return (
                    <div className="relative py-4 md:py-5">
                        {/* Left fade */}
                        <div className="absolute top-0 left-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10 pointer-events-none" />
                        {/* Right fade */}
                        <div className="absolute top-0 right-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent z-10 pointer-events-none" />

                        <div className="marquee-track">
                            <div className="marquee-content">
                                {[...integrations, ...integrations].map((name, i) => (
                                    <div key={i} className="flex items-center px-4 md:px-5 flex-shrink-0 group/item">
                                        <div className="flex items-center gap-2 px-2 py-1 rounded-sm border border-transparent hover:border-orange-500/20 hover:bg-orange-500/[0.04] transition-all">
                                            <div className="w-1 h-1 rounded-full bg-orange-500/50 group-hover/item:bg-orange-500 group-hover/item:shadow-[0_0_6px_rgba(249,115,22,0.6)] transition-all flex-shrink-0" />
                                            <span className="font-mono text-[10px] md:text-[11px] text-zinc-500 group-hover/item:text-zinc-300 uppercase tracking-[0.15em] whitespace-nowrap transition-colors">{name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};
