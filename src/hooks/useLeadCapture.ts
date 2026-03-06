import { useRef, useCallback } from 'react';
import type { LeadData } from '../types/leads';

const SESSION_LEAD_ID_KEY = 'taskrig_lead_id';
const SESSION_CONTACT_ID_KEY = 'taskrig_ghl_contact_id';

function getOrCreateLeadId(): string {
  let id = sessionStorage.getItem(SESSION_LEAD_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_LEAD_ID_KEY, id);
  }
  return id;
}

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

/**
 * Map LeadData fields to the GHL contact payload shape.
 */
function mapLeadDataToGHL(data: Partial<LeadData>, stage: 'partial' | 'complete' = 'partial'): GHLPayload {
  const nameParts = (data.contactName ?? '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  const tags: string[] = [
    stage === 'complete' ? 'get-started-complete' : 'get-started-partial',
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
    ...(data.contactPhone && { phone: data.contactPhone }),
    ...(data.businessName && { companyName: data.businessName }),
    ...(data.businessAddress && { address1: data.businessAddress }),
    source: data.source ?? 'get-started',
    ...(tags.length > 0 && { tags }),
  };
}

export function useLeadCapture() {
  const leadIdRef = useRef<string>(getOrCreateLeadId());

  const savePartialLead = useCallback(async (data: Partial<LeadData>): Promise<string | null> => {
    // If we already have a contactId, update instead of creating a duplicate
    const existingId = getStoredContactId();
    const payload = mapLeadDataToGHL(data);

    try {
      if (existingId) {
        const response = await fetch('/api/lead', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, contactId: existingId }),
        });
        if (!response.ok) {
          console.warn('[LeadCapture] Failed to update partial lead:', response.status);
          return null;
        }
        const result = await response.json();
        return result.contactId ?? existingId;
      }

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn('[LeadCapture] Failed to save partial lead:', response.status);
        return null;
      }

      const result = await response.json();
      if (result.contactId) {
        storeContactId(result.contactId);
      }
      return result.contactId ?? null;
    } catch (err) {
      console.warn('[LeadCapture] Error saving partial lead:', err);
      return null;
    }
  }, []);

  const updateLead = useCallback(async (data: Partial<LeadData>): Promise<string | null> => {
    const contactId = getStoredContactId();
    if (!contactId) {
      console.warn('[LeadCapture] No contactId stored, cannot update');
      return null;
    }

    try {
      const payload = mapLeadDataToGHL(data);
      const response = await fetch('/api/lead', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, contactId }),
      });

      if (!response.ok) {
        console.warn('[LeadCapture] Failed to update lead:', response.status);
        return null;
      }

      const result = await response.json();
      return result.contactId ?? contactId;
    } catch (err) {
      console.warn('[LeadCapture] Error updating lead:', err);
      return null;
    }
  }, []);

  const submitLead = useCallback(async (data: Partial<LeadData>): Promise<string | null> => {
    const contactId = getStoredContactId();
    if (!contactId) {
      console.warn('[LeadCapture] No contactId stored, cannot submit');
      return null;
    }

    try {
      const payload = mapLeadDataToGHL(data, 'complete');
      const response = await fetch('/api/lead', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, contactId }),
      });

      if (!response.ok) {
        console.warn('[LeadCapture] Failed to submit lead:', response.status);
        return null;
      }

      const result = await response.json();
      return result.contactId ?? contactId;
    } catch (err) {
      console.warn('[LeadCapture] Error submitting lead:', err);
      return null;
    }
  }, []);

  return {
    leadId: leadIdRef.current,
    contactId: getStoredContactId(),
    savePartialLead,
    updateLead,
    submitLead,
  };
}
