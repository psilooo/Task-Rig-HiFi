import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { SectionBadge } from '../../components/ui/SectionBadge';
import { PRICING_TIERS } from '../../constants/pricing';

interface PricingSectionProps {
    isAnnual: boolean;
    setIsAnnual: (value: boolean) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ isAnnual, setIsAnnual }) => {
    return (
        <section className="py-10 md:py-14 px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">

            {/* Header */}
            <ScrollReveal className="w-full text-center">
                <SectionBadge text="Pricing" />
                <h2 className="font-heading font-bold text-[clamp(1.875rem,1rem+3vw,3rem)] leading-none text-center tracking-[-0.02em] text-white uppercase mb-4">
                    Simple, Transparent Pricing
                </h2>
                <p className="font-mono text-[13px] text-zinc-500 text-center tracking-[0.04em] mb-6">
                    Fully built for you. Live in 48 hours. Cancel anytime. No hidden fees.
                </p>
            </ScrollReveal>

            {/* Annual toggle */}
            <ScrollReveal delay={0.1} className="w-full">
                <div className="flex items-center justify-center mb-6">
                    <div className="relative inline-flex items-center p-[3px] rounded-lg border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]">
                        {/* Sliding active indicator */}
                        <div
                            className={`absolute top-[3px] bottom-[3px] w-[calc(50%-3px)] rounded-md bg-orange-500/[0.12] border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.15)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAnnual ? 'left-[calc(50%+1.5px)]' : 'left-[3px]'}`}
                        />
                        <button
                            onClick={() => setIsAnnual(false)}
                            type="button"
                            className={`relative z-10 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 rounded-md focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950 ${!isAnnual ? 'text-orange-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            type="button"
                            className={`relative z-10 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 rounded-md focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950 ${isAnnual ? 'text-orange-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            Annual
                        </button>
                        {/* Save badge anchored to top-right corner */}
                        <div className="absolute -top-2.5 -right-3 bg-orange-500 text-black font-mono text-[9px] font-bold tracking-[0.08em] uppercase px-2 py-[2px] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)] leading-none">
                            –20%
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start w-full mt-4">
                {PRICING_TIERS.map((tier, i) => {
                    const isFeatured = tier.highlighted;

                    // Dynamic Color mapping
                    const getTagColors = (scheme?: string) => {
                        switch (scheme) {
                            case 'green': return 'text-zinc-300 bg-zinc-800/50 border-zinc-700';
                            case 'blue': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
                            case 'silver': return 'text-zinc-400 bg-zinc-800/50 border-zinc-700';
                            default: return 'text-zinc-300 bg-zinc-800/50 border-zinc-700/50';
                        }
                    };

                    const getCheckColor = (scheme?: string) => {
                        switch (scheme) {
                            case 'green': return '#d4d4d8';
                            case 'blue': return '#f97316';
                            case 'silver': return '#a1a1aa';
                            default: return '#d4d4d8';
                        }
                    };

                    return (
                        <ScrollReveal key={i} delay={i * 0.1}>
                            <div className={`relative p-6 md:p-7 border rounded-sm flex flex-col h-full bg-zinc-900/40 backdrop-blur-sm transition-all duration-300 ${isFeatured ? 'border-orange-500/60 hover:-translate-y-[4px]' : 'border-zinc-800/50 hover:border-zinc-700 hover:-translate-y-[4px]'}`}>
                                {isFeatured && (
                                    <>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white font-mono text-[10px] font-bold tracking-[0.14em] uppercase px-4 py-[3px] pt-[4px] rounded-sm whitespace-nowrap z-10 leading-none">
                                            Most Popular
                                        </div>
                                        {/* Animated orbiting glow border — sharp ring */}
                                        <div className="glow-border absolute -inset-[2px] rounded-sm pointer-events-none" />
                                        {/* Blurred halo behind the ring */}
                                        <div className="glow-border absolute -inset-[2px] rounded-sm pointer-events-none blur-[8px] opacity-40" />
                                        {/* Slow pulsing ambient glow */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[120px] bg-orange-500/[0.04] blur-[60px] rounded-full pointer-events-none animate-pulse" />
                                    </>
                                )}

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="self-start">
                                        <div className={`inline-block font-mono text-sm tracking-[0.14em] uppercase px-3 py-1 rounded border font-bold mb-3 ${getTagColors(tier.colorScheme)}`}>
                                            {tier.name}
                                        </div>
                                    </div>
                                    <p className="font-mono text-[11px] text-zinc-500 tracking-[0.04em] mb-5 leading-relaxed flex-shrink-0 min-h-[40px]">{tier.tagline}</p>

                                    <div className="flex items-end gap-1 mb-1.5">
                                        <span className="font-mono text-[13px] text-zinc-500 pb-2">$</span>
                                        <span className="font-heading font-black text-[44px] leading-none text-white tracking-[-0.03em]">
                                            {isAnnual ? tier.prices.annual : tier.prices.monthly}
                                        </span>
                                        <span className="font-mono text-[13px] text-zinc-500 pb-2 tracking-[0.04em]">CAD /mo</span>
                                    </div>
                                    <div className="font-mono text-[11px] text-orange-500 mb-6 min-h-[16px] tracking-[0.04em]">
                                        {isAnnual ? 'Billed annually — save 20%' : ''}
                                    </div>

                                    <ul className="flex flex-col gap-2.5 mb-6 flex-1 list-none p-0">
                                        {tier.features.map((feat, j) => (
                                            <li key={j} className="flex items-start gap-2.5 font-mono text-sm text-zinc-300 leading-[1.45]">
                                                <svg className="flex-shrink-0 mt-0.5 w-4 h-4" viewBox="0 0 16 16" fill="none">
                                                    <circle cx="8" cy="8" r="7.5" stroke={getCheckColor(tier.colorScheme)} strokeOpacity="0.3" />
                                                    <path d="M5 8l2 2 4-4" stroke={getCheckColor(tier.colorScheme)} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>
                                                    {feat.text && feat.emph ? (
                                                        <>
                                                            {feat.text.startsWith('Everything') ? <span className="font-bold text-white">{feat.text}</span> : <span>{feat.text}</span>}
                                                            {feat.emph && !feat.text.startsWith('Everything') ? <span className="font-bold text-white">{feat.emph}</span> : <span>{feat.emph}</span>}
                                                            {feat.suffix && <span>{feat.suffix}</span>}
                                                        </>
                                                    ) : (
                                                        feat.text
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="font-mono text-[10px] text-zinc-500 tracking-[0.04em] mt-1 mb-6">
                                        {tier.overage}
                                    </div>

                                    <div className="h-px bg-zinc-800 w-full mb-6"></div>

                                    <Link to="/get-started" className="no-underline block w-full focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950 rounded-sm">
                                        <div className={`block w-full py-3.5 rounded-sm font-mono text-[12px] font-bold tracking-[0.12em] uppercase text-center transition-all cursor-pointer ${isFeatured
                                            ? 'bg-orange-500 text-white shadow-[0_4px_24px_rgba(245,98,15,0.25)] hover:bg-orange-600 hover:shadow-[0_4px_32px_rgba(245,98,15,0.55)] hover:-translate-y-px border-none'
                                            : 'bg-transparent border border-zinc-700 text-zinc-300 hover:border-orange-500/40 hover:text-white'
                                            }`}>
                                            {tier.ctaText}
                                        </div>
                                    </Link>

                                    <div className="font-mono text-[10px] text-zinc-500 text-center mt-2.5 tracking-[0.06em]">
                                        {tier.setupFee}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    );
                })}
            </div>

            {/* Bottom strip */}
            <ScrollReveal delay={0.2} className="w-full">
                <div className="mt-12 flex items-center justify-center gap-x-8 gap-y-4 flex-wrap">
                    {['No long-term contracts', 'CASL & PIPEDA compliant', 'Live in 48 hours', 'Canadian-built & managed', 'Cancel anytime'].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-zinc-500">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-orange-500"><path d="M7 1l1.5 3.5H13l-3.5 2.5 1.5 4L7 9 3 11l1.5-4L1 4.5h4.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                            {item}
                        </div>
                    ))}
                </div>
            </ScrollReveal>
        </section>
    );
};
