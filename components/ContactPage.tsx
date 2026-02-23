import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TaskRigLogo } from './ui/TaskRigLogo';

export const ContactPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-clip selection:bg-orange-500/30">
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <TaskRigLogo className="h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                        <div className="font-heading font-bold text-2xl tracking-tight text-white">TASK RIG</div>
                    </div>
                    <a href="/" className="group flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                        Back to Home
                    </a>
                </div>
            </nav>

            {/* Content */}
            <main className="relative z-10 pt-32 pb-24 px-6 flex flex-col justify-center min-h-[calc(100vh-160px)]">
                <div className="max-w-3xl mx-auto bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12 rounded-sm shadow-xl backdrop-blur-sm w-full">
                    <div className="mb-12 border-b border-zinc-800 pb-8">
                        <h1 className="font-heading font-bold text-4xl mb-2 text-white uppercase tracking-tight">Contact Us</h1>
                        <p className="text-zinc-500 font-mono text-sm">We're here to help.</p>
                    </div>

                    <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 font-mono text-sm leading-relaxed
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-headings:uppercase prose-headings:tracking-wide
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-orange-500
                prose-a:text-orange-500 prose-a:no-underline hover:prose-a:text-orange-400
                prose-ul:list-disc prose-ul:pl-6 prose-li:my-2 prose-li:text-zinc-400
                prose-strong:text-zinc-100">

                        <p>
                            Have questions about our AI orchestration platform or need help planning your deployment? Our team is ready to assist you.
                        </p>

                        <div className="bg-zinc-950 p-6 rounded-sm border border-zinc-800 mt-8 mb-8">
                            <p className="m-0 mb-1"><strong className="text-orange-500">TaskRig Support</strong></p>
                            <p className="m-0 mb-1">Email: <a href="mailto:info@taskrig.ca">info@taskrig.ca</a></p>
                            <p className="m-0 mb-1">Phone: <a href="tel:+18442222630">+1 844-222-2630</a></p>
                            <p className="m-0">Website: <a href="/">taskrig.ca</a></p>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-zinc-950 pt-10 pb-10 px-6 border-t border-zinc-800 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TaskRigLogo className="w-5 h-auto text-zinc-800" />
                        <span className="font-heading font-bold text-lg tracking-tight text-zinc-700">TASK RIG</span>
                    </div>
                    <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center flex-1">
                        © 2026 Task Rig Systems Inc. All Rights Reserved.
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-900"></div>
                        <span className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">Systems Normal</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
