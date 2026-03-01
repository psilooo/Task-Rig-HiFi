import React from 'react';
import { Check } from 'lucide-react';
import { chipBaseClass, chipSelectedClass, chipUnselectedClass } from './styles';

export const ChipButton: React.FC<{
    selected: boolean;
    onClick: () => void;
    icon?: React.ElementType;
    label: string;
    desc?: string;
}> = ({ selected, onClick, icon: Icon, label, desc }) => (
    <button
        onClick={onClick}
        className={`group text-left flex items-center gap-2.5 w-full px-3.5 py-2.5 ${chipBaseClass} ${
            selected ? chipSelectedClass : chipUnselectedClass
        }`}
    >
        {Icon && <Icon size={14} className={selected ? 'text-orange-500' : 'text-zinc-600 group-hover:text-zinc-400'} />}
        <div className="flex-1 min-w-0">
            <span className={`font-mono text-xs ${selected ? 'text-orange-400' : 'text-zinc-400'}`}>
                {label}
            </span>
            {desc && <span className="font-mono text-[10px] text-zinc-600 ml-2 hidden sm:inline">{desc}</span>}
        </div>
        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
            selected ? 'border-orange-500 bg-orange-500/20' : 'border-zinc-700 bg-zinc-900'
        }`}>
            {selected && <Check size={10} className="text-orange-500" />}
        </div>
    </button>
);
