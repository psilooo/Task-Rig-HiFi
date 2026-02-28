import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Search, MapPin, Phone, Mail, Users, Building2,
    Check, Wrench, Calendar, MessageSquare, CreditCard, BarChart3,
    Zap, Globe, Shield, Clock, Star, Sparkles,
    FileText, Heart, Truck, Home, Hammer, Briefcase, Stethoscope,
    Car, UtensilsCrossed, Scissors, PaintBucket, TreePine, Cog, ChevronDown,
    ChevronRight
} from 'lucide-react';
import { TaskRigLogo } from './ui/TaskRigLogo';
import { DynamicNoise } from './DynamicNoise';
import { Footer } from './Footer';

// ─── TYPES ────────────────────────────────────────────────────────

interface LeadData {
    // Step 1: Business
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    businessCategory: string;
    businessRating: number | null;
    businessPlaceId: string;
    // Step 2: Industry & Services
    industries: string[];
    customIndustry: string;
    services: string[];
    // Step 3: Pain Points & Needs
    painPoints: string[];
    currentTools: string[];
    desiredIntegrations: string[];
    // Step 4: Team & Volume
    teamSize: string;
    monthlyCallVolume: string;
    monthlyLeadVolume: string;
    operatingHours: string;
    // Step 5: Contact
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    contactRole: string;
    preferredContactMethod: string;
    notes: string;
    consentMarketing: boolean;
    consentTransactional: boolean;
}

