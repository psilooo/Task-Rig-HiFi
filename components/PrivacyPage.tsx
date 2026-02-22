import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TaskRigLogo } from './ui/TaskRigLogo';

export const PrivacyPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
            <main className="relative z-10 pt-32 pb-24 px-6">
                <div className="max-w-3xl mx-auto bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12 rounded-sm shadow-xl backdrop-blur-sm">
                    <div className="mb-12 border-b border-zinc-800 pb-8">
                        <h1 className="font-heading font-bold text-4xl mb-2 text-white uppercase tracking-tight">Privacy Policy</h1>
                        <p className="text-zinc-500 font-mono text-sm">Effective Date: February 19, 2026</p>
                    </div>

                    <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 font-mono text-sm leading-relaxed
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-headings:uppercase prose-headings:tracking-wide
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-orange-500
                prose-a:text-orange-500 prose-a:no-underline hover:prose-a:text-orange-400
                prose-ul:list-disc prose-ul:pl-6 prose-li:my-2 prose-li:text-zinc-400
                prose-strong:text-zinc-100">

                        <p>
                            This Privacy Policy describes how TaskRig ("we", "us", or "our") collects, uses, and protects your personal information when you interact with our website, submit a web form, or contact us via our demo phone line. By using our services or submitting your information, you consent to the practices described in this policy.
                        </p>
                        <p>
                            TaskRig is committed to compliance with Canada's Anti-Spam Legislation (CASL) and applicable Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA).
                        </p>

                        <h2>1. Information We Collect</h2>
                        <p>When you submit a web form or contact us through our demo line, we may collect the following personal information:</p>
                        <ul>
                            <li>Full name</li>
                            <li>Phone number (mobile or landline)</li>
                            <li>Email address</li>
                            <li>Business name and type</li>
                            <li>General location or service area</li>
                            <li>Any information you voluntarily share during a call or form submission</li>
                        </ul>
                        <p>If you call our demo line, the call may be recorded for quality assurance, consent verification, and compliance purposes. You will be informed of this during the call.</p>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information you provide for the following purposes:</p>
                        <ul>
                            <li>To respond to your inquiry or demo request</li>
                            <li>To contact you by phone or SMS with information relevant to your inquiry, including scheduling, follow-up, or a demo summary link — only with your explicit consent</li>
                            <li>To book appointments or demonstrations of our AI receptionist services</li>
                            <li>To improve our services and customer experience</li>
                            <li>To maintain records of consent for regulatory compliance</li>
                        </ul>
                        <p>We will never contact you via SMS or phone without your prior express consent, as required under CASL.</p>

                        <h2>3. SMS Communications & Consent</h2>
                        <p>TaskRig may send you SMS messages only if you have provided explicit consent through one of the following methods:</p>
                        <ul>
                            <li>Checking the opt-in checkbox on our web form (which is unchecked by default)</li>
                            <li>Verbally agreeing during a recorded phone or demo call when asked by our AI agent</li>
                        </ul>
                        <p>By opting in to SMS communications, you acknowledge:</p>
                        <ul>
                            <li>Message and data rates may apply depending on your carrier plan</li>
                            <li>Message frequency will vary based on your inquiry and service type</li>
                            <li>You may opt out at any time by replying STOP to any SMS message</li>
                            <li>You may request help by replying HELP</li>
                        </ul>
                        <p>We do not send unsolicited SMS messages. All outbound SMS is triggered only following confirmed consent.</p>

                        <h2>4. Sharing of Your Information</h2>
                        <p>TaskRig does not sell, rent, or trade your personal information to third parties. We may share your information only in the following limited circumstances:</p>
                        <ul>
                            <li>With trusted service providers who assist in operating our platform (e.g., GoHighLevel CRM, VAPI voice services), under strict confidentiality obligations</li>
                            <li>If required by law or to comply with a legal process or government request</li>
                            <li>To protect the rights, safety, or property of TaskRig or its clients</li>
                        </ul>
                        <p>All third-party providers we work with are contractually bound to handle your data securely and only for the purposes we specify.</p>

                        <h2>5. Data Retention</h2>
                        <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by applicable law. Call recordings are retained for a minimum of 12 months for consent documentation purposes. You may request deletion of your data at any time (see Section 7).</p>

                        <h2>6. Cookies & Website Tracking</h2>
                        <p>Our website may use cookies or similar tracking technologies to improve user experience and analyze site traffic. These do not collect personally identifiable information unless you submit a form. You can disable cookies through your browser settings at any time.</p>

                        <h2>7. Your Rights</h2>
                        <p>Under Canadian privacy law, you have the right to:</p>
                        <ul>
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Withdraw your consent to receive SMS or phone communications at any time</li>
                            <li>Request deletion of your personal information, subject to legal retention requirements</li>
                        </ul>
                        <p>To exercise any of these rights, contact us at the information provided in Section 9. We will respond to all requests within 30 days.</p>

                        <h2>8. Security</h2>
                        <p>We take reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. Our platform uses industry-standard security practices including encrypted data storage and secure transmission protocols. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>

                        <h2>9. Contact Us</h2>
                        <p>If you have questions, concerns, or requests related to this Privacy Policy or how we handle your personal information, please contact us:</p>
                        <div className="bg-zinc-950 p-6 rounded-sm border border-zinc-800 mt-4 mb-8">
                            <p className="m-0 mb-1"><strong className="text-orange-500">TaskRig</strong></p>
                            <p className="m-0 mb-1">Email: [your@email.com]</p>
                            <p className="m-0 mb-1">Phone: [Your Contact Number]</p>
                            <p className="m-0">Website: [www.taskrig.com]</p>
                        </div>

                        <h2>10. Updates to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised effective date. We encourage you to review this policy periodically.</p>

                        <div className="mt-12 pt-8 border-t border-zinc-800/50 text-center">
                            <p className="text-zinc-500 text-xs uppercase tracking-widest">
                                By submitting a form or contacting TaskRig, you acknowledge that you have read and understood this Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-zinc-950 pt-10 pb-10 px-6 border-t border-zinc-800 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TaskRigLogo className="w-5 h-auto text-zinc-800" />
                        <span className="font-heading font-bold text-lg tracking-tight text-zinc-700">TASK RIG</span>
                    </div>
                    <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center flex-1">
                        © 2026 Task Rig Systems Inc. All Rights Reserved.
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-900"></div>
                        <span className="text-zinc-700 font-mono text-[10px] uppercase tracking-widest">Systems Normal</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
