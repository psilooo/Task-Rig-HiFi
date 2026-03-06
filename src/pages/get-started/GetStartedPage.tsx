import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { TaskRigLogo } from '../../components/ui/TaskRigLogo';
import { PHASES } from '../../constants/integrations';
import { StepIndicator } from './StepIndicator';
import { SuccessState } from './SuccessState';
import { Phase1Trade } from './phases/Phase1Trade';
import { Phase2Needs } from './phases/Phase2Needs';
import { Phase3Preview } from './phases/Phase3Preview';
import { Phase4Book } from './phases/Phase4Book';
import { useLeadCapture } from '../../hooks/useLeadCapture';
import type { LeadData, PlacePrediction } from '../../types';

// ─── SLIDE VARIANTS ──────────────────────────────────────────────

const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const slideVariants = prefersReducedMotion
    ? {
          enter: () => ({ opacity: 0 }),
          center: { opacity: 1 },
          exit: () => ({ opacity: 0 }),
      }
    : {
          enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
          center: { x: 0, opacity: 1 },
          exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
      };

const slideTransition = prefersReducedMotion
    ? { opacity: { duration: 0.01 } }
    : {
          x: { type: 'spring' as const, stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
      };

// ─── PHASE HEADINGS ──────────────────────────────────────────────

const PHASE_HEADINGS: Record<number, string> = {
    1: 'Your Trade',
    2: 'Your Needs',
    3: 'Your Preview',
    4: 'Book Your Call',
};

// ─── INITIAL DATA ────────────────────────────────────────────────

const INITIAL_DATA: LeadData = {
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessRating: null,
    businessPlaceId: '',
    industry: '',
    customIndustry: '',
    painPoints: [],
    teamSize: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    consentSms: false,
    appointmentSlot: null,
    source: 'get-started',
    completedAt: null,
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────

export const GetStartedPage: React.FC = () => {
    const [phase, setPhase] = useState(1);
    const [direction, setDirection] = useState(1);
    const [data, setData] = useState<LeadData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [calendarAvailable, setCalendarAvailable] = useState(false);

    const placesServiceRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const { createLead } = useLeadCapture();

    // ─── UPDATE ──────────────────────────────────────────────────

    const update = useCallback((partial: Partial<LeadData>) => {
        setData((prev) => ({ ...prev, ...partial }));
    }, []);

    // ─── GOOGLE PLACES ──────────────────────────────────────────

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
                            setPredictions(
                                results.map((r) => ({
                                    place_id: r.place_id || '',
                                    description: r.description,
                                    structured_formatting: {
                                        main_text: r.structured_formatting?.main_text || '',
                                        secondary_text: r.structured_formatting?.secondary_text || '',
                                    },
                                })),
                            );
                        } else {
                            setPredictions([]);
                        }
                        setIsSearching(false);
                    },
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

    const handleSearch = useCallback(
        (query: string) => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(() => searchPlaces(query), 300);
        },
        [searchPlaces],
    );

    const handleSelectPlace = useCallback(
        (prediction: PlacePrediction) => {
            if (window.google?.maps?.places && placesServiceRef.current) {
                const service = new window.google.maps.places.PlacesService(placesServiceRef.current);
                service.getDetails(
                    {
                        placeId: prediction.place_id,
                        fields: ['name', 'formatted_address', 'formatted_phone_number', 'rating', 'types'],
                    },
                    (place, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                            update({
                                businessName: place.name || '',
                                businessAddress: place.formatted_address || '',
                                businessPhone: place.formatted_phone_number || '',
                                businessRating: place.rating || null,
                                businessPlaceId: prediction.place_id,
                            });
                        }
                    },
                );
            }
            setPredictions([]);
        },
        [update],
    );

    // ─── VALIDATION ──────────────────────────────────────────────

    const isPhaseValid = (p: number): boolean => {
        switch (p) {
            case 1: {
                const industryValid = data.industry === 'other'
                    ? data.customIndustry.trim() !== ''
                    : data.industry !== '';
                return industryValid && data.businessName.trim() !== '';
            }
            case 2:
                return data.teamSize !== '';
            case 3:
                return true; // Preview — always valid
            case 4: {
                const contactValid =
                    data.contactName.trim() !== '' &&
                    data.contactEmail.includes('@') &&
                    data.contactEmail.includes('.') &&
                    data.contactPhone.replace(/\D/g, '').length >= 10;
                // Require a time slot only when the calendar loaded successfully
                const slotValid = !calendarAvailable || data.appointmentSlot !== null;
                return contactValid && slotValid;
            }
            default:
                return false;
        }
    };

    // ─── NAVIGATION ──────────────────────────────────────────────

    const goNext = () => {
        if (phase < 4) {
            setDirection(1);
            setPhase((p) => p + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goBack = () => {
        if (phase > 1) {
            setDirection(-1);
            setPhase((p) => p - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ─── SUBMIT ──────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!isPhaseValid(4) || isSubmitting) return;

        setIsSubmitting(true);
        const completedAt = new Date().toISOString();
        const finalData = { ...data, completedAt };

        setData((prev) => ({ ...prev, completedAt }));

        let bookingSucceeded = false;

        try {
            const contactId = await createLead(finalData);

            // Book the appointment if a slot was selected and contact was created
            if (data.appointmentSlot && contactId) {
                const bookingRes = await fetch('/api/calendar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contactId,
                        startTime: data.appointmentSlot,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }),
                });
                bookingSucceeded = bookingRes.ok;
            }
        } catch (err) {
            console.warn('[GetStartedPage] submit failed:', err);
        }

        // If booking failed, clear the slot so SuccessState shows the fallback message
        if (data.appointmentSlot && !bookingSucceeded) {
            setData((prev) => ({ ...prev, appointmentSlot: null }));
        }

        setIsSubmitting(false);
        setIsComplete(true);
    };

    // ─── RENDER ──────────────────────────────────────────────────

    const valid = isPhaseValid(phase);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Hidden div for PlacesService */}
            <div ref={placesServiceRef} hidden />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-14">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors no-underline"
                    >
                        <ArrowLeft size={16} />
                        <span className="font-mono text-xs uppercase tracking-widest hidden sm:inline">
                            Back
                        </span>
                    </Link>
                    <Link to="/" className="flex items-center gap-2 no-underline">
                        <TaskRigLogo className="h-5 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                        <span className="font-heading font-bold text-base tracking-tight text-white">
                            TASK RIG
                        </span>
                    </Link>
                    {/* Spacer for centering */}
                    <div className="w-16" />
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-12 px-4">
                <div className="max-w-xl mx-auto">
                    {isComplete ? (
                        <SuccessState data={data} />
                    ) : (
                        <>
                            {/* Step Indicator */}
                            <StepIndicator currentPhase={phase} />

                            {/* Phase Heading */}
                            <h1 className="font-heading font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mt-6 mb-1">
                                {PHASE_HEADINGS[phase]}
                            </h1>
                            <p className="text-zinc-500 font-mono text-sm mb-6">
                                {PHASES[phase - 1]?.subtitle}
                            </p>

                            {/* Animated Phase Content */}
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={phase}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={slideTransition}
                                >
                                    {phase === 1 && (
                                        <Phase1Trade
                                            data={data}
                                            update={update}
                                            predictions={predictions}
                                            isSearching={isSearching}
                                            onSearch={handleSearch}
                                            onSelectPlace={handleSelectPlace}
                                        />
                                    )}
                                    {phase === 2 && (
                                        <Phase2Needs
                                            data={data}
                                            update={update}
                                        />
                                    )}
                                    {phase === 3 && (
                                        <Phase3Preview data={data} />
                                    )}
                                    {phase === 4 && (
                                        <Phase4Book
                                            data={data}
                                            update={update}
                                            errors={errors}
                                            setErrors={setErrors}
                                            onCalendarAvailability={setCalendarAvailable}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <nav className="flex items-center gap-3 mt-8">
                                {/* Back button — invisible on phase 1 to preserve layout */}
                                <button
                                    onClick={goBack}
                                    className={`flex items-center gap-1.5 px-5 py-3 min-h-[44px] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 font-mono text-xs uppercase tracking-widest transition-all rounded-sm ${
                                        phase === 1 ? 'invisible' : ''
                                    }`}
                                >
                                    <ChevronLeft size={14} />
                                    Back
                                </button>

                                {/* Continue / Submit button */}
                                {phase < 4 ? (
                                    <button
                                        onClick={goNext}
                                        disabled={!valid}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] font-bold text-sm uppercase tracking-widest transition-all rounded-sm ${
                                            valid
                                                ? 'bg-orange-500 text-zinc-950 hover:bg-orange-400'
                                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                        }`}
                                    >
                                        Continue
                                        <ChevronRight size={14} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!valid || isSubmitting}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] font-bold text-sm uppercase tracking-widest transition-all rounded-sm ${
                                            valid && !isSubmitting
                                                ? 'bg-orange-500 text-zinc-950 hover:bg-orange-400'
                                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Booking...
                                            </>
                                        ) : (
                                            'Confirm My Walkthrough'
                                        )}
                                    </button>
                                )}
                            </nav>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};
