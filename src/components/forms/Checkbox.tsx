import React from 'react';
import { Check } from 'lucide-react';

export const Checkbox: React.FC<{
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}> = ({ checked, onChange, label }) => (
    <label className="flex items-start gap-3 cursor-pointer group">
        <div className={`mt-0.5 relative flex items-center justify-center w-4 h-4 rounded border transition-colors ${
            checked ? 'border-orange-500 bg-orange-500/20' : 'border-zinc-700 bg-zinc-900 group-hover:border-orange-500/50'
        }`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(!checked)}
                className="absolute opacity-0 w-full h-full cursor-pointer"
            />
            {checked && <Check size={12} className="text-orange-500" />}
        </div>
        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed flex-1">
            {label}
        </span>
    </label>
);
