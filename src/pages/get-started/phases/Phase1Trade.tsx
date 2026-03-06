import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { InputField } from '../../../components/forms/InputField';
import { INDUSTRIES } from '../../../constants/industries';
import {
    chipBaseClass,
    chipSelectedClass,
    chipUnselectedClass,
    labelClass,
    inputClass,
} from '../../../components/forms/styles';
import { staggerContainer, staggerItem } from '../animations';
import type { LeadData, PlacePrediction } from '../../../types';

interface Phase1TradeProps {
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
    predictions: PlacePrediction[];
    isSearching: boolean;
    onSearch: (query: string) => void;
    onSelectPlace: (prediction: PlacePrediction) => void;
}

export const Phase1Trade: React.FC<Phase1TradeProps> = ({
    data,
    update,
    predictions,
    isSearching,
    onSearch,
    onSelectPlace,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showManual, setShowManual] = useState(false);

    const handleSearchInput = (value: string) => {
        setSearchQuery(value);
        onSearch(value);
    };

    const handleSelectPlace = (prediction: PlacePrediction) => {
        setSearchQuery('');
        onSelectPlace(prediction);
    };

    const clearSelectedBusiness = () => {
        update({
            businessName: '',
            businessAddress: '',
            businessPhone: '',
            businessRating: null,
            businessPlaceId: '',
        });
        setSearchQuery('');
    };

    const hasSelectedBusiness = data.businessPlaceId !== '';

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* ── Industry Selection (single-select grid) ──────── */}
            <motion.div variants={staggerItem}>
                <label className={labelClass}>
                    What's your trade? <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {INDUSTRIES.map((ind) => {
                        const Icon = ind.icon;
                        const isSelected = data.industry === ind.id;
                        return (
                            <button
                                key={ind.id}
                                onClick={() =>
                                    update({
                                        industry: isSelected ? '' : ind.id,
                                        // clear custom industry when switching away from other
                                        ...(ind.id !== 'other' ? { customIndustry: '' } : {}),
                                    })
                                }
                                className={`relative flex items-center gap-2 p-2.5 min-h-[44px] ${chipBaseClass} ${
                                    isSelected ? chipSelectedClass : chipUnselectedClass
                                }`}
                            >
                                <Icon
                                    size={14}
                                    className={isSelected ? 'text-orange-500' : 'text-zinc-600'}
                                />
                                <span
                                    className={`font-mono text-xs ${
                                        isSelected ? 'text-orange-400' : 'text-zinc-400'
                                    }`}
                                >
                                    {ind.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── Custom industry input (only when "other") ────── */}
            <AnimatePresence>
                {data.industry === 'other' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
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

            {/* ── Business Search (optional) ────────────────────── */}
            <motion.div variants={staggerItem} className="relative">
                <label className={labelClass}>
                    Find your business <span className="text-zinc-600">(optional)</span>
                </label>

                {/* Search input — hidden once a business is selected */}
                {!hasSelectedBusiness && (
                    <>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                {isSearching ? (
                                    <div className="w-4 h-4 border-2 border-orange-500/50 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Search size={16} className="text-zinc-600" />
                                )}
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                placeholder="Search for your business..."
                                className={`${inputClass} pl-10`}
                            />
                        </div>

                        {/* Predictions dropdown */}
                        <AnimatePresence>
                            {predictions.length > 0 && searchQuery.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="absolute top-full left-0 right-0 mt-1 border border-zinc-700 bg-zinc-900 rounded-sm shadow-xl z-20 overflow-hidden"
                                >
                                    {predictions.map((p) => (
                                        <button
                                            key={p.place_id}
                                            onClick={() => handleSelectPlace(p)}
                                            className="w-full text-left px-4 py-3 hover:bg-zinc-800/60 transition-colors border-b border-zinc-800/50 last:border-0 flex items-start gap-3"
                                        >
                                            <MapPin
                                                size={14}
                                                className="text-orange-500 mt-0.5 shrink-0"
                                            />
                                            <div>
                                                <div className="font-mono text-sm text-white">
                                                    {p.structured_formatting.main_text}
                                                </div>
                                                <div className="font-mono text-xs text-zinc-500 mt-0.5">
                                                    {p.structured_formatting.secondary_text}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}

                {/* Selected business confirmation card */}
                <AnimatePresence>
                    {hasSelectedBusiness && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 border border-emerald-500/20 bg-emerald-500/[0.04] rounded-sm relative">
                                <button
                                    onClick={clearSelectedBusiness}
                                    className="absolute top-3 right-3 text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
                                >
                                    Change
                                </button>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
                                        Business Found
                                    </span>
                                </div>
                                <div className="font-heading font-bold text-base text-white uppercase tracking-wide mb-1">
                                    {data.businessName}
                                </div>
                                {data.businessAddress && (
                                    <div className="font-mono text-xs text-zinc-400 flex items-center gap-1.5">
                                        <MapPin size={11} className="text-zinc-500" />
                                        {data.businessAddress}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── Manual entry fallback ─────────────────────────── */}
            {!hasSelectedBusiness && (
                <motion.div variants={staggerItem}>
                    <button
                        onClick={() => setShowManual(!showManual)}
                        className="flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors"
                    >
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                                showManual ? 'rotate-180' : ''
                            }`}
                        />
                        Or enter manually
                    </button>
                    <AnimatePresence>
                        {showManual && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-4 pt-4">
                                    <InputField
                                        label="Business Name"
                                        value={data.businessName}
                                        onChange={(v) => update({ businessName: v })}
                                        placeholder="Acme HVAC Services"
                                    />
                                    <InputField
                                        label="Business Address"
                                        value={data.businessAddress}
                                        onChange={(v) => update({ businessAddress: v })}
                                        placeholder="123 Main St, City, State"
                                    />
                                    <InputField
                                        label="Business Phone"
                                        value={data.businessPhone}
                                        onChange={(v) => update({ businessPhone: v })}
                                        placeholder="+1 (555) 000-0000"
                                        type="tel"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
};
