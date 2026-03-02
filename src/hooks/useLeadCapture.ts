import { useRef, useCallback } from 'react';

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

interface LeadFields {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address1?: string;
  source?: string;
  tags?: string[];
  [key: string]: unknown;
}

export function useLeadCapture() {
  const leadIdRef = useRef<string>(getOrCreateLeadId());

  const savePartialLead = useCallback(async (data: LeadFields): Promise<string | null> => {
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: data.source ?? 'Task Rig Website - Get Started',
        }),
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

  const updateLead = useCallback(async (data: LeadFields): Promise<string | null> => {
    const contactId = getStoredContactId();
    if (!contactId) {
      console.warn('[LeadCapture] No contactId stored, cannot update');
      return null;
    }

    try {
      const response = await fetch('/api/lead', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, contactId }),
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

  const submitLead = useCallback(async (data: LeadFields): Promise<string | null> => {
    const contactId = getStoredContactId();
    if (!contactId) {
      console.warn('[LeadCapture] No contactId stored, cannot submit');
      return null;
    }

    try {
      const response = await fetch('/api/lead', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          contactId,
          tags: [...(data.tags ?? []), 'get-started-complete'],
        }),
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
