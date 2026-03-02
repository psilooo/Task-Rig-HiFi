import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InputField } from '../../../components/forms/InputField';
import { Checkbox } from '../../../components/forms/Checkbox';
import { ROLES } from '../../../constants/integrations';
import { chipBaseClass, chipSelectedClass, chipUnselectedClass, labelClass, inputClass } from '../../../components/forms/styles';
import { staggerItem } from '../animations';
import type { LeadData } from '../../../types';

export const Phase3Contact: React.FC<{
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
    emailError: string;
    phoneError: string;
    setEmailError: (v: string) => void;
    setPhoneError: (v: string) => void;
    canSubmit: boolean;
    onSubmit: () => void;
}> = ({ data, update, emailError, phoneError, setEmailError, setPhoneError, canSubmit, onSubmit }) => (
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

        {/* Role chips — optional */}
        <motion.div variants={staggerItem}>
            <label className={labelClass}>
                Your Role <span className="text-zinc-600">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {ROLES.map((role) => (
                    <button
                        key={role}
                        onClick={() => update({ contactRole: data.contactRole === role ? '' : role })}
                        className={`px-3 py-1.5 min-h-[44px] sm:min-h-0 font-mono text-xs ${chipBaseClass} ${
                            data.contactRole === role ? chipSelectedClass : chipUnselectedClass
                        }`}
                    >
                        {role}
                    </button>
                ))}
            </div>
        </motion.div>

        {/* Preferred contact method */}
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
                        className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] sm:min-h-0 font-mono text-xs ${chipBaseClass} ${
                            data.preferredContactMethod === method.id ? chipSelectedClass : chipUnselectedClass
                        }`}
                    >
                        <method.icon size={12} />
                        {method.label}
                    </button>
                ))}
            </div>
        </motion.div>

        {/* Notes */}
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

        {/* Consent checkboxes */}
        <motion.div variants={staggerItem} className="space-y-3 pt-2">
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
        </motion.div>

        {/* Submit button */}
        <motion.div variants={staggerItem} className="pt-2">
            <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-all rounded-sm ${
                    canSubmit
                        ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
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
    </div>
);
