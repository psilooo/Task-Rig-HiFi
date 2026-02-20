import React, { useEffect, useState } from 'react';
import { TaskRigLogo } from './ui/TaskRigLogo';

interface LoadingScreenProps {
    onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState('INITIALIZING SECURE LINK...');
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const duration = 1800; // Total simulated loading time
        const startTime = Date.now();
        let animationFrameId: number;

        const updateLoading = () => {
            const elapsed = Date.now() - startTime;
            const p = Math.min(1, elapsed / duration);

            // Apply easeOutQuart curve to make it start fast and slow down at the end like a real loader
            const easeP = 1 - Math.pow(1 - p, 4);
            const currentProgress = Math.floor(easeP * 100);

            setProgress(currentProgress);

            if (currentProgress < 30) setText('INITIALIZING SECURE LINK...');
            else if (currentProgress < 60) setText('ESTABLISHING MAINFRAME CONNECTION...');
            else if (currentProgress < 90) setText('DECRYPTING PROTOCOLS...');
            else if (currentProgress < 100) setText('MOUNTING INTERFACE...');
            else setText('SYSTEM READY');

            if (p < 1) {
                animationFrameId = requestAnimationFrame(updateLoading);
            }
        };

        animationFrameId = requestAnimationFrame(updateLoading);

        // Trigger fade out
        const tFade = setTimeout(() => { setIsExiting(true); }, 2000); // 2000ms ensures it sits at 100% briefly before fading
        // Unmount completely
        const tUnmount = setTimeout(() => { onComplete(); }, 2500); // 500ms for css fade transition

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(tFade);
            clearTimeout(tUnmount);
        };
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-500 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] animate-noise opacity-10 mix-blend-overlay"></div>
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-orange-600/5 blur-[80px] rounded-full pointer-events-none"></div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-10 max-w-sm w-full px-6">

                {/* Pulsing Logo */}
                <div className="relative flex justify-center items-center w-24 h-24">
                    <div className="absolute inset-0 border border-orange-500/20 rounded-full animate-ping opacity-20"></div>
                    <TaskRigLogo className="w-16 h-16 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                </div>

                {/* Loader Bar */}
                <div className="w-full space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest leading-none">{text}</span>
                        <span className="font-mono text-[10px] text-orange-500 font-bold leading-none">{progress}%</span>
                    </div>

                    <div className="h-[2px] w-full bg-zinc-900 border-x border-zinc-800 relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-[#FF6A15] shadow-[0_0_10px_rgba(255,106,21,0.8)] transition-none"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                </div>
            </div>
        </div>
    );
};
