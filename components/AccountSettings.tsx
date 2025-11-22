import React from 'react';
import { Reveal } from './ui/Reveal';
import { CyberCard } from './ui/CyberCard';
import { User, Mail, Lock, Send, Twitter, Facebook, Chrome, CheckCircle, CreditCard } from 'lucide-react';

export const AccountSettings: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 pt-28 pb-12">
        
        {/* Header for Config */}
        <div className="mb-12 border-b border-zinc-800 pb-6 flex items-end justify-between">
            <div>
                <div className="text-[10px] font-mono text-orange-500 uppercase tracking-widest mb-2">Config Level 01</div>
                <h1 className="font-heading font-bold text-4xl text-white uppercase">System Configuration</h1>
            </div>
            <div className="hidden md:block text-right">
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Last Sync</div>
                <div className="text-zinc-400 font-mono text-xs">T-Minus 00:42:15</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
            {/* Card 1: Account Identity */}
            <Reveal className="h-full">
                <CyberCard title="Operator Identity" className="h-full">
                    <div className="space-y-8">
                        <div className="group">
                            <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Designation</label>
                            <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center">
                                        <User size={16} className="text-zinc-400" />
                                    </div>
                                    <span className="font-heading font-bold text-xl text-zinc-200 tracking-wide">Alex Chen</span>
                                </div>
                                <button className="px-3 py-1 text-[10px] border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 uppercase font-bold tracking-widest transition-all">Edit</button>
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Comms Link</label>
                            <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center">
                                        <Mail size={16} className="text-zinc-400" />
                                    </div>
                                    <span className="font-mono text-sm text-zinc-300">alex.c@taskrig.com</span>
                                </div>
                                <button className="px-3 py-1 text-[10px] border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 uppercase font-bold tracking-widest transition-all">Edit</button>
                            </div>
                        </div>
                         <div className="group">
                            <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Security Token</label>
                            <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center">
                                        <Lock size={16} className="text-zinc-400" />
                                    </div>
                                    <span className="font-mono text-sm text-zinc-300">••••••••••••</span>
                                </div>
                                <button className="px-3 py-1 text-[10px] border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 uppercase font-bold tracking-widest transition-all">Reset</button>
                            </div>
                        </div>
                    </div>
                </CyberCard>
            </Reveal>

            {/* Card 2: Subscription Plan */}
            <Reveal delay={0.1} className="h-full">
                 <CyberCard title="Resource Allocation" className="h-full">
                    <div className="flex flex-col h-full">
                        <div className="flex-grow">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Current Tier</div>
                                    <h4 className="font-heading font-bold text-3xl text-white">Enterprise Agent</h4>
                                </div>
                                <div className="flex flex-col items-end">
                                     <span className="px-2 py-1 bg-emerald-900/20 border border-emerald-500/30 text-emerald-500 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active
                                    </span>
                                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Auto-Renew: ON</span>
                                </div>
                            </div>
                            
                            <div className="space-y-1 mb-8">
                                <div className="flex justify-between items-center p-3 border-b border-zinc-800 border-dashed">
                                    <span className="text-xs text-zinc-500 font-mono uppercase">Billing Cycle</span>
                                    <span className="text-zinc-200 font-bold font-mono text-xs">MONTHLY</span>
                                </div>
                                <div className="flex justify-between items-center p-3 border-b border-zinc-800 border-dashed">
                                    <span className="text-xs text-zinc-500 font-mono uppercase">Next Invoice</span>
                                    <span className="text-zinc-200 font-bold font-mono text-xs">2025-11-01</span>
                                </div>
                                 <div className="flex justify-between items-center p-3 border-b border-zinc-800 border-dashed">
                                    <span className="text-xs text-zinc-500 font-mono uppercase">Unit Cost</span>
                                    <span className="text-orange-500 font-heading font-bold text-xl">$299.00</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 border border-zinc-700 text-zinc-300 font-heading font-bold uppercase tracking-widest hover:bg-zinc-800 hover:text-white hover:border-zinc-500 transition-all mt-auto flex items-center justify-center gap-2 group">
                            <CreditCard size={16} className="group-hover:text-orange-500 transition-colors"/>
                            Manage Subscription
                        </button>
                    </div>
                </CyberCard>
            </Reveal>

            {/* Card 3: Connected Services */}
             <Reveal delay={0.2} className="h-full">
                <CyberCard title="External Uplinks" className="h-full">
                    <div className="space-y-4 h-full">
                        {/* Google */}
                        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400">
                                    <Chrome size={18} />
                                </div>
                                <div>
                                    <h5 className="font-heading font-bold text-zinc-200 uppercase tracking-wide text-sm">Google Workspace</h5>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase">Status: Syncing...</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                 <CheckCircle size={14} className="text-emerald-500" />
                            </div>
                        </div>

                        {/* Outlook */}
                        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-sm opacity-60 hover:opacity-100 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h5 className="font-heading font-bold text-zinc-200 uppercase tracking-wide text-sm">Outlook</h5>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase">Status: Offline</p>
                                </div>
                            </div>
                            <button className="px-3 py-1 bg-zinc-800 hover:bg-orange-600 text-zinc-300 hover:text-black text-[9px] font-bold uppercase tracking-widest transition-colors">
                                Connect
                            </button>
                        </div>

                        {/* Facebook */}
                        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-sm hover:border-zinc-600 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400">
                                    <Facebook size={18} />
                                </div>
                                <div>
                                    <h5 className="font-heading font-bold text-zinc-200 uppercase tracking-wide text-sm">Facebook</h5>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase">Status: Active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                 <CheckCircle size={14} className="text-emerald-500" />
                            </div>
                        </div>

                        {/* X.com */}
                        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-sm opacity-60 hover:opacity-100 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400">
                                    <Twitter size={18} />
                                </div>
                                <div>
                                    <h5 className="font-heading font-bold text-zinc-200 uppercase tracking-wide text-sm">X.com</h5>
                                    <p className="text-[10px] text-zinc-500 font-mono uppercase">Status: Offline</p>
                                </div>
                            </div>
                            <button className="px-3 py-1 bg-zinc-800 hover:bg-orange-600 text-zinc-300 hover:text-black text-[9px] font-bold uppercase tracking-widest transition-colors">
                                Connect
                            </button>
                        </div>
                    </div>
                </CyberCard>
             </Reveal>

             {/* Card 4: System Directive */}
             <Reveal delay={0.3} className="h-full">
                <CyberCard title="Override Protocol" className="h-full">
                    <div className="flex flex-col h-full">
                        <p className="text-zinc-500 font-mono text-xs mb-4 leading-relaxed">
                            Submit a high-priority override to adjust agent behavior parameters. Logs will be audited.
                        </p>
                        <div className="flex-1 flex flex-col">
                            <textarea 
                                className="w-full flex-1 bg-zinc-950/50 border border-zinc-800 text-zinc-300 p-4 focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 focus:outline-none font-mono text-xs resize-none placeholder:text-zinc-700 mb-4"
                                placeholder="// ENTER_DIRECTIVE_PARAMETERS..."
                            ></textarea>
                            <button className="flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-500 text-black font-heading font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-orange-500/20 group">
                                <Send size={14} />
                                Execute Command
                            </button>
                        </div>
                    </div>
                </CyberCard>
             </Reveal>
        </div>
    </div>
  );
};