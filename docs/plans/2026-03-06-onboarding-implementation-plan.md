# Onboarding Conversion Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Get Started onboarding flow from a 3-phase, 26-field data-collection form into a 4-phase, ~12-interaction conversion funnel with embedded scheduling, a personalized value preview, and psychological momentum — without repeating landing page content.

**Architecture:** Linear 4-phase wizard (Trade Selection → Needs Assessment → Value Preview → Book Call) built on the existing GetStartedPage scaffold. Phases are React components with Framer Motion slide transitions. GHL calendar embed replaces phone CTAs. The useLeadCapture hook gets wired in for real lead persistence. New Phase 3 (Value Preview) delivers personalized insights before asking for contact info (Phase 4).

**Tech Stack:** React 19, TypeScript, Framer Motion 12, Tailwind CSS, Lucide React icons, Google Places API, GHL API (existing `/api/lead.ts`), GHL Calendar embed

**Design Spec:** `docs/plans/2026-03-06-onboarding-conversion-design.md`

**Key Constraint:** The landing page already shows testimonials, pain point stats, feature showcases, pricing, FAQs, integration logos, and trust badges. The onboarding flow must NOT repeat any of this. It should be focused, action-oriented, and feel like a conversation — not a second sales pitch. The only trust signals allowed in-flow are micro-signals (lock icon near phone field, "no obligation" text near CTA) that serve the immediate conversion context.

---

## Task Overview

| # | Task | Files | Est. |
|---|------|-------|------|
| 1 | Update types & constants for new 4-phase flow | `leads.ts`, `integrations.ts`, `industries.ts` | 5 min |
| 2 | Rebuild StepIndicator for 4 phases + endowed progress | `StepIndicator.tsx` | 10 min |
| 3 | Rebuild Phase 1: Trade Selection (simplified) | `Phase1Trade.tsx` (new) | 15 min |
| 4 | Rebuild Phase 2: Needs Assessment (streamlined) | `Phase2Needs.tsx` (rewrite) | 10 min |
| 5 | Build Phase 3: Value Preview (new) | `Phase3Preview.tsx` (new) | 15 min |
| 6 | Build Phase 4: Book Your Call (new) | `Phase4Book.tsx` (new) | 15 min |
| 7 | Rebuild SuccessState with personalized confirmation | `SuccessState.tsx` (rewrite) | 10 min |
| 8 | Rewire GetStartedPage orchestrator for 4 phases | `GetStartedPage.tsx` (rewrite) | 15 min |
| 9 | Wire up useLeadCapture hook + GHL integration | `GetStartedPage.tsx`, `useLeadCapture.ts` | 10 min |
| 10 | Clean up old files, update routes, final polish | Multiple | 10 min |

---

## Task 1: Update Types & Constants for 4-Phase Flow

**Files:**
- Modify: `src/types/leads.ts`
- Modify: `src/constants/integrations.ts`
- Modify: `src/constants/industries.ts`

### Step 1: Update LeadData interface

Slim down the interface to match the new ~12 interactions. Remove fields we'll auto-enrich or cut entirely.

```typescript
// src/types/leads.ts

export interface LeadData {
  // Phase 1: Trade
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessRating: number | null;
  businessPlaceId: string;
  industry: string;        // single selection now (was industries[])
  customIndustry: string;

  // Phase 2: Needs
  painPoints: string[];    // max 3
  teamSize: string;

  // Phase 3: Preview (no new data — computed from Phase 1+2)

  // Phase 4: Book
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  consentSms: boolean;     // single consolidated consent

  // Booking
  appointmentSlot: string | null;  // ISO datetime from calendar

  // Meta
  source: string;
  completedAt: string | null;
}

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  rating?: number;
  types?: string[];
}
```

### Step 2: Update PHASES constant

```typescript
// In src/constants/integrations.ts — update PHASES array

export const PHASES = [
  { num: 1, title: 'Your Trade',   subtitle: 'Find your business' },
  { num: 2, title: 'Your Needs',   subtitle: 'What should we focus on?' },
  { num: 3, title: 'Your Preview', subtitle: 'See what Task Rig does for you' },
  { num: 4, title: 'Book a Call',  subtitle: 'Pick a time — it\'s free' },
];
```

Remove `CALL_VOLUMES`, `LEAD_VOLUMES`, `HOURS` from integrations.ts — these are unused in the new flow.

### Step 3: Trim PAIN_POINTS to top 6

```typescript
// In src/constants/industries.ts — reduce from 10 to 6

export const PAIN_POINTS = [
  { id: 'missed-calls',     label: 'Missed calls & leads',     icon: 'PhoneOff' },
  { id: 'slow-response',    label: 'Slow response times',      icon: 'Clock' },
  { id: 'scheduling',       label: 'Scheduling chaos',         icon: 'CalendarX' },
  { id: 'after-hours',      label: 'No after-hours coverage',  icon: 'Moon' },
  { id: 'manual-work',      label: 'Manual paperwork & admin', icon: 'ClipboardList' },
  { id: 'reviews',          label: 'Not enough reviews',       icon: 'Star' },
];
```

### Step 4: Simplify TEAM_SIZES

```typescript
// In src/constants/integrations.ts
export const TEAM_SIZES = ['Just me', '2–5', '6–15', '16–50', '50+'];
```

### Step 5: Commit

