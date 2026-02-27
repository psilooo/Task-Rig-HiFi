import React from 'react';
import { TaskRigLogo } from './ui/TaskRigLogo';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-zinc-950 pt-10 pb-8 px-6 border-t border-zinc-800 relative z-10 transition-colors">
            <div className="max-w-7xl mx-auto flex items-center gap-2 mb-6">
                <TaskRigLogo className="h-4 w-auto text-zinc-700 shrink-0" />
                <div className="font-heading font-bold text-sm tracking-tight text-zinc-600 leading-none">TASK RIG</div>
                <span className="text-zinc-600 font-mono text-[10px]">—</span>
                <p className="text-zinc-600 font-mono text-[10px] leading-none">
                    Advanced AI orchestration for the modern service economy.
                </p>
            </div>

            <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center md:text-left">
                    © 2026 Task Rig Systems Inc. All Rights Reserved.
                </div>
                <div className="flex items-center gap-5">
                    <a href="/privacy" className="text-zinc-500 hover:text-orange-500 font-mono text-[10px] uppercase tracking-wider transition-colors py-2 px-1 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950">Privacy Policy</a>
                    <a href="/terms" className="text-zinc-500 hover:text-orange-500 font-mono text-[10px] uppercase tracking-wider transition-colors py-2 px-1 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950">Terms & Conditions</a>
                    <a href="/contact" className="text-zinc-500 hover:text-orange-500 font-mono text-[10px] uppercase tracking-wider transition-colors py-2 px-1 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};
