import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Check, ChevronDown, ChevronRight
} from 'lucide-react';
import { TaskRigLogo } from '../../components/ui/TaskRigLogo';
import { DynamicNoise } from '../../components/ui/DynamicNoise';
import { Footer } from '../../components/layout/Footer';
import { Checkbox } from '../../components/forms/Checkbox';
import { PHASES } from '../../constants/integrations';
import { INDUSTRIES } from '../../constants/industries';
import { staggerContainer, staggerItem } from './animations';
import { ContinueButton } from './ContinueButton';
import { SuccessState } from './SuccessState';
import { PhaseSubtitle } from './PhaseSubtitle';
import { Phase1Content } from './phases/Phase1';
import { Phase2Content } from './phases/Phase2';
import { Phase3Content } from './phases/Phase3';
import { Phase4Content } from './phases/Phase4';
import { Phase5Content } from './phases/Phase5';
import type { LeadData, PlacePrediction, PlaceDetails } from '../../types';

// ─── PHASE SUMMARIES ─────────────────────────────────────────────

function getPhaseSummary(phase: number, data: LeadData): string {
    switch (phase) {
        case 1: {
            const parts = [data.businessName];
            if (data.businessAddress) parts.push(data.businessAddress.split(',')[0]);
            if (data.businessRating) parts.push(`${data.businessRating}\u2605`);
            return parts.filter(Boolean).join(' \u00b7 ');
        }
        case 2: {
            const names = data.industries.map(id => INDUSTRIES.find(i => i.id === id)?.label).filter(Boolean);
            const serviceCount = data.services.length;
            const parts = [names.join(', ')];
            if (serviceCount > 0) parts.push(`${serviceCount} services`);
            return parts.join(' \u00b7 ');
        }
        case 3:
            return `${data.painPoints.length} challenges \u00b7 ${data.desiredIntegrations.length} integrations`;
        case 4: {
            const parts = [];
            if (data.teamSize) parts.push(data.teamSize);
            if (data.monthlyCallVolume) parts.push(data.monthlyCallVolume);
            return parts.join(' \u00b7 ') || 'Configured';
        }
        case 5:
            return [data.contactName, data.contactEmail].filter(Boolean).join(' \u00b7 ');
        default:
            return '';
    }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────

export const GetStartedPage: React.FC = () => {
    const [data, setData] = useState<LeadData>({
        businessName: '',
        businessAddress: '',
        businessPhone: '',
        businessCategory: '',
        businessRating: null,
        businessPlaceId: '',
        industries: [],
        customIndustry: '',
        services: [],
        painPoints: [],
        currentTools: [],
        desiredIntegrations: ['sms', 'calendars', 'crm'],
        teamSize: '',
        monthlyCallVolume: '',
        monthlyLeadVolume: '',
        operatingHours: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        contactRole: '',
        preferredContactMethod: 'phone',
        notes: '',
        consentMarketing: false,
        consentTransactional: false,
    });

    const [activePhase, setActivePhase] = useState(1);
    const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
    const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]));
    const [phaseTypingComplete, setPhaseTypingComplete] = useState<Record<number, boolean>>({});
    const [phaseHasBeenExpanded, setPhaseHasBeenExpanded] = useState<Set<number>>(new Set([1]));
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Google Places state
    const [searchQuery, setSearchQuery] = useState('');
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    // Validation
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const phaseRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const update = useCallback((partial: Partial<LeadData>) => {
        setData(prev => ({ ...prev, ...partial }));
    }, []);

    const toggleArrayItem = useCallback((field: keyof LeadData, value: string) => {
        setData(prev => {
            const arr = prev[field] as string[];
            return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
        });
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowPredictions(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // ─── GOOGLE PLACES ────────────────────────────────────────────

    const searchPlaces = useCallback(async (query: string) => {
        if (query.length < 3) {
            setPredictions([]);
            return;
        }
        setIsSearching(true);
        try {
            if (window.google?.maps?.places) {
                const service = new window.google.maps.places.AutocompleteService();
                service.getPlacePredictions(
                    { input: query, types: ['establishment'] },
                    (results, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                            setPredictions(results.map(r => ({
                                place_id: r.place_id || '',
                                description: r.description,
                                structured_formatting: {
                                    main_text: r.structured_formatting?.main_text || '',
                                    secondary_text: r.structured_formatting?.secondary_text || '',
                                },
                            })));
                        } else {
                            setPredictions([]);
                        }
                        setIsSearching(false);
                    }
                );
            } else {
                // API not loaded — no fake results, user should use manual entry
                setPredictions([]);
                setIsSearching(false);
            }
        } catch {
            setIsSearching(false);
        }
    }, []);

    const handleSearchInput = (value: string) => {
        setSearchQuery(value);
        setShowPredictions(true);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => searchPlaces(value), 300);
    };

    const selectPlace = (prediction: PlacePrediction) => {
        setShowPredictions(false);
        setSearchQuery(prediction.structured_formatting.main_text);

        if (window.google?.maps?.places) {
            const div = document.createElement('div');
            const service = new window.google.maps.places.PlacesService(div);
            service.getDetails(
                { placeId: prediction.place_id, fields: ['name', 'formatted_address', 'formatted_phone_number', 'rating', 'types'] },
                (place, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                        const details: PlaceDetails = {
                            name: place.name || '',
                            formatted_address: place.formatted_address || '',
                            formatted_phone_number: place.formatted_phone_number,
                            rating: place.rating,
                            types: place.types,
                        };
                        setSelectedPlace(details);
                        update({
                            businessName: details.name,
                            businessAddress: details.formatted_address,
                            businessPhone: details.formatted_phone_number || '',
                            businessRating: details.rating || null,
                            businessPlaceId: prediction.place_id,
                            businessCategory: details.types?.[0]?.replace(/_/g, ' ') || '',
                        });
                    }
                }
            );
        }
    };

    const clearPlace = () => {
        setSelectedPlace(null);
        setSearchQuery('');
        update({
            businessName: '',
            businessAddress: '',
            businessPhone: '',
            businessRating: null,
            businessPlaceId: '',
            businessCategory: '',
        });
    };

    // ─── VALIDATION ───────────────────────────────────────────────

    const validateEmail = (email: string): boolean => {
        const trimmed = email.trim();
        return trimmed.includes('@') && trimmed.includes('.');
    };

    const validatePhone = (phone: string): boolean => {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    };

    // ─── PHASE NAVIGATION ─────────────────────────────────────────

    const canConfirmPhase = (phase: number): boolean => {
        switch (phase) {
            case 1: return data.businessName.trim() !== '';
            case 2: return data.industries.length > 0;
            case 3: return data.painPoints.length > 0;
            case 4: return data.teamSize !== '';
            case 5:
                return (
                    data.contactName.trim() !== '' &&
                    data.contactEmail.trim() !== '' &&
                    validateEmail(data.contactEmail) &&
                    data.contactPhone.trim() !== '' &&
                    validatePhone(data.contactPhone)
                );
            default: return false;
        }
    };

    const confirmPhase = (phase: number) => {
        if (phase === 5) {
            let hasError = false;
            if (!validateEmail(data.contactEmail)) {
                setEmailError('Please enter a valid email address.');
                hasError = true;
            } else {
                setEmailError('');
            }
            if (!validatePhone(data.contactPhone)) {
                setPhoneError('Please enter a phone number with at least 10 digits.');
                hasError = true;
            } else {
                setPhoneError('');
            }
            if (hasError) return;
        }

        setCompletedPhases(prev => new Set(prev).add(phase));
        setExpandedPhases(prev => {
            const next = new Set(prev);
            next.delete(phase);
            return next;
        });

        if (phase < 5) {
            const nextPhase = phase + 1;
            setActivePhase(nextPhase);
            setExpandedPhases(prev => new Set(prev).add(nextPhase));
            setPhaseHasBeenExpanded(prev => new Set(prev).add(nextPhase));

            setTimeout(() => {
                phaseRefs.current[nextPhase]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const togglePhaseExpand = (phase: number) => {
        if (!completedPhases.has(phase) && phase !== activePhase) return;
        setExpandedPhases(prev => {
            const next = new Set(prev);
            if (next.has(phase)) {
                next.delete(phase);
            } else {
                next.add(phase);
                setPhaseHasBeenExpanded(p => new Set(p).add(phase));
            }
            return next;
        });
    };

    // ─── SUBMIT ────────────────────────────────────────────────────

    const handleSubmit = () => {
        const payload = {
            ...data,
            submittedAt: new Date().toISOString(),
            source: 'get-started-wizard',
            utmSource: new URLSearchParams(window.location.search).get('utm_source') || '',
            utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || '',
            utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
        };

        console.log('[TaskRig Lead Capture]', JSON.stringify(payload, null, 2));
        setIsSubmitted(true);
    };

    const allPhasesComplete = completedPhases.size === 5;

    // ─── RENDER ────────────────────────────────────────────────────

    return (
        <div className="min-h-[100svh] bg-zinc-950 text-zinc-100 relative overflow-x-clip selection:bg-orange-500/30 flex flex-col">
            {/* Background layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <DynamicNoise opacity={0.06} />
            </div>
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0" />
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-orange-600/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-14 md:h-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center">
                    <Link to="/" className="flex items-center gap-2 md:gap-3 no-underline">
                        <TaskRigLogo className="h-5 md:h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                        <div className="font-heading font-bold text-base md:text-2xl tracking-tight text-white whitespace-nowrap">TASK RIG</div>
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 relative z-10 pt-20 md:pt-28 pb-12 md:pb-20 px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Back link */}
                    <div className="mb-6">
                        <Link to="/" className="group inline-flex items-center gap-1.5 py-2 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors no-underline">
                            <ArrowLeft size={14} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                            Back to Home
                        </Link>
                    </div>

                    {/* Glass Card */}
                    <div className="relative bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm rounded-sm shadow-xl">
                        {/* Corner brackets */}
                        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-orange-500/50 z-10" />
                        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-orange-500/50 z-10" />
                        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-orange-500/50 z-10" />
                        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-orange-500/50 z-10" />

                        {/* Card header: phase dots + step counter */}
                        <div className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 pb-4">
                            <div className="flex items-center gap-2">
                                {PHASES.map(p => (
                                    <div
                                        key={p.num}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                            completedPhases.has(p.num)
                                                ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                                                : p.num === activePhase
                                                    ? 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.4)]'
                                                    : 'bg-zinc-700'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                                Step {isSubmitted ? 5 : activePhase} of 5
                            </span>
                        </div>

                        <div className="h-px bg-zinc-800/50 mx-6 md:mx-10" />

                        {/* Card body */}
                        <div className="px-6 md:px-10 py-6 md:py-8 space-y-2">
                            {isSubmitted ? (
                                <SuccessState data={data} />
                            ) : (
                                <>
                                    {PHASES.map((phase) => {
                                        const isComplete = completedPhases.has(phase.num);
                                        const isExpanded = expandedPhases.has(phase.num);
                                        const isActive = phase.num === activePhase;
                                        const isAccessible = isComplete || isActive;
                                        const hasBeenExpanded = phaseHasBeenExpanded.has(phase.num);

                                        if (!isAccessible) return null;

                                        return (
                                            <div
                                                key={phase.num}
                                                ref={(el) => { phaseRefs.current[phase.num] = el; }}
                                                className="scroll-mt-28"
                                            >
                                                {/* Collapsed summary */}
                                                {isComplete && !isExpanded && (
                                                    <button
                                                        onClick={() => togglePhaseExpand(phase.num)}
                                                        className="w-full text-left flex items-center gap-3 py-3 border-b border-zinc-800/30 group transition-colors hover:bg-zinc-800/10"
                                                    >
                                                        <Check size={16} className="text-emerald-500 shrink-0" />
                                                        <span className="text-zinc-400 font-mono text-sm flex-1 truncate">
                                                            {getPhaseSummary(phase.num, data)}
                                                        </span>
                                                        <ChevronDown size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                                                    </button>
                                                )}

                                                {/* Expanded phase */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="py-4">
                                                                {/* Phase header + collapse button */}
                                                                <div className="flex items-start justify-between mb-1">
                                                                    <h3 className="font-heading font-bold text-2xl text-white uppercase tracking-tight">
                                                                        {phase.title}
                                                                    </h3>
                                                                    {isComplete && (
                                                                        <button
                                                                            onClick={() => togglePhaseExpand(phase.num)}
                                                                            className="font-mono text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors mt-1"
                                                                        >
                                                                            Collapse
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {/* Subtitle typing — only on first expansion */}
                                                                {!hasBeenExpanded || (isActive && !phaseTypingComplete[phase.num]) ? (
                                                                    <PhaseSubtitle
                                                                        text={phase.subtitle}
                                                                        enabled={true}
                                                                        onComplete={() => setPhaseTypingComplete(prev => ({ ...prev, [phase.num]: true }))}
                                                                    />
                                                                ) : (
                                                                    <p className="text-zinc-500 font-mono text-sm mb-6">
                                                                        {phase.subtitle}
                                                                    </p>
                                                                )}

                                                                {/* Phase form content */}
                                                                {(phaseTypingComplete[phase.num] || hasBeenExpanded) && (
                                                                    <motion.div
                                                                        variants={staggerContainer}
                                                                        initial={hasBeenExpanded ? 'show' : 'hidden'}
                                                                        animate="show"
                                                                    >
                                                                        {phase.num === 1 && <Phase1Content data={data} update={update} searchQuery={searchQuery} handleSearchInput={handleSearchInput} selectedPlace={selectedPlace} selectPlace={selectPlace} clearPlace={clearPlace} predictions={predictions} showPredictions={showPredictions} isSearching={isSearching} searchRef={searchRef} showManualEntry={showManualEntry} setShowManualEntry={setShowManualEntry} setShowPredictions={setShowPredictions} />}
                                                                        {phase.num === 2 && <Phase2Content data={data} update={update} toggleArrayItem={toggleArrayItem} />}
                                                                        {phase.num === 3 && <Phase3Content data={data} toggleArrayItem={toggleArrayItem} />}
                                                                        {phase.num === 4 && <Phase4Content data={data} update={update} />}
                                                                        {phase.num === 5 && <Phase5Content data={data} update={update} emailError={emailError} phoneError={phoneError} setEmailError={setEmailError} setPhoneError={setPhoneError} />}

                                                                        {/* Continue / Submit button */}
                                                                        {!isComplete && (
                                                                            <motion.div variants={staggerItem} className="pt-2">
                                                                                {phase.num === 5 ? (
                                                                                    /* Phase 5: show consents + submit after all phases done */
                                                                                    allPhasesComplete ? null : (
                                                                                        <ContinueButton
                                                                                            enabled={canConfirmPhase(5)}
                                                                                            onClick={() => confirmPhase(5)}
                                                                                            label="Continue"
                                                                                        />
                                                                                    )
                                                                                ) : (
                                                                                    <ContinueButton
                                                                                        enabled={canConfirmPhase(phase.num)}
                                                                                        onClick={() => confirmPhase(phase.num)}
                                                                                        label="Continue"
                                                                                    />
                                                                                )}
                                                                            </motion.div>
                                                                        )}
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}

                                    {/* Final submit — after all 5 phases confirmed */}
                                    {allPhasesComplete && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="pt-4"
                                        >
                                            <div className="h-px bg-zinc-800/50 mb-6" />

                                            <div className="space-y-3 mb-6">
                                                <Checkbox
                                                    checked={data.consentMarketing}
                                                    onChange={(v) => update({ consentMarketing: v })}
                                                    label="I consent to receive marketing text messages from TaskRig at the phone number provided. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out."
                                                />
                                                <Checkbox
                                                    checked={data.consentTransactional}
                                                    onChange={(v) => update({ consentTransactional: v })}
                                                    label="I consent to receive non-marketing text messages from TaskRig about my order updates, appointment reminders, etc. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out."
                                                />
                                            </div>

                                            <button
                                                onClick={handleSubmit}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-400 text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                                            >
                                                Submit
                                                <ChevronRight size={14} />
                                            </button>

                                            <p className="text-center font-mono text-[10px] text-zinc-600/50 leading-relaxed mt-3">
                                                By submitting, you agree to receive SMS updates from TaskRig. Msg &amp; data rates may apply. Reply STOP anytime.{' '}
                                                <Link to="/privacy-policy" className="text-zinc-500/60 hover:text-zinc-400 underline underline-offset-2 transition-colors">
                                                    Privacy Policy
                                                </Link>
                                            </p>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
