import React from 'react';
import { labelClass, chipBaseClass, chipSelectedClass, chipUnselectedClass } from './styles';

export const SelectChips: React.FC<{
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
    required?: boolean;
}> = ({ label, value, options, onChange, required }) => (
    <div>
        <label className={labelClass}>
            {label} {required && <span className="text-orange-500">*</span>}
        </label>
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`px-3 py-1.5 font-mono text-xs ${chipBaseClass} ${
                        value === opt ? chipSelectedClass : chipUnselectedClass
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);
