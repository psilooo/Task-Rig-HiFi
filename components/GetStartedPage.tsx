import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Search, MapPin, Phone, Mail, User, Users, Building2,
    Check, Wrench, Calendar, MessageSquare, CreditCard, BarChart3,
    Bot, Zap, Globe, Shield, Clock, Star, Sparkles,
    FileText, Heart, Truck, Home, Hammer, Briefcase, Stethoscope,
    Car, UtensilsCrossed, Scissors, PaintBucket, TreePine, Cog, ChevronDown,
    Terminal, ChevronRight
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
    { num: 1, code: 'SYS_INIT', title: 'Business Identification', prompt: '> SCANNING BUSINESS RECORDS...' },
    { num: 2, code: 'OPS_CONFIG', title: 'Operations Profile', prompt: '> LOADING INDUSTRY DATABASE...' },
    { num: 3, code: 'SYS_DIAG', title: 'System Diagnostics', prompt: '> RUNNING SYSTEM DIAGNOSTICS...' },
    { num: 4, code: 'SCALE_CAL', title: 'Capacity Parameters', prompt: '> CALIBRATING SCALE PARAMETERS...' },
    { num: 5, code: 'OP_LINK', title: 'Operator Registration', prompt: '> PREPARING SECURE LINK...' },
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

