import { useCallback } from 'react';
import type { LeadData } from '../types/leads';

const SESSION_CONTACT_ID_KEY = 'taskrig_ghl_contact_id';

function getStoredContactId(): string | null {
  return sessionStorage.getItem(SESSION_CONTACT_ID_KEY);
}

function storeContactId(id: string): void {
  sessionStorage.setItem(SESSION_CONTACT_ID_KEY, id);
}

interface GHLPayload {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address1?: string;
  source?: string;
  tags?: string[];
  contactId?: string;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // If already has country code (11+ digits starting with 1), use as-is
  if (digits.length >= 11 && digits.startsWith('1')) return `+${digits}`;
  // Otherwise prepend +1 for Canada
  return `+1${digits}`;
}

function mapLeadDataToGHL(data: Partial<LeadData>): GHLPayload {
  const nameParts = (data.contactName ?? '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  const tags: string[] = [
    'get-started-complete',
    data.industry ? `industry:${data.industry}` : '',
    data.teamSize ? `team:${data.teamSize}` : '',
    ...(data.painPoints ?? []).map((p) => `pain:${p}`),
    data.consentSms ? 'sms-consent' : 'no-sms-consent',
  ].filter(Boolean);

  return {
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(fullName && { name: fullName }),
    ...(data.contactEmail && { email: data.contactEmail }),
    ...(data.contactPhone && {
      phone: formatPhone(data.contactPhone),
    }),
    ...(data.businessName && { companyName: data.businessName }),
    ...(data.businessAddress && { address1: data.businessAddress }),
    source: data.source ?? 'get-started',
    ...(tags.length > 0 && { tags }),
  };
}

export function useLeadCapture() {
  const createLead = useCallback(async (data: Partial<LeadData>): Promise<string | null> => {
    const payload = mapLeadDataToGHL(data);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn('[LeadCapture] Failed to create lead:', response.status);
        return null;
      }

      const result = await response.json();
      if (result.contactId) {
        storeContactId(result.contactId);
      }
      return result.contactId ?? null;
    } catch (err) {
      console.warn('[LeadCapture] Error creating lead:', err);
      return null;
    }
  }, []);

  return { createLead, contactId: getStoredContactId() };
}
