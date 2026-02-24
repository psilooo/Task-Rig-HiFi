import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Search, MapPin, Phone, Mail, User, Users, Building2,
    Check, Wrench, Calendar, MessageSquare, CreditCard, BarChart3,
    Bot, Zap, Globe, Shield, Clock, Send, Star, Sparkles,
    FileText, Heart, Truck, Home, Hammer, Briefcase, Stethoscope,
    Car, UtensilsCrossed, Scissors, PaintBucket, TreePine, Cog, ChevronDown
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

const TOTAL_STEPS = 5;

const STEP_META = [
    { label: 'Business', tag: '/// Identify', icon: Building2 },
    { label: 'Industry', tag: '/// Industry', icon: Briefcase },
    { label: 'Challenges', tag: '/// Challenges', icon: Zap },
    { label: 'Scale', tag: '/// Scale', icon: BarChart3 },
    { label: 'Connect', tag: '/// Get in touch', icon: Send },
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

// ─── ANIMATIONS ───────────────────────────────────────────────────

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 80 : -80,
        opacity: 0,
        filter: 'blur(4px)',
    }),
    center: {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 80 : -80,
        opacity: 0,
        filter: 'blur(4px)',
    }),
};

const springTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    opacity: { duration: 0.3, ease: 'easeOut' },
    filter: { duration: 0.3, ease: 'easeOut' },
};

const staggerChildren = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.04 },
    },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

// ─── SUBCOMPONENTS ────────────────────────────────────────────────

const StepLabel: React.FC<{ tag: string; title: string; subtitle: string }> = ({ tag, title, subtitle }) => (
    <div className="mb-6 md:mb-8">
        {tag && <span className="font-mono text-orange-500 text-[10px] uppercase tracking-[0.2em] mb-2 block">{tag}</span>}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight mb-2 leading-[1.1]">
            {title}
        </h2>
        <p className="font-mono text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-lg">
            {subtitle}
        </p>
    </div>
);