interface PlacePrediction {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

interface PlaceDetails {
    name: string;
    formatted_address: string;
    formatted_phone_number?: string;
    rating?: number;
    types?: string[];
}

// ─── CONSTANTS ────────────────────────────────────────────────────

const PHASES = [
    { num: 1, title: 'Find Your Business', subtitle: 'Search or enter your details below' },
    { num: 2, title: 'Your Industry', subtitle: 'Select your industry to customize your setup' },
    { num: 3, title: 'Challenges & Tools', subtitle: 'Tell us what you\'re solving for' },
    { num: 4, title: 'Scale', subtitle: 'How big is your operation?' },
    { num: 5, title: 'Contact', subtitle: 'We\'ll reach out within 24 hours' },
];

const INDUSTRIES = [
    { id: 'hvac', label: 'HVAC', icon: Wrench },
    { id: 'plumbing', label: 'Plumbing', icon: Wrench },
    { id: 'electrical', label: 'Electrical', icon: Zap },
    { id: 'roofing', label: 'Roofing', icon: Home },
    { id: 'landscaping', label: 'Landscaping', icon: TreePine },
    { id: 'painting', label: 'Painting', icon: PaintBucket },
    { id: 'construction', label: 'Construction', icon: Hammer },
    { id: 'cleaning', label: 'Cleaning', icon: Sparkles },
    { id: 'auto-repair', label: 'Auto Repair', icon: Car },
    { id: 'healthcare', label: 'Healthcare', icon: Stethoscope },
    { id: 'dental', label: 'Dental', icon: Heart },
    { id: 'legal', label: 'Legal', icon: Briefcase },
    { id: 'real-estate', label: 'Real Estate', icon: Building2 },
    { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
    { id: 'salon-spa', label: 'Salon & Spa', icon: Scissors },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'pest-control', label: 'Pest Control', icon: Shield },
    { id: 'general-contracting', label: 'General Contractor', icon: FileText },
    { id: 'moving', label: 'Moving & Hauling', icon: Truck },
    { id: 'other', label: 'Other', icon: Cog },
];

const PAIN_POINTS = [
    { id: 'missed-calls', label: 'Missed calls & leads', icon: Phone },
    { id: 'slow-response', label: 'Slow response times', icon: Clock },
    { id: 'scheduling-chaos', label: 'Scheduling chaos', icon: Calendar },
    { id: 'manual-dispatch', label: 'Manual dispatch', icon: Truck },
    { id: 'no-after-hours', label: 'No after-hours coverage', icon: Globe },
    { id: 'lost-reviews', label: 'Not enough reviews', icon: Star },
    { id: 'invoicing', label: 'Invoicing delays', icon: CreditCard },
    { id: 'customer-followup', label: 'Customer follow-up', icon: MessageSquare },
    { id: 'data-silos', label: 'Data spread across tools', icon: BarChart3 },
    { id: 'hiring', label: 'Hard to hire/retain staff', icon: Users },
];

const INTEGRATIONS = [
    { id: 'calendars', label: 'Calendar Sync', desc: 'Google, Outlook, iCal' },
    { id: 'sms', label: 'SMS / Texting', desc: 'Two-way business texting' },
    { id: 'email', label: 'Email', desc: 'Automated email campaigns' },
    { id: 'voicemail', label: 'Voicemail / IVR', desc: 'AI voicemail & routing' },
    { id: 'payments', label: 'Payments', desc: 'Invoicing & online pay' },
    { id: 'crm', label: 'CRM', desc: 'Contact & deal tracking' },
    { id: 'forms', label: 'Forms & Surveys', desc: 'Lead capture forms' },
    { id: 'social', label: 'Social Media', desc: 'Post & manage social' },
    { id: 'reputation', label: 'Reputation', desc: 'Review management' },
    { id: 'website', label: 'Website Chat', desc: 'Live chat widget' },
    { id: 'analytics', label: 'Analytics', desc: 'Reporting & dashboards' },
    { id: 'ai-agent', label: 'AI Phone Agent', desc: 'Autonomous call handling' },
];

const TEAM_SIZES = ['Solo', '2-5', '6-15', '16-50', '51-200', '200+'];
const CALL_VOLUMES = ['< 50/mo', '50-200/mo', '200-500/mo', '500-1000/mo', '1000+/mo'];
const LEAD_VOLUMES = ['< 20/mo', '20-100/mo', '100-500/mo', '500+/mo'];
const HOURS = ['Standard (9-5)', 'Extended (7-7)', '24/7', 'Varies / Seasonal'];
const ROLES = ['Owner', 'Manager', 'Operations Lead', 'Marketing', 'IT / Tech', 'Other'];

const INDUSTRY_SERVICES: Record<string, string[]> = {
    'hvac': ['AC Repair', 'Heating Repair', 'Installation', 'Maintenance', 'Duct Work', 'Commercial HVAC'],
    'plumbing': ['Drain Cleaning', 'Water Heater', 'Pipe Repair', 'Sewer Line', 'Emergency Service', 'Repiping'],
    'electrical': ['Wiring', 'Panel Upgrades', 'Lighting', 'EV Charger Install', 'Emergency Service', 'Inspections'],
    'roofing': ['Roof Repair', 'Replacement', 'Inspection', 'Storm Damage', 'Gutters', 'Commercial'],
    'landscaping': ['Lawn Care', 'Design', 'Irrigation', 'Tree Service', 'Hardscaping', 'Snow Removal'],
    'painting': ['Interior', 'Exterior', 'Commercial', 'Cabinet Refinishing', 'Staining', 'Pressure Washing'],
    'construction': ['Residential', 'Commercial', 'Remodeling', 'Additions', 'Foundation', 'Permits'],
    'cleaning': ['Residential', 'Commercial', 'Move-In/Out', 'Deep Clean', 'Window Cleaning', 'Carpet'],
    'auto-repair': ['Oil Change', 'Brakes', 'Engine', 'Transmission', 'Diagnostics', 'Body Work'],
    'healthcare': ['Primary Care', 'Urgent Care', 'Telehealth', 'Lab Work', 'Referrals', 'Follow-ups'],
    'dental': ['Cleaning', 'Fillings', 'Crown', 'Implants', 'Emergency', 'Cosmetic'],
    'legal': ['Consultation', 'Litigation', 'Estate Planning', 'Business Law', 'Personal Injury', 'Family Law'],
    'real-estate': ['Buying', 'Selling', 'Property Mgmt', 'Commercial', 'Rentals', 'Appraisals'],
    'restaurant': ['Dine-In', 'Takeout', 'Catering', 'Delivery', 'Events', 'Reservations'],
    'salon-spa': ['Haircut', 'Color', 'Massage', 'Facial', 'Nails', 'Waxing'],
    'logistics': ['Last Mile', 'Freight', 'Warehousing', 'Fleet Mgmt', 'Route Planning', 'Tracking'],
    'pest-control': ['Termites', 'Rodents', 'Mosquitoes', 'Bed Bugs', 'Wildlife Removal', 'Quarterly Plans'],
    'general-contracting': ['New Builds', 'Remodels', 'Additions', 'Permit Management', 'Sub Coordination', 'Inspections'],
    'moving': ['Local Moves', 'Long Distance', 'Packing', 'Storage', 'Junk Removal', 'Commercial'],
};

// ─── HOOKS ────────────────────────────────────────────────────────

function useTypingEffect(text: string, enabled: boolean, speed = 20): { displayText: string; isComplete: boolean } {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setDisplayText('');
            setIsComplete(false);
            return;
        }
        let i = 0;
        setDisplayText('');
        setIsComplete(false);
        const interval = setInterval(() => {
            i++;
            setDisplayText(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(interval);
                setIsComplete(true);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, enabled, speed]);

    return { displayText, isComplete };
}

// ─── ANIMATION VARIANTS ──────────────────────────────────────────

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.04 },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