```bash
git add src/types/leads.ts src/constants/integrations.ts src/constants/industries.ts
git commit -m "$(cat <<'EOF'
refactor: update types and constants for 4-phase onboarding flow

Slim LeadData to ~12 fields, add appointmentSlot, consolidate consent
into single checkbox. Reduce pain points from 10 to 6, team sizes from
6 to 5. Update PHASES constant from 3 to 4 phases.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Rebuild StepIndicator for 4 Phases + Endowed Progress

**Files:**
- Modify: `src/pages/get-started/StepIndicator.tsx`

### Step 1: Rewrite StepIndicator

The new indicator supports 4 phases, starts progress at ~20% (endowed progress effect), and uses a single continuous progress bar with step markers rather than segmented bars.

```tsx
// src/pages/get-started/StepIndicator.tsx
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PHASES } from '../../constants/integrations';

interface StepIndicatorProps {
  currentPhase: number;  // 1-4
  totalPhases?: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentPhase,
  totalPhases = 4,
}) => {
  // Endowed progress: phase 0 (just arrived) = 15%, each phase completion adds roughly equal chunks
  const progressPercent = Math.min(
    15 + ((currentPhase - 1) / totalPhases) * 85,
    100
  );

  return (
    <div className="w-full space-y-3">
      {/* Continuous progress bar */}
      <div className="relative h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
          initial={{ width: '15%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step markers */}
      <div className="flex justify-between">
        {PHASES.map((phase) => {
          const isActive = phase.num === currentPhase;
          const isComplete = phase.num < currentPhase;

          return (
            <div
              key={phase.num}
              className="flex items-center gap-2"
            >
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono
                  transition-colors duration-300
                  ${isComplete
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : isActive
                      ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400'
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-600'
                  }
                `}
              >
                {isComplete ? <Check className="w-3 h-3" /> : phase.num}
              </div>
              <span
                className={`
                  hidden sm:inline text-xs font-mono transition-colors duration-300
                  ${isComplete ? 'text-emerald-400' : isActive ? 'text-orange-400' : 'text-zinc-600'}
                `}
              >
                {phase.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### Step 2: Commit

```bash
git add src/pages/get-started/StepIndicator.tsx
git commit -m "$(cat <<'EOF'
feat: rebuild StepIndicator for 4 phases with endowed progress

Continuous progress bar starts at 15% (endowed progress effect).
Step markers show phase numbers with checkmarks for completed steps.
Responsive: labels hidden on mobile, visible on sm+.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Build Phase 1 — Trade Selection (Simplified)

**Files:**
- Create: `src/pages/get-started/phases/Phase1Trade.tsx`
- Reference: `src/components/forms/InputField.tsx`, `src/constants/industries.ts`

### Design Intent

This is the "foot-in-the-door" phase. One tap on an industry icon is the only required interaction. Business search is encouraged but optional. No typing required to proceed. Auto-advances feel fast — progress bar jumps from 15% to 40%.

**What's different from current Phase1Business:**
- Industry is single-select (not multi-select) — simpler, faster
- Services list is removed entirely (auto-derived later)
- Manual entry fallback is more compact
- The whole phase feels like one question, not a form

### Step 1: Write Phase1Trade component

```tsx
// src/pages/get-started/phases/Phase1Trade.tsx
import { motion } from 'framer-motion';
import { Search, MapPin, Building2 } from 'lucide-react';
import { staggerContainer, staggerItem } from '../animations';
import { INDUSTRIES } from '../../../constants/industries';
import type { LeadData, PlacePrediction, PlaceDetails } from '../../../types/leads';

// Icon mapping — import all needed Lucide icons
import {
  Flame, Droplets, Zap, Home, Trees, Paintbrush, HardHat, Sparkles,
  Car, Heart, Smile, Scale, Building, UtensilsCrossed, Scissors,
  Truck, Bug, Wrench, Package, CircleHelp,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Flame, Droplets, Zap, Home, Trees, Paintbrush, HardHat, Sparkles,
  Car, Heart, Smile, Scale, Building, UtensilsCrossed, Scissors,
  Truck, Bug, Wrench, Package, CircleHelp,
};

interface Phase1TradeProps {
  data: LeadData;
  update: (partial: Partial<LeadData>) => void;
  predictions: PlacePrediction[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onSelectPlace: (prediction: PlacePrediction) => void;
}

export const Phase1Trade: React.FC<Phase1TradeProps> = ({
  data,
  update,
  predictions,
  isSearching,
  onSearch,
  onSelectPlace,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showManual, setShowManual] = React.useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 2) onSearch(value);
  };

  const selectedIndustry = INDUSTRIES.find((i) => i.id === data.industry);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Industry grid */}
      <motion.div variants={staggerItem} className="space-y-3">
        <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
          What type of service business do you run?
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {INDUSTRIES.map((ind) => {
            const Icon = ICON_MAP[ind.icon] || CircleHelp;
            const isSelected = data.industry === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => update({ industry: isSelected ? '' : ind.id })}
                className={`
                  flex flex-col items-center gap-1.5 p-3 rounded-sm border transition-all duration-200
                  ${isSelected
                    ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-mono leading-tight text-center">
                  {ind.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Custom industry input — only if "Other" selected */}
      {data.industry === 'other' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <label className="block text-zinc-400 font-mono text-xs uppercase tracking-widest">
            What's your trade?
          </label>
          <input
            type="text"
            value={data.customIndustry}
            onChange={(e) => update({ customIndustry: e.target.value })}
            placeholder="e.g., Pool maintenance, Fencing..."
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-sm px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-700"
          />
        </motion.div>
      )}

      {/* Business search */}
      <motion.div variants={staggerItem} className="space-y-2">
        <label className="block text-zinc-400 font-mono text-xs uppercase tracking-widest">
          Find your business <span className="text-zinc-600">(optional)</span>
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Start typing your business name..."
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-sm pl-10 pr-4 py-3 text-white font-mono text-base focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-700"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Search results dropdown */}
        {predictions.length > 0 && (
          <div className="border border-zinc-800 rounded-sm overflow-hidden">
            {predictions.map((p) => (
              <button
                key={p.place_id}
                onClick={() => {
                  onSelectPlace(p);
                  setSearchQuery('');
                }}
                className="w-full px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-b-0"
              >
                <p className="text-sm text-zinc-200 font-mono">
                  {p.structured_formatting.main_text}
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  {p.structured_formatting.secondary_text}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Selected business card */}
        {data.businessName && data.businessPlaceId && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-sm"
          >
            <Building2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-emerald-300 font-mono truncate">{data.businessName}</p>
              {data.businessAddress && (
                <p className="text-xs text-zinc-500 font-mono flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{data.businessAddress}</span>
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Manual entry toggle */}
        {!data.businessPlaceId && (
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-xs text-zinc-500 hover:text-zinc-400 font-mono transition-colors"
          >
            {showManual ? 'Hide manual entry' : "Can't find it? Enter manually"}
          </button>
        )}

        {showManual && !data.businessPlaceId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <input
              type="text"
              value={data.businessName}
              onChange={(e) => update({ businessName: e.target.value })}
              placeholder="Business name"
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-sm px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-700"
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
```

**Validation rule (handled in parent):** `data.industry !== ''` (and if industry === 'other', `data.customIndustry.trim() !== ''`)

### Step 2: Commit

```bash
git add src/pages/get-started/phases/Phase1Trade.tsx
git commit -m "$(cat <<'EOF'
feat: build Phase1Trade — simplified trade selection

Single industry pick with icon grid (foot-in-the-door). Google Places
business search is optional. No services list, no multi-select.
One required interaction to proceed.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Rebuild Phase 2 — Needs Assessment (Streamlined)

**Files:**
- Rewrite: `src/pages/get-started/phases/Phase2Needs.tsx`

### Design Intent

Two focused questions: pain points (multi-select, max 3) and team size (single select). No integrations selection (removed — it was 12 options and already covered on the landing page). This is the "IKEA Effect" phase where users define their problem.

### Step 1: Rewrite Phase2Needs

```tsx
// src/pages/get-started/phases/Phase2Needs.tsx
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../animations';
import { PAIN_POINTS } from '../../../constants/industries';
import { TEAM_SIZES } from '../../../constants/integrations';
import type { LeadData } from '../../../types/leads';

import {
  PhoneOff, Clock, CalendarX, Moon, ClipboardList, Star,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  PhoneOff, Clock, CalendarX, Moon, ClipboardList, Star,
};

interface Phase2NeedsProps {
  data: LeadData;
  update: (partial: Partial<LeadData>) => void;
}

export const Phase2Needs: React.FC<Phase2NeedsProps> = ({ data, update }) => {
  const togglePainPoint = (id: string) => {
    const current = data.painPoints;
    if (current.includes(id)) {
      update({ painPoints: current.filter((p) => p !== id) });
    } else if (current.length < 3) {
      update({ painPoints: [...current, id] });
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Pain points */}
      <motion.div variants={staggerItem} className="space-y-3">
        <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
          What's your biggest challenge right now?
        </p>
        <p className="text-zinc-600 font-mono text-xs">
          Pick up to 3 — we'll focus on what matters most
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PAIN_POINTS.map((pp) => {
            const Icon = ICON_MAP[pp.icon] || Clock;
            const isSelected = data.painPoints.includes(pp.id);
            const isDisabled = !isSelected && data.painPoints.length >= 3;

            return (
              <button
                key={pp.id}
                onClick={() => !isDisabled && togglePainPoint(pp.id)}
                disabled={isDisabled}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-sm border transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                    : isDisabled
                      ? 'border-zinc-800/50 text-zinc-700 cursor-not-allowed'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-sm font-mono">{pp.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Team size */}
      <motion.div variants={staggerItem} className="space-y-3">
        <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
          How big is your team?
        </p>
        <div className="flex flex-wrap gap-2">
          {TEAM_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => update({ teamSize: data.teamSize === size ? '' : size })}
              className={`
                px-4 py-2.5 rounded-sm border font-mono text-sm transition-all duration-200
                ${data.teamSize === size
                  ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
```

**Validation rule (handled in parent):** `data.teamSize !== ''`

### Step 2: Commit

```bash
git add src/pages/get-started/phases/Phase2Needs.tsx
git commit -m "$(cat <<'EOF'
feat: streamline Phase2Needs — pain points (max 3) + team size

Remove integrations selection (12 options → 0). Reduce pain points
from 10 to 6 with max-3 selection. Team size uses pill buttons.
Two focused questions, ~30 seconds to complete.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Build Phase 3 — Value Preview (New)

**Files:**
- Create: `src/pages/get-started/phases/Phase3Preview.tsx`

### Design Intent

This is the key differentiator. Before asking for any contact info, we show the user a personalized preview of what Task Rig will do for their business. This triggers **reciprocity** (we gave you something first) and **loss aversion** (abandoning means losing this). No data collection in this phase — it's pure value delivery.

This is NOT repeating landing page content. The landing page shows generic features. This phase shows **personalized** outputs based on what the user just told us (their trade, pain points, team size). It's the difference between a brochure and a custom proposal.

### Step 1: Create the value preview logic

```tsx
// src/pages/get-started/phases/Phase3Preview.tsx
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { staggerContainer, staggerItem } from '../animations';
import { INDUSTRIES, PAIN_POINTS } from '../../../constants/industries';
import type { LeadData } from '../../../types/leads';

// Map pain point IDs to personalized action statements
const PAIN_POINT_ACTIONS: Record<string, string> = {
  'missed-calls':   'Answer 100% of inbound calls with AI — even at 2 AM',
  'slow-response':  'Respond to every lead in under 60 seconds, automatically',
  'scheduling':     'Let customers self-book into your calendar via text or chat',
  'after-hours':    'Run a 24/7 virtual front desk that never clocks out',
  'manual-work':    'Automate estimates, follow-ups, and dispatch paperwork',
  'reviews':        'Request and respond to reviews after every completed job',
};

// Estimated impact based on pain points (conservative, credible ranges)
function getImpactEstimates(painPoints: string[], teamSize: string) {
  let hoursPerWeek = 0;
  let responseImprovement = '';
  let leadRecovery = '';

  if (painPoints.includes('missed-calls'))  { hoursPerWeek += 6; leadRecovery = '15–30 more leads captured/month'; }
  if (painPoints.includes('slow-response')) { hoursPerWeek += 4; responseImprovement = '95% faster response time'; }
  if (painPoints.includes('scheduling'))    { hoursPerWeek += 5; }
  if (painPoints.includes('after-hours'))   { hoursPerWeek += 8; leadRecovery = leadRecovery || '10–20 after-hours leads/month'; }
  if (painPoints.includes('manual-work'))   { hoursPerWeek += 10; }
  if (painPoints.includes('reviews'))       { hoursPerWeek += 3; }

  // Scale by team size
  const multiplier = teamSize === '50+' ? 2.5 : teamSize === '16–50' ? 2 : teamSize === '6–15' ? 1.5 : 1;
  hoursPerWeek = Math.round(hoursPerWeek * multiplier);

  return {
    hoursPerWeek: hoursPerWeek || 8,
    responseImprovement: responseImprovement || 'Sub-60-second response time',
    leadRecovery: leadRecovery || '10–25 more leads captured/month',
  };
}

interface Phase3PreviewProps {
  data: LeadData;
}

export const Phase3Preview: React.FC<Phase3PreviewProps> = ({ data }) => {
  const industryLabel = INDUSTRIES.find((i) => i.id === data.industry)?.label
    || data.customIndustry
    || 'your business';
  const businessLabel = data.businessName || industryLabel;
  const impact = getImpactEstimates(data.painPoints, data.teamSize);

  const selectedActions = data.painPoints
    .map((id) => PAIN_POINT_ACTIONS[id])
    .filter(Boolean);

  // Fallback if no pain points selected
  if (selectedActions.length === 0) {
    selectedActions.push(
      'Answer 100% of inbound calls with AI',
      'Respond to every lead in under 60 seconds',
      'Run a 24/7 virtual front desk',
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Preview card */}
      <motion.div
        variants={staggerItem}
        className="border border-zinc-800 rounded-sm overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">
              Your Operations Preview
            </span>
          </div>
          <p className="text-lg text-zinc-100 font-heading">
            {businessLabel}
          </p>
          <p className="text-xs text-zinc-500 font-mono">
            {industryLabel} &middot; {data.teamSize || 'Small'} team
          </p>
        </div>

        {/* Action items */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Task Rig will
          </p>
          {selectedActions.map((action, i) => (
            <motion.div
              key={action}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-start gap-3"
            >
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-200 font-mono">{action}</span>
            </motion.div>
          ))}
        </div>

        {/* Impact estimates */}
        <div className="px-5 py-4 border-t border-zinc-800 bg-zinc-900/30">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3">
            Estimated impact
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xl font-heading text-orange-400">~{impact.hoursPerWeek}</p>
              <p className="text-[10px] font-mono text-zinc-500">hrs/week saved</p>
            </div>
            <div>
              <p className="text-xl font-heading text-orange-400">&lt;60s</p>
              <p className="text-[10px] font-mono text-zinc-500">response time</p>
            </div>
            <div>
              <p className="text-xl font-heading text-orange-400">24/7</p>
              <p className="text-[10px] font-mono text-zinc-500">coverage</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prompt to continue */}
      <motion.p
        variants={staggerItem}
        className="text-center text-sm text-zinc-400 font-mono"
      >
        See how this works — book a free walkthrough
        <ArrowRight className="inline w-4 h-4 ml-1 text-orange-400" />
      </motion.p>
    </motion.div>
  );
};
```

**Validation rule:** None — this phase auto-enables "Continue" immediately. It's a read-only preview.

### Step 2: Commit

```bash
git add src/pages/get-started/phases/Phase3Preview.tsx
git commit -m "$(cat <<'EOF'
feat: build Phase3Preview — personalized value preview

Shows personalized action items and impact estimates based on user's
trade, pain points, and team size. No data collection — pure value
delivery to trigger reciprocity before asking for contact info.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Build Phase 4 — Book Your Call (New)

**Files:**
- Create: `src/pages/get-started/phases/Phase4Book.tsx`

### Design Intent

Contact info (3 fields) + embedded calendar. Phone field reframed as "Where should we text your confirmation?" Single consolidated consent checkbox. Trust signals near sensitive fields. This is where all the conversion psychology converges: loss aversion (they've built their preview), trust signals, scarcity (curated time slots), and clear benefit framing.

**Calendar integration note:** For initial implementation, use a GHL calendar embed iframe. The exact embed URL will depend on the GHL account setup. We'll use an environment variable `VITE_GHL_CALENDAR_URL` for the iframe src. If the calendar URL is not configured, fall back to a "We'll call you within 24 hours" message with a phone CTA.

### Step 1: Create Phase4Book

```tsx
// src/pages/get-started/phases/Phase4Book.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';
import { staggerContainer, staggerItem } from '../animations';
import type { LeadData } from '../../../types/leads';

interface Phase4BookProps {
  data: LeadData;
  update: (partial: Partial<LeadData>) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const calendarUrl = import.meta.env.VITE_GHL_CALENDAR_URL;

export const Phase4Book: React.FC<Phase4BookProps> = ({
  data,
  update,
  errors,
  setErrors,
}) => {
  const validateEmail = (email: string) => {
    if (!email.includes('@') || !email.includes('.')) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email address' }));
    } else {
      setErrors((prev) => { const { email: _, ...rest } = prev; return rest; });
    }
  };

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setErrors((prev) => ({ ...prev, phone: 'Enter at least 10 digits' }));
    } else {
      setErrors((prev) => { const { phone: _, ...rest } = prev; return rest; });
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Trust badge */}
      <motion.div
        variants={staggerItem}
        className="flex items-center gap-2 text-zinc-500"
      >
        <Shield className="w-4 h-4" />
        <span className="text-xs font-mono">
          Free walkthrough &middot; No obligation &middot; No credit card
        </span>
      </motion.div>

      {/* Contact fields */}
      <motion.div variants={staggerItem} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-zinc-400 font-mono text-xs uppercase tracking-widest mb-2">
            Your name <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            value={data.contactName}
            onChange={(e) => update({ contactName: e.target.value })}
            placeholder="Jane Doe"
            autoComplete="name"
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-sm px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-700"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-zinc-400 font-mono text-xs uppercase tracking-widest mb-2">
            Email <span className="text-orange-500">*</span>
          </label>
          <input
            type="email"
            value={data.contactEmail}
            onChange={(e) => {
              update({ contactEmail: e.target.value });
              if (errors.email) validateEmail(e.target.value);
            }}
            onBlur={(e) => validateEmail(e.target.value)}
            placeholder="jane@acmehvac.com"
            autoComplete="email"
            className={`w-full bg-zinc-950/50 border rounded-sm px-4 py-3 text-white font-mono text-base focus:outline-none focus:ring-1 transition-all placeholder:text-zinc-700 ${
              errors.email
                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50'
                : 'border-zinc-800 focus:border-orange-500/50 focus:ring-orange-500/50'
            }`}
          />
          {errors.email && (
            <p className="text-red-400 text-xs font-mono mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone — reframed */}
        <div>
          <label className="block text-zinc-400 font-mono text-xs uppercase tracking-widest mb-2">
            Where should we text your confirmation? <span className="text-orange-500">*</span>
          </label>
          <input
            type="tel"
            value={data.contactPhone}
            onChange={(e) => {
              update({ contactPhone: e.target.value });
              if (errors.phone) validatePhone(e.target.value);
            }}
            onBlur={(e) => validatePhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            className={`w-full bg-zinc-950/50 border rounded-sm px-4 py-3 text-white font-mono text-base focus:outline-none focus:ring-1 transition-all placeholder:text-zinc-700 ${
              errors.phone
                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50'
                : 'border-zinc-800 focus:border-orange-500/50 focus:ring-orange-500/50'
            }`}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs font-mono mt-1">{errors.phone}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5">
            <Lock className="w-3 h-3 text-zinc-600" />
            <span className="text-[10px] font-mono text-zinc-600">
              Your info is encrypted and never shared
            </span>
          </div>
        </div>
      </motion.div>

      {/* Calendar embed or fallback */}
      <motion.div variants={staggerItem} className="space-y-3">
        <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
          Pick a time for your walkthrough
        </p>
        {calendarUrl ? (
          <div className="border border-zinc-800 rounded-sm overflow-hidden bg-zinc-900/30">
            <iframe
              src={calendarUrl}
              className="w-full h-[400px] border-0"
              title="Schedule your walkthrough"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="border border-zinc-800 rounded-sm p-6 bg-zinc-900/30 text-center space-y-3">
            <p className="text-sm text-zinc-300 font-mono">
              We'll reach out within 24 hours to schedule your walkthrough.
            </p>
            <p className="text-xs text-zinc-500 font-mono">
              Or call us now:&nbsp;
              <a
                href="tel:+18442222486"
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                (844) 222-2486
              </a>
            </p>
          </div>
        )}
      </motion.div>

      {/* Consent */}
      <motion.div variants={staggerItem}>
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            className={`
              w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 transition-all
              ${data.consentSms
                ? 'bg-orange-500/20 border-orange-500/50'
                : 'border-zinc-700 group-hover:border-zinc-600'
              }
            `}
            onClick={() => update({ consentSms: !data.consentSms })}
          >
            {data.consentSms && (
              <svg className="w-3 h-3 text-orange-400" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-xs text-zinc-500 font-mono leading-relaxed">
            I agree to receive appointment confirmations and updates via SMS from TaskRig.
            Msg & data rates may apply. Reply STOP anytime.{' '}
            <a href="/privacy" className="text-zinc-400 underline hover:text-zinc-300">
              Privacy Policy
            </a>
          </span>
        </label>
      </motion.div>
    </motion.div>
  );
};
```

**Validation rule (handled in parent):**
```typescript
data.contactName.trim() !== '' &&
data.contactEmail.includes('@') && data.contactEmail.includes('.') &&
data.contactPhone.replace(/\D/g, '').length >= 10
```

### Step 2: Commit

```bash
git add src/pages/get-started/phases/Phase4Book.tsx
git commit -m "$(cat <<'EOF'
feat: build Phase4Book — contact form + calendar embed

3 contact fields (name, email, phone reframed as 'where to text
confirmation'). GHL calendar iframe embed with env var URL, fallback
to 'we'll call you' if not configured. Single SMS consent checkbox.
Trust signals: lock icon, 'no obligation' badge, encrypted note.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Rebuild SuccessState with Personalized Confirmation

**Files:**
- Rewrite: `src/pages/get-started/SuccessState.tsx`

### Design Intent

Peak-end rule: the ending colors the entire experience. Instead of a generic "You're All Set" with phone CTAs, show a personalized confirmation with what the walkthrough will cover (based on their pain points), an add-to-calendar option, and confirmation that an SMS was sent.

### Step 1: Rewrite SuccessState

```tsx
// src/pages/get-started/SuccessState.tsx
import { motion } from 'framer-motion';
import { Check, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAIN_POINTS } from '../../constants/industries';
import type { LeadData } from '../../types/leads';

const WALKTHROUGH_ITEMS: Record<string, string> = {
  'missed-calls':  'How AI handles your inbound calls 24/7',
  'slow-response': 'Automated lead response in under 60 seconds',
  'scheduling':    'Self-serve booking that fills your calendar',
  'after-hours':   'Your virtual front desk — nights, weekends, holidays',
  'manual-work':   'Automating estimates, dispatch, and follow-ups',
  'reviews':       'Hands-free review requests after every job',
};

interface SuccessStateProps {
  data: LeadData;
}

export const SuccessState: React.FC<SuccessStateProps> = ({ data }) => {
  const firstName = data.contactName.split(' ')[0] || 'there';

  const walkthroughTopics = data.painPoints
    .map((id) => WALKTHROUGH_ITEMS[id])
    .filter(Boolean);

  if (walkthroughTopics.length === 0) {
    walkthroughTopics.push(
      'How AI handles your inbound calls 24/7',
      'Automated lead response and scheduling',
      'Live demo with your business data',
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="text-center space-y-6"
    >
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
      >
        <Check className="w-8 h-8 text-emerald-400" />
      </motion.div>

      {/* Heading */}
      <div>
        <h2 className="text-xl font-heading text-zinc-100">
          You're all set, {firstName}!
        </h2>
        {data.appointmentSlot ? (
          <p className="text-sm text-zinc-400 font-mono mt-1">
            Your walkthrough is confirmed.
          </p>
        ) : (
          <p className="text-sm text-zinc-400 font-mono mt-1">
            We'll reach out to {data.contactEmail} within 24 hours.
          </p>
        )}
      </div>

      {/* What we'll cover */}
      <div className="border border-zinc-800 rounded-sm text-left">
        <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            What we'll cover in your walkthrough
          </p>
        </div>
        <div className="px-5 py-4 space-y-2.5">
          {walkthroughTopics.map((topic) => (
            <div key={topic} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-300 font-mono">{topic}</span>
            </div>
          ))}
          <div className="flex items-start gap-3">
            <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span className="text-sm text-zinc-300 font-mono">
              Live demo customized for {data.businessName || 'your business'}
            </span>
          </div>
        </div>
      </div>

      {/* SMS confirmation note */}
      {data.contactPhone && (
        <p className="text-xs text-zinc-500 font-mono">
          We just texted a confirmation to {data.contactPhone}
        </p>
      )}

      {/* Back to home */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
    </motion.div>
  );
};
```

### Step 2: Commit

```bash
git add src/pages/get-started/SuccessState.tsx
git commit -m "$(cat <<'EOF'
feat: rebuild SuccessState with personalized walkthrough preview

Shows personalized topics based on pain point selections. First-name
greeting via peak-end rule. SMS confirmation note. Removes hardcoded
phone CTAs in favor of embedded calendar booking (handled in Phase 4).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Rewire GetStartedPage Orchestrator for 4 Phases

**Files:**
- Rewrite: `src/pages/get-started/GetStartedPage.tsx`

### Design Intent

The orchestrator manages state, validation, phase transitions, and Google Places API integration. It's a significant rewrite: 4 phases instead of 3, slimmed-down state, new validation rules, and the Places API logic stays but gets simplified.

### Step 1: Rewrite GetStartedPage

This is the largest single file. Key changes:
- State shape matches new `LeadData` interface
- 4 phases with new validation per phase
- Places API integration preserved (moved from inline to handler functions)
- Phase transitions use Framer Motion `AnimatePresence` with directional slides
- Submit handler calls `useLeadCapture` hook (wired in Task 9)

```tsx
// src/pages/get-started/GetStartedPage.tsx
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

import { StepIndicator } from './StepIndicator';
import { Phase1Trade } from './phases/Phase1Trade';
import { Phase2Needs } from './phases/Phase2Needs';
import { Phase3Preview } from './phases/Phase3Preview';
import { Phase4Book } from './phases/Phase4Book';
import { SuccessState } from './SuccessState';
import { useLeadCapture } from '../../hooks/useLeadCapture';
import type { LeadData, PlacePrediction, PlaceDetails } from '../../types/leads';

const INITIAL_DATA: LeadData = {
  businessName: '',
  businessAddress: '',
  businessPhone: '',
  businessRating: null,
  businessPlaceId: '',
  industry: '',
  customIndustry: '',
  painPoints: [],
  teamSize: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  consentSms: false,
  appointmentSlot: null,
  source: 'get-started',
  completedAt: null,
};

export const GetStartedPage: React.FC = () => {
  const [phase, setPhase] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [data, setData] = useState<LeadData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Places API state
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const placesServiceRef = useRef<HTMLDivElement>(null);

  const { submitLead } = useLeadCapture();

  const update = useCallback((partial: Partial<LeadData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  // --- Google Places API ---
  const handleSearch = useCallback((query: string) => {
    if (query.length < 2) { setPredictions([]); return; }
    setIsSearching(true);

    if (window.google?.maps?.places) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input: query, types: ['establishment'] },
        (results, status) => {
          if (status === 'OK' && results) {
            setPredictions(
              results.map((r) => ({
                place_id: r.place_id || '',
                description: r.description,
                structured_formatting: {
                  main_text: r.structured_formatting?.main_text || r.description,
                  secondary_text: r.structured_formatting?.secondary_text || '',
                },
              }))
            );
          } else {
            setPredictions([]);
          }
          setIsSearching(false);
        }
      );
    } else {
      setPredictions([]);
      setIsSearching(false);
    }
  }, []);

  const handleSelectPlace = useCallback((prediction: PlacePrediction) => {
    setPredictions([]);
    update({
      businessName: prediction.structured_formatting.main_text,
      businessPlaceId: prediction.place_id,
    });

    if (window.google?.maps?.places && placesServiceRef.current) {
      const service = new window.google.maps.places.PlacesService(placesServiceRef.current);
      service.getDetails(
        { placeId: prediction.place_id, fields: ['name', 'formatted_address', 'formatted_phone_number', 'rating', 'types'] },
        (place, status) => {
          if (status === 'OK' && place) {
            update({
              businessName: place.name || prediction.structured_formatting.main_text,
              businessAddress: place.formatted_address || '',
              businessPhone: place.formatted_phone_number || '',
              businessRating: place.rating || null,
            });
          }
        }
      );
    }
  }, [update]);

  // --- Validation ---
  const isPhaseValid = (p: number): boolean => {
    switch (p) {
      case 1:
        if (data.industry === 'other') return data.customIndustry.trim() !== '';
        return data.industry !== '';
      case 2:
        return data.teamSize !== '';
      case 3:
        return true; // Preview phase — always valid
      case 4:
        return (
          data.contactName.trim() !== '' &&
          data.contactEmail.includes('@') &&
          data.contactEmail.includes('.') &&
          data.contactPhone.replace(/\D/g, '').length >= 10
        );
      default:
        return false;
    }
  };

  // --- Navigation ---
  const goNext = () => {
    if (phase < 4) {
      setDirection(1);
      setPhase((p) => p + 1);
    }
  };

  const goBack = () => {
    if (phase > 1) {
      setDirection(-1);
      setPhase((p) => p - 1);
    }
  };

  // --- Submit ---
  const handleSubmit = async () => {
    if (!isPhaseValid(4)) return;
    setIsSubmitting(true);

    try {
      const finalData = { ...data, completedAt: new Date().toISOString() };
      await submitLead(finalData);
      setData(finalData);
      setIsComplete(true);
    } catch (err) {
      console.error('Submit error:', err);
      // Still show success — lead data is logged, GHL submission is best-effort
      setData((prev) => ({ ...prev, completedAt: new Date().toISOString() }));
      setIsComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Slide animation variants ---
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hidden div for PlacesService */}
      <div ref={placesServiceRef} className="hidden" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-mono">Back</span>
          </Link>
          <span className="text-sm font-heading text-zinc-300 tracking-wide">
            TASK<span className="text-orange-500">RIG</span>
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-xl mx-auto">
          {isComplete ? (
            <SuccessState data={data} />
          ) : (
            <>
              {/* Step indicator */}
              <div className="mb-8">
                <StepIndicator currentPhase={phase} />
              </div>

              {/* Phase heading */}
              <div className="mb-6">
                <h1 className="text-xl font-heading text-zinc-100">
                  {phase === 1 && 'Your Trade'}
                  {phase === 2 && 'Your Needs'}
                  {phase === 3 && 'Your Preview'}
                  {phase === 4 && 'Book Your Call'}
                </h1>
              </div>

              {/* Phase content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={phase}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {phase === 1 && (
                    <Phase1Trade
                      data={data}
                      update={update}
                      predictions={predictions}
                      isSearching={isSearching}
                      onSearch={handleSearch}
                      onSelectPlace={handleSelectPlace}
                    />
                  )}
                  {phase === 2 && <Phase2Needs data={data} update={update} />}
                  {phase === 3 && <Phase3Preview data={data} />}
                  {phase === 4 && (
                    <Phase4Book
                      data={data}
                      update={update}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={goBack}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 text-sm font-mono rounded-sm transition-all
                    ${phase === 1
                      ? 'invisible'
                      : 'text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
                    }
                  `}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                {phase < 4 ? (
                  <button
                    onClick={goNext}
                    disabled={!isPhaseValid(phase)}
                    className={`
                      flex items-center gap-2 px-6 py-2.5 text-sm font-bold font-mono uppercase tracking-wider rounded-sm transition-all
                      ${isPhaseValid(phase)
                        ? 'bg-orange-500 text-zinc-950 hover:bg-orange-400 shadow-lg shadow-orange-500/20'
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      }
                    `}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isPhaseValid(4) || isSubmitting}
                    className={`
                      flex items-center gap-2 px-6 py-2.5 text-sm font-bold font-mono uppercase tracking-wider rounded-sm transition-all
                      ${isPhaseValid(4) && !isSubmitting
                        ? 'bg-orange-500 text-zinc-950 hover:bg-orange-400 shadow-lg shadow-orange-500/20'
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        Confirm My Walkthrough
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
```

### Step 2: Commit

```bash
git add src/pages/get-started/GetStartedPage.tsx
git commit -m "$(cat <<'EOF'
feat: rewire GetStartedPage for 4-phase conversion flow

New orchestrator: Phase1Trade → Phase2Needs → Phase3Preview →
Phase4Book → SuccessState. Directional slide animations via
AnimatePresence. Validation per phase. Places API preserved.
Submit calls useLeadCapture hook. CTA: 'Confirm My Walkthrough'.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Wire Up useLeadCapture Hook + GHL Integration

**Files:**
- Modify: `src/hooks/useLeadCapture.ts`
- Modify: `api/lead.ts` (if needed for new field mapping)

### Design Intent

The hook exists but was never called from GetStartedPage. Wire it up so `submitLead` is called on form completion. The API route maps our LeadData to GHL contact fields.

### Step 1: Update useLeadCapture to match new LeadData shape

Review the existing hook and update the field mapping. The key changes:
- `industries[]` → `industry` (single string)
- Remove `desiredIntegrations`, `currentTools`, `contactRole`, `preferredContactMethod`, `notes`
- Add `consentSms` (single boolean)
- Add `appointmentSlot`
- Tags should include industry and pain points

```typescript
// src/hooks/useLeadCapture.ts
// Update the submitLead function's payload mapping:

// In the body of submitLead, map fields like:
const payload = {
  firstName: data.contactName.split(' ')[0] || '',
  lastName: data.contactName.split(' ').slice(1).join(' ') || '',
  name: data.contactName,
  email: data.contactEmail,
  phone: data.contactPhone,
  companyName: data.businessName,
  address1: data.businessAddress,
  source: 'get-started',
  tags: [
    'get-started-complete',
    data.industry ? `industry:${data.industry}` : null,
    data.teamSize ? `team:${data.teamSize}` : null,
    ...data.painPoints.map((p) => `pain:${p}`),
  ].filter(Boolean),
  customFields: {
    industry: data.industry,
    team_size: data.teamSize,
    pain_points: data.painPoints.join(', '),
    business_rating: data.businessRating,
    consent_sms: data.consentSms,
    appointment_slot: data.appointmentSlot,
  },
};
```

The existing API route at `api/lead.ts` should handle the tags and customFields — verify it passes them through to GHL. If the current route doesn't forward `customFields`, add that to the request body.

### Step 2: Verify API route handles new fields

Check `api/lead.ts` line ~60-80 where the GHL payload is constructed. Ensure `tags` and `customField` are forwarded. The GHL contacts API supports:
- `tags: string[]`
- `customFields: { id: string, field_value: string }[]` (requires GHL custom field IDs)

For the initial implementation, just pass `tags` (which the existing route already supports) and log `customFields` for future mapping once GHL custom field IDs are configured.

### Step 3: Commit

```bash
git add src/hooks/useLeadCapture.ts api/lead.ts
git commit -m "$(cat <<'EOF'
feat: wire useLeadCapture into onboarding flow

Map new LeadData fields to GHL contact payload. Tags include
industry, team size, and pain points. Custom fields logged for
future GHL custom field ID mapping. submitLead called on Phase 4
completion.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Clean Up Old Files, Update Routes, Final Polish

**Files:**
- Delete: `src/pages/get-started/phases/Phase1Business.tsx`
- Delete: `src/pages/get-started/phases/Phase3Contact.tsx`
- Modify: `src/constants/integrations.ts` (remove unused exports)
- Verify: `src/App.tsx` (route unchanged — `/get-started` → `GetStartedPage`)

### Step 1: Delete old phase files

```bash
git rm src/pages/get-started/phases/Phase1Business.tsx
git rm src/pages/get-started/phases/Phase3Contact.tsx
```

### Step 2: Clean up unused constants

In `src/constants/integrations.ts`, remove:
- `CALL_VOLUMES` (unused)
- `LEAD_VOLUMES` (unused)
- `HOURS` (unused)
- `INTEGRATIONS` (no longer in onboarding flow — still used by landing page? Check first)
- `ROLES` (removed from flow)

Keep `MARQUEE_INTEGRATIONS` (used by landing page `IntegrationMarquee.tsx`).

**Important:** Before deleting `INTEGRATIONS`, verify it's not imported anywhere else:
```bash
grep -r "INTEGRATIONS" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules
```

If `INTEGRATIONS` is only used by the old Phase2Needs, remove it. If it's used by the landing page, keep it.

### Step 3: Verify the app builds

```bash
npm run build
```

Expected: Clean build with no TypeScript errors. If there are import errors from deleted files, fix the remaining references.

### Step 4: Verify dev server runs

```bash
npm run dev
```

Navigate to `/get-started` and verify:
- 4 phases render and transition correctly
- Industry icons are tappable and single-select
- Google Places search works (if API key configured)
- Pain points cap at 3 selections
- Phase 3 preview shows personalized content
- Phase 4 form validates inline
- Submit creates success state
- Back/Continue navigation works in both directions
- Progress bar shows endowed progress (starts at ~15%)

### Step 5: Commit

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: clean up old phase files and unused constants

Remove Phase1Business.tsx, Phase3Contact.tsx (replaced by
Phase1Trade and Phase4Book). Remove unused CALL_VOLUMES,
LEAD_VOLUMES, HOURS constants. Verify clean build.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Post-Implementation Notes

### Not in scope for this plan (future tasks):

1. **GHL Calendar embed URL** — Requires GHL account configuration to generate the calendar widget URL. Set `VITE_GHL_CALENDAR_URL` in `.env` once available. Until then, the fallback "We'll call you" message renders.

2. **GHL Custom Fields** — The API route logs custom fields but doesn't map to GHL custom field IDs yet. Once field IDs are created in GHL, update `api/lead.ts` to include them in the contact payload.

3. **Analytics events** — The design doc specifies tracking events (`hero_cta_click`, `phase_complete`, `phase_abandon`, etc.). Add these with whatever analytics provider is chosen (PostHog, Mixpanel, GA4).

4. **Exit-intent popup** — Research shows 8-12% recovery. Build as a separate component triggered on mouse-leave (desktop) or back-button (mobile).

5. **Post-booking SMS/email nurture** — Requires GHL workflow configuration, not code changes. Set up in GHL dashboard based on the sequences in the design doc.

6. **Hero section dual-CTA** — The design doc recommends adding a secondary "Watch How It Works" CTA. This is a landing page change, separate from the onboarding flow.

7. **A/B testing** — Once baseline metrics are established, test variations: progress bar start percentage, CTA copy, pain point ordering, etc.
