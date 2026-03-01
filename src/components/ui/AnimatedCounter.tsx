import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const AnimatedCounter: React.FC<{ value: string; duration?: number }> = ({ value, duration = 2 }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const [display, setDisplay] = useState('0');

    // Parse numeric part and suffix (handles $, <, > prefixes and commas)
    const numMatch = value.match(/^([<>$]?)([\d,]+\.?\d*)(.*)/);
    const prefix = numMatch?.[1] || '';
    const target = numMatch ? parseFloat(numMatch[2].replace(/,/g, '')) : 0;
    const suffix = numMatch?.[3] || '';
    const isDecimal = value.includes('.');
    const hasComma = numMatch?.[2]?.includes(',') || false;

    useEffect(() => {
        if (!isInView) return;
        const start = performance.now();
        const step = (now: number) => {
            const elapsed = (now - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            const raw = isDecimal ? current.toFixed(1) : Math.round(current).toString();
            setDisplay(hasComma ? Number(raw).toLocaleString() : raw);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, target, duration, isDecimal]);

    return <span ref={ref}>{prefix}{display}{suffix}</span>;
};
