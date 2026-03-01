import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export const TypingBubble: React.FC<{ text: string; sender: string; delay: number; isInView: boolean }> = ({ text, sender, delay, isInView }) => {
    const [phase, setPhase] = useState<'hidden' | 'typing' | 'visible'>('hidden');
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        if (!isInView) return;
        const showTimer = setTimeout(() => setPhase('typing'), delay * 1000);
        return () => clearTimeout(showTimer);
    }, [isInView, delay]);

    useEffect(() => {
        if (phase !== 'typing') return;
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayText(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(interval);
                setPhase('visible');
            }
        }, 12);
        return () => clearInterval(interval);
    }, [phase, text]);

    if (phase === 'hidden') return null;

    const isAi = sender === 'ai';
    const isSystem = sender === 'system';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex ${isSystem ? 'justify-center' : isAi ? 'justify-start' : 'justify-end'}`}
        >
            {isSystem ? (
                <div className="w-full text-center py-2 px-3 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-400">
                    {phase === 'typing' ? displayText : text}
                    {phase === 'typing' && <span className="animate-pulse ml-0.5">|</span>}
                </div>
            ) : (
                <div className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm font-mono leading-relaxed ${isAi
                    ? 'bg-orange-500/10 border border-orange-500/20 text-zinc-300 rounded-bl-sm'
                    : 'bg-zinc-800 text-zinc-200 rounded-br-sm'
                    }`}>
                    {isAi && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Bot size={10} className="text-orange-500" />
                            <span className="text-[9px] text-orange-500 uppercase tracking-wider">Task Rig AI</span>
                        </div>
                    )}
                    {phase === 'typing' ? (
                        <>{displayText}<span className="animate-pulse ml-0.5 text-orange-500">|</span></>
                    ) : text}
                </div>
            )}
        </motion.div>
    );
};
