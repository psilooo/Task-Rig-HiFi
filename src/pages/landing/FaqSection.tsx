import React from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Minus,
} from 'lucide-react';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { SectionBadge } from '../../components/ui/SectionBadge';
import { FAQ_ITEMS } from '../../constants/pricing';

interface FaqSectionProps {
    openFaq: number | null;
    setOpenFaq: (value: number | null) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ openFaq, setOpenFaq }) => {
    return (
        <section className="py-10 md:py-14 px-4 md:px-6 relative z-10 border-t border-white/5 overflow-clip">
            {/* Ambient effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/[0.02] blur-[180px] rounded-full pointer-events-none" />

            {/* Horizontal scan line effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent animate-scan-vertical" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header — split layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 md:mb-8">
                    <div className="lg:col-span-5">
                        <ScrollReveal>
                            <SectionBadge text="Knowledge Base" />
                            <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-white uppercase tracking-tight leading-[0.95] mb-4">
                                Common <span className="text-zinc-500">Questions</span>
                            </h2>
                            <p className="text-zinc-500 font-mono text-xs leading-relaxed max-w-sm">
                                Everything you need to know before deploying Task Rig. Select a query to access detailed intelligence.
                            </p>
                        </ScrollReveal>
                    </div>
                    <div className="lg:col-span-7" />
                </div>

                {/* FAQ grid — two-column on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-3 md:gap-4 mb-8 md:mb-10">
                    {FAQ_ITEMS.map((item, i) => (
                        <ScrollReveal key={i} delay={i * 0.05}>
                            <div
                                className={`group relative border rounded-lg overflow-hidden transition-[border-color,background-color,box-shadow] duration-500 ${openFaq === i
                                ? 'border-orange-500/30 bg-orange-500/[0.04] shadow-[0_0_30px_rgba(255,106,21,0.06)]'
                                : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03]'
                                }`}>
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-start gap-4 p-5 md:p-6 text-left focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950"
                                >
                                    {/* Index number */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${openFaq === i
                                        ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(255,106,21,0.3)]'
                                        : 'bg-zinc-800/80 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-400'
                                        }`}>
                                        {String(i + 1).padStart(2, '0')}
                                    </div>

                                    {/* Question text */}
                                    <div className="flex-1 min-w-0">
                                        <span className={`font-mono text-sm leading-snug block transition-colors duration-300 ${openFaq === i ? 'text-orange-400' : 'text-zinc-200'
                                            }`}>
                                            {item.q}
                                        </span>
                                    </div>

                                    {/* Toggle icon */}
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 mt-0.5 ${openFaq === i
                                        ? 'bg-orange-500/20 text-orange-500'
                                        : 'bg-zinc-800/50 text-zinc-600 group-hover:text-zinc-400'
                                        }`}>
                                        {openFaq === i ? <Minus size={12} /> : <Plus size={12} />}
                                    </div>
                                </button>

                                {/* Answer panel — CSS grid transition for jolt-free switching */}
                                <div
                                    className="grid transition-[grid-template-rows,opacity] duration-300"
                                    style={{
                                        gridTemplateRows: openFaq === i ? '1fr' : '0fr',
                                        opacity: openFaq === i ? 1 : 0,
                                    }}
                                >
                                    <div className="overflow-hidden min-h-0">
                                        <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[4.25rem] md:pl-[4.75rem]">
                                            <div className="relative">
                                                {/* Decorative left line */}
                                                <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/40 via-orange-500/20 to-transparent" />
                                                <p className="text-zinc-400 text-sm font-mono leading-[1.8]">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* ── Final CTA ── */}
                <ScrollReveal>
                    <div className="relative text-center py-12 md:py-16 mt-6 border-t border-white/5">
                        {/* Ambient glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-orange-500/[0.06] blur-[100px] rounded-full pointer-events-none" />

                        <SectionBadge text="Get Started" />
                        <h2 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-white uppercase tracking-tight mb-3 relative leading-[0.95]">
                            Stop Losing Customers<br />
                            <span className="text-zinc-500">to Missed Calls</span>
                        </h2>
                        <p className="text-zinc-400 font-mono text-sm max-w-lg mx-auto mb-8 leading-relaxed relative">
                            Join 2,400+ home service businesses using Task Rig to respond faster, book more jobs, and never miss a customer inquiry.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                            <Link
                                to="/get-started"
                                className="relative overflow-hidden w-full sm:w-auto px-14 py-4 bg-orange-500 hover:bg-orange-600 text-white font-mono font-bold text-sm uppercase tracking-widest transition-all group rounded-sm shadow-[0_0_25px_rgba(249,115,22,0.25)] hover:shadow-[0_0_35px_rgba(249,115,22,0.45)] no-underline focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950 flex justify-center items-center gap-3"
                            >
                                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                <span className="relative z-10 flex items-center gap-2">
                                    GET STARTED
                                    <svg width="14" height="10" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 opacity-80 group-hover:opacity-100">
                                        <path d="M1 6H14M14 6L9 1M14 6L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
                                    </svg>
                                </span>
                            </Link>
                            <a
                                href="tel:+18442222486"
                                className="relative overflow-hidden w-full sm:w-auto px-10 py-3.5 border border-zinc-700 hover:border-orange-500/40 text-zinc-300 hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-sm no-underline flex justify-center items-center focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950"
                            >
                                Or Call Our Demo Line
                            </a>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};
