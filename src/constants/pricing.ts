export const PRICING_TIERS = [
    {
        name: 'Starter',
        tagline: 'For solo operators & small home service businesses.',
        prices: { monthly: 297, annual: 248 },
        features: [
            { text: '24/7 AI Voice Receptionist', emph: ' — answers every call, captures leads' },
            { text: 'Website Chat Widget', emph: ' — engages visitors 24/7' },
            { text: 'Google Review Automation', emph: ' — every review replied to automatically' },
            { text: 'Up to ', emph: '150 voice minutes', suffix: ' / month' },
            { text: 'Client dashboard — call logs & basic analytics' },
            { text: '1 dedicated phone number' },
            { text: 'CASL compliant setup' },
            { text: 'Email support' },
        ],
        overage: 'Overage: $0.35/additional minute',
        ctaText: 'Book a Free Demo',
        setupFee: '+ $197 one-time setup fee',
        highlighted: false,
        colorScheme: 'silver',
    },
    {
        name: 'Premium',
        tagline: 'Your front office, fully automated. Calls, bookings & follow-ups handled.',
        prices: { monthly: 597, annual: 497 },
        features: [
            { text: 'Everything in Starter', emph: ', plus:' },
            { text: 'Up to ', emph: '400 voice minutes', suffix: ' / month' },
            { text: 'Automated booking workflow', emph: ' — AI sends SMS booking link mid-call' },
            { text: 'CRM integration', emph: ' — GoHighLevel, calendar sync, contact records' },
            { text: 'Follow-up sequences', emph: ' — missed call text-back, appointment reminders' },
            { text: 'Custom AI persona', emph: ' — branded voice & script tailored to your business' },
            { text: 'Advanced dashboard — bookings, lead conversion, call outcomes' },
            { text: 'Priority email + chat support' },
            { text: 'Onboarding call included' },
        ],
        overage: 'Overage: $0.30/additional minute',
        ctaText: 'Get Your AI Built',
        setupFee: '+ $397 one-time setup fee',
        highlighted: true,
        colorScheme: 'blue',
    },
    {
        name: 'Enterprise',
        tagline: 'Multi-location operations & high-volume businesses.',
        prices: { monthly: '1,197', annual: '997' },
        features: [
            { text: 'Everything in Premium', emph: ', plus:' },
            { text: 'Unlimited minutes', emph: ' — up to 1,200/mo, custom above that' },
            { text: 'Multi-location support', emph: ' — separate AI agents per location' },
            { text: 'Bilingual support', emph: ' — English + French (EN/FR)' },
            { text: 'Custom integrations', emph: ' — existing CRM, dispatch & scheduling tools' },
            { text: 'Dedicated account manager' },
            { text: 'Monthly performance review calls' },
            { text: 'Uptime SLA guarantee' },
            { text: 'Priority phone support' },
        ],
        overage: '',
        ctaText: 'Book a Strategy Call',
        setupFee: '+ $797 one-time setup fee (scoped per client)',
        highlighted: false,
        colorScheme: 'green',
    },
];

export const FAQ_ITEMS = [
    { q: 'How does the AI learn about my business?', a: 'During setup, you upload your FAQs, service descriptions, pricing, and any other relevant information. Task Rig uses this to build a custom knowledge base. The AI also learns from every conversation it handles, continuously improving its responses.' },
    { q: 'Will customers know they are talking to an AI?', a: 'That is up to you. You can configure the AI to introduce itself as an assistant, or let it respond naturally. Most customers care more about getting fast, accurate help than who is providing it.' },
    { q: 'What happens when the AI cannot answer a question?', a: 'Task Rig intelligently routes conversations it cannot handle to your team. It provides a full summary so your staff can pick up seamlessly without the customer repeating themselves.' },
    { q: 'Can I customize the AI responses and tone?', a: 'Absolutely. You can set the tone (professional, friendly, casual), add custom responses for specific questions, and create rules for different situations. You stay in full control.' },
    { q: 'How long does setup take?', a: 'Most businesses are up and running in under 30 minutes. Connect your channels, upload your knowledge base, and the AI is ready to go. No technical expertise required.' },
    { q: 'Is my customer data secure?', a: 'Yes. All data is encrypted in transit and at rest. We are SOC 2 compliant and never use your customer data to train models for other businesses. Your data stays yours.' },
];

export const CHAT_MESSAGES = [
    { sender: 'customer', text: 'Hi, I need to schedule an AC repair. My unit stopped blowing cold air.' },
    { sender: 'ai', text: "I'd be happy to help you schedule an AC repair! I can see you're located in the Phoenix area. We have availability tomorrow between 9 AM-12 PM or Thursday 2 PM-5 PM. Which works better for you?" },
    { sender: 'customer', text: 'Tomorrow morning works.' },
    { sender: 'ai', text: "You're all set! I've booked a technician for tomorrow, Feb 21, between 9 AM-12 PM. You'll receive a confirmation text shortly. Is there anything else I can help with?" },
];

export const TESTIMONIALS = [
    {
        quote: "Task Rig cut our response time from 4 hours to under 30 seconds. We're booking 40% more jobs because leads aren't going cold.",
        name: 'Marcus Johnson',
        title: 'Owner, Johnson HVAC Services',
        metric: '+40% bookings',
    },
    {
        quote: "Our intake process used to take 20 minutes per client call. Now Task Rig handles screening and scheduling automatically.",
        name: 'Rebecca Alvarez',
        title: 'Managing Partner, Alvarez & Associates',
        metric: '3x faster intake',
    },
    {
        quote: "Managing 200+ units was a nightmare. Now maintenance requests come in via chat, get triaged by AI, and dispatched automatically.",
        name: 'Derek Simmons',
        title: 'Operations Director, Apex Property Group',
        metric: '60% fewer calls',
    },
];

export const PAIN_POINT_STATS = [
    {
        stat: '62%',
        title: 'Missed While You Work',
        desc: 'of inbound calls to small businesses go unanswered. Most of those callers won\'t leave a voicemail — they\'ll call a competitor who picks up.',
        source: 'Numa Business Phone Report',
    },
    {
        stat: '$15k',
        title: 'Walking Out the Door',
        desc: 'is the average lifetime value of a single home service customer. One unanswered call doesn\'t just lose a job — it loses years of repeat revenue.',
        source: 'Mediagistic HVAC Industry Report',
    },
    {
        stat: '16',
        title: 'Hours Per Week, Buried in Busywork',
        desc: 'is what the average owner spends on scheduling, reminders, follow-ups, and data entry. That\'s two full days a week not spent on billable work.',
        source: 'Time Etc Entrepreneur Survey',
    },
];
