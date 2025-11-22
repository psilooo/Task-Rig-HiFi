import React, { useState } from 'react';
import { RECENT_ACTIVITY } from '../constants';
import { Reveal } from './ui/Reveal';
import { Mail, MessageSquare, Phone, Terminal } from 'lucide-react';
import { CyberCard } from './ui/CyberCard';

export const ActivityFeed: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'email': return <Mail size={14} />;
      case 'sms': return <MessageSquare size={14} />;
      case 'phone': return <Phone size={14} />;
      default: return <Terminal size={14} />;
    }
  };

  return (
    <CyberCard title="Data Stream" className="h-full border-zinc-800">
      <div className="flex flex-col">
        {RECENT_ACTIVITY.map((activity, index) => (
          <Reveal key={activity.id} delay={0.3 + (index * 0.1)}>
            <div 
              className={`group py-4 border-b border-zinc-800/50 last:border-none transition-all duration-200 cursor-pointer hover:bg-zinc-900/30 px-2 -mx-2`}
              onClick={() => toggleExpand(activity.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 p-1.5 border border-zinc-800 bg-zinc-950 text-zinc-500 group-hover:text-orange-500 group-hover:border-orange-500/30 transition-colors`}>
                  {getIcon(activity.platform)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-orange-500/80 uppercase tracking-widest">
                         LOG_{activity.id.padStart(3, '0')}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-600 shrink-0">{activity.timestamp}</span>
                  </div>
                  
                  <h5 className="font-body text-lg text-zinc-200 truncate pr-4 mb-1 group-hover:text-white transition-colors">
                      {activity.summary}
                  </h5>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase bg-zinc-900 px-1.5 py-0.5 rounded-sm">{activity.platform}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Target: {activity.contactName}</span>
                  </div>

                  <div className={`grid transition-all duration-300 ease-out ${expandedId === activity.id ? 'grid-rows-[1fr] opacity-100 pt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="p-3 bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-zinc-400 leading-relaxed border-l-2 border-l-orange-500">
                        <span className="text-orange-500 block mb-1 opacity-50">// DECODED MESSAGE:</span>
                        {activity.fullDetails}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </CyberCard>
  );
};