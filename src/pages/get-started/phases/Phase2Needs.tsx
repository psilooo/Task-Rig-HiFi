import React from 'react';
import { motion } from 'framer-motion';
import { ChipButton } from '../../../components/forms/ChipButton';
import { SelectChips } from '../../../components/forms/SelectChips';
import { PAIN_POINTS } from '../../../constants/industries';
import { INTEGRATIONS, TEAM_SIZES } from '../../../constants/integrations';
import { labelClass } from '../../../components/forms/styles';
import { staggerItem } from '../animations';
import type { LeadData } from '../../../types';

export const Phase2Needs: React.FC<{
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
    toggleArrayItem: (field: keyof LeadData, value: string) => void;
}> = ({ data, update, toggleArrayItem }) => (
    <div className="space-y-6">
        {/* Integrations — pre-checked: sms, calendars, crm */}
        <motion.div variants={staggerItem}>
            <label className={labelClass}>
                Integrations
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

        {/* Pain points — optional */}
        <motion.div variants={staggerItem}>
            <label className={labelClass}>
                Challenges <span className="text-zinc-600">(optional)</span>
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

        {/* Team size — required */}
        <motion.div variants={staggerItem}>
            <SelectChips
                label="Team Size"
                value={data.teamSize}
                options={TEAM_SIZES}
                onChange={(v) => update({ teamSize: v })}
                required
            />
        </motion.div>
    </div>
);
