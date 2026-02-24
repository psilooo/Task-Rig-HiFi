import React from 'react';
import { TaskRigLogo } from './ui/TaskRigLogo';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-zinc-950 pt-16 pb-10 px-6 border-t border-zinc-800 relative z-10 transition-colors">
            <div className="max-w-7xl mx-auto flex flex-col items-center mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <TaskRigLogo className="h-6 w-auto text-zinc-700" />
                    <div className="font-heading font-bold text-2xl tracking-tight text-zinc-600">TASK RIG</div>
                </div>
                <p className="text-zinc-500 font-mono text-sm max-w-sm text-center leading-relaxed mb-8">
                    Advanced AI orchestration for the modern service economy. Built for speed, security, and scale.
                </p>
                <div className="flex gap-6">
                    <a href="/privacy" className="text-zinc-500 hover:text-orange-500 font-mono text-xs uppercase tracking-wider transition-colors border-b border-transparent hover:border-orange-500/30 pb-1">Privacy Policy</a>
                    <a href="/terms" className="text-zinc-500 hover:text-orange-500 font-mono text-xs uppercase tracking-wider transition-colors border-b border-transparent hover:border-orange-500/30 pb-1">Terms & Conditions</a>
                    <a href="/contact" className="text-zinc-500 hover:text-orange-500 font-mono text-xs uppercase tracking-wider transition-colors border-b border-transparent hover:border-orange-500/30 pb-1">Contact Us</a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center flex-1 md:text-left md:flex-none">
                    © 2026 Task Rig Systems Inc. All Rights Reserved.
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-900"></div>
                    <span className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">Systems Normal</span>
                </div>
            </div>
        </footer>
    );
};
