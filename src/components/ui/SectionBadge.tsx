import React from 'react';

export const SectionBadge: React.FC<{ text: string }> = ({ text }) => (
    <div className="inline-flex items-center mb-4">
        <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em]">{text}</span>
    </div>
);
