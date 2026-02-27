import React from 'react';
import { TaskRigLogo } from './ui/TaskRigLogo';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-zinc-950 relative z-10 border-t border-white/5 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-orange-500/[0.03] blur-[80px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 relative">
                {/* Top row: branding + nav links */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    {/* Logo + tagline */}
                    <div className="flex items-center gap-2.5">
                        <TaskRigLogo className="h-5 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.4)] shrink-0" />
                        <div className="font-heading font-bold text-base tracking-tight text-white leading-none">TASK RIG</div>
                        <div className="hidden sm:block w-px h-3.5 bg-zinc-700 mx-1" />
                        <p className="hidden sm:block text-zinc-500 font-mono text-[10px] tracking-[0.06em] leading-none">
                            AI-powered operations for service businesses
                        </p>
                    </div>

                    {/* Nav links */}
                    <div className="flex items-center gap-1">
                        {[
                            { label: 'Privacy', href: '/privacy' },
                            { label: 'Terms', href: '/terms' },
                            { label: 'Contact', href: '/contact' },
                        ].map((link, i) => (
                            <a
                                key={i}
                                href={link.href}
                                className="text-zinc-500 hover:text-orange-400 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors px-3 py-2 rounded-md hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-5" />

                {/* Bottom row: copyright + status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-zinc-600 font-mono text-[10px] tracking-[0.08em]">
                        © 2026 Task Rig Systems Inc.
                    </span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-orange-500/50" />
                        <span className="text-zinc-600 font-mono text-[9px] tracking-[0.1em] uppercase">
                            Canadian-built & managed
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
