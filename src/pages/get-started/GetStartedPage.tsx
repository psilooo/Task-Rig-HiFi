import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskRigLogo } from '../../components/ui/TaskRigLogo';
import { DynamicNoise } from '../../components/ui/DynamicNoise';
import { Footer } from '../../components/layout/Footer';
import { PHASES } from '../../constants/integrations';
import { staggerContainer } from './animations';
import { StepIndicator } from './StepIndicator';
import { SuccessState } from './SuccessState';
import { Phase1Business } from './phases/Phase1Business';
import { Phase2Needs } from './phases/Phase2Needs';
import { Phase3Contact } from './phases/Phase3Contact';
import type { LeadData, PlacePrediction, PlaceDetails } from '../../types';

// ─── SLIDE VARIANTS ──────────────────────────────────────────────

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 80 : -80,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -80 : 80,
        opacity: 0,
    }),
};

const slideTransition = {
    x: { type: 'spring' as const, stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────

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
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        contactRole: '',
        preferredContactMethod: 'phone',
        notes: '',
        consentMarketing: false,
        consentTransactional: false,
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
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

    const canContinue = (step: number): boolean => {
        switch (step) {
            case 1: return data.businessName.trim() !== '' && data.industries.length > 0;
            case 2: return data.teamSize !== '';
            case 3:
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

    // ─── NAVIGATION ───────────────────────────────────────────────

    const goNext = () => {
        if (!canContinue(currentStep)) return;

        setCompletedSteps(prev => new Set(prev).add(currentStep));
        setDirection(1);
        setCurrentStep(prev => Math.min(prev + 1, PHASES.length));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goBack = () => {
        setDirection(-1);
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ─── SUBMIT ─────────────────────────────────────────────────

    const handleSubmit = () => {
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

    // ─── RENDER ─────────────────────────────────────────────────

    return (
        <div className="min-h-[100svh] bg-zinc-950 text-zinc-100 relative overflow-x-clip selection:bg-orange-500/30 flex flex-col">
            {/* Background layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <DynamicNoise opacity={0.06} />
            </div>
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0" />
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-600/[0.04] blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-1/4 left-1/3 w-[300px] h-[200px] bg-orange-500/[0.02] blur-[100px] rounded-full pointer-events-none z-0" />

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
                    <div className="relative bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm rounded-sm shadow-xl shadow-orange-500/[0.02]">
                        {/* Corner brackets */}
                        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-orange-500/50 z-10" />
                        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-orange-500/50 z-10" />
                        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-orange-500/50 z-10" />
                        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-orange-500/50 z-10" />

                        {/* Subtle orange glow behind card */}
                        <div className="absolute -inset-px bg-gradient-to-b from-orange-500/[0.03] to-transparent rounded-sm pointer-events-none" />

                        {/* Step indicator */}
                        <div className="px-6 md:px-10 pt-6 md:pt-8 pb-4">
                            {!isSubmitted && (
                                <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
                            )}
                            {isSubmitted && (
                                <div className="flex items-center justify-center">
                                    <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">Complete</span>
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-zinc-800/50 mx-6 md:mx-10" />

                        {/* Card body */}
                        <div className="px-6 md:px-10 py-6 md:py-8">
                            {isSubmitted ? (
                                <SuccessState data={data} />
                            ) : (
                                <>
                                    {/* Phase title */}
                                    <div className="mb-6">
                                        <h3 className="font-heading font-bold text-2xl md:text-3xl text-white uppercase tracking-tight">
                                            {PHASES[currentStep - 1].title}
                                        </h3>
                                        <p className="text-zinc-500 font-mono text-sm mt-1">
                                            {PHASES[currentStep - 1].subtitle}
                                        </p>
                                    </div>

                                    {/* Phase content with slide animation */}
                                    <div className="relative overflow-hidden">
                                        <AnimatePresence mode="wait" custom={direction}>
                                            <motion.div
                                                key={currentStep}
                                                custom={direction}
                                                variants={slideVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={slideTransition}
                                            >
                                                <motion.div
                                                    variants={staggerContainer}
                                                    initial="hidden"
                                                    animate="show"
                                                >
                                                    {currentStep === 1 && (
                                                        <Phase1Business
                                                            data={data}
                                                            update={update}
                                                            toggleArrayItem={toggleArrayItem}
                                                            searchQuery={searchQuery}
                                                            handleSearchInput={handleSearchInput}
                                                            selectedPlace={selectedPlace}
                                                            selectPlace={selectPlace}
                                                            clearPlace={clearPlace}
                                                            predictions={predictions}
                                                            showPredictions={showPredictions}
                                                            isSearching={isSearching}
                                                            searchRef={searchRef}
                                                            showManualEntry={showManualEntry}
                                                            setShowManualEntry={setShowManualEntry}
                                                            setShowPredictions={setShowPredictions}
                                                        />
                                                    )}
                                                    {currentStep === 2 && (
                                                        <Phase2Needs
                                                            data={data}
                                                            update={update}
                                                            toggleArrayItem={toggleArrayItem}
                                                        />
                                                    )}
                                                    {currentStep === 3 && (
                                                        <Phase3Contact
                                                            data={data}
                                                            update={update}
                                                            emailError={emailError}
                                                            phoneError={phoneError}
                                                            setEmailError={setEmailError}
                                                            setPhoneError={setPhoneError}
                                                            canSubmit={canContinue(3)}
                                                            onSubmit={handleSubmit}
                                                        />
                                                    )}
                                                </motion.div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Back / Continue buttons (not on phase 3 which has its own submit) */}
                                    {currentStep < 3 && (
                                        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-800/30">
                                            {currentStep > 1 && (
                                                <button
                                                    onClick={goBack}
                                                    className="flex items-center gap-1.5 px-5 py-3 min-h-[44px] border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm"
                                                >
                                                    <ChevronLeft size={14} />
                                                    Back
                                                </button>
                                            )}
                                            <button
                                                onClick={goNext}
                                                disabled={!canContinue(currentStep)}
                                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] font-mono text-xs uppercase tracking-widest transition-all rounded-sm ${
                                                    canContinue(currentStep)
                                                        ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                                                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                                }`}
                                            >
                                                Continue
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Phase 3 back button */}
                                    {currentStep === 3 && (
                                        <div className="pt-4">
                                            <button
                                                onClick={goBack}
                                                className="flex items-center gap-1.5 px-5 py-3 min-h-[44px] border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm"
                                            >
                                                <ChevronLeft size={14} />
                                                Back
                                            </button>
                                        </div>
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
