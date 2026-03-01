import React from 'react';
import { ChevronRight } from 'lucide-react';

export const ContinueButton: React.FC<{ enabled: boolean; onClick: () => void; label: string }> = ({ enabled, onClick, label }) => (
    <button
        onClick={onClick}
        disabled={!enabled}
        className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all rounded-sm ${
            enabled
                ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
    >
        {label}
        <ChevronRight size={14} />
    </button>
);