const ChipButton: React.FC<{
    selected: boolean;
    onClick: () => void;
    icon?: React.ElementType;
    label: string;
    desc?: string;
    size?: 'sm' | 'md';
}> = ({ selected, onClick, icon: Icon, label, desc, size = 'md' }) => (
    <button
        onClick={onClick}
        className={`group text-left transition-all duration-200 rounded-md border flex items-center gap-3 w-full ${size === 'sm' ? 'px-3 py-2' : 'px-4 py-3'
            } ${selected
                ? 'border-orange-500/50 bg-orange-500/[0.08] shadow-[0_0_12px_rgba(249,115,22,0.1)]'
                : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/40'
            }`}
    >
        {Icon && (
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-orange-500/15' : 'bg-zinc-800/80 group-hover:bg-zinc-800'
                }`}>
                <Icon size={14} className={selected ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-400'} />
            </div>
        )}
        <div className="flex-1 min-w-0">
            <div className={`font-mono text-xs uppercase tracking-wider ${selected ? 'text-orange-400' : 'text-zinc-300'}`}>
                {label}
            </div>
            {desc && <div className="font-mono text-[10px] text-zinc-600 mt-0.5">{desc}</div>}
        </div>
        <div className="shrink-0 w-4 h-4 flex items-center justify-center">
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center"
                >
                    <Check size={10} className="text-black" />
                </motion.div>
            )}
        </div>
    </button>
);

const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    icon?: React.ElementType;
}> = ({ label, value, onChange, placeholder, type = 'text', required, icon: Icon }) => (
    <div>
        <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em] mb-2">
            {label} {required && <span className="text-orange-500/60">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon size={14} className="text-zinc-600" />
                </div>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-zinc-950/60 border border-zinc-800 focus:border-orange-500/50 focus:shadow-[0_0_12px_rgba(249,115,22,0.08)] py-3 font-mono text-sm text-white placeholder:text-zinc-700 outline-none transition-all rounded-md ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
            />
        </div>
    </div>
);

const InsightCard: React.FC<{ industry: string }> = ({ industry }) => {
    const insights: Record<string, { stat: string; label: string; tip: string }> = {
        'hvac': { stat: '67%', label: 'of HVAC calls go unanswered after hours', tip: 'TaskRig AI answers every call 24/7 — even at 2 AM.' },
        'plumbing': { stat: '43%', label: 'of plumbing leads are lost to slow response', tip: 'Average response time with TaskRig: under 30 seconds.' },
        'electrical': { stat: '52%', label: 'of electricians lose jobs to faster competitors', tip: 'Auto-scheduling puts you first in line, every time.' },
        'roofing': { stat: '71%', label: 'of storm damage calls happen outside business hours', tip: 'Never miss a high-value emergency lead again.' },
        'landscaping': { stat: '38%', label: 'of landscaping inquiries need same-day quotes', tip: 'AI generates instant estimates while you work.' },
        'construction': { stat: '55%', label: 'of contractors say admin is their biggest bottleneck', tip: 'Automate scheduling, invoicing, and follow-ups.' },
        'cleaning': { stat: '60%', label: 'of cleaning companies struggle with no-shows', tip: 'Automated reminders reduce no-shows by 80%.' },
        'healthcare': { stat: '45%', label: 'of patient calls result in voicemail', tip: 'AI handles intake, scheduling, and triage 24/7.' },
        'dental': { stat: '34%', label: 'of dental appointments are missed without reminders', tip: 'Smart reminders via SMS reduce cancellations.' },
        'legal': { stat: '48%', label: 'of legal intake calls go unanswered', tip: 'AI screens and qualifies leads before your team sees them.' },
        'real-estate': { stat: '62%', label: 'of real estate leads expect a response within 5 min', tip: 'Instant AI response captures leads competitors miss.' },
        'auto-repair': { stat: '41%', label: 'of auto repair shops rely solely on phone bookings', tip: 'Multi-channel booking catches every customer.' },
        'pest-control': { stat: '58%', label: 'of pest control leads call during active infestations', tip: 'Instant AI response books the emergency visit before they call a competitor.' },
        'general-contracting': { stat: '46%', label: 'of GCs lose bids due to slow follow-up', tip: 'Automated estimates and scheduling keep you first in line.' },
        'moving': { stat: '64%', label: 'of movers book with the first company that answers', tip: 'AI answers instantly and books the quote — even at midnight.' },
    };

    const data = insights[industry] || { stat: '73%', label: 'of service businesses lose leads to slow response', tip: 'TaskRig responds in under 30 seconds, 24/7.' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 p-4 md:p-5 border border-orange-500/20 bg-orange-500/[0.04] rounded-lg relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
            <div className="flex items-center gap-2 mb-3">
                <Sparkles size={12} className="text-orange-500" />
                <span className="font-mono text-[9px] text-orange-500/80 uppercase tracking-[0.2em]">Industry Insight</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading font-bold text-2xl md:text-3xl text-orange-400">{data.stat}</span>
                <span className="font-mono text-xs text-zinc-400">{data.label}</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-500 mt-2 leading-relaxed">
                {data.tip}
            </p>
        </motion.div>
    );
};

const ValuePreview: React.FC<{ leadData: LeadData }> = ({ leadData }) => {
    const selectedIntegrations = INTEGRATIONS.filter(i => leadData.desiredIntegrations.includes(i.id));
    const selectedPains = PAIN_POINTS.filter(p => leadData.painPoints.includes(p.id));

    if (selectedPains.length === 0 && selectedIntegrations.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 border border-zinc-800/60 bg-zinc-900/30 rounded-lg overflow-hidden"
        >
            <div className="px-4 py-3 border-b border-zinc-800/40 flex items-center gap-2">
                <Bot size={12} className="text-orange-500" />
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.15em]">Your TaskRig Setup Preview</span>
            </div>
            <div className="p-4 space-y-3">
                {selectedPains.length > 0 && (
                    <div>
                        <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.2em] mb-2">Solving For</div>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedPains.map(p => (
                                <span key={p.id} className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-[10px] rounded">
                                    {p.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {selectedIntegrations.length > 0 && (
                    <div>
                        <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.2em] mb-2">Integrations</div>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedIntegrations.map(i => (
                                <span key={i.id} className="px-2 py-1 bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 font-mono text-[10px] rounded">
                                    {i.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────

export const GetStartedPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    // Google Places
    const [searchQuery, setSearchQuery] = useState('');
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

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
    });

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
                // Demo fallback when Google Maps is not loaded
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

    // ─── NAVIGATION ───────────────────────────────────────────────

    const scrollToTop = useCallback(() => {
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }, []);

    const goNext = () => {
        if (step < TOTAL_STEPS) {
            setDirection(1);
            setStep(step + 1);
            scrollToTop();
        }
    };

    const goBack = () => {
        if (step > 1) {
            setDirection(-1);
            setStep(step - 1);
            scrollToTop();
        }
    };

    const handleSubmit = () => {
        const payload = {
            ...data,
            submittedAt: new Date().toISOString(),
            source: 'get-started-wizard',
            utmSource: new URLSearchParams(window.location.search).get('utm_source') || '',
            utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || '',
            utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
        };

        // Ready to POST to API endpoint
        console.log('[TaskRig Lead Capture]', JSON.stringify(payload, null, 2));
        setSubmitted(true);
        scrollToTop();
    };

    const canAdvance = (): boolean => {
        switch (step) {
            case 1: return data.businessName.trim() !== '';
            case 2: return data.industries.length > 0;
            case 3: return data.painPoints.length > 0;
            case 4: return data.teamSize !== '';
            case 5: return data.contactName.trim() !== '' && data.contactEmail.trim() !== '' && data.contactPhone.trim() !== '';
            default: return false;
        }
    };

    // ─── SUBMITTED STATE ──────────────────────────────────────────

    if (submitted) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-clip selection:bg-orange-500/30 flex flex-col">
                <div className="fixed inset-0 pointer-events-none z-0">
                    <DynamicNoise opacity={0.06} />
                </div>
                <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

                <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-14 md:h-20">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center">
                        <Link to="/" className="flex items-center gap-2 md:gap-3 no-underline">
                            <TaskRigLogo className="h-5 md:h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                            <div className="font-heading font-bold text-base md:text-2xl tracking-tight text-white">TASK RIG</div>
                        </Link>
                    </div>
                </nav>

                <div className="flex-1 flex items-center justify-center relative z-10 pt-20 px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center max-w-lg mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                            className="w-20 h-20 mx-auto mb-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                        >
                            <Check className="text-orange-500" size={36} />
                        </motion.div>

                        <h1 className="font-heading font-bold text-3xl md:text-5xl text-white uppercase tracking-tight mb-4">
                            Profile Complete
                        </h1>
                        <p className="font-mono text-sm text-zinc-400 leading-relaxed mb-4">
                            We've built a custom TaskRig deployment profile for <span className="text-orange-400">{data.businessName || 'your business'}</span>.
                        </p>
                        <p className="font-mono text-xs text-zinc-500 leading-relaxed mb-10">
                            A deployment specialist will reach out within 24 hours to walk you through your personalized setup and get you live.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <a
                                href="tel:+18442222486"
                                className="group relative w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-heading font-bold uppercase tracking-widest text-sm transition-all rounded-md shadow-[0_0_25px_rgba(249,115,22,0.25)] hover:shadow-[0_0_40px_rgba(249,115,22,0.35)] flex items-center justify-center gap-2 no-underline overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                <span className="relative z-10 flex items-center gap-2">
                                    <Phone size={16} />
                                    Call Now
                                </span>
                            </a>
                            <button className="w-full sm:w-auto px-8 py-3.5 border border-zinc-700 hover:border-orange-500/40 text-zinc-300 hover:text-white font-heading font-bold uppercase tracking-widest text-sm transition-all rounded-md flex items-center justify-center gap-2">
                                <Calendar size={16} />
                                Schedule a Call
                            </button>
                        </div>

                        <div className="text-left border border-zinc-800/60 bg-zinc-900/30 rounded-lg overflow-hidden">
                            <div className="px-5 py-3 border-b border-zinc-800/40 flex items-center gap-2">
                                <FileText size={12} className="text-orange-500" />
                                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.15em]">Your Deployment Summary</span>
                            </div>
                            <div className="p-5 space-y-3 font-mono text-xs">
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

                        <div className="mt-10">
                            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 font-mono text-xs uppercase tracking-widest transition-colors no-underline">
                                <ArrowLeft size={14} />
                                Back to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // ─── WIZARD ───────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-clip selection:bg-orange-500/30 flex flex-col">
            <div className="fixed inset-0 pointer-events-none z-0">
                <DynamicNoise opacity={0.06} />
            </div>
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-orange-600/[0.03] blur-[120px] rounded-full pointer-events-none z-0"></div>

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
            <div className="flex-1 relative z-10 pt-18 md:pt-24 pb-8 md:pb-16 px-4 md:px-6">
                <div className="w-full max-w-3xl mx-auto mb-2 md:mb-4">
                    <Link to="/" className="group inline-flex items-center gap-1.5 md:gap-2 py-2 text-zinc-400 hover:text-white font-mono text-[10px] md:text-xs uppercase tracking-widest transition-colors no-underline">
                        <ArrowLeft size={12} className="text-zinc-500 group-hover:text-orange-500 transition-colors md:[&]:w-[14px] md:[&]:h-[14px]" />
                        <span className="hidden sm:inline">Back to Home</span>
                    </Link>
                </div>
                <div className="w-full max-w-3xl mx-auto">

                    {/* Progress Bar */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex items-center justify-between mb-3">
                            {STEP_META.map((s, i) => {
                                const stepNum = i + 1;
                                const isActive = stepNum === step;
                                const isComplete = stepNum < step;
                                const StepIcon = s.icon;
                                return (
                                    <React.Fragment key={i}>
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <div className={`w-6 h-6 md:w-7 md:h-7 rounded-md flex items-center justify-center transition-all duration-300 ${isActive
                                                ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                                                : isComplete
                                                    ? 'bg-orange-500/20 border border-orange-500/30'
                                                    : 'bg-zinc-900 border border-zinc-800'
                                                }`}>
                                                {isComplete ? (
                                                    <Check size={12} className="text-orange-500" />
                                                ) : (
                                                    <StepIcon size={12} className={isActive ? 'text-black' : 'text-zinc-600'} />
                                                )}
                                            </div>
                                            <span className={`hidden md:block font-mono text-[10px] uppercase tracking-wider transition-colors ${isActive ? 'text-orange-400' : isComplete ? 'text-zinc-500' : 'text-zinc-700'
                                                }`}>
                                                {s.label}
                                            </span>
                                        </div>
                                        {i < STEP_META.length - 1 && (
                                            <div className={`w-4 md:w-8 lg:w-12 h-px mx-1 md:mx-2 transition-colors ${stepNum < step ? 'bg-orange-500/40' : 'bg-zinc-800'
                                                }`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                        <div className="h-[2px] bg-zinc-800 relative overflow-hidden rounded-full">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                                initial={false}
                                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                                Step {step} of {TOTAL_STEPS}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
                                {STEP_META[step - 1].label}
                            </span>
                        </div>
                    </div>

                    {/* Step Content Container */}
                    <div className="relative border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm rounded-lg shadow-2xl shadow-black/30 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange-500/30" />
                        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange-500/30" />

                        <div className="p-5 sm:p-6 md:p-8 lg:p-10 min-h-[450px] md:min-h-[500px] flex flex-col">
                            <AnimatePresence mode="wait" custom={direction}>
                                {/* STEP 1: Business Lookup */}
                                {step === 1 && (
                                    <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="flex-1 flex flex-col">
                                        <StepLabel tag={STEP_META[0].tag} title="Find Your Business" subtitle="Search for your business to auto-fill your details, or enter manually." />

                                        <div ref={searchRef} className="relative mb-6">
                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em] mb-2">
                                                Business Name <span className="text-orange-500/60">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    {isSearching ? (
                                                        <div className="w-4 h-4 border-2 border-orange-500/50 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Search size={14} className="text-zinc-600" />
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={selectedPlace ? data.businessName : searchQuery}
                                                    onChange={(e) => {
                                                        if (selectedPlace) {
                                                            clearPlace();
                                                            setSearchQuery(e.target.value);
                                                        } else {
                                                            handleSearchInput(e.target.value);
                                                        }
                                                    }}
                                                    onFocus={() => !selectedPlace && setShowPredictions(true)}
                                                    placeholder="Search for your business..."
                                                    className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-orange-500/50 focus:shadow-[0_0_12px_rgba(249,115,22,0.08)] pl-10 pr-4 py-3 font-mono text-sm text-white placeholder:text-zinc-700 outline-none transition-all rounded-md"
                                                />
                                            </div>

                                            <AnimatePresence>
                                                {showPredictions && predictions.length > 0 && !selectedPlace && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        className="absolute top-full left-0 right-0 mt-1 border border-zinc-700 bg-zinc-900 rounded-md shadow-xl z-20 overflow-hidden"
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
                                                                    <div className="font-mono text-[11px] text-zinc-500 mt-0.5">{p.structured_formatting.secondary_text}</div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <AnimatePresence>
                                            {selectedPlace && (
                                                <motion.div initial={{ opacity: 0, y: 8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} className="mb-6 overflow-hidden">
                                                    <div className="p-4 border border-orange-500/30 bg-orange-500/[0.04] rounded-lg relative">
                                                        <button onClick={clearPlace} className="absolute top-3 right-3 text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">Change</button>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                            <span className="font-mono text-[9px] text-emerald-500 uppercase tracking-[0.2em]">Business Found</span>
                                                        </div>
                                                        <div className="font-heading font-bold text-lg text-white uppercase tracking-wide mb-1">{selectedPlace.name}</div>
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
                                                                    <Star key={i} size={12} className={i < Math.round(selectedPlace.rating!) ? 'text-orange-500 fill-orange-500' : 'text-zinc-700'} />
                                                                ))}
                                                                <span className="font-mono text-xs text-zinc-400 ml-1">{selectedPlace.rating}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {!selectedPlace && (
                                            <div>
                                                <button
                                                    onClick={() => setShowManualEntry(!showManualEntry)}
                                                    className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors mt-2"
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
                                                                <InputField label="Business Name" value={data.businessName} onChange={(v) => update({ businessName: v })} placeholder="Acme HVAC Services" required icon={Building2} />
                                                                <InputField label="Business Address" value={data.businessAddress} onChange={(v) => update({ businessAddress: v })} placeholder="123 Main St, City, State" icon={MapPin} />
                                                                <InputField label="Business Phone" value={data.businessPhone} onChange={(v) => update({ businessPhone: v })} placeholder="+1 (555) 000-0000" type="tel" icon={Phone} />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* STEP 2: Industry & Services */}
                                {step === 2 && (
                                    <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="flex-1 flex flex-col">
                                        <StepLabel tag={STEP_META[1].tag} title="What's your industry?" subtitle="This helps us customize your AI agent's knowledge base and integrations." />

                                        <motion.div variants={staggerChildren} initial="hidden" animate="show" className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-6">
                                            {INDUSTRIES.map((ind) => {
                                                const Icon = ind.icon;
                                                const isSelected = data.industries.includes(ind.id);
                                                return (
                                                    <motion.button
                                                        key={ind.id}
                                                        variants={fadeInUp}
                                                        onClick={() => {
                                                            const current = data.industries;
                                                            if (current.includes(ind.id)) {
                                                                update({ industries: current.filter(id => id !== ind.id) });
                                                            } else {
                                                                update({ industries: [...current, ind.id] });
                                                            }
                                                        }}
                                                        className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 aspect-square ${isSelected
                                                            ? 'border-orange-500/50 bg-orange-500/[0.08] shadow-[0_0_12px_rgba(249,115,22,0.1)]'
                                                            : 'border-zinc-800/60 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-800/40'
                                                            }`}
                                                    >
                                                        <Icon size={20} className={`transition-colors ${isSelected ? 'text-orange-500' : 'text-zinc-500'}`} />
                                                        <span className={`font-mono text-[10px] uppercase tracking-wider text-center leading-tight ${isSelected ? 'text-orange-400' : 'text-zinc-400'}`}>
                                                            {ind.label}
                                                        </span>
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center"
                                                            >
                                                                <Check size={8} className="text-black" />
                                                            </motion.div>
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </motion.div>

                                        <AnimatePresence
                                            onExitComplete={() => { document.documentElement.style.overflowAnchor = ''; }}
                                        >
                                            {data.industries.includes('other') && (
                                                <motion.div
                                                    key="other-industry"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                    className="overflow-hidden"
                                                    onAnimationStart={() => { document.documentElement.style.overflowAnchor = 'none'; }}
                                                    onAnimationComplete={() => { document.documentElement.style.overflowAnchor = ''; }}
                                                >
                                                    <div className="pt-2 pb-6">
                                                        <InputField label="Your Industry" value={data.customIndustry} onChange={(v) => update({ customIndustry: v })} placeholder="e.g., Pool Cleaning, Window Tinting..." required />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            {(() => {
                                                const nonOtherIndustries = data.industries.filter(id => id !== 'other');
                                                const allServices = [...new Set(nonOtherIndustries.flatMap(id => INDUSTRY_SERVICES[id] || []))];
                                                if (allServices.length === 0) return null;
                                                return (
                                                    <motion.div
                                                        key="services"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pt-2 pb-2">
                                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em] mb-3">
                                                                Services You Offer <span className="text-zinc-700">(optional)</span>
                                                            </label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {allServices.map((service) => (
                                                                    <button
                                                                        key={service}
                                                                        onClick={() => toggleArrayItem('services', service)}
                                                                        className={`px-3 py-1.5 font-mono text-[11px] border transition-all duration-200 rounded-md ${data.services.includes(service)
                                                                            ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                                                                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                                                            }`}
                                                                    >
                                                                        {service}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })()}
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            {(() => {
                                                const firstInsightIndustry = data.industries.find(id => id !== 'other');
                                                if (!firstInsightIndustry) return null;
                                                return (
                                                    <motion.div
                                                        key="insight-wrap"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <InsightCard key={firstInsightIndustry} industry={firstInsightIndustry} />
                                                    </motion.div>
                                                );
                                            })()}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                {/* STEP 3: Pain Points & Integrations */}
                                {step === 3 && (
                                    <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="flex-1 flex flex-col">
                                        <StepLabel tag={STEP_META[2].tag} title="What are your biggest challenges?" subtitle="Select all that apply — we'll show you exactly how TaskRig solves each one." />

                                        <motion.div variants={staggerChildren} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {PAIN_POINTS.map((pain) => (
                                                <motion.div key={pain.id} variants={fadeInUp}>
                                                    <ChipButton selected={data.painPoints.includes(pain.id)} onClick={() => toggleArrayItem('painPoints', pain.id)} icon={pain.icon} label={pain.label} />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                )}

                                {/* STEP 4: Team & Scale */}
                                {step === 4 && (
                                    <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="flex-1 flex flex-col">
                                        <StepLabel tag={STEP_META[3].tag} title="How big is your operation?" subtitle="This helps us size your deployment and recommend the right plan." />

                                        <motion.div variants={staggerChildren} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Team Size */}
                                            <motion.div variants={fadeInUp} className="p-4 border border-zinc-800/60 bg-zinc-900/20 rounded-lg">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-6 h-6 rounded bg-orange-500/10 flex items-center justify-center">
                                                        <Users size={12} className="text-orange-500" />
                                                    </div>
                                                    <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.15em]">
                                                        Team Size <span className="text-orange-500/60">*</span>
                                                    </label>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {TEAM_SIZES.map((size) => (
                                                        <button
                                                            key={size}
                                                            onClick={() => update({ teamSize: size })}
                                                            className={`px-3 py-2 font-mono text-[11px] uppercase tracking-wider border transition-all duration-200 rounded-md ${data.teamSize === size
                                                                ? 'border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.08)]'
                                                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                                                }`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            {/* Call Volume */}
                                            <motion.div variants={fadeInUp} className="p-4 border border-zinc-800/60 bg-zinc-900/20 rounded-lg">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-6 h-6 rounded bg-orange-500/10 flex items-center justify-center">
                                                        <Phone size={12} className="text-orange-500" />
                                                    </div>
                                                    <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.15em]">
                                                        Monthly Calls / Inquiries
                                                    </label>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {CALL_VOLUMES.map((vol) => (
                                                        <button
                                                            key={vol}
                                                            onClick={() => update({ monthlyCallVolume: vol })}
                                                            className={`px-3 py-2 font-mono text-[11px] border transition-all duration-200 rounded-md ${data.monthlyCallVolume === vol
                                                                ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                                                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                                                }`}
                                                        >
                                                            {vol}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            {/* Lead Volume */}
                                            <motion.div variants={fadeInUp} className="p-4 border border-zinc-800/60 bg-zinc-900/20 rounded-lg">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-6 h-6 rounded bg-orange-500/10 flex items-center justify-center">
                                                        <BarChart3 size={12} className="text-orange-500" />
                                                    </div>
                                                    <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.15em]">
                                                        Monthly New Leads
                                                    </label>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {LEAD_VOLUMES.map((vol) => (
                                                        <button
                                                            key={vol}
                                                            onClick={() => update({ monthlyLeadVolume: vol })}
                                                            className={`px-3 py-2 font-mono text-[11px] border transition-all duration-200 rounded-md ${data.monthlyLeadVolume === vol
                                                                ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                                                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                                                }`}
                                                        >
                                                            {vol}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            {/* Operating Hours */}
                                            <motion.div variants={fadeInUp} className="p-4 border border-zinc-800/60 bg-zinc-900/20 rounded-lg">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-6 h-6 rounded bg-orange-500/10 flex items-center justify-center">
                                                        <Clock size={12} className="text-orange-500" />
                                                    </div>
                                                    <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.15em]">
                                                        Operating Hours
                                                    </label>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {HOURS.map((hr) => (
                                                        <button
                                                            key={hr}
                                                            onClick={() => update({ operatingHours: hr })}
                                                            className={`px-3 py-2 font-mono text-[11px] border transition-all duration-200 rounded-md ${data.operatingHours === hr
                                                                ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                                                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                                                }`}
                                                        >
                                                            {hr}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </motion.div>

                                        <AnimatePresence>
                                            {data.teamSize && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 p-4 border border-zinc-800/60 bg-zinc-900/30 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Bot size={12} className="text-orange-500" />
                                                            <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-[0.2em]">Recommended Config</span>
                                                        </div>
                                                        <p className="font-mono text-xs text-zinc-400 leading-relaxed">
                                                            {data.teamSize === 'Solo' || data.teamSize === '2-5'
                                                                ? 'For teams your size, most operators start with 1 AI Agent covering calls, SMS, and email. Average setup time: 15 minutes.'
                                                                : data.teamSize === '6-15'
                                                                    ? 'Teams of 6-15 typically deploy 2-3 AI Agents with CRM sync and calendar integration. We\'ll configure smart routing to your team.'
                                                                    : 'Enterprise-scale deployments get dedicated AI Agents per department with custom training. Your specialist will design the optimal architecture.'}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                {/* STEP 5: Contact Info */}
                                {step === 5 && (
                                    <motion.div key="step5" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={springTransition} className="flex-1 flex flex-col">
                                        <StepLabel tag={STEP_META[4].tag} title="Connect With Us" subtitle="We'll build your custom TaskRig deployment and reach out within 24 hours." />

                                        <div className="space-y-4">
                                            <InputField label="Full Name" value={data.contactName} onChange={(v) => update({ contactName: v })} placeholder="Jane Doe" required icon={User} />
                                            <InputField label="Email Address" value={data.contactEmail} onChange={(v) => update({ contactEmail: v })} placeholder="jane@acmehvac.com" type="email" required icon={Mail} />
                                            <InputField label="Phone Number" value={data.contactPhone} onChange={(v) => update({ contactPhone: v })} placeholder="+1 (555) 000-0000" type="tel" required icon={Phone} />

                                            <div>
                                                <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em] mb-3">Your Role</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {ROLES.map((role) => (
                                                        <button key={role} onClick={() => update({ contactRole: role })} className={`px-3 py-1.5 font-mono text-[11px] border transition-all rounded-md ${data.contactRole === role ? 'border-orange-500/50 bg-orange-500/10 text-orange-400' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}>
                                                            {role}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em] mb-3">Preferred Contact Method</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        { id: 'phone', label: 'Phone Call', icon: Phone },
                                                        { id: 'email', label: 'Email', icon: Mail },
                                                        { id: 'text', label: 'Text / SMS', icon: MessageSquare },
                                                    ].map((method) => (
                                                        <button key={method.id} onClick={() => update({ preferredContactMethod: method.id })} className={`flex items-center gap-2 px-3 py-2 font-mono text-[11px] border transition-all rounded-md ${data.preferredContactMethod === method.id ? 'border-orange-500/50 bg-orange-500/10 text-orange-400' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}>
                                                            <method.icon size={12} />
                                                            {method.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-[0.15em] mb-2">
                                                    Anything else we should know? <span className="text-zinc-700">(optional)</span>
                                                </label>
                                                <textarea
                                                    value={data.notes}
                                                    onChange={(e) => update({ notes: e.target.value })}
                                                    placeholder="e.g., We're switching from another provider, need help migrating..."
                                                    rows={3}
                                                    className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-orange-500/50 focus:shadow-[0_0_12px_rgba(249,115,22,0.08)] px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-700 outline-none transition-all rounded-md resize-none"
                                                />
                                            </div>
                                        </div>

                                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 p-4 border border-zinc-800/60 bg-zinc-900/30 rounded-lg">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Shield size={12} className="text-orange-500" />
                                                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-[0.2em]">What Happens Next</span>
                                            </div>
                                            <div className="space-y-2">
                                                {[
                                                    'A deployment specialist reviews your profile',
                                                    'You get a personalized demo tailored to your business',
                                                    'We build and launch your AI workforce — setup takes ~15 min',
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2.5 font-mono text-xs text-zinc-400">
                                                        <div className="w-5 h-5 rounded bg-orange-500/10 flex items-center justify-center shrink-0">
                                                            <span className="text-orange-500 text-[10px] font-bold">{i + 1}</span>
                                                        </div>
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>

                        {/* SMS Consent Checkboxes */}
                        {step === TOTAL_STEPS && (
                            <div className="space-y-4 pt-6 border-t border-zinc-800/30">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="mt-0.5 relative flex items-center justify-center w-4 h-4 rounded border border-zinc-700 bg-zinc-900 group-hover:border-orange-500/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={data.consentMarketing}
                                            onChange={(e) => update({ consentMarketing: e.target.checked })}
                                            className="absolute opacity-0 w-full h-full cursor-pointer"
                                        />
                                        {data.consentMarketing && <Check size={12} className="text-orange-500" />}
                                    </div>
                                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed flex-1 text-left">
                                        I consent to receive marketing text messages from TaskRig at the phone number provided. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.
                                    </span>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="mt-0.5 relative flex items-center justify-center w-4 h-4 rounded border border-zinc-700 bg-zinc-900 group-hover:border-orange-500/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={data.consentTransactional}
                                            onChange={(e) => update({ consentTransactional: e.target.checked })}
                                            className="absolute opacity-0 w-full h-full cursor-pointer"
                                        />
                                        {data.consentTransactional && <Check size={12} className="text-orange-500" />}
                                    </div>
                                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed flex-1 text-left">
                                        I consent to receive non-marketing text messages from TaskRig about my order updates, appointment reminders, etc. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out.
                                    </span>
                                </label>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800/30">
                            <button
                                onClick={goBack}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-3 md:px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all rounded-md ${step === 1 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                                    }`}
                            >
                                <ArrowLeft size={14} />
                                <span className="hidden sm:inline">Back</span>
                            </button>

                            {step < TOTAL_STEPS ? (
                                <button
                                    onClick={goNext}
                                    disabled={!canAdvance()}
                                    className={`group relative flex items-center gap-2 px-6 md:px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-md overflow-hidden ${canAdvance()
                                        ? 'bg-orange-500 hover:bg-orange-600 text-black shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]'
                                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                        }`}
                                >
                                    {canAdvance() && <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />}
                                    <span className="relative z-10">Continue</span>
                                    <ArrowRight size={14} className="relative z-10" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canAdvance()}
                                    className={`group relative flex items-center gap-2 px-6 md:px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-md overflow-hidden ${canAdvance()
                                        ? 'bg-orange-500 hover:bg-orange-600 text-black shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]'
                                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                        }`}
                                >
                                    {canAdvance() && <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />}
                                    <Send size={14} className="relative z-10" />
                                    <span className="relative z-10">Get My Custom Plan</span>
                                </button>
                            )}
                        </div>

                        {/* Fine print - only on last step */}
                        {step === TOTAL_STEPS && (
                            <p className="text-center font-mono text-[10px] text-zinc-600/50 leading-relaxed mt-4 px-2">
                                By submitting, you agree to receive SMS updates from TaskRig. Msg &amp; data rates may apply. Reply STOP anytime.{' '}
                                <Link to="/privacy-policy" className="text-zinc-500/60 hover:text-zinc-400 underline underline-offset-2 transition-colors">
                                    Privacy Policy
                                </Link>
                            </p>
                        )}
                    </div>
                </div>

                {/* Step dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className={`rounded-full transition-all duration-300 ${s === step ? 'w-6 h-1.5 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]'
                            : s < step ? 'w-3 h-1.5 bg-orange-500/40'
                                : 'w-3 h-1.5 bg-zinc-800'
                            }`} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

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
