import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TaskRigLogo } from './ui/TaskRigLogo';
import { Footer } from './Footer';

export const TermsPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-clip selection:bg-orange-500/30">
            <div className="fixed inset-0 grid-bg opacity-[0.03] pointer-events-none z-0"></div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/95 backdrop-blur-md h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
                    <Link to="/" className="flex items-center gap-3 group no-underline">
                        <TaskRigLogo className="h-8 w-auto text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)] group-hover:scale-105 transition-transform" />
                        <div className="font-heading font-bold text-2xl tracking-tight text-white group-hover:text-orange-500 transition-colors">TASK RIG</div>
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="relative z-10 pt-24 pb-24 px-6">
                <div className="max-w-3xl mx-auto mb-4">
                    <Link to="/" className="group inline-flex items-center gap-2 py-2 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors no-underline">
                        <ArrowLeft size={14} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                        Back to Home
                    </Link>
                </div>
                <div className="max-w-3xl mx-auto bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12 rounded-sm shadow-xl backdrop-blur-sm">
                    <div className="mb-12 border-b border-zinc-800 pb-8">
                        <h1 className="font-heading font-bold text-4xl mb-2 text-white uppercase tracking-tight">SMS Terms & Privacy Policy</h1>
                        <p className="text-zinc-500 font-mono text-sm leading-relaxed">
                            Effective Date: February 23, 2026 | Last Updated: February 23, 2026<br />
                            TaskRig — <a href="/" className="text-orange-500 hover:underline">taskrig.ca</a>
                        </p>
                    </div>

                    <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 font-mono text-sm leading-relaxed
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-headings:uppercase prose-headings:tracking-wide
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-orange-500
                prose-a:text-orange-500 prose-a:no-underline hover:prose-a:text-orange-400
                prose-ul:list-disc prose-ul:pl-6 prose-li:my-2 prose-li:text-zinc-400
                prose-strong:text-zinc-100">

                        <p>
                            This document outlines the Terms of Service and Privacy Policy for TaskRig ("TaskRig", "we", "our", or "us"), including our SMS messaging program. By contacting TaskRig, submitting your information through our website, or verbally consenting during a call with our AI receptionist, you agree to the terms described below.
                        </p>
                        <p>
                            If you have any questions, please contact us using the information provided at the end of this document.
                        </p>

                        <h2>1. SMS Program Description</h2>
                        <p>TaskRig operates an SMS (text message) program to communicate with prospects, leads, and clients in connection with our AI receptionist services. By providing your phone number and consenting to receive messages, you agree to receive SMS communications from TaskRig.</p>

                        <p><strong>Messaging Use Cases</strong><br />
                            We may send you SMS messages for the following purposes:</p>
                        <ul>
                            <li>Sending booking links so you can schedule a discovery call or consultation</li>
                            <li>Appointment confirmations and reminders for scheduled calls with the TaskRig team</li>
                            <li>Follow-up communications after a call or inquiry</li>
                            <li>Onboarding information for new clients</li>
                            <li>Service updates or important account notifications</li>
                            <li>Responses to inbound inquiries submitted via our website or AI demo line</li>
                        </ul>
                        <p>TaskRig does not send promotional or marketing broadcast messages. All SMS communications are transactional and directly related to your interaction with our services.</p>

                        <h2>2. How We Obtain Consent</h2>
                        <p>TaskRig obtains consent through one of two methods before sending any SMS message:</p>

                        <p><strong>Web Form Consent</strong><br />
                            When you submit a contact form on our website, consent language is displayed near the submit button. By submitting the form, you consent to receive SMS communications from TaskRig related to your inquiry.</p>

                        <p><strong>Verbal Consent (AI Demo Line)</strong><br />
                            When you call our AI demo line, our AI receptionist (Riley) will verbally ask for your permission before sending any SMS message. Your verbal confirmation is recorded on the call and constitutes express consent under CASL and applicable telecommunications regulations. You will never receive an unsolicited text message from TaskRig following a call without first providing verbal consent during that call.</p>

                        <p><strong>Important</strong><br />
                            TaskRig does not share your phone number with third parties for their own marketing purposes. Your consent to receive messages from TaskRig does not constitute consent to receive messages from any other company.</p>

                        <h2>3. How to Opt Out</h2>
                        <p>You may opt out of receiving SMS messages from TaskRig at any time using any of the following methods:</p>
                        <ul>
                            <li>Text STOP to any TaskRig SMS message to immediately unsubscribe</li>
                            <li>Text CANCEL, END, QUIT, or UNSUBSCRIBE to any TaskRig message</li>
                            <li>Contact us directly at info@taskrig.ca or +1 844-222-2630 to request removal</li>
                        </ul>
                        <p>Once you opt out, TaskRig will process your request within 10 business days in accordance with CASL requirements. You will receive one final confirmation message acknowledging your opt-out, after which no further messages will be sent unless you provide new consent.<br />
                            To re-subscribe after opting out, text START to +1 844-222-2630 or contact our support team directly.</p>

                        <h2>4. Support Contact Information</h2>
                        <p>If you have questions about our SMS program, need assistance, or want to update your preferences, please contact us:</p>
                        <div className="bg-zinc-950 p-6 rounded-sm border border-zinc-800 mt-4 mb-8">
                            <p className="m-0 mb-1"><strong>Email:</strong> info@taskrig.ca</p>
                            <p className="m-0 mb-1"><strong>Phone:</strong> +1 844-222-2630</p>
                            <p className="m-0 mb-1"><strong>Website:</strong> taskrig.ca</p>
                            <p className="m-0"><strong>Mailing Address:</strong> Toronto, ON, Canada</p>
                        </div>
                        <p>Our team is available Monday through Friday, 9am - 5pm, Eastern Time. We aim to respond to all inquiries within 1 business day.</p>

                        <h2>5. Message & Data Rates</h2>
                        <p>Standard message and data rates may apply to all SMS messages sent and received through our program. These charges are determined by your mobile carrier and your individual plan. TaskRig does not charge any additional fee for SMS communications beyond any applicable carrier charges.<br />
                            Message frequency varies depending on your interaction with TaskRig. Typically, you will receive no more than 2-4 messages per interaction (e.g., booking confirmation, appointment reminder). You will never receive unsolicited recurring promotional messages.</p>

                        <p><strong>Disclosure</strong><br />
                            Msg &amp; data rates may apply. Message frequency varies. Text STOP to cancel. Text HELP for help.</p>

                        <h2>6. Carrier Liability Disclaimer</h2>
                        <p>TaskRig's SMS program is provided through third-party telecommunications carriers and messaging platforms. TaskRig is not responsible for any delays, failures, or errors in the transmission of SMS messages caused by your mobile carrier or any third-party telecommunications provider.<br />
                            Mobile carriers are not liable for delayed or undelivered messages. Delivery of SMS messages is subject to the policies, terms, and network conditions of your wireless carrier. TaskRig cannot guarantee that all messages will be delivered in a timely manner or at all, depending on network availability and carrier policies.<br />
                            By participating in our SMS program, you acknowledge that TaskRig bears no responsibility for carrier-level delays or failures in message delivery.</p>

                        <h2>7. Age Restriction</h2>
                        <p>TaskRig's SMS program and services are intended solely for individuals who are 18 years of age or older. By providing your phone number and consenting to receive SMS messages from TaskRig, you represent and warrant that you are at least 18 years of age.<br />
                            TaskRig does not knowingly collect personal information from or send SMS messages to individuals under the age of 18. If we become aware that a person under 18 has provided consent or personal information, we will promptly delete that information and remove the individual from all communications.<br />
                            If you believe a minor has submitted their information through our platform, please contact us immediately at info@taskrig.ca.</p>

                        <h2>8. Privacy Policy</h2>
                        <p>This section describes how TaskRig collects, uses, stores, and protects your personal information in connection with our AI receptionist services and SMS program.</p>

                        <p><strong>Information We Collect</strong></p>
                        <ul>
                            <li>Name and contact information (phone number, email address) provided via web form or verbally during a call</li>
                            <li>Business information shared during your interaction with our AI receptionist or team</li>
                            <li>Call recordings and transcripts from interactions with our VAPI-powered AI demo line</li>
                            <li>Consent records including the date, time, and method of consent</li>
                            <li>SMS opt-in and opt-out records</li>
                        </ul>

                        <p><strong>How We Use Your Information</strong></p>
                        <ul>
                            <li>To send you booking links, appointment confirmations, and follow-up communications</li>
                            <li>To configure and deliver our AI receptionist services</li>
                            <li>To maintain records of consent as required by CASL and applicable privacy laws</li>
                            <li>To improve our services and AI agent performance</li>
                            <li>To respond to your inquiries and provide customer support</li>
                        </ul>

                        <p><strong>Data Storage &amp; Retention</strong><br />
                            Your personal information is stored securely within GoHighLevel (our CRM platform) and VAPI (our voice AI platform), both of which act as data processors on our behalf. Call recordings are retained for a maximum of 12 months. Contact and consent records are retained for a minimum of 3 years as required by CASL.</p>

                        <p><strong>Your Rights</strong><br />
                            Under PIPEDA (Personal Information Protection and Electronic Documents Act) and applicable Canadian privacy law, you have the right to access, correct, or request deletion of your personal information. To exercise these rights, contact us at info@taskrig.ca.</p>

                        <p><strong>Third-Party Platforms</strong><br />
                            TaskRig uses the following third-party platforms to deliver our services:</p>
                        <ul>
                            <li>GoHighLevel — CRM and workflow automation (gohighlevel.com)</li>
                            <li>VAPI — Voice AI infrastructure (vapi.ai)</li>
                            <li>Deepgram — Voice transcription (deepgram.com)</li>
                            <li>ElevenLabs — Voice synthesis (elevenlabs.io)</li>
                        </ul>
                        <p>We do not sell your personal information to third parties.</p>

                        <h2>9. Link to Full Privacy Policy</h2>
                        <p>This document serves as TaskRig's combined SMS Terms and Privacy Policy. The most current version is always available at:<br />
                            <a href="/privacy">taskrig.ca/privacy</a></p>
                        <p>All SMS messages sent by TaskRig will reference this Privacy Policy where applicable.</p>

                        <h2>10. Changes to This Policy</h2>
                        <p>TaskRig reserves the right to update or modify this SMS Terms &amp; Privacy Policy at any time. Changes will be posted to our website with an updated effective date. Continued use of our services or SMS program following any changes constitutes your acceptance of the revised terms.</p>

                        <div className="mt-12 pt-8 border-t border-zinc-800/50 text-center">
                            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
                                TaskRig — AI Receptionist Services<br />
                                taskrig.ca • info@taskrig.ca • +1 844-222-2630<br />
                                Canada — CASL &amp; PIPEDA Compliant
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};
