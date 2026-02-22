# TaskRig Lead API Endpoint Setup

## LeadData Schema

The onboarding wizard (`components/GetStartedPage.tsx`) collects the following data:

```typescript
interface LeadData {
  // Step 1: Business (auto-filled via Google Places or manual entry)
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessCategory: string;     // e.g. "plumber", "hvac" (from Google Places types)
  businessRating: number | null; // Google Places rating (1-5)
  businessPlaceId: string;       // Google Places ID for deduplication

  // Step 2: Industry & Services
  industry: string;              // e.g. "hvac", "plumbing", "electrical", "other"
  customIndustry: string;        // free-text if industry === "other"
  services: string[];            // e.g. ["AC Repair", "Installation", "Maintenance"]

  // Step 3: Pain Points & Needs
  painPoints: string[];          // e.g. ["missed-calls", "slow-response", "scheduling-chaos"]
  currentTools: string[];        // (currently unused in wizard, reserved for future)
  desiredIntegrations: string[]; // e.g. ["sms", "calendars", "crm", "ai-agent"]

  // Step 4: Team & Volume
  teamSize: string;              // "Solo" | "2-5" | "6-15" | "16-50" | "51-200" | "200+"
  monthlyCallVolume: string;     // "< 50/mo" | "50-200/mo" | "200-500/mo" | "500-1000/mo" | "1000+/mo"
  monthlyLeadVolume: string;     // "< 20/mo" | "20-100/mo" | "100-500/mo" | "500+/mo"
  operatingHours: string;        // "Standard (9-5)" | "Extended (7-7)" | "24/7" | "Varies / Seasonal"

  // Step 5: Contact Info
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;           // "Owner" | "Manager" | "Operations Lead" | "Marketing" | "IT / Tech" | "Other"
  preferredContactMethod: string; // "phone" | "email" | "text"
  notes: string;                 // free-text
}
```

## Full Submission Payload

On submit, the wizard sends an enriched payload with metadata:

```typescript
interface LeadSubmission extends LeadData {
  submittedAt: string;   // ISO 8601 timestamp
  source: string;        // "get-started-wizard"
  utmSource: string;     // from URL ?utm_source=
  utmMedium: string;     // from URL ?utm_medium=
  utmCampaign: string;   // from URL ?utm_campaign=
}
```

## API Endpoint

**POST** `<LEAD_API_URL>/api/leads`

> The actual URL is TBD. Set it via environment variable `VITE_LEAD_API_URL`.

### Request

```
POST /api/leads
Content-Type: application/json

{
  "businessName": "Acme HVAC Services",
  "businessAddress": "123 Main St, Toronto, ON M5V 2T6",
  "businessPhone": "+1 (416) 555-0123",
  "businessCategory": "hvac",
  "businessRating": 4.6,
  "businessPlaceId": "ChIJp1...",
  "industry": "hvac",
  "customIndustry": "",
  "services": ["AC Repair", "Heating Repair", "Installation"],
  "painPoints": ["missed-calls", "slow-response", "no-after-hours"],
  "currentTools": [],
  "desiredIntegrations": ["sms", "calendars", "crm", "ai-agent"],
  "teamSize": "6-15",
  "monthlyCallVolume": "200-500/mo",
  "monthlyLeadVolume": "100-500/mo",
  "operatingHours": "Extended (7-7)",
  "contactName": "Jane Doe",
  "contactEmail": "jane@acmehvac.com",
  "contactPhone": "+1 (416) 555-0124",
  "contactRole": "Owner",
  "preferredContactMethod": "phone",
  "notes": "Currently using ServiceTitan, looking to switch.",
  "submittedAt": "2026-02-21T15:30:00.000Z",
  "source": "get-started-wizard",
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "hvac-toronto"
}
```

### Response

```
200 OK
{ "id": "lead_abc123", "status": "received" }
```

## Wiring Up the Form Submission

Replace the `console.log` in `handleSubmit` (`GetStartedPage.tsx:579`) with a real fetch call:

```typescript
const handleSubmit = async () => {
  const payload = {
    ...data,
    submittedAt: new Date().toISOString(),
    source: 'get-started-wizard',
    utmSource: new URLSearchParams(window.location.search).get('utm_source') || '',
    utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || '',
    utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
  };

  try {
    const res = await fetch(`${import.meta.env.VITE_LEAD_API_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('[TaskRig] Lead submission failed:', err);
    // TODO: show error toast to user
  }
};
```

## Backend Options

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **Webhook (Zapier/Make)** | Zero code, instant setup, connects to CRM/Sheets/email | Monthly cost, rate limits, vendor lock-in | MVP / quick launch |
| **Supabase** | Free tier, Postgres, real-time, auth built-in, edge functions | Need to manage schema, limited compute on free tier | Small-medium scale |
| **Vercel Serverless (API route)** | Same deploy as frontend, zero infra, edge-fast | Cold starts, 10s timeout on free tier | If already on Vercel |
| **Custom Express/Fastify API** | Full control, any hosting, custom logic | More setup, need hosting (Railway, Fly, etc.) | Custom workflows |
| **Google Sheets API** | Dead simple, business users can access | Not a real DB, 500 row/s limit, fragile | Prototype only |

### Recommended: Supabase

1. Create a `leads` table matching the `LeadData` schema
2. Use Supabase JS client or REST API from a Vercel edge function
3. Set up a Supabase trigger to send email notifications on new leads
4. Dashboard via Supabase Studio or custom admin page

### Quick Start: Webhook

For fastest launch, use a webhook service:

```
VITE_LEAD_API_URL=https://hooks.zapier.com/hooks/catch/12345/abcdef
```

The form POSTs directly to the webhook, which forwards to your CRM / Google Sheet / email.

## Environment Variables

```env
# Lead API
VITE_LEAD_API_URL=https://your-api-url.com  # or webhook URL

# Google Places (for business autocomplete in Step 1)
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```
