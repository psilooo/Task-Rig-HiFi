import React from 'react';
import { TaskRigLogo } from './ui/TaskRigLogo';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-zinc-950 pt-10 pb-8 px-6 border-t border-zinc-800 relative z-10 transition-colors">
            <div className="max-w-7xl mx-auto flex items-start gap-3 mb-8">
                <TaskRigLogo className="h-6 w-auto text-zinc-700 shrink-0 mt-0.5" />
                <div>
                    <div className="font-heading font-bold text-2xl tracking-tight text-zinc-600 leading-none mb-2">TASK RIG</div>
                    <p className="text-zinc-500 font-mono text-sm max-w-sm leading-relaxed">
                        Advanced AI orchestration for the modern service economy. Built for speed, security, and scale.
                    </p>
                </div>
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
