export interface ActivityLog {
  id: string;
  platform: 'email' | 'sms' | 'phone';
  contactName: string;
  timestamp: string;
  summary: string;
  fullDetails: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface StatMetric {
  label: string;
  value: string | number;
  trend?: number; // percentage change
  unit?: string;
}

export enum Tab {
  AGENT = 'AGENT',
  ACCOUNT = 'ACCOUNT'
}

export type TimeRange = '1d' | '1w' | '1m' | '1y';

export interface QuestionData {
  category: string;
  count: number;
  color: string;
}