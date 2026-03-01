import React from 'react';
import { motion } from 'framer-motion';
import { ChipButton } from '../../../components/forms/ChipButton';
import { PAIN_POINTS } from '../../../constants/industries';
import { INTEGRATIONS } from '../../../constants/integrations';
import { labelClass } from '../../../components/forms/styles';
import { staggerItem } from '../animations';
import type { LeadData } from '../../../types';

export const Phase3Content: React.FC<{
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
