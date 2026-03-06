import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { labelClass, inputClass } from '../../../components/forms/styles';
import { staggerContainer, staggerItem } from '../animations';
import type { LeadData } from '../../../types';

interface Phase4BookProps {
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const calendarUrl = import.meta.env.VITE_GHL_CALENDAR_URL as string | undefined;

const errorInputClass = 'w-full bg-zinc-950/50 border border-red-500/50 rounded-sm px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-red-400/50 focus:ring-1 focus:ring-red-400/50 transition-all placeholder:text-zinc-700';

export const Phase4Book: React.FC<Phase4BookProps> = ({ data, update, errors, setErrors }) => {
    const validateEmail = (value: string) => {
        if (!value.includes('@') || !value.includes('.')) {
            setErrors((prev) => ({ ...prev, contactEmail: 'Please enter a valid email address' }));
        } else {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.contactEmail;
                return next;
            });
        }
    };

    const validatePhone = (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
            setErrors((prev) => ({ ...prev, contactPhone: 'Please enter a valid phone number (10+ digits)' }));
        } else {
            setErrors((prev) => {
                const next = { ...prev };
                delete next.contactPhone;
                return next;
            });
        }
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-5"
        >
            {/* Trust badge */}
            <motion.div variants={staggerItem} className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-mono text-zinc-500">
                    Free walkthrough&nbsp;&middot;&nbsp;No obligation&nbsp;&middot;&nbsp;No credit card
                </span>
            </motion.div>

            {/* Contact name */}
            <motion.div variants={staggerItem}>
                <label className={labelClass}>
                    Your name <span className="text-orange-500">*</span>
                </label>
                <input
                    type="text"
                    value={data.contactName}
                    onChange={(e) => update({ contactName: e.target.value })}
                    autoComplete="name"
                    placeholder="Jane Doe"
                    className={inputClass}
                />
            </motion.div>

            {/* Email */}
            <motion.div variants={staggerItem}>
                <label className={labelClass}>
                    Email <span className="text-orange-500">*</span>
                </label>
                <input
                    type="email"
                    value={data.contactEmail}
                    onChange={(e) => {
                        update({ contactEmail: e.target.value });
                        if (errors.contactEmail) {
                            setErrors((prev) => {
                                const next = { ...prev };
                                delete next.contactEmail;
                                return next;
                            });
                        }
                    }}
                    onBlur={() => {
                        if (data.contactEmail) validateEmail(data.contactEmail);
                    }}
                    autoComplete="email"
                    placeholder="jane@acmehvac.com"
                    className={errors.contactEmail ? errorInputClass : inputClass}
                />
                {errors.contactEmail && (
                    <p className="text-red-400 font-mono text-xs mt-1.5">{errors.contactEmail}</p>
                )}
            </motion.div>

            {/* Phone */}
            <motion.div variants={staggerItem}>
                <label className={labelClass}>
                    Where should we text your confirmation? <span className="text-orange-500">*</span>
                </label>
                <input
                    type="tel"
                    value={data.contactPhone}
                    onChange={(e) => {
                        update({ contactPhone: e.target.value });
                        if (errors.contactPhone) {
                            setErrors((prev) => {
                                const next = { ...prev };
                                delete next.contactPhone;
                                return next;
                            });
                        }
                    }}
                    onBlur={() => {
                        if (data.contactPhone) validatePhone(data.contactPhone);
                    }}
                    autoComplete="tel"
                    placeholder="+1 (555) 000-0000"
                    className={errors.contactPhone ? errorInputClass : inputClass}
                />
                {errors.contactPhone && (
                    <p className="text-red-400 font-mono text-xs mt-1.5">{errors.contactPhone}</p>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                    <Lock className="w-3 h-3 text-zinc-600" />
                    <span className="text-[10px] font-mono text-zinc-600">Your info is encrypted and never shared</span>
                </div>
            </motion.div>

            {/* Calendar embed */}
            <motion.div variants={staggerItem}>
                <label className={labelClass}>Pick a time for your walkthrough</label>
                {calendarUrl ? (
                    <div className="border border-zinc-800 rounded-sm overflow-hidden">
                        <iframe
                            src={calendarUrl}
                            title="Schedule your walkthrough"
                            className="w-full h-[400px] border-0"
                        />
                    </div>
                ) : (
                    <div className="border border-zinc-800 rounded-sm p-6 text-center space-y-3">
                        <p className="text-zinc-400 font-mono text-sm">
                            We'll reach out within 24 hours to schedule your walkthrough.
                        </p>
                        <a
                            href="tel:+18442222486"
                            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-mono text-xs transition-colors"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            Or call us: (844) 222-2486
                        </a>
                    </div>
                )}
            </motion.div>

            {/* SMS consent checkbox */}
            <motion.div variants={staggerItem} className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <button
                        type="button"
                        role="checkbox"
                        aria-checked={data.consentSms}
                        onClick={() => update({ consentSms: !data.consentSms })}
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-sm border transition-all ${
                            data.consentSms
                                ? 'border-orange-500/50 bg-orange-500/10'
                                : 'border-zinc-700 group-hover:border-zinc-600'
                        }`}
                    >
                        {data.consentSms && (
                            <svg
                                viewBox="0 0 16 16"
                                fill="none"
                                className="w-full h-full text-orange-400"
                            >
                                <path
                                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </button>
                    <span className="text-zinc-500 font-mono text-xs leading-relaxed">
                        I agree to receive appointment confirmations and updates via SMS from TaskRig.
                        Msg &amp; data rates may apply. Reply STOP anytime.{' '}
                        <Link
                            to="/privacy"
                            className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                    </span>
                </label>
            </motion.div>
        </motion.div>
    );
};