// ─── SHARED STYLES ───────────────────────────────────────────────

const labelClass = 'block text-zinc-400 font-mono text-xs uppercase tracking-widest mb-2';
const inputClass = 'w-full bg-zinc-950/50 border border-zinc-800 rounded-sm px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-700';
const chipBaseClass = 'border rounded-sm transition-all duration-200';
const chipSelectedClass = 'border-orange-500/50 bg-orange-500/10 text-orange-400';
const chipUnselectedClass = 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300';

// ─── FORM PRIMITIVES ─────────────────────────────────────────────

const InputField: React.FC<{
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

const ChipButton: React.FC<{
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

const Checkbox: React.FC<{
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

const SelectChips: React.FC<{
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

// ─── PHASE SUBTITLE TYPING ──────────────────────────────────────

const PhaseSubtitle: React.FC<{ text: string; enabled: boolean; onComplete?: () => void }> = ({ text, enabled, onComplete }) => {
    const { displayText, isComplete } = useTypingEffect(text, enabled);

    useEffect(() => {
        if (isComplete && onComplete) onComplete();
    }, [isComplete, onComplete]);

    if (!enabled) return null;

    return (
        <p className="text-zinc-500 font-mono text-sm mb-6">
            {displayText}
        </p>
    );
};

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
                setPredictions([
                    {
                        place_id: 'demo-1',
                        description: `${query} - 123 Main St, Your City`,
                        structured_formatting: { main_text: query, secondary_text: '123 Main St, Your City, ST 12345' },
                    },
                    {
                        place_id: 'demo-2',
                        description: `${query} Services LLC - 456 Oak Ave`,
                        structured_formatting: { main_text: `${query} Services LLC`, secondary_text: '456 Oak Ave, Nearby Town, ST 67890' },
                    },
                ]);
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
        } else {
            const details: PlaceDetails = {
                name: prediction.structured_formatting.main_text,
                formatted_address: prediction.structured_formatting.secondary_text,
                rating: 4.6,
                types: ['establishment'],
            };
            setSelectedPlace(details);
            update({
                businessName: details.name,
                businessAddress: details.formatted_address,
                businessPhone: '',
                businessRating: details.rating || null,
                businessPlaceId: prediction.place_id,
                businessCategory: 'business',
            });
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

// ─── CONTINUE BUTTON ─────────────────────────────────────────────

const ContinueButton: React.FC<{ enabled: boolean; onClick: () => void; label: string }> = ({ enabled, onClick, label }) => (
    <button
        onClick={onClick}
        disabled={!enabled}
        className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all rounded-sm ${
            enabled
                ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
    >
        {label}
        <ChevronRight size={14} />
    </button>
);

// ─── SUCCESS STATE ───────────────────────────────────────────────

const SuccessState: React.FC<{ data: LeadData }> = ({ data }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
        {/* Checkmark */}
        <div className="text-center mb-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
                <Check className="text-emerald-500" size={28} />
            </motion.div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-2">
                You're All Set
            </h2>
            <p className="font-mono text-sm text-zinc-400">
                Your TaskRig setup for <span className="text-orange-400">{data.businessName || 'your business'}</span> is being configured.
            </p>
            <p className="font-mono text-xs text-zinc-500 mt-2">
                We'll reach out within 24 hours.
            </p>
        </div>

        {/* Summary card */}
        <div className="border border-zinc-800/50 bg-zinc-950/40 rounded-sm overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-zinc-800/50">
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Summary</span>
            </div>
            <div className="p-5 space-y-3 font-mono text-sm">
                {data.businessName && (
                    <div className="flex justify-between"><span className="text-zinc-500">Business</span><span className="text-zinc-300">{data.businessName}</span></div>
                )}
                {data.industries.length > 0 && (
                    <div className="flex justify-between"><span className="text-zinc-500">Industry</span><span className="text-zinc-300">{data.industries.map(id => INDUSTRIES.find(i => i.id === id)?.label || data.customIndustry).join(', ')}</span></div>
                )}
                {data.teamSize && (
                    <div className="flex justify-between"><span className="text-zinc-500">Team Size</span><span className="text-zinc-300">{data.teamSize}</span></div>
                )}
                {data.desiredIntegrations.length > 0 && (
                    <div className="flex justify-between"><span className="text-zinc-500">Integrations</span><span className="text-zinc-300">{data.desiredIntegrations.length} selected</span></div>
                )}
                {data.painPoints.length > 0 && (
                    <div className="flex justify-between"><span className="text-zinc-500">Focus Areas</span><span className="text-zinc-300">{data.painPoints.length} identified</span></div>
                )}
            </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
                href="tel:+18442222486"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-400 text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] no-underline"
            >
                <Phone size={14} />
                Call Now
            </a>
            <a
                href="tel:+18442222486"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-zinc-700 hover:border-orange-500/40 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm no-underline"
            >
                <Calendar size={14} />
                Schedule a Call
            </a>
        </div>

        <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 font-mono text-xs uppercase tracking-widest transition-colors no-underline">
                <ArrowLeft size={14} />
                Back to Home
            </Link>
        </div>
    </motion.div>
);

// ─── PHASE CONTENT COMPONENTS ────────────────────────────────────

const Phase1Content: React.FC<{
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

const Phase2Content: React.FC<{
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

const Phase3Content: React.FC<{
    data: LeadData;
    toggleArrayItem: (field: keyof LeadData, value: string) => void;
}> = ({ data, toggleArrayItem }) => (
    <div className="space-y-6">
        {/* Pain points */}
        <motion.div variants={staggerItem}>
            <label className={labelClass}>
                Challenges <span className="text-orange-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAIN_POINTS.map((pain) => (
                    <ChipButton
                        key={pain.id}
                        selected={data.painPoints.includes(pain.id)}
                        onClick={() => toggleArrayItem('painPoints', pain.id)}
                        icon={pain.icon}
                        label={pain.label}
                    />
                ))}
            </div>
        </motion.div>

        {/* Desired integrations */}
        <motion.div variants={staggerItem}>
            <label className={labelClass}>
                Desired integrations
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTEGRATIONS.map((intg) => (
                    <ChipButton
                        key={intg.id}
                        selected={data.desiredIntegrations.includes(intg.id)}
                        onClick={() => toggleArrayItem('desiredIntegrations', intg.id)}
                        label={intg.label}
                        desc={intg.desc}
                    />
                ))}
            </div>
        </motion.div>
    </div>
);

const Phase4Content: React.FC<{
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
}> = ({ data, update }) => (
    <div className="space-y-5">
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectChips label="Team Size" value={data.teamSize} options={TEAM_SIZES} onChange={(v) => update({ teamSize: v })} required />
            <SelectChips label="Monthly Calls" value={data.monthlyCallVolume} options={CALL_VOLUMES} onChange={(v) => update({ monthlyCallVolume: v })} />
            <SelectChips label="Monthly Leads" value={data.monthlyLeadVolume} options={LEAD_VOLUMES} onChange={(v) => update({ monthlyLeadVolume: v })} />
            <SelectChips label="Operating Hours" value={data.operatingHours} options={HOURS} onChange={(v) => update({ operatingHours: v })} />
        </motion.div>
    </div>
);

const Phase5Content: React.FC<{
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
    emailError: string;
    phoneError: string;
    setEmailError: (v: string) => void;
    setPhoneError: (v: string) => void;
}> = ({ data, update, emailError, phoneError, setEmailError, setPhoneError }) => (
    <div className="space-y-4">
        <motion.div variants={staggerItem}>
            <InputField label="Full Name" value={data.contactName} onChange={(v) => update({ contactName: v })} placeholder="Jane Doe" required />
        </motion.div>
        <motion.div variants={staggerItem}>
            <InputField label="Email Address" value={data.contactEmail} onChange={(v) => { update({ contactEmail: v }); if (emailError) setEmailError(''); }} placeholder="jane@acmehvac.com" type="email" required error={emailError} />
        </motion.div>
        <motion.div variants={staggerItem}>
            <InputField label="Phone Number" value={data.contactPhone} onChange={(v) => { update({ contactPhone: v }); if (phoneError) setPhoneError(''); }} placeholder="+1 (555) 000-0000" type="tel" required error={phoneError} />
        </motion.div>

        <motion.div variants={staggerItem}>
            <label className={labelClass}>Your Role</label>
            <div className="flex flex-wrap gap-2">
                {ROLES.map((role) => (
                    <button
                        key={role}
                        onClick={() => update({ contactRole: role })}
                        className={`px-3 py-1.5 font-mono text-xs ${chipBaseClass} ${
                            data.contactRole === role ? chipSelectedClass : chipUnselectedClass
                        }`}
                    >
                        {role}
                    </button>
                ))}
            </div>
        </motion.div>

        <motion.div variants={staggerItem}>
            <label className={labelClass}>Preferred Contact Method</label>
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'phone', label: 'Phone Call', icon: Phone },
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'text', label: 'Text / SMS', icon: MessageSquare },
                ].map((method) => (
                    <button
                        key={method.id}
                        onClick={() => update({ preferredContactMethod: method.id })}
                        className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs ${chipBaseClass} ${
                            data.preferredContactMethod === method.id ? chipSelectedClass : chipUnselectedClass
                        }`}
                    >
                        <method.icon size={12} />
                        {method.label}
                    </button>
                ))}
            </div>
        </motion.div>

        <motion.div variants={staggerItem}>
            <label className={labelClass}>
                Notes <span className="text-zinc-600">(optional)</span>
            </label>
            <textarea
                value={data.notes}
                onChange={(e) => update({ notes: e.target.value })}
                placeholder="e.g., We're switching from another provider, need help migrating..."
                rows={3}
                className={`${inputClass} resize-none`}
            />
        </motion.div>
    </div>
);

// Google Maps types
declare global {
    interface Window {
        google?: {
            maps: {
                places: {
                    AutocompleteService: new () => {
                        getPlacePredictions: (
                            request: { input: string; types?: string[] },
                            callback: (results: Array<{
                                place_id?: string;
                                description: string;
                                structured_formatting?: { main_text: string; secondary_text: string };
                            }> | null, status: string) => void
                        ) => void;
                    };
                    PlacesService: new (div: HTMLElement) => {
                        getDetails: (
                            request: { placeId: string; fields: string[] },
                            callback: (place: {
                                name?: string;
                                formatted_address?: string;
                                formatted_phone_number?: string;
                                rating?: number;
                                types?: string[];
                            } | null, status: string) => void
                        ) => void;
                    };
                    PlacesServiceStatus: { OK: string };
                };
            };
        };
    }
}
