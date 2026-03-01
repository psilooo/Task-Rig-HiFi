import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { InputField } from '../../../components/forms/InputField';
import { ROLES } from '../../../constants/integrations';
import { chipBaseClass, chipSelectedClass, chipUnselectedClass, labelClass } from '../../../components/forms/styles';
import { inputClass } from '../../../components/forms/styles';
import { staggerItem } from '../animations';
import type { LeadData } from '../../../types';

export const Phase5Content: React.FC<{
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
