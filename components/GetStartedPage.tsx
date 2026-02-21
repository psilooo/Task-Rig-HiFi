import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Bot, Headphones, TrendingDown, Building2, Users, Send, Check } from 'lucide-react';
import { TaskRigLogo } from './ui/TaskRigLogo';
import { DynamicNoise } from './DynamicNoise';

const TOTAL_STEPS = 3;

const useCases = [
    { id: 'automate-support', label: 'Automate Support', desc: 'Deploy AI agents to handle inbound calls, SMS, and email 24/7.', icon: Headphones },
    { id: 'scale-operations', label: 'Scale Operations', desc: 'Optimize dispatch, scheduling, and field service logistics.', icon: Bot },
    { id: 'reduce-costs', label: 'Reduce Costs', desc: 'Cut overhead by replacing manual processes with intelligent automation.', icon: TrendingDown },
];

const teamSizes = ['1-5', '6-20', '21-50', '51-200', '200+'];

const industries = [
    'Home Services', 'Healthcare', 'Real Estate', 'Logistics',
    'Professional Services', 'Retail', 'Construction', 'Other',
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 60 : -60,
        opacity: 0,
        filter: 'blur(2px)',
    }),
    center: {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 60 : -60,
        opacity: 0,
        filter: 'blur(2px)',
    }),
};

const springTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    opacity: { duration: 0.25, ease: 'easeOut' },
    filter: { duration: 0.25, ease: 'easeOut' },
};

