import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { QUESTION_DATA } from '../constants';
import { CyberCard } from './ui/CyberCard';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 p-3 shadow-xl">
        <p className="font-heading font-bold uppercase text-zinc-300 mb-1 text-xs tracking-widest">{label}</p>
        <p className="font-mono text-orange-500 text-lg">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const QuestionsChart: React.FC = () => {
  return (
    <CyberCard title="Top Inquiries" className="h-full min-h-[300px]">
      <div className="w-full h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={QUESTION_DATA}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="category" 
              tick={{ fill: '#71717a', fontFamily: 'IBM Plex Sans Condensed', fontSize: 11, fontWeight: 600, letterSpacing: '0.5px' }} 
              width={90}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.03)'}} />
            <Bar dataKey="count" radius={[0, 2, 2, 0]} barSize={24}>
              {QUESTION_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
         <span className="text-xs font-mono text-zinc-600">PERIOD: LAST_24H</span>
         <span className="text-xs font-heading text-zinc-400 uppercase tracking-wider">
            Total: {QUESTION_DATA.reduce((acc, curr) => acc + curr.count, 0)}
         </span>
      </div>
    </CyberCard>
  );
};