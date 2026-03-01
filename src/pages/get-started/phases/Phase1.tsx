import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Star, ChevronDown } from 'lucide-react';
import { InputField } from '../../../components/forms/InputField';
import { staggerItem } from '../animations';
import { labelClass, inputClass } from '../../../components/forms/styles';
import type { LeadData, PlacePrediction, PlaceDetails } from '../../../types';

export const Phase1Content: React.FC<{
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
    searchQuery: string;
    handleSearchInput: (v: string) => void;
    selectedPlace: PlaceDetails | null;
    selectPlace: (p: PlacePrediction) => void;
    clearPlace: () => void;
    predictions: PlacePrediction[];
    showPredictions: boolean;
    isSearching: boolean;
    searchRef: React.RefObject<HTMLDivElement | null>;
    showManualEntry: boolean;
    setShowManualEntry: (v: boolean) => void;
    setShowPredictions: (v: boolean) => void;
}> = ({ data, update, searchQuery, handleSearchInput, selectedPlace, selectPlace, clearPlace, predictions, showPredictions, isSearching, searchRef, showManualEntry, setShowManualEntry, setShowPredictions }) => (
    <div className="space-y-4">
        {/* Business search */}
        <motion.div variants={staggerItem} ref={searchRef} className="relative">
            <label className={labelClass}>
                Search your business <span className="text-orange-500">*</span>
            </label>
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
                    value={selectedPlace ? data.businessName : searchQuery}
                    onChange={(e) => {
                        if (selectedPlace) {
                            clearPlace();
                            handleSearchInput(e.target.value);
                        } else {
                            handleSearchInput(e.target.value);
                        }
                    }}
                    onFocus={() => !selectedPlace && setShowPredictions(true)}
                    placeholder="Search for your business..."
                    className={`${inputClass} pl-10`}
                />
            </div>

            <AnimatePresence>
                {showPredictions && predictions.length > 0 && !selectedPlace && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full left-0 right-0 mt-1 border border-zinc-700 bg-zinc-900 rounded-sm shadow-xl z-20 overflow-hidden"
                    >
                        {predictions.map((p) => (
                            <button
                                key={p.place_id}
                                onClick={() => selectPlace(p)}
                                className="w-full text-left px-4 py-3 hover:bg-zinc-800/60 transition-colors border-b border-zinc-800/50 last:border-0 flex items-start gap-3"
                            >
                                <MapPin size={14} className="text-orange-500 mt-0.5 shrink-0" />
                                <div>
                                    <div className="font-mono text-sm text-white">{p.structured_formatting.main_text}</div>
                                    <div className="font-mono text-xs text-zinc-500 mt-0.5">{p.structured_formatting.secondary_text}</div>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

        {/* Selected place card */}
        <AnimatePresence>
            {selectedPlace && (
                <motion.div
                    initial={{ opacity: 0, y: 8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="p-4 border border-emerald-500/20 bg-emerald-500/[0.04] rounded-sm relative">
                        <button onClick={clearPlace} className="absolute top-3 right-3 text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">Change</button>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">Business Found</span>
                        </div>
                        <div className="font-heading font-bold text-base text-white uppercase tracking-wide mb-1">{selectedPlace.name}</div>
                        <div className="font-mono text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
                            <MapPin size={11} className="text-zinc-500" />
                            {selectedPlace.formatted_address}
                        </div>
                        {selectedPlace.formatted_phone_number && (
                            <div className="font-mono text-xs text-zinc-400 flex items-center gap-1.5 mb-1">
                                <Phone size={11} className="text-zinc-500" />
                                {selectedPlace.formatted_phone_number}
                            </div>
                        )}
                        {selectedPlace.rating && (
                            <div className="flex items-center gap-1.5 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={11} className={i < Math.round(selectedPlace.rating!) ? 'text-orange-500 fill-orange-500' : 'text-zinc-700'} />
                                ))}
                                <span className="font-mono text-xs text-zinc-400 ml-1">{selectedPlace.rating}</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Manual entry toggle */}
        {!selectedPlace && (
            <motion.div variants={staggerItem}>
                <button
                    onClick={() => setShowManualEntry(!showManualEntry)}
                    className="flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors"
                >
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showManualEntry ? 'rotate-180' : ''}`} />
                    Or enter manually
                </button>
                <AnimatePresence>
                    {showManualEntry && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-4 pt-4">
                                <InputField label="Business Name" value={data.businessName} onChange={(v) => update({ businessName: v })} placeholder="Acme HVAC Services" required />
                                <InputField label="Business Address" value={data.businessAddress} onChange={(v) => update({ businessAddress: v })} placeholder="123 Main St, City, State" />
                                <InputField label="Business Phone" value={data.businessPhone} onChange={(v) => update({ businessPhone: v })} placeholder="+1 (555) 000-0000" type="tel" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        )}
    </div>
);