export const GetStartedPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    // Form state
    const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState('');
    const [teamSize, setTeamSize] = useState<string | null>(null);
    const [industry, setIndustry] = useState<string | null>(null);
    const [customIndustry, setCustomIndustry] = useState('');
    const [contactName, setContactName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const goNext = () => {
        if (step < TOTAL_STEPS) {
            setDirection(1);
            setStep(step + 1);
        }
    };

    const goBack = () => {
        if (step > 1) {
            setDirection(-1);
            setStep(step - 1);
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const canAdvance = () => {
        if (step === 1) return selectedUseCase !== null;
        if (step === 2) return companyName.trim() !== '' && teamSize !== null && industry !== null && (industry !== 'Other' || customIndustry.trim() !== '');
        if (step === 3) return contactName.trim() !== '' && email.trim() !== '';
        return false;
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-hidden selection:bg-orange-500/30 flex flex-col">
                <div className="fixed inset-0 pointer-events-none z-0">
                    <DynamicNoise opacity={0.06} />
                </div>
                <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

                {/* Nav */}
                <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-20">
                    <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-3 no-underline">
                            <TaskRigLogo className="h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                            <div className="font-heading font-bold text-2xl tracking-tight text-white">TASK RIG</div>
                        </Link>
                    </div>
                </nav>

                <div className="flex-1 flex items-center justify-center relative z-10 pt-20">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center max-w-lg mx-auto px-6"
                    >
                        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                            <Check className="text-orange-500" size={36} />
                        </div>
                        <h1 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase tracking-tight mb-4">
                            Request Received
                        </h1>
                        <p className="font-mono text-sm text-zinc-400 leading-relaxed mb-8">
                            Our team will review your information and reach out within 24 hours to schedule your personalized demo.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-orange-500/50 text-zinc-300 hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-all no-underline"
                        >
                            <ArrowLeft size={14} />
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-hidden selection:bg-orange-500/30 flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <DynamicNoise opacity={0.06} />
            </div>
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

            {/* Ambient glow */}
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-600/[0.03] blur-[120px] rounded-full pointer-events-none z-0"></div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 no-underline">
                        <TaskRigLogo className="h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                        <div className="font-heading font-bold text-2xl tracking-tight text-white">TASK RIG</div>
                    </Link>
                    <Link to="/" className="group flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors no-underline">
                        <ArrowLeft size={14} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                        Back
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center relative z-10 pt-28 pb-16 px-6">
                <div className="w-full max-w-2xl mx-auto">

                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                                Step {step} of {TOTAL_STEPS}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                                {step === 1 && 'Use Case'}
                                {step === 2 && 'Company Info'}
                                {step === 3 && 'Contact Details'}
                            </span>
                        </div>
                        <div className="h-[2px] bg-zinc-800 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-orange-500"
                                initial={false}
                                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm rounded-sm p-8 md:p-10 shadow-2xl min-h-[400px] flex flex-col">
                        <AnimatePresence mode="wait" custom={direction}>
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={springTransition}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="mb-6">
                                        <span className="font-mono text-orange-500 text-xs uppercase tracking-widest mb-2 block">/// Initialize</span>
                                        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
                                            What brings you here?
                                        </h2>
                                        <p className="font-mono text-sm text-zinc-400">
                                            Select the primary use case for your deployment.
                                        </p>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        {useCases.map((uc) => {
                                            const isSelected = selectedUseCase === uc.id;
                                            return (
                                                <button
                                                    key={uc.id}
                                                    onClick={() => setSelectedUseCase(uc.id)}
                                                    className={`w-full text-left px-5 py-4 border transition-all group flex items-center gap-4 rounded-sm ${
                                                        isSelected
                                                            ? 'border-orange-500/50 bg-orange-500/[0.06]'
                                                            : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/50'
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 border transition-colors ${
                                                        isSelected
                                                            ? 'border-orange-500/50 bg-orange-500/10'
                                                            : 'border-zinc-800 bg-zinc-950 group-hover:border-zinc-700'
                                                    }`}>
                                                        <uc.icon size={20} className={isSelected ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-400'} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`font-heading font-bold text-lg uppercase tracking-wide mb-0.5 ${
                                                            isSelected ? 'text-white' : 'text-zinc-300'
                                                        }`}>
                                                            {uc.label}
                                                        </div>
                                                        <div className="font-mono text-xs text-zinc-500 leading-relaxed">
                                                            {uc.desc}
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0 w-5 flex items-center justify-center">
                                                        {isSelected && (
                                                            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                                                <Check size={12} className="text-black" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={springTransition}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="mb-6">
                                        <span className="font-mono text-orange-500 text-xs uppercase tracking-widest mb-2 block">/// Configure</span>
                                        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
                                            Tell us about your team
                                        </h2>
                                        <p className="font-mono text-sm text-zinc-400">
                                            Help us tailor the deployment to your organization.
                                        </p>
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        {/* Company Name */}
                                        <div>
                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                placeholder="Acme Corp"
                                                className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-orange-500/50 px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-colors rounded-sm"
                                            />
                                        </div>

                                        {/* Team Size */}
                                        <div>
                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                                                Team Size
                                            </label>
                                            <div className="flex flex-wrap gap-2.5">
                                                {teamSizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setTeamSize(size)}
                                                        className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-all rounded-sm ${
                                                            teamSize === size
                                                                ? 'border-orange-500/50 bg-orange-500/10 text-orange-500'
                                                                : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Industry */}
                                        <div className="mb-6">
                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                                                Industry
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {industries.map((ind) => (
                                                    <button
                                                        key={ind}
                                                        onClick={() => {
                                                            setIndustry(ind);
                                                            if (ind !== 'Other') setCustomIndustry('');
                                                        }}
                                                        className={`px-3.5 py-2 font-mono text-[11px] border transition-all rounded-sm ${
                                                            industry === ind
                                                                ? 'border-orange-500/50 bg-orange-500/10 text-orange-500'
                                                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                                        }`}
                                                    >
                                                        {ind}
                                                    </button>
                                                ))}
                                            </div>
                                            <AnimatePresence>
                                                {industry === 'Other' && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ type: 'spring', stiffness: 300, damping: 30, opacity: { duration: 0.2 } }}
                                                        className="overflow-hidden"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={customIndustry}
                                                            onChange={(e) => setCustomIndustry(e.target.value)}
                                                            placeholder="Enter your industry"
                                                            autoFocus
                                                            className="mt-3 w-full bg-zinc-950/60 border border-zinc-800 focus:border-orange-500/50 px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-colors rounded-sm"
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={springTransition}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="mb-6">
                                        <span className="font-mono text-orange-500 text-xs uppercase tracking-widest mb-2 block">/// Connect</span>
                                        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white uppercase tracking-tight mb-2">
                                            How can we reach you?
                                        </h2>
                                        <p className="font-mono text-sm text-zinc-400">
                                            We'll use this to schedule your personalized demo.
                                        </p>
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        {/* Full Name */}
                                        <div>
                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={contactName}
                                                onChange={(e) => setContactName(e.target.value)}
                                                placeholder="Jane Doe"
                                                className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-orange-500/50 px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-colors rounded-sm"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="jane@acmecorp.com"
                                                className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-orange-500/50 px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-colors rounded-sm"
                                            />
                                        </div>

                                        {/* Phone (optional) */}
                                        <div>
                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                                                Phone <span className="text-zinc-700">(Optional)</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-orange-500/50 px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-colors rounded-sm"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-auto pt-8 border-t border-zinc-800/50">
                            <button
                                onClick={goBack}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all ${
                                    step === 1
                                        ? 'text-zinc-700 cursor-not-allowed'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                <ArrowLeft size={14} />
                                Back
                            </button>

                            {step < TOTAL_STEPS ? (
                                <button
                                    onClick={goNext}
                                    disabled={!canAdvance()}
                                    className={`flex items-center gap-2 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${
                                        canAdvance()
                                            ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-lg hover:shadow-orange-500/20'
                                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                    }`}
                                >
                                    Continue
                                    <ArrowRight size={14} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canAdvance()}
                                    className={`flex items-center gap-2 px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${
                                        canAdvance()
                                            ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-lg hover:shadow-orange-500/20'
                                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                    }`}
                                >
                                    <Send size={14} />
                                    Request Demo
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex items-center justify-center gap-2.5 mt-8">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1 rounded-full transition-all duration-300 ${
                                    s === step
                                        ? 'w-8 bg-orange-500'
                                        : s < step
                                        ? 'w-4 bg-orange-500/40'
                                        : 'w-4 bg-zinc-800'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-zinc-950 py-6 px-6 border-t border-zinc-800 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TaskRigLogo className="w-5 h-auto text-zinc-800" />
                        <span className="font-heading font-bold text-lg tracking-tight text-zinc-700">TASK RIG</span>
                    </div>
                    <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center flex-1">
                        &copy; 2026 Task Rig Systems Inc. All Rights Reserved.
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-900"></div>
                        <span className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">Systems Normal</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};