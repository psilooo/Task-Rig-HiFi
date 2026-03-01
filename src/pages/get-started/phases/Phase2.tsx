import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputField } from '../../../components/forms/InputField';
import { INDUSTRIES, INDUSTRY_SERVICES } from '../../../constants/industries';
import { chipBaseClass, chipSelectedClass, chipUnselectedClass, labelClass } from '../../../components/forms/styles';
import { staggerItem } from '../animations';
import type { LeadData } from '../../../types';

export const Phase2Content: React.FC<{
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
    toggleArrayItem: (field: keyof LeadData, value: string) => void;
}> = ({ data, update, toggleArrayItem }) => {
    const nonOtherIndustries = data.industries.filter(id => id !== 'other');
    const allServices = [...new Set(nonOtherIndustries.flatMap(id => INDUSTRY_SERVICES[id] || []))];

    return (
        <div className="space-y-5">
            {/* Industry grid */}
            <motion.div variants={staggerItem}>
                <label className={labelClass}>
                    Select industry <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {INDUSTRIES.map((ind) => {
                        const Icon = ind.icon;
                        const isSelected = data.industries.includes(ind.id);
                        return (
                            <button
                                key={ind.id}
                                onClick={() => {
                                    const current = data.industries;
                                    if (current.includes(ind.id)) {
                                        update({ industries: current.filter(id => id !== ind.id) });
                                    } else {
                                        update({ industries: [...current, ind.id] });
                                    }
                                }}
                                className={`relative flex items-center gap-2 p-2.5 ${chipBaseClass} ${
                                    isSelected ? chipSelectedClass : chipUnselectedClass
                                }`}
                            >
                                <Icon size={14} className={isSelected ? 'text-orange-500' : 'text-zinc-600'} />
                                <span className={`font-mono text-xs ${isSelected ? 'text-orange-400' : 'text-zinc-400'}`}>
                                    {ind.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Custom industry */}
            <AnimatePresence>
                {data.industries.includes('other') && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <InputField
                            label="Your Industry"
                            value={data.customIndustry}
                            onChange={(v) => update({ customIndustry: v })}
                            placeholder="e.g., Pool Cleaning, Window Tinting..."
                            required
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Services */}
            <AnimatePresence>
                {allServices.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <label className={labelClass}>
                            Services <span className="text-zinc-600">(optional)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {allServices.map((service) => (
                                <button
                                    key={service}
                                    onClick={() => toggleArrayItem('services', service)}
                                    className={`px-3 py-1.5 font-mono text-xs ${chipBaseClass} ${
                                        data.services.includes(service) ? chipSelectedClass : chipUnselectedClass
                                    }`}
                                >
                                    {service}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
