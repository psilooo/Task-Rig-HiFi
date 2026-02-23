import React, { useEffect, useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { TaskRigLogo } from './ui/TaskRigLogo';
import { Footer } from './Footer';

export const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message.');
            }

            setStatus('success');
            setFormData({ name: '', email: '', company: '', message: '' });
        } catch (error: any) {
            console.error('Submission error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-clip selection:bg-orange-500/30">
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <TaskRigLogo className="h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                        <div className="font-heading font-bold text-2xl tracking-tight text-white">TASK RIG</div>
                    </div>
                    <a href="/" className="group flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                        Back to Home
                    </a>
                </div>
            </nav>

            {/* Content */}
            <main className="relative z-10 pt-32 pb-24 px-6 flex flex-col justify-center min-h-[calc(100vh-160px)]">
                <div className="max-w-3xl mx-auto bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12 rounded-sm shadow-xl backdrop-blur-sm w-full">
                    <div className="mb-12 border-b border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="font-heading font-bold text-4xl mb-2 text-white uppercase tracking-tight">Contact Us</h1>
                            <p className="text-zinc-500 font-mono text-sm">We're here to help.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-zinc-400 font-mono text-sm">Email: <a href="mailto:info@taskrig.ca" className="text-orange-500 hover:underline">info@taskrig.ca</a></p>
                            <p className="text-zinc-400 font-mono text-sm mt-1">Phone: <a href="tel:+18442222630" className="text-orange-500 hover:underline">+1 844-222-2630</a></p>
                        </div>
                    </div>

                    {status === 'success' ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-sm text-center">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-heading font-bold text-white mb-2 uppercase tracking-wide">Message Sent Successfully</h2>
                            <p className="text-zinc-400 font-mono text-sm max-w-md mx-auto mb-8">
                                Thank you for contacting TaskRig. Our team has received your message and will respond shortly.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded-sm border border-zinc-700"
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-sm flex gap-3 text-red-400 font-mono text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-zinc-400 font-mono text-xs uppercase tracking-widest mb-2">Name <span className="text-orange-500">*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-sm px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-700"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-zinc-400 font-mono text-xs uppercase tracking-widest mb-2">Email Address <span className="text-orange-500">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-sm px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-700"
                                        placeholder="jane@acmehvac.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-zinc-400 font-mono text-xs uppercase tracking-widest mb-2">Company Name</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-sm px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-700"
                                    placeholder="Acme HVAC"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-zinc-400 font-mono text-xs uppercase tracking-widest mb-2">Message <span className="text-orange-500">*</span></label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-sm px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-700 resize-none"
                                    placeholder="How can we help you..."
                                ></textarea>
                            </div>

                            <div className="pt-4 border-t border-zinc-800">
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-400 text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                                >
                                    {status === 'submitting' ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-zinc-600 font-mono text-[10px] uppercase tracking-widest mt-4">
                                    Protected by standard form security protocols.
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};