const CURRENT_TOOLS_OPTIONS = [
    'Spreadsheets', 'Google Workspace', 'QuickBooks', 'ServiceTitan',
    'Housecall Pro', 'Jobber', 'None / Manual', 'Other',
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

const DEPLOYMENT_LINES = [
    '> Compiling business profile...',
    '> Initializing AI agent core...',
    '> Loading industry knowledge base...',
    '> Configuring integration endpoints...',
    '> Calibrating response algorithms...',
    '> Running pre-flight diagnostics...',
    '> All systems nominal.',
    '',
    '██████████████████████████████ 100%',
    '',
    'DEPLOYMENT SUCCESSFUL',
];

// ─── HOOKS ────────────────────────────────────────────────────────

function useTypingEffect(text: string, enabled: boolean, speed = 25): { displayText: string; isComplete: boolean } {
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
        transition: { staggerChildren: 0.03 },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

// ─── TERMINAL SUBCOMPONENTS ──────────────────────────────────────

const TerminalTitleBar: React.FC<{ completedPhases: Set<number>; activePhase: number }> = ({ completedPhases, activePhase }) => (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/60 bg-zinc-900/60">
        <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex items-center gap-2">
                <Terminal size={12} className="text-zinc-500" />
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.15em] hidden sm:inline">
                    TASKRIG // SYSTEM DEPLOYMENT
                </span>
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.15em] sm:hidden">
                    SYS DEPLOY
                </span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {/* Mobile: horizontal status dots */}
            <div className="flex lg:hidden items-center gap-1.5">
                {PHASES.map(p => (
                    <div
                        key={p.num}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            completedPhases.has(p.num)
                                ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]'
                                : p.num === activePhase
                                    ? 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.4)] animate-pulse'
                                    : 'bg-zinc-700'
                        }`}
                    />
                ))}
            </div>
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">v2.1.0</span>
        </div>
    </div>
);

const DeploymentPipeline: React.FC<{
    activePhase: number;
    completedPhases: Set<number>;
    onPhaseClick: (phase: number) => void;
}> = ({ activePhase, completedPhases, onPhaseClick }) => (
    <div className="hidden lg:flex flex-col w-48 shrink-0 sticky top-24 self-start">
        <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.2em] mb-4 px-1">
            Deployment Pipeline
        </div>
        <div className="space-y-1">
            {PHASES.map((phase, i) => {
                const isComplete = completedPhases.has(phase.num);
                const isActive = phase.num === activePhase;
                const isAccessible = isComplete || isActive;
                return (
                    <React.Fragment key={phase.num}>
                        <button
                            onClick={() => isAccessible && onPhaseClick(phase.num)}
                            disabled={!isAccessible}
                            className={`w-full text-left px-3 py-2.5 rounded transition-all duration-200 group ${
                                isActive
                                    ? 'bg-orange-500/[0.08] border border-orange-500/30'
                                    : isComplete
                                        ? 'bg-emerald-500/[0.05] border border-emerald-500/20 hover:bg-emerald-500/[0.08] cursor-pointer'
                                        : 'bg-zinc-900/30 border border-zinc-800/30 opacity-40 cursor-not-allowed'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-0.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    isComplete ? 'bg-emerald-500' : isActive ? 'bg-orange-500 animate-pulse' : 'bg-zinc-700'
                                }`} />
                                <span className={`font-mono text-[9px] uppercase tracking-wider ${
                                    isComplete ? 'text-emerald-400' : isActive ? 'text-orange-400' : 'text-zinc-600'
                                }`}>
                                    {phase.code}
                                </span>
                            </div>
                            <div className={`font-mono text-[10px] pl-3.5 ${
                                isComplete ? 'text-zinc-400' : isActive ? 'text-zinc-300' : 'text-zinc-700'
                            }`}>
                                {phase.title}
                            </div>
                        </button>
                        {i < PHASES.length - 1 && (
                            <div className="flex justify-center py-0.5">
                                <div className={`w-px h-3 ${
                                    completedPhases.has(phase.num) ? 'bg-emerald-500/40' : 'bg-zinc-800/40'
                                }`} />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
);

const PhaseStatusBadge: React.FC<{ status: 'pending' | 'active' | 'complete' }> = ({ status }) => {
    const styles = {
        pending: 'text-zinc-500 border-zinc-700',
        active: 'text-orange-400 border-orange-500/40 animate-pulse',
        complete: 'text-emerald-400 border-emerald-500/40',
    };
    const labels = { pending: 'PENDING', active: 'ACTIVE', complete: 'COMPLETE' };
    return (
        <span className={`font-mono text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded ${styles[status]}`}>
            [ {labels[status]} ]
        </span>
    );
};

const TerminalPrompt: React.FC<{ text: string; enabled: boolean; onComplete?: () => void }> = ({ text, enabled, onComplete }) => {
    const { displayText, isComplete } = useTypingEffect(text, enabled);

    useEffect(() => {
        if (isComplete && onComplete) onComplete();
    }, [isComplete, onComplete]);

    if (!enabled) return null;

    return (
        <div className="font-mono text-sm text-emerald-400/80 mb-4 flex items-center">
            <span>{displayText}</span>
            {!isComplete && <span className="ml-0.5 animate-pulse">|</span>}
        </div>
    );
};

const SystemLogMessage: React.FC<{ message: string; delay?: number }> = ({ message, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay }}
        className="font-mono text-[11px] text-zinc-500 flex items-center gap-2 py-0.5"
    >
        <Check size={10} className="text-emerald-500 shrink-0" />
        <span>{message}</span>
    </motion.div>
);

const ScanLineTransition: React.FC<{ active: boolean }> = ({ active }) => (
    <AnimatePresence>
        {active && (
            <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent origin-left my-3"
            />
        )}
    </AnimatePresence>
);

const CollapsedPhaseSummary: React.FC<{
    phase: typeof PHASES[number];
    summary: string;
    onClick: () => void;
}> = ({ phase, summary, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-left px-4 py-3 border-l-2 border-emerald-500/50 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06] transition-all group rounded-r"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
                <PhaseStatusBadge status="complete" />
                <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-wider">{phase.code}</span>
                <span className="font-mono text-[11px] text-zinc-500 truncate hidden sm:inline">// {summary}</span>
            </div>
            <ChevronDown size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
        </div>
    </button>
);

// ─── FORM PRIMITIVES ─────────────────────────────────────────────

const TerminalInputField: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    error?: string;
}> = ({ label, value, onChange, placeholder, type = 'text', required, error }) => (
    <div>
        <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-1.5">
            // {label.toUpperCase().replace(/\s/g, '_')} {required && <span className="text-orange-500/60">*</span>}
        </label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-zinc-600 text-sm pointer-events-none">&gt;</span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-b border-zinc-800 focus:border-orange-500/50 focus:shadow-[0_0_12px_rgba(249,115,22,0.06)] pl-8 pr-4 py-2.5 font-mono text-sm text-white placeholder:text-zinc-700 outline-none transition-all"
            />
        </div>
        {error && <p className="text-red-400 font-mono text-[10px] mt-1">{error}</p>}
    </div>
);

const TerminalChipButton: React.FC<{
    selected: boolean;
    onClick: () => void;
    icon?: React.ElementType;
    label: string;
    desc?: string;
}> = ({ selected, onClick, icon: Icon, label, desc }) => (
    <button
        onClick={onClick}
        className={`group text-left transition-all duration-200 border flex items-center gap-2.5 w-full px-3 py-2 ${
            selected
                ? 'border-orange-500/40 bg-orange-500/[0.06]'
                : 'border-zinc-800/60 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-800/30'
        }`}
    >
        <span className={`font-mono text-[10px] shrink-0 ${selected ? 'text-orange-400' : 'text-zinc-600'}`}>
            {selected ? '>' : ' '}
        </span>
        {Icon && <Icon size={13} className={selected ? 'text-orange-500' : 'text-zinc-600 group-hover:text-zinc-400'} />}
        <div className="flex-1 min-w-0">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${selected ? 'text-orange-400' : 'text-zinc-400'}`}>
                {label}
            </span>
            {desc && <span className="font-mono text-[10px] text-zinc-600 ml-2 hidden sm:inline">{desc}</span>}
        </div>
        <span className={`font-mono text-[10px] shrink-0 ${selected ? 'text-orange-500' : 'text-zinc-700'}`}>
            {selected ? '[x]' : '[ ]'}
        </span>
    </button>
);

const TerminalCheckbox: React.FC<{
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}> = ({ checked, onChange, label }) => (
    <button
        onClick={() => onChange(!checked)}
        className="flex items-start gap-3 group text-left w-full"
    >
        <span className={`font-mono text-sm mt-0.5 shrink-0 ${checked ? 'text-orange-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
            {checked ? '[x]' : '[ ]'}
        </span>
        <span className="text-zinc-500 font-mono text-[11px] leading-relaxed flex-1">
            {label}
        </span>
    </button>
);

const TerminalSelect: React.FC<{
    label: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
    required?: boolean;
    icon?: React.ElementType;
}> = ({ label, value, options, onChange, required, icon: Icon }) => (
    <div>
        <div className="flex items-center gap-2 mb-2">
            {Icon && (
                <div className="w-5 h-5 rounded bg-orange-500/10 flex items-center justify-center">
                    <Icon size={10} className="text-orange-500" />
                </div>
            )}
            <label className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
                // {label.toUpperCase().replace(/\s/g, '_')} {required && <span className="text-orange-500/60">*</span>}
            </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`px-3 py-1.5 font-mono text-[11px] border transition-all duration-200 ${
                        value === opt
                            ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
                            : 'border-zinc-800/60 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                >
                    {value === opt && <span className="mr-1">&gt;</span>}{opt}
                </button>
            ))}
        </div>
    </div>
);

// ─── PHASE CONTENT COMPONENTS ────────────────────────────────────

const PhaseConfirmButton: React.FC<{ enabled: boolean; onClick: () => void; isLast?: boolean }> = ({ enabled, onClick, isLast }) => (
    <button
        onClick={onClick}
        disabled={!enabled}
        className={`group relative mt-6 w-full sm:w-auto px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all overflow-hidden ${
            isLast ? 'clip-path-slant' : ''
        } ${
            enabled
                ? 'bg-orange-500 hover:bg-orange-600 text-black shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        }`}
    >
        {enabled && <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />}
        <span className="relative z-10 flex items-center justify-center gap-2">
            {isLast ? (
                <><ChevronRight size={14} /> DEPLOY SYSTEM</>
            ) : (
                <><Check size={14} /> CONFIRM PHASE</>
            )}
        </span>
    </button>
);

// ─── PHASE SUMMARIES ─────────────────────────────────────────────

function getPhaseSummary(phase: number, data: LeadData): string {
    switch (phase) {
        case 1:
            return data.businessName || 'No business';
        case 2: {
            const names = data.industries.map(id => INDUSTRIES.find(i => i.id === id)?.label).filter(Boolean);
            return names.length > 0 ? names.join(', ') : 'No industry';
        }
        case 3:
            return `${data.painPoints.length} issues, ${data.desiredIntegrations.length} integrations`;
        case 4:
            return data.teamSize ? `Team: ${data.teamSize}` : 'Not configured';
        case 5:
            return data.contactName || 'No contact';
        default:
            return '';
    }
}

