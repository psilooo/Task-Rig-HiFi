import React, { useState } from 'react';
import { CyberCard } from './ui/CyberCard';
import { Reveal } from './ui/Reveal';
import { Lock, User, ArrowRight, ShieldCheck, ChevronLeft, Fingerprint } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onBack?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-[0.05] pointer-events-none"></div>
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors font-mono text-[10px] uppercase tracking-widest group z-50"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Abort / Return
        </button>
      )}

      <div className="w-full max-w-md px-4 relative z-10">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 border border-zinc-800 px-3 py-1 bg-zinc-900/50 backdrop-blur-sm mb-6">
                 <div className="w-1.5 h-1.5 bg-red-500 animate-pulse"></div>
                 <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-widest">Secure Environment</span>
            </div>
            <h1 className="font-heading font-bold text-5xl md:text-6xl text-white tracking-tighter leading-none mb-2">
              TASK RIG
            </h1>
            <p className="text-zinc-600 font-mono text-[10px] tracking-[0.3em] uppercase">
              Command Interface v2.4.1
            </p>
          </div>

          <CyberCard className="shadow-2xl shadow-black/80">
             {/* Biometric Header */}
             <div className="border-b border-zinc-800/50 pb-6 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 border border-zinc-800">
                        <Lock size={16} className="text-orange-500" />
                    </div>
                    <div className="text-left">
                        <div className="text-xs font-heading font-bold text-white uppercase tracking-wide">Authentication</div>
                        <div className="text-[9px] font-mono text-zinc-600 uppercase">Req_Lvl_4</div>
                    </div>
                </div>
                <Fingerprint size={32} className="text-zinc-800" />
             </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Operator ID</label>
                    <span className="text-[9px] font-mono text-zinc-700 uppercase">REQ: ALPHANUMERIC</span>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-zinc-900 border-r border-zinc-800 flex items-center justify-center">
                        <User size={14} className="text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="USR_001" 
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 pl-14 pr-4 py-3 font-mono text-sm focus:outline-none focus:border-orange-500/50 focus:ring-0 transition-all placeholder:text-zinc-800"
                    />
                    {/* Corner tick */}
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-zinc-600 group-focus-within:border-orange-500 transition-colors"></div>
                  </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Security Key</label>
                    <span className="text-[9px] font-mono text-zinc-700 uppercase">AES-256</span>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-zinc-900 border-r border-zinc-800 flex items-center justify-center">
                        <ShieldCheck size={14} className="text-zinc-600 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 pl-14 pr-4 py-3 font-mono text-sm focus:outline-none focus:border-orange-500/50 focus:ring-0 transition-all placeholder:text-zinc-800"
                    />
                     {/* Corner tick */}
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-zinc-600 group-focus-within:border-orange-500 transition-colors"></div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-8 group relative bg-orange-600 hover:bg-orange-500 text-black font-heading font-bold text-lg uppercase tracking-widest py-4 transition-all clip-path-slant shadow-[0_0_20px_rgba(234,88,12,0.15)] hover:shadow-[0_0_30px_rgba(234,88,12,0.3)] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="animate-pulse font-mono text-xs">Verifying Credentials...</span>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <span className="relative flex items-center justify-center gap-3">
                        Initiate Link <ArrowRight size={16} />
                      </span>
                    </>
                  )}
                </button>
              </form>
            
            <div className="mt-8 flex justify-between items-center border-t border-zinc-800/50 pt-4">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Node: Alpha-7</span>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Lat: 42.31</span>
                </div>
                <div className="text-[9px] font-mono text-orange-500/50 uppercase tracking-widest">Unauthorized Access Prohibited</div>
            </div>
          </CyberCard>
        </Reveal>
      </div>
    </div>
  );
};