import React from 'react';
import { motion } from 'framer-motion';
import { SelectChips } from '../../../components/forms/SelectChips';
import { TEAM_SIZES, CALL_VOLUMES, LEAD_VOLUMES, HOURS } from '../../../constants/integrations';
import { staggerItem } from '../animations';
import type { LeadData } from '../../../types';

export const Phase4Content: React.FC<{
    data: LeadData;
    update: (partial: Partial<LeadData>) => void;
}> = ({ data, update }) => (
    <div className="space-y-5">
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectChips label="Team Size" value={data.teamSize} options={TEAM_SIZES} onChange={(v) => update({ teamSize: v })} required />
            <SelectChips label="Monthly Calls" value={data.monthlyCallVolume} options={CALL_VOLUMES} onChange={(v) => update({ monthlyCallVolume: v })} />
            <SelectChips label="Monthly Leads" value={data.monthlyLeadVolume} options={LEAD_VOLUMES} onChange={(v) => update({ monthlyLeadVolume: v })} />
            <SelectChips label="Operating Hours" value={data.operatingHours} options={HOURS} onChange={(v) => update({ operatingHours: v })} />
        </motion.div>
    </div>
);