function getPhaseLogMessages(phase: number, data: LeadData): string[] {
    switch (phase) {
        case 1:
            return [
                `Business verified${data.businessRating ? ` — ${data.businessRating} stars` : ''}`,
                data.businessAddress ? `Location: ${data.businessAddress.split(',')[0]}` : 'Location pending manual entry',
            ];
        case 2: {
            const names = data.industries.map(id => INDUSTRIES.find(i => i.id === id)?.label).filter(Boolean);
            return [
                `Industry profile loaded: ${names.join(', ')}`,
                data.services.length > 0 ? `${data.services.length} services configured` : 'Service catalog ready',
            ];
        }
        case 3:
            return [
                `${data.painPoints.length} pain points identified`,
                `${data.desiredIntegrations.length} integrations queued`,
            ];
        case 4:
            return [
                `Scale: ${data.teamSize || 'TBD'} operators`,
                data.monthlyCallVolume ? `Volume: ${data.monthlyCallVolume}` : 'Volume calibration complete',
            ];
        case 5:
            return [
                `Operator registered: ${data.contactName}`,
                `Contact channel: ${data.preferredContactMethod}`,
            ];
        default:
            return [];
    }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────

export const GetStartedPage: React.FC = () => {
    // Existing data state
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

    // Terminal phase state
    const [activePhase, setActivePhase] = useState(1);
    const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
    const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]));
    const [phaseTypingComplete, setPhaseTypingComplete] = useState<Record<number, boolean>>({});
    const [phaseHasBeenExpanded, setPhaseHasBeenExpanded] = useState<Set<number>>(new Set([1]));
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentComplete, setDeploymentComplete] = useState(false);
    const [deploymentLogLines, setDeploymentLogLines] = useState<string[]>([]);
    const [showScanLine, setShowScanLine] = useState(false);

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

    // Refs
    const phaseRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const deployLogRef = useRef<HTMLDivElement>(null);

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

        // Mark phase complete, collapse it
        setCompletedPhases(prev => new Set(prev).add(phase));
        setExpandedPhases(prev => {
            const next = new Set(prev);
            next.delete(phase);
            return next;
        });

        // Show scan line
        setShowScanLine(true);
        setTimeout(() => setShowScanLine(false), 500);

        if (phase < 5) {
            const nextPhase = phase + 1;
            setActivePhase(nextPhase);
            setExpandedPhases(prev => new Set(prev).add(nextPhase));
            setPhaseHasBeenExpanded(prev => new Set(prev).add(nextPhase));

            // Scroll to next phase
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

    // ─── DEPLOY ────────────────────────────────────────────────────

    const handleDeploy = () => {
        const payload = {
            ...data,
            submittedAt: new Date().toISOString(),
            source: 'get-started-wizard',
            utmSource: new URLSearchParams(window.location.search).get('utm_source') || '',
            utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || '',
            utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
        };

        console.log('[TaskRig Lead Capture]', JSON.stringify(payload, null, 2));
        setIsDeploying(true);

        // Type deployment lines one by one
        let lineIndex = 0;
        const typeLine = () => {
            if (lineIndex < DEPLOYMENT_LINES.length) {
                setDeploymentLogLines(prev => [...prev, DEPLOYMENT_LINES[lineIndex]]);
                lineIndex++;
                // Scroll to bottom of log
                setTimeout(() => {
                    deployLogRef.current?.scrollTo({ top: deployLogRef.current.scrollHeight, behavior: 'smooth' });
                }, 50);
                setTimeout(typeLine, lineIndex === DEPLOYMENT_LINES.length ? 500 : 300 + Math.random() * 200);
            } else {
                setDeploymentComplete(true);
            }
        };
        setTimeout(typeLine, 500);
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
            <div className="flex-1 relative z-10 pt-16 md:pt-24 pb-8 md:pb-16 px-4 md:px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Back link */}
                    <div className="mb-4">
                        <Link to="/" className="group inline-flex items-center gap-1.5 py-2 text-zinc-400 hover:text-white font-mono text-[10px] md:text-xs uppercase tracking-widest transition-colors no-underline">
                            <ArrowLeft size={12} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                            <span className="hidden sm:inline">Back to Home</span>
                        </Link>
                    </div>

                    {/* Layout: Pipeline + Terminal */}
                    <div className="flex gap-8">
                        {/* Sidebar Pipeline (desktop) */}
                        <DeploymentPipeline
                            activePhase={activePhase}
                            completedPhases={completedPhases}
                            onPhaseClick={(p) => {
                                togglePhaseExpand(p);
                                setTimeout(() => {
                                    phaseRefs.current[p]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 100);
                            }}
                        />

                        {/* Terminal Panel */}
                        <div className="flex-1 max-w-3xl">
                            <div className="border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm rounded-lg shadow-2xl shadow-black/30 overflow-hidden relative">
                                {/* Corner brackets */}
                                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange-500/30 z-10" />
                                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-orange-500/30 z-10" />
                                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-orange-500/30 z-10" />
                                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange-500/30 z-10" />

                                {/* Title Bar */}
                                <TerminalTitleBar completedPhases={completedPhases} activePhase={activePhase} />

                                {/* Terminal Body */}
                                <div className="p-4 sm:p-5 md:p-6 space-y-3">
                                    {/* Phase Sections */}
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
                                                className="scroll-mt-24"
                                            >
                                                {/* Collapsed summary */}
                                                {isComplete && !isExpanded && (
                                                    <>
                                                        <CollapsedPhaseSummary
                                                            phase={phase}
                                                            summary={getPhaseSummary(phase.num, data)}
                                                            onClick={() => togglePhaseExpand(phase.num)}
                                                        />
                                                        {/* Log messages after collapsed phase */}
                                                        <div className="pl-4 py-1 space-y-0.5">
                                                            {getPhaseLogMessages(phase.num, data).map((msg, i) => (
                                                                <SystemLogMessage key={i} message={msg} />
                                                            ))}
                                                        </div>
                                                    </>
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
                                                            <div className="border border-zinc-800/40 bg-zinc-950/30 rounded p-4 sm:p-5">
                                                                {/* Phase header */}
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <PhaseStatusBadge status={isComplete ? 'complete' : 'active'} />
                                                                        <span className="font-mono text-[11px] text-zinc-300 uppercase tracking-wider">{phase.code}</span>
                                                                    </div>
                                                                    {isComplete && (
                                                                        <button
                                                                            onClick={() => togglePhaseExpand(phase.num)}
                                                                            className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors"
                                                                        >
                                                                            Collapse
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {/* Typing prompt — only plays on first expansion */}
                                                                {!hasBeenExpanded || (isActive && !phaseTypingComplete[phase.num]) ? (
                                                                    <TerminalPrompt
                                                                        text={phase.prompt}
                                                                        enabled={true}
                                                                        onComplete={() => setPhaseTypingComplete(prev => ({ ...prev, [phase.num]: true }))}
                                                                    />
                                                                ) : (
                                                                    <div className="font-mono text-sm text-emerald-400/80 mb-4">
                                                                        {phase.prompt}
                                                                    </div>
                                                                )}

                                                                {/* Phase title */}
                                                                <h3 className="font-heading font-bold text-lg sm:text-xl text-white uppercase tracking-tight mb-4">
                                                                    {phase.title}
                                                                </h3>

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

                                                                        {/* Confirm / Deploy button */}
                                                                        {!isComplete && (
                                                                            <motion.div variants={staggerItem}>
                                                                                {phase.num === 5 && allPhasesComplete ? null : (
                                                                                    <PhaseConfirmButton
                                                                                        enabled={canConfirmPhase(phase.num)}
                                                                                        onClick={() => {
                                                                                            if (phase.num === 5) {
                                                                                                confirmPhase(5);
                                                                                            } else {
                                                                                                confirmPhase(phase.num);
                                                                                            }
                                                                                        }}
                                                                                        isLast={phase.num === 5}
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

                                                {/* Scan line between phases */}
                                                {isComplete && !isExpanded && phase.num < 5 && (
                                                    <ScanLineTransition active={showScanLine && phase.num === activePhase - 1} />
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Deploy System button — after all 5 phases confirmed */}
                                    {allPhasesComplete && !isDeploying && !deploymentComplete && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="pt-4"
                                        >
                                            <div className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-6" />

                                            {/* SMS Consent */}
                                            <div className="space-y-3 mb-6">
                                                <TerminalCheckbox
                                                    checked={data.consentMarketing}
                                                    onChange={(v) => update({ consentMarketing: v })}
                                                    label="I consent to receive marketing text messages from TaskRig at the phone number provided. Frequency may vary. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out."
                                                />
                                                <TerminalCheckbox
                                                    checked={data.consentTransactional}
                                                    onChange={(v) => update({ consentTransactional: v })}
                                                    label="I consent to receive non-marketing text messages from TaskRig about my order updates, appointment reminders, etc. Message & data rates may apply. Text HELP for assistance, reply STOP to opt out."
                                                />
                                            </div>

                                            <button
                                                onClick={handleDeploy}
                                                className="group relative w-full px-10 py-4 bg-orange-500 hover:bg-orange-600 text-black font-mono text-sm font-bold uppercase tracking-widest transition-all clip-path-slant shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)] overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                                <span className="relative z-10 flex items-center justify-center gap-3">
                                                    <ChevronRight size={16} />
                                                    DEPLOY SYSTEM
                                                </span>
                                            </button>

                                            <p className="text-center font-mono text-[10px] text-zinc-600/50 leading-relaxed mt-3">
                                                By deploying, you agree to receive SMS updates from TaskRig. Msg &amp; data rates may apply. Reply STOP anytime.{' '}
                                                <Link to="/privacy-policy" className="text-zinc-500/60 hover:text-zinc-400 underline underline-offset-2 transition-colors">
                                                    Privacy Policy
                                                </Link>
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Deployment Log */}
                                    {isDeploying && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="pt-4"
                                        >
                                            <div className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-4" />
                                            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-3">
                                                Deployment Log
                                            </div>
                                            <div
                                                ref={deployLogRef}
                                                className="bg-zinc-950/60 border border-zinc-800/40 rounded p-4 max-h-[300px] overflow-y-auto space-y-1"
                                            >
                                                {deploymentLogLines.map((line, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -8 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className={`font-mono text-xs ${
                                                            line === 'DEPLOYMENT SUCCESSFUL'
                                                                ? 'text-emerald-400 font-bold text-sm mt-2'
                                                                : line.includes('██')
                                                                    ? 'text-orange-400'
                                                                    : line === ''
                                                                        ? 'h-2'
                                                                        : 'text-zinc-500'
                                                        }`}
                                                    >
                                                        {line}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Deployment Complete */}
                                    {deploymentComplete && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
                                            className="pt-6"
                                        >
                                            {/* Success banner */}
                                            <div className="text-center mb-8">
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                                                >
                                                    <Check className="text-emerald-500" size={28} />
                                                </motion.div>
                                                <h2 className="font-heading font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-2">
                                                    System Deployed
                                                </h2>
                                                <p className="font-mono text-sm text-zinc-400">
                                                    Your TaskRig instance for <span className="text-orange-400">{data.businessName || 'your business'}</span> is being configured.
                                                </p>
                                                <p className="font-mono text-xs text-zinc-500 mt-2">
                                                    A deployment specialist will reach out within 24 hours.
                                                </p>
                                            </div>

                                            {/* Summary card */}
                                            <div className="border border-zinc-800/60 bg-zinc-900/30 rounded-lg overflow-hidden mb-6">
                                                <div className="px-5 py-3 border-b border-zinc-800/40 flex items-center gap-2">
                                                    <FileText size={14} className="text-orange-500" />
                                                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-[0.15em]">Deployment Summary</span>
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
                                                    className="group relative w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-mono font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_25px_rgba(249,115,22,0.25)] hover:shadow-[0_0_40px_rgba(249,115,22,0.35)] flex items-center justify-center gap-2 no-underline overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        <Phone size={14} />
                                                        Call Now
                                                    </span>
                                                </a>
                                                <a
                                                    href="tel:+18442222486"
                                                    className="w-full sm:w-auto px-8 py-3.5 border border-zinc-700 hover:border-orange-500/40 text-zinc-300 hover:text-white font-mono font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 no-underline"
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
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

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
            <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-1.5">
                // BUSINESS_SEARCH <span className="text-orange-500/60">*</span>
            </label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isSearching ? (
                        <div className="w-3.5 h-3.5 border-2 border-orange-500/50 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Search size={13} className="text-zinc-600" />
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
                    className="w-full bg-transparent border-b border-zinc-800 focus:border-orange-500/50 focus:shadow-[0_0_12px_rgba(249,115,22,0.06)] pl-9 pr-4 py-2.5 font-mono text-sm text-white placeholder:text-zinc-700 outline-none transition-all"
                />
            </div>

            <AnimatePresence>
                {showPredictions && predictions.length > 0 && !selectedPlace && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full left-0 right-0 mt-1 border border-zinc-700 bg-zinc-900 rounded shadow-xl z-20 overflow-hidden"
                    >
                        {predictions.map((p) => (
                            <button
                                key={p.place_id}
                                onClick={() => selectPlace(p)}
                                className="w-full text-left px-4 py-3 hover:bg-zinc-800/60 transition-colors border-b border-zinc-800/50 last:border-0 flex items-start gap-3"
                            >
                                <MapPin size={13} className="text-orange-500 mt-0.5 shrink-0" />
                                <div>
                                    <div className="font-mono text-sm text-white">{p.structured_formatting.main_text}</div>
                                    <div className="font-mono text-[11px] text-zinc-500 mt-0.5">{p.structured_formatting.secondary_text}</div>
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
                    <div className="p-4 border border-emerald-500/30 bg-emerald-500/[0.04] rounded relative">
                        <button onClick={clearPlace} className="absolute top-3 right-3 text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">Change</button>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-mono text-[9px] text-emerald-500 uppercase tracking-[0.2em]">Business Found</span>
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
                    className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors"
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
                            <div className="space-y-3 pt-3">
                                <TerminalInputField label="Business Name" value={data.businessName} onChange={(v) => update({ businessName: v })} placeholder="Acme HVAC Services" required />
                                <TerminalInputField label="Business Address" value={data.businessAddress} onChange={(v) => update({ businessAddress: v })} placeholder="123 Main St, City, State" />
                                <TerminalInputField label="Business Phone" value={data.businessPhone} onChange={(v) => update({ businessPhone: v })} placeholder="+1 (555) 000-0000" type="tel" />
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
        <div className="space-y-4">
            {/* Industry grid */}
            <motion.div variants={staggerItem}>
                <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-2">
                    // SELECT_INDUSTRY <span className="text-orange-500/60">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
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
                                className={`relative flex items-center gap-2 p-2.5 border transition-all duration-200 ${
                                    isSelected
                                        ? 'border-orange-500/40 bg-orange-500/[0.06]'
                                        : 'border-zinc-800/50 bg-zinc-900/20 hover:border-zinc-700'
                                }`}
                            >
                                <Icon size={14} className={isSelected ? 'text-orange-500' : 'text-zinc-600'} />
                                <span className={`font-mono text-[10px] uppercase tracking-wider ${isSelected ? 'text-orange-400' : 'text-zinc-400'}`}>
                                    {ind.label}
                                </span>
                                {isSelected && (
                                    <span className="absolute top-1 right-1 font-mono text-[8px] text-orange-500">x</span>
                                )}
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
                        <TerminalInputField
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
                        <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-2">
                            // SERVICES <span className="text-zinc-700">(optional)</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {allServices.map((service) => (
                                <button
                                    key={service}
                                    onClick={() => toggleArrayItem('services', service)}
                                    className={`px-2.5 py-1.5 font-mono text-[10px] border transition-all duration-200 ${
                                        data.services.includes(service)
                                            ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
                                            : 'border-zinc-800/50 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                    }`}
                                >
                                    {data.services.includes(service) && '> '}{service}
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
    <div className="space-y-5">
        {/* Pain points */}
        <motion.div variants={staggerItem}>
            <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-2">
                // PAIN_POINTS <span className="text-orange-500/60">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {PAIN_POINTS.map((pain) => (
                    <TerminalChipButton
                        key={pain.id}
                        selected={data.painPoints.includes(pain.id)}
                        onClick={() => toggleArrayItem('painPoints', pain.id)}
                        icon={pain.icon}
                        label={pain.label}
                    />
                ))}
            </div>
        </motion.div>

        {/* Current tools */}
        <motion.div variants={staggerItem}>
            <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-2">
                // CURRENT_TOOLS <span className="text-zinc-700">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
                {CURRENT_TOOLS_OPTIONS.map((tool) => (
                    <button
                        key={tool}
                        onClick={() => toggleArrayItem('currentTools', tool)}
                        className={`px-2.5 py-1.5 font-mono text-[10px] border transition-all duration-200 ${
                            data.currentTools.includes(tool)
                                ? 'border-orange-500/40 bg-orange-500/10 text-orange-400'
                                : 'border-zinc-800/50 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                        }`}
                    >
                        {data.currentTools.includes(tool) && '> '}{tool}
                    </button>
                ))}
            </div>
        </motion.div>

        {/* Desired integrations */}
        <motion.div variants={staggerItem}>
            <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-2">
                // DESIRED_INTEGRATIONS
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {INTEGRATIONS.map((intg) => (
                    <TerminalChipButton
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
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TerminalSelect label="Team Size" value={data.teamSize} options={TEAM_SIZES} onChange={(v) => update({ teamSize: v })} required icon={Users} />
            <TerminalSelect label="Monthly Calls" value={data.monthlyCallVolume} options={CALL_VOLUMES} onChange={(v) => update({ monthlyCallVolume: v })} icon={Phone} />
            <TerminalSelect label="Monthly Leads" value={data.monthlyLeadVolume} options={LEAD_VOLUMES} onChange={(v) => update({ monthlyLeadVolume: v })} icon={BarChart3} />
            <TerminalSelect label="Operating Hours" value={data.operatingHours} options={HOURS} onChange={(v) => update({ operatingHours: v })} icon={Clock} />
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
            <TerminalInputField label="Full Name" value={data.contactName} onChange={(v) => update({ contactName: v })} placeholder="Jane Doe" required />
        </motion.div>
        <motion.div variants={staggerItem}>
            <TerminalInputField label="Email Address" value={data.contactEmail} onChange={(v) => { update({ contactEmail: v }); if (emailError) setEmailError(''); }} placeholder="jane@acmehvac.com" type="email" required error={emailError} />
        </motion.div>
        <motion.div variants={staggerItem}>
            <TerminalInputField label="Phone Number" value={data.contactPhone} onChange={(v) => { update({ contactPhone: v }); if (phoneError) setPhoneError(''); }} placeholder="+1 (555) 000-0000" type="tel" required error={phoneError} />
        </motion.div>

        <motion.div variants={staggerItem}>
            <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-2">// YOUR_ROLE</label>
            <div className="flex flex-wrap gap-1.5">
                {ROLES.map((role) => (
                    <button key={role} onClick={() => update({ contactRole: role })} className={`px-2.5 py-1.5 font-mono text-[10px] border transition-all ${data.contactRole === role ? 'border-orange-500/40 bg-orange-500/10 text-orange-400' : 'border-zinc-800/50 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}>
                        {data.contactRole === role && '> '}{role}
                    </button>
                ))}
            </div>
        </motion.div>

        <motion.div variants={staggerItem}>
            <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-2">// CONTACT_METHOD</label>
            <div className="flex flex-wrap gap-1.5">
                {[
                    { id: 'phone', label: 'Phone Call', icon: Phone },
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'text', label: 'Text / SMS', icon: MessageSquare },
                ].map((method) => (
                    <button key={method.id} onClick={() => update({ preferredContactMethod: method.id })} className={`flex items-center gap-2 px-3 py-2 font-mono text-[10px] border transition-all ${data.preferredContactMethod === method.id ? 'border-orange-500/40 bg-orange-500/10 text-orange-400' : 'border-zinc-800/50 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}>
                        <method.icon size={11} />
                        {data.preferredContactMethod === method.id && '> '}{method.label}
                    </button>
                ))}
            </div>
        </motion.div>

        <motion.div variants={staggerItem}>
            <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-[0.15em] mb-1.5">
                // NOTES <span className="text-zinc-700">(optional)</span>
            </label>
            <div className="relative">
                <span className="absolute left-3 top-3 font-mono text-zinc-600 text-sm pointer-events-none">&gt;</span>
                <textarea
                    value={data.notes}
                    onChange={(e) => update({ notes: e.target.value })}
                    placeholder="e.g., We're switching from another provider, need help migrating..."
                    rows={3}
                    className="w-full bg-transparent border-b border-zinc-800 focus:border-orange-500/50 focus:shadow-[0_0_12px_rgba(249,115,22,0.06)] pl-8 pr-4 py-2.5 font-mono text-sm text-white placeholder:text-zinc-700 outline-none transition-all resize-none"
                />
            </div>
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
