import { ActivityLog, StatMetric, QuestionData } from './types';

export const STATS_DATA: StatMetric[] = [
  { label: 'Users Interacted', value: 1248, trend: 12 },
  { label: 'Messages Sent', value: 8503, trend: 5 },
  { label: 'Appointments Booked', value: 142, trend: 28 },
  { label: 'Avg Response Time', value: 1.2, unit: 's', trend: -10 },
  { label: 'Resolution Rate', value: 94.5, unit: '%', trend: 2 },
  { label: 'Leads Captured', value: 315, trend: 15 },
];

export const RECENT_ACTIVITY: ActivityLog[] = [
  {
    id: '1',
    platform: 'sms',
    contactName: 'Sarah Jenkins',
    timestamp: '10:42 AM',
    summary: 'Inquired about weekend availability.',
    fullDetails: 'Customer asked if we have openings this Saturday for a consultation. Agent checked calendar, confirmed 2:00 PM slot available, and tentatively held the spot pending confirmation.',
    sentiment: 'positive'
  },
  {
    id: '2',
    platform: 'email',
    contactName: 'TechCorp Logistics',
    timestamp: '09:15 AM',
    summary: 'Billing question regarding Invoice #4022.',
    fullDetails: 'Received inquiry about a discrepancy in the last invoice. Agent identified the line item in question (overtime surcharge), explained the rate card policy, and offered to send a detailed breakdown.',
    sentiment: 'neutral'
  },
  {
    id: '3',
    platform: 'phone',
    contactName: 'Unknown (555-0192)',
    timestamp: 'Yesterday',
    summary: 'Missed call follow-up / Spam filtered.',
    fullDetails: 'Incoming call detected as potential spam. Agent screened call. Caller did not leave a voicemail. Number added to watch list.',
    sentiment: 'negative'
  },
  {
    id: '4',
    platform: 'sms',
    contactName: 'Mike Ross',
    timestamp: 'Yesterday',
    summary: 'Rescheduling request confirmed.',
    fullDetails: 'Mike requested to move his Thursday appointment to Friday. Agent negotiated time, confirmed Friday at 10:00 AM, and updated the CRM.',
    sentiment: 'positive'
  },
];

export const QUESTION_DATA: QuestionData[] = [
  { category: 'Pricing & Quotes', count: 45, color: '#f97316' }, // Orange 500
  { category: 'Scheduling', count: 30, color: '#ea580c' }, // Orange 600
  { category: 'Service Details', count: 15, color: '#c2410c' }, // Orange 700
  { category: 'Support/Tech', count: 10, color: '#9a3412' }, // Orange 800
];