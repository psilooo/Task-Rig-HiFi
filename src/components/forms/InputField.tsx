import React from 'react';
import { labelClass, inputClass } from './styles';

export const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    error?: string;
}> = ({ label, value, onChange, placeholder, type = 'text', required, error }) => (
    <div>
        <label className={labelClass}>
            {label} {required && <span className="text-orange-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
        />
        {error && <p className="text-red-400 font-mono text-xs mt-1.5">{error}</p>}
    </div>
);
