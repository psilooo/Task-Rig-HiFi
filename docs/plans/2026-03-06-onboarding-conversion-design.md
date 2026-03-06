# Task Rig: Hero-to-Booking Conversion Design Guide

**Date:** March 6, 2026
**Scope:** Redesigning the Get Started onboarding flow to maximize conversion from hero CTA to booked appointment
**Research basis:** 4 parallel deep-research agents covering conversion psychology, modern UX patterns, SMB booking optimization, and 18+ competitor teardowns

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Research Findings: The Numbers That Matter](#2-research-findings)
3. [Psychological Framework](#3-psychological-framework)
4. [Proposed Flow Architecture](#4-proposed-flow-architecture)
5. [Phase-by-Phase Design Specification](#5-phase-by-phase-design-specification)
6. [Hero Section Redesign](#6-hero-section-redesign)
7. [Visual Design System](#7-visual-design-system)
8. [Mobile-First Considerations](#8-mobile-first-considerations)
9. [Post-Booking Experience](#9-post-booking-experience)
10. [Trust & Social Proof Strategy](#10-trust--social-proof-strategy)
11. [Anti-Patterns to Avoid](#11-anti-patterns-to-avoid)
12. [Competitor Insights Summary](#12-competitor-insights-summary)
13. [Success Metrics & Benchmarks](#13-success-metrics--benchmarks)
14. [Sources & Bibliography](#14-sources--bibliography)

---

## 1. Executive Summary

### The Problem

Task Rig's current 3-phase onboarding flow collects 26 fields of data across Business Info, Needs Assessment, and Contact Info. The flow ends with a phone CTA -- not an embedded booking experience. There is no calendar integration, no live scheduling, and the GHL lead capture hook exists but is not wired up. The success state offers only hardcoded `tel:` links.

### The Opportunity

Research across 100+ sources reveals that the highest-converting onboarding flows in 2025-2026 share a clear pattern: **conversational, multi-step, value-first experiences** that minimize upfront data collection and maximize perceived personalization. The gap between Task Rig's current implementation and best-in-class is significant -- and closable.

### Key Numbers

| Current State | Best Practice | Potential Lift |
|---|---|---|
| 26 form fields total | 3-5 fields per step, 10-12 total | Up to 300% more conversions |
| No embedded scheduling | Embedded calendar post-form | +32-122% form-to-meeting rate |
| Phone CTA only | Self-serve booking + callback option | +25-30% lead conversion |
| No social proof in flow | Contextual testimonials per phase | +10-270% (median 37%) |
| No trust signals on form | Trust badges near sensitive fields | +42% conversion lift |
| Generic "Submit" CTA | Specific benefit-driven CTA | +28-35% CTR |
| No progress endowment | Progress bar starting at ~20% | 3x return likelihood |

### The Thesis

**Reduce friction, increase psychological investment, deliver value before asking for commitment, and embed scheduling directly into the flow.** Every design decision should serve one question: *"Does this make it easier or more compelling for a busy HVAC/plumbing/electrical business owner to book a call with us?"*

---

## 2. Research Findings: The Numbers That Matter

### Form Design

- Multi-step forms convert **up to 300% more** than single-page forms (Venture Harbour)
- Each additional form field decreases conversion by **4.1%** on average (HubSpot 2024)
- More than 7 fields per page causes **67.8% abandonment** (Formstack 2025)
- Reducing fields from 4 to 3 boosts conversion by **50%** (HubSpot)
- Single-column forms are completed **15.4 seconds faster** than multi-column
- Inline validation increases success rates by **22%** and reduces completion time by **42%**
- Mandatory phone number fields cause **~37% abandonment** unless positioned last

### Psychology

- "Foot-in-the-door" technique: users who agree to a small initial request are **2.4x more likely** to comply with a larger follow-up request (Freedman & Fraser)
- Endowed progress (starting progress bar at 20%) measurably increases completion -- users given a "head start" are **significantly more likely** to finish
- Fast-then-slow progress perception: **11.3% abandonment** vs. 14.4% for steady progress
- Loss aversion is **2x as powerful** as the desire for gain (Kahneman & Tversky)
- Social proof increases conversions **up to 34%**; video testimonials by **80%**
- Real-time social proof notifications boost conversions by **98%** vs. static pages

### Scheduling & Booking

- Embedded calendar increases conversion by **32% overnight** (HowdyGo)
- With scheduling automation, **66.7% of form submissions book a meeting** vs. 30% without -- **122% improvement** (Chili Piper, 4M submissions)
- Only **8% of top B2B SaaS** embed form-to-scheduling on their website -- massive competitive advantage
- Same-day bookings: **6.9% no-show** rate; 8+ days out: **23% no-show**
- Sub-5-minute response time: **391% conversion lift**; leads are **21x more likely** to qualify
- **78% of customers buy from the company that responds first**

### SMB Buyer Behavior

- **96% of SMB purchases**: CEO/owner decides alone
- **92%** expect personalization; **71%** disengage when interactions feel generic
- **70%+ prefer digital self-service** over face-to-face meetings
- **50-90%** of the buying journey is completed before any human contact
- Click-to-call converts at **30-50%** vs. form fill at **2-5%** on mobile
- Mobile form abandonment: **78.7-85.2%** (vs. 66.7% desktop)
- Trades business owners research software primarily in **evenings (7-10 PM)** and **weekends**
- Best day for demos: **Thursday**, with 2-4 PM achieving **82% completion rate**

### Competitor Insights

- Typeform's one-question-per-screen achieves **47.3% completion** (2x industry average)
- Jobber: email-only initial signup, 14-day trial, no credit card -- product-led
- ServiceTitan: 7+ field demo form, sales-led -- works for enterprise but poor for SMB
- Podium: AI-powered "Jerry 2.0" qualifies and books in real-time via chat
- Interactive demos (Navattic, Storylane) convert **20-35% higher** than form-to-call flows
- GoHighLevel uses "snapshot templates" -- pre-built industry configurations

---

## 3. Psychological Framework

The onboarding flow should be designed as a **psychological escalation ladder**, not a data-collection form. Each phase leverages specific behavioral principles:

### The Commitment Escalation Model

```
PHASE 0: Hero CTA Click          -- Micro-commitment (1 second)
   |  Principle: Foot-in-the-door
   v
PHASE 1: "What's your trade?"    -- Easy, visual, non-threatening (15 seconds)
   |  Principles: Endowed progress, commitment & consistency
   v
PHASE 2: "What do you need?"     -- Co-creation, personalization (30 seconds)
   |  Principles: IKEA effect, sunk cost, loss aversion
   v
PHASE 3: "See your results"      -- Value delivery before ask (15 seconds)
   |  Principles: Reciprocity, anchoring
   v
PHASE 4: "Book your call"        -- Contact + scheduling (45 seconds)
   |  Principles: Loss aversion (don't lose what you built),
   |              social proof, trust signals, scarcity
   v
SUCCESS: Confirmation             -- Peak-end rule, anticipation
```

### Principle Application Map

| Principle | Where Applied | How |
|---|---|---|
| **Foot-in-the-door** | Phase 1 | Start with the easiest possible interaction (tap an icon) |
| **Endowed progress** | Progress bar | Start at ~20% when user arrives ("You've already started!") |
| **Zeigarnik Effect** | Progress indicator | Show incompleteness to create completion tension |
| **IKEA Effect** | Phase 2 | User "builds" their custom operations plan |
| **Loss aversion** | Phase 3-4 transition | Show summary of what they've created -- abandoning means losing it |
| **Reciprocity** | Phase 3 | Deliver value (insights/preview) before asking for contact info |
| **Social proof** | Sidebar/inline | Industry-specific testimonials matched to their trade |
| **Peak-end rule** | Success state | Make the ending feel like an exciting beginning |
| **Commitment & consistency** | Throughout | Each step is a continuation of a decision already made |
| **Default effect** | Pre-selections | Smart defaults for common options (SMS, calendars, CRM pre-checked) |
| **Scarcity** | Booking phase | "Next available slots this week" -- curated, not open calendar |

---

## 4. Proposed Flow Architecture

### Current Flow (3 phases, 26 fields)

```
Hero CTA -> Phase 1: Business Info (8 fields) -> Phase 2: Needs (4 fields) -> Phase 3: Contact (14 fields) -> Success (phone CTA)
```

**Problems:**
- Too many fields overall (26 total)
- Phase 3 asks for 14 fields including 2 consent checkboxes -- heavy friction at the moment of highest commitment
- No value delivery before asking for personal info
- No embedded scheduling
- Success state is a dead-end with hardcoded phone links
- GHL lead capture hook exists but isn't connected

### Proposed Flow (4 phases, ~12 interactions)

```
Hero (dual CTA) -> Phase 1: Your Trade (2 interactions, ~15s)
               -> Phase 2: Your Needs (3 interactions, ~30s)
               -> Phase 3: Your Preview (value reveal, ~15s)
               -> Phase 4: Book Your Call (4 fields + embedded calendar, ~45s)
               -> Success: Personalized confirmation
```

**Total time:** ~2 minutes
**Total interactions:** ~12 (down from 26)
**Key change:** Value delivery (Phase 3) happens BEFORE asking for contact info (Phase 4)

### What Gets Cut

| Current Field | Decision | Rationale |
|---|---|---|
| Business address | Auto-enrich from Places API | Don't ask what you can look up |
| Business phone | Auto-enrich from Places API | Same |
| Business rating | Auto-enrich from Places API | Same |
| Business category | Derive from industry selection | Redundant |
| Custom industry | Keep but conditional | Only if "Other" selected |
| Services list | Auto-populate from industry | Remove manual selection |
| Current tools | Cut entirely | Nice-to-have, not need-to-have for booking |
| Desired integrations | Simplify to 3-4 key picks | Currently 12 options -- too many |
| Pain points | Keep but reduce | 5-6 options max, not 10 |
| Contact role | Cut | Can be asked on the call |
| Preferred contact method | Cut | Default to SMS (98% open rate), let them change later |
| Notes textarea | Cut | Rarely filled, adds friction |
| 2x consent checkboxes | Consolidate to 1 | Legal can combine into single TCPA consent |

### What Gets Added

| New Element | Purpose |
|---|---|
| Value preview (Phase 3) | Show personalized insights before asking for info |
| Embedded calendar | Replace phone CTAs with actual scheduling |
| Sidebar social proof | Industry-matched testimonials per phase |
| Trust badges | Lock icon + privacy text near contact fields |
| "Free, no obligation" badge | Remove risk perception |
| SMS confirmation | Immediate post-booking via GHL |
| Exit-intent capture | Recover 8-12% of abandoning visitors |

---

## 5. Phase-by-Phase Design Specification

### Phase 1: "What type of service business do you run?"

**Goal:** Lowest-friction entry point. One tap to commit.

**Duration:** ~15 seconds

**Layout:**
- Full-width heading: "What type of service business do you run?"
- Subtext: "We'll customize everything for your trade"
- Grid of 8-10 industry icons (large, tappable, visual)
  - HVAC, Plumbing, Electrical, Roofing, Landscaping, Cleaning, Construction, Auto Repair, Other
  - Each icon: 80x80px minimum, with label below
  - Single-select (tap one, it highlights, auto-advances after 500ms delay)
- Below grid: Business name search field (Google Places autocomplete)
  - Label: "Find your business"
  - Placeholder: "Start typing your business name..."
  - Auto-populates: name, address, phone, rating, placeId from Places API

**Progress bar:** Starts at 20% on page load (endowed progress). Jumps to 40% on industry selection.

**Sidebar (desktop only):**
- Small stat: "Join 500+ service businesses already using Task Rig"
- Or: "Trusted by HVAC, plumbing, and electrical pros nationwide"

**Psychology at work:**
- Visual icon grid = easiest possible first interaction (no typing)
- Endowed progress = "you've already started"
- Industry selection = self-identification = commitment
- Auto-advance after selection = momentum, no "Next" button friction

**Data captured:**
- `industries[]` (single selection in Phase 1, can add more later)
- `businessName`, `businessAddress`, `businessPhone`, `businessRating`, `businessPlaceId` (from Places API)

**Validation:** Industry must be selected. Business search is encouraged but not required (manual entry fallback available).

---

### Phase 2: "What's holding your business back?"

**Goal:** Co-create their solution. Trigger the IKEA Effect.

**Duration:** ~30 seconds

**Layout — Step 2a: Pain Points**
- Heading: "What's your biggest challenge right now?"
- Subtext: "Pick up to 3 -- we'll focus on what matters most"
- 5-6 chip buttons (max), each with an icon:
  - "Missed calls & leads" (phone-off icon)
  - "Scheduling chaos" (calendar icon)
  - "Slow response times" (clock icon)
  - "Manual paperwork" (clipboard icon)
  - "No after-hours coverage" (moon icon)
  - "Managing reviews" (star icon)
- Multi-select, max 3
- Each chip animates on select (scale + color shift to orange)

**Layout — Step 2b: Team Size**
- Heading: "How big is your team?"
- 5 visual options (single select, auto-advance):
  - "Just me" | "2-5" | "6-15" | "16-50" | "50+"
- Displayed as horizontal pill buttons

**Progress bar:** 40% -> 55% on pain point selection -> 65% on team size

**Sidebar (desktop only):**
- Industry-matched testimonial (dynamically selected based on Phase 1 industry):
  - Example: If HVAC selected, show: *"Task Rig caught 47 missed calls in our first month. That's $23,000 in recovered revenue."* -- Mike R., HVAC Pro
  - If Plumbing: *"We went from 3-hour response times to under 5 minutes. Customers are blown away."* -- Sarah K., Plumbing Co.

**Psychology at work:**
- Limited choices (5-6) prevents decision fatigue
- "Pick up to 3" = controlled choice architecture
- Pain point selection = user is defining their problem = IKEA effect begins
- Industry-matched testimonial = "people like me use this" = social proof
- Auto-advance on team size = momentum continues

**Data captured:**
- `painPoints[]` (max 3)
- `teamSize` (single selection)

---

### Phase 3: "Here's what Task Rig can do for you"

**Goal:** Deliver value BEFORE asking for anything. Trigger reciprocity.

**Duration:** ~15 seconds (reading time)

**Layout:**
- Heading: "Your Custom Operations Preview"
- Animated reveal of a personalized "report card" based on their selections:

```
+--------------------------------------------------+
|  YOUR BUSINESS: [Business Name] (or [Industry])  |
|  TEAM SIZE: [X] people                           |
|                                                   |
|  BASED ON YOUR CHALLENGES, TASK RIG WILL:         |
|                                                   |
|  [x] Answer 100% of after-hours calls via AI     |  <- if "Missed calls" selected
|  [x] Auto-schedule jobs from inbound requests     |  <- if "Scheduling chaos" selected
|  [x] Respond to leads in under 60 seconds         |  <- if "Slow response" selected
|  [x] Digitize estimates, invoices, and dispatch   |  <- if "Manual paperwork" selected
|  [x] Manage and respond to reviews automatically  |  <- if "Managing reviews" selected
|                                                   |
|  ESTIMATED IMPACT:                                |
|  ~ [X] hours/week saved                           |
|  ~ [Y]% faster response time                      |
|  ~ [Z] more jobs/month captured                   |
|                                                   |
+--------------------------------------------------+
```

- Below the preview: "Want to see how this works for [Business Name / your business]? Book a free walkthrough."
- CTA button: "Book My Free Walkthrough" (large, orange, pulsing glow)
- Secondary: "Not ready? We'll send this to your email." (captures email without full booking)

**Progress bar:** 65% -> 80%

**Psychology at work:**
- **Reciprocity:** We gave you something (a personalized preview) before asking for anything
- **Anchoring:** The estimated impact numbers set expectations
- **Loss aversion:** This preview is "yours" now -- leaving means losing it
- **Specificity:** Concrete numbers ("47 missed calls," "23 hours/week") are more believable than vague promises
- The secondary CTA captures partial leads who aren't ready to book

**Data captured:**
- Nothing new -- this phase is pure value delivery
- (Secondary CTA captures email for partial leads)

---

### Phase 4: "Let's set up your walkthrough"

**Goal:** Collect contact info and schedule the appointment. Maximum trust signals.

**Duration:** ~45 seconds

**Layout:**
- Heading: "Book your free walkthrough"
- Subtext: "30 minutes. No obligation. No credit card."

**Left column (form):**
- Full Name (required)
  - Input with floating label
  - Auto-focus on phase entry
- Email Address (required)
  - Inline validation on blur
  - Green checkmark on valid
- Phone Number (required)
  - Label: "Where should we text your confirmation?"
  - Reframes the phone ask as a benefit, not a demand
  - Inline validation: 10+ digits
- Single consent checkbox:
  - "I agree to receive appointment confirmations and updates via SMS. View our [Privacy Policy]."

**Right column (calendar):**
- Embedded GHL/Cal.com calendar widget
- Shows next 3-5 available slots prominently
- "See more times" expansion link
- Subtle note: "Next available slots this week"
- Each slot shows: Day, Date, Time, Duration (30 min)

**Trust signals (below form):**
- Lock icon + "Your information is encrypted and never shared"
- "Free consultation -- zero obligation"
- "Trusted by 500+ service businesses"
- Small client logos (3-4 max)

**Progress bar:** 80% -> 95% on form fill -> 100% on booking

**CTA:** "Confirm My Walkthrough" (orange, large)
- Disabled until form + time slot selected
- Subtle loading animation on submit

**Psychology at work:**
- **Phone reframe:** "Where should we text your confirmation?" makes the phone field feel like a service, not a demand
- **Trust signals near sensitive fields:** Directly addresses the #1 reason for form abandonment (security concerns)
- **Embedded calendar:** 32-122% conversion lift over redirect or "we'll call you"
- **Curated slots (3-5):** Reduces decision fatigue + implies exclusivity
- **Loss aversion:** They've built their preview, selected their pain points -- abandoning now means losing all of it
- **"No obligation" framing:** Removes the last psychological barrier

**Data captured:**
- `contactName`, `contactEmail`, `contactPhone`
- `consentTransactional` (single checkbox)
- `appointmentDate`, `appointmentTime` (from calendar)

---

## 6. Hero Section Redesign

### Current State

- Tagline: "YOUR BUSINESS, NEVER OFFLINE"
- Subtitle: Long (30+ words)
- Single CTA: "GET STARTED" link to /get-started
- Gear icon animation on right
- Corner bracket accents

### Proposed Changes

**Headline:** Keep "YOUR BUSINESS, NEVER OFFLINE" -- it's strong, concise, and benefit-focused.

**Subtitle:** Shorten to one line:
- Current: "AI agents that answer calls, respond to messages, book jobs, and manage your systems -- 24/7, across every platform your business runs on."
- Proposed: "AI that answers your calls, books your jobs, and never takes a day off."

**Dual CTA strategy:**
- Primary (orange, filled): "See What You're Missing" or "Get Your Free Operations Review"
  - This frames the CTA as value-receiving, not form-filling
- Secondary (ghost/outlined): "Watch How It Works" (30-second product video or interactive demo)
  - Captures the "still exploring" audience

**Social proof bar (directly below hero):**
- "Trusted by 500+ service businesses" + 3-4 client logos
- Or: Real-time counter: "12 businesses signed up this week"
- Or: Star rating aggregate: "4.9/5 from 200+ reviews"

**Transition to onboarding:**
- Option A (recommended): Clicking primary CTA scrolls down to an inline onboarding flow on the same page (no page redirect)
- Option B: Smooth page transition with shared element animation (logo stays fixed, content morphs)
- Avoid: Hard redirect to `/get-started` with no visual continuity

### Why Inline > Redirect

- Every page transition is a decision point where users can abandon
- Inline expansion maintains context and momentum
- The hero's social proof and branding stay visible during onboarding
- Shopify saw **12% conversion increase** with scroll-triggered content reveals

---

## 7. Visual Design System

### Existing System (Keep)

- **Dark theme:** zinc-950 background, zinc-900 cards
- **Orange accent:** orange-500 for CTAs and focus states
- **Glassmorphic cards:** `bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm`
- **Monospace typography:** `font-mono` for UI, `font-heading` for headings
- **Framer Motion:** Spring physics, stagger animations
- **Corner brackets:** Decorative accents

### Refinements

**Dark theme adjustments:**
- Avoid pure black (#000000) backgrounds -- use zinc-950 (#09090b) which is already correct
- Never use pure white (#FFFFFF) text -- it causes halation (glowing). Use zinc-100 (#f4f4f5) instead
- Input fields should have slightly lighter backgrounds than their container (zinc-900/50 on zinc-950)
- Desaturate orange by 10-20% for large surface areas; keep full saturation only for CTAs

**Glassmorphism rules:**
- Use for the onboarding card container -- this is the correct application
- Do NOT use for individual form fields or buttons (hurts readability)
- Ensure backdrop-blur is strong enough that text is never competing with background elements
- Add a subtle white border (border-white/5) for depth on glass panels

**CTA design:**
- Primary CTA: `bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold`
  - Dark text on orange (not white) for maximum contrast
  - Subtle box-shadow glow: `shadow-lg shadow-orange-500/20`
  - Minimum height: 48px (touch target)
- Secondary CTA: `border border-zinc-700 text-zinc-300 hover:border-zinc-500`
- Never use orange for non-CTA elements -- it dilutes CTA attention

**Progress bar:**
- Background: zinc-800
- Fill: gradient from orange-500 to orange-400
- Height: 3px (subtle, not distracting)
- Position: Top of onboarding card, full width
- Step indicators: Small circles with checkmarks for completed steps

**Animation specifications:**
- Phase transitions: Horizontal slide, 300ms, spring physics (`stiffness: 300, damping: 30`)
- Form field entry: Staggered fade-up, 40ms offset between fields
- Chip selection: Scale to 1.02 + border color shift, 150ms
- Success celebration: Green checkmark with spring bounce + subtle particle burst, 500ms
- Always respect `prefers-reduced-motion`

**Typography:**
- Phase headings: `text-xl font-heading text-zinc-100`
- Phase subtitles: `text-sm font-mono text-zinc-400`
- Form labels: `text-xs font-mono text-zinc-400 uppercase tracking-widest`
- Input text: `text-base font-mono text-zinc-100`
- CTA text: `text-sm font-bold uppercase tracking-wider`

---

## 8. Mobile-First Considerations

### The Reality

- Mobile drives top-of-funnel engagement; desktop closes deals
- Mobile form abandonment is **22% higher** than desktop
- **75% of mobile interactions** are thumb-driven
- Trades business owners browse on phones during downtime (evening, weekends, between jobs)

### Design Rules

**Thumb zone optimization:**
- Primary CTAs always in the **bottom third** of the screen
- Use sticky bottom CTA bar on mobile (fixed position, always visible)
- Minimum touch targets: **48x48px** with **8px+ spacing** between elements
- Industry icon grid: 2 columns on mobile (large, easy tap targets)

**Mobile form design:**
- Single column only (this is already the case)
- Use native input types: `type="tel"` for phone, `type="email"` for email
- Enable autocomplete attributes: `autocomplete="name"`, `autocomplete="email"`, `autocomplete="tel"`
- Swipe gestures between phases (supplement, don't replace, Next button)
- Keyboard-aware: form should scroll so active input is always visible above keyboard

**Mobile calendar:**
- Vertical list of time slots (not a full calendar grid)
- Each slot: full-width card with day/date/time, large tap target
- "See more times" loads additional slots inline (no modal)

**Click-to-call fallback:**
- On mobile, add a persistent "Prefer to call? Tap here" link
- Click-to-call converts at **30-50%** vs. **2-5%** for forms on mobile
- Position below the form as an escape hatch, not a competing option

**Performance:**
- Target sub-2.5s Largest Contentful Paint
- Lazy-load the calendar embed (not needed until Phase 4)
- Skeleton screens for any async content (Places API results, calendar loading)
- Skeleton loading animation: wave (left-to-right), not pulse -- perceived **20-30% faster**

---

## 9. Post-Booking Experience

### Why This Matters

The Peak-End Rule says people judge an experience by its **emotional peak** and its **ending**. The post-booking confirmation is the ending -- it colors the entire preceding experience.

### Confirmation Screen Design

```
+--------------------------------------------------+
|         [Animated green checkmark]                |
|                                                   |
|     "You're all set, [First Name]!"               |
|                                                   |
|  +----------------------------------------------+ |
|  | YOUR WALKTHROUGH                              | |
|  | Thursday, March 12 at 2:00 PM EST             | |
|  | 30 minutes | Video call                       | |
|  | With: [Rep Name + small photo]                | |
|  +----------------------------------------------+ |
|                                                   |
|  WHAT WE'LL COVER:                                |
|  Based on your selections, we'll walk through:    |
|  * How AI handles your missed calls 24/7          |  <- from their pain points
|  * Automated scheduling for your [industry] team  |  <- personalized
|  * Live demo with your actual business data       |
|                                                   |
|  [Add to Google Calendar]  [Add to Apple Calendar] |
|                                                   |
|  "We just texted a confirmation to [phone].       |
|   See you Thursday!"                              |
|                                                   |
|  [Back to Home]                                   |
+--------------------------------------------------+
```

### Immediate Actions (Automated via GHL)

1. **SMS confirmation** (within 30 seconds):
   > "Hey [Name]! Your Task Rig walkthrough is confirmed for [Date] at [Time]. We'll show you how AI can handle [pain point #1] for [Business Name]. Reply YES to confirm or RESCHEDULE to pick a new time."

2. **Email confirmation** (within 2 minutes):
   - Calendar invite attachment (.ics)
   - Personalized preview of what the call will cover
   - Link to a 60-second "What to expect" video
   - Rep's name and photo

3. **GHL contact creation** with tags:
   - `get-started-complete`
   - `walkthrough-booked`
   - `industry:[their-trade]`
   - `pain-points:[their-selections]`

### Pre-Appointment Nurture (Automated via GHL workflows)

| Timing | Channel | Content |
|---|---|---|
| T+1 day | Email | "3 ways [Industry] businesses are using AI to win more jobs" -- relevant case study |
| T-1 day | SMS | "Looking forward to your walkthrough tomorrow at [Time]! Here's what we'll cover: [personalized bullets]" |
| T-3 hours | SMS | "See you in a few hours, [Name]! Reply YES to confirm or let us know if you need to reschedule." |

### No-Show Recovery

- If no-show: Wait 15 minutes, then SMS: "Hey [Name], looks like we missed each other. Want to reschedule? Here are some times: [3 slots]"
- If no response in 24h: Email with a "Watch the 3-minute walkthrough video instead" link
- If no response in 72h: Final SMS: "Still interested in automating [pain point]? No worries if not -- just reply STOP and we'll leave you be."

---

## 10. Trust & Social Proof Strategy

### Placement Framework

Trust signals should appear at **three critical moments**: entry (hero), mid-flow (Phase 2), and conversion (Phase 4).

| Location | Trust Signal | Purpose |
|---|---|---|
| **Hero section** | "Trusted by 500+ service businesses" + logos | Initial credibility |
| **Phase 1 sidebar** | "Setup takes under 2 minutes" | Time commitment assurance |
| **Phase 2 sidebar** | Industry-matched testimonial | "People like me use this" |
| **Phase 3** | Personalized impact preview | Competence demonstration |
| **Phase 4 form** | Lock icon + "Your info is encrypted and never shared" | Security assurance |
| **Phase 4 CTA** | "Free consultation -- zero obligation" | Risk removal |
| **Phase 4 below CTA** | 3-4 client logos | Authority at point of conversion |

### Testimonial Content Guidelines

- Use **specific numbers**: "Caught 47 missed calls" not "caught many missed calls"
- Include **name, title, and trade**: "Mike R., Owner, ProTemp HVAC"
- Keep to **1-2 sentences max** -- no one reads long testimonials mid-form
- Match testimonials to the user's selected industry when possible
- If no industry-specific testimonial exists, use a general "service business" quote

### Proof Points to Develop

| Metric | Format |
|---|---|
| Businesses using Task Rig | "500+ service businesses" |
| Average response time improvement | "From 3 hours to under 60 seconds" |
| Missed calls recovered | "47 missed calls caught per month, average" |
| Time saved | "23 hours/week saved on average" |
| Customer satisfaction | "4.9/5 from 200+ reviews" |

**Use specific, odd numbers** (47, 23, 4.9) -- research shows they're perceived as more credible than rounded numbers because they signal precision.

---

## 11. Anti-Patterns to Avoid

### Form Design Anti-Patterns

| Anti-Pattern | Why It Fails | Our Alternative |
|---|---|---|
| Asking for phone number first | 37% abandonment | Phone is last field, reframed as "Where should we text your confirmation?" |
| "Submit" as CTA text | Generic, creates anxiety | "Confirm My Walkthrough" -- specific, confident |
| Requiring company size/revenue | Feels invasive, high drop-off | Team size only (less threatening), framed as visual pills |
| Asking questions you can auto-enrich | Wastes user's time, signals laziness | Use Places API, IP geolocation, progressive profiling |
| Long single-page forms | 67.8% abandonment at 7+ fields | 4 phases, 2-3 interactions each |
| No progress indicator | User doesn't know how much is left | Always-visible progress bar with endowed start |
| Placeholder text as labels | Confusing once user starts typing | Floating labels that stay visible |

### Dark Theme Anti-Patterns

| Anti-Pattern | Why It Fails | Our Alternative |
|---|---|---|
| Pure white (#FFF) on pure black (#000) | Causes halation (glowing/blurring) | zinc-100 on zinc-950 |
| Orange everywhere | Dilutes CTA attention | Orange ONLY for primary CTAs and key interactive states |
| Glass panels for form inputs | Text readability suffers | Glass for container card only; solid backgrounds for inputs |
| Thin/light font weights | Appear washed out on dark backgrounds | Minimum font-weight: 400 for body, 600+ for labels |
| Low-contrast placeholder text | Invisible on dark inputs | zinc-500 minimum for placeholders (test with contrast checker) |

### Psychology Anti-Patterns

| Anti-Pattern | Why It Fails | Our Alternative |
|---|---|---|
| Fake urgency (countdown timers) | B2B buyers see through it; damages trust permanently | Genuine scarcity: "Next available slots this week" |
| Asking for info before delivering value | Feels transactional; user has no reason to trust you yet | Phase 3 delivers personalized preview before Phase 4 asks for contact |
| Too many choices (12+ options) | Decision fatigue, paradox of choice | Max 6 options per selection, with "Recommended" labels |
| Generic social proof | "Trusted by thousands" is meaningless | Industry-specific, named testimonials with numbers |
| No escape hatch | Users feel trapped, bounce entirely | "Not ready? We'll email you this preview" as secondary CTA |

---

## 12. Competitor Insights Summary

### What Each Competitor Does Best (and What We Should Steal)

| Competitor | Their Strength | What to Adopt |
|---|---|---|
| **Typeform** | One-question-per-screen, 47.3% completion | Conversational, focused phases with one concept each |
| **Jobber** | Email-only initial signup, instant value | Low-barrier entry; don't ask for everything upfront |
| **Calendly** | Immediate calendar integration on signup | Embed scheduling directly; no redirect |
| **Linear** | Cinematic transitions, "must-do" vs. "get started" separation | Polish transitions; separate essential from optional steps |
| **Podium** | AI-powered real-time qualification via chat | Future consideration: AI chatbot as alternative onboarding path |
| **Housecall Pro** | 14-day trial, hands-on onboarding | "See it in action" before committing |
| **GoHighLevel** | Snapshot templates per industry | Pre-configured setups that feel personalized per trade |
| **ServiceTitan** | Industry segmentation, "Product Expert" framing | Consultative language: "walkthrough" not "demo" |
| **Notion** | Learn-by-doing, lightweight tooltips | Interactive elements over passive forms |
| **Intercom** | Live chat + form hybrid for demo booking | Chat widget as alternative entry point |
| **Navattic/Storylane** | Interactive demos convert 20-35% higher | Future consideration: interactive product demo as alternative to booking |

### Competitive Positioning

Task Rig's unique position: **the only AI operations platform that shows you what you're missing before asking you to book a call.** No competitor in the trades/field service space delivers personalized value during the onboarding flow itself. ServiceTitan asks for 7+ fields before any value. Jobber offers a trial but no personalization. Podium has AI but doesn't show a preview.

The Phase 3 "value preview" is the differentiator.

---

## 13. Success Metrics & Benchmarks

### Primary KPIs

| Metric | Current (Estimated) | Target (3 months) | Stretch (6 months) |
|---|---|---|---|
| Hero CTA click-through rate | ~3-5% | 8-12% | 15%+ |
| Phase 1 completion | Unknown | 85%+ | 90%+ |
| Phase 2 completion | Unknown | 70%+ | 80%+ |
| Phase 3 (preview) engagement | N/A (new) | 65%+ | 75%+ |
| Phase 4 form completion | Unknown | 50%+ | 60%+ |
| Form-to-booking rate | 0% (no calendar) | 40%+ | 55%+ |
| Overall visitor-to-booking | ~1-2% (phone CTA) | 8-12% | 15-20% |
| Booking no-show rate | N/A | <15% | <10% |
| Partial lead capture rate | 0% | 15%+ | 25%+ |

### Tracking Implementation

| Event | Trigger | Data |
|---|---|---|
| `hero_cta_click` | User clicks primary or secondary hero CTA | `cta_type: primary|secondary` |
| `onboarding_start` | Phase 1 renders | `source: hero|direct|referral` |
| `phase_complete` | User advances to next phase | `phase: 1|2|3|4`, `duration_seconds` |
| `phase_abandon` | User leaves mid-phase (exit/back) | `phase`, `last_field_interacted`, `time_spent` |
| `industry_select` | Industry icon tapped | `industry` |
| `pain_point_select` | Pain point chip selected | `pain_point`, `total_selected` |
| `preview_view` | Phase 3 preview renders | `personalized_items[]` |
| `preview_email_capture` | Secondary CTA "email me this" clicked | `email` |
| `calendar_interact` | User clicks a time slot | `slot_date`, `slot_time` |
| `booking_complete` | Booking confirmed | All form data + slot |
| `exit_intent_shown` | Exit intent popup triggered | `phase_at_exit` |
| `exit_intent_convert` | User engages with exit intent offer | `offer_type` |

### Benchmarks from Research

| Metric | Industry Average | Best-in-Class | Our Target |
|---|---|---|---|
| Multi-step form completion | 40-60% | 80%+ | 60%+ |
| Form-to-meeting rate | 30% (no automation) | 66.7% (with automation) | 50%+ |
| Onboarding-influenced churn reduction | Baseline | 53.5% less churn | Track post-sale |
| Mobile form completion | 15-21% | 40%+ | 35%+ |
| No-show rate | 13.3% average | 6.9% (same-day) | <12% |
| Speed-to-lead response | 42-47 hours average | <5 minutes | <2 minutes (automated) |

---

## 14. Sources & Bibliography

### Conversion Psychology
- Cialdini, R. (1984). *Influence: The Psychology of Persuasion*
- Kahneman, D. & Tversky, A. (1979). *Prospect Theory: Loss Aversion*
- Freedman, J.L. & Fraser, S.C. (1966). Foot-in-the-door technique study
- Ariely, D., Norton, M.I., & Mochon, D. (2011). The IKEA Effect
- CXL: Foot in the Door Technique -- https://cxl.com/blog/foot-in-the-door-technique/
- Laws of UX: Zeigarnik Effect -- https://lawsofux.com/zeigarnik-effect/
- Laws of UX: Peak-End Rule -- https://lawsofux.com/peak-end-rule/
- The Decision Lab: Paradox of Choice -- https://thedecisionlab.com/reference-guide/economics/the-paradox-of-choice
- Heyflow: Psychology of Micro-Commitments -- https://heyflow.com/blog/the-psychology-of-micro-commitments/

### Form & Conversion Data
- Venture Harbour: Multi-Step Forms Get 300% More Conversions -- https://ventureharbour.com/multi-step-lead-forms-get-300-conversions/
- Venture Harbour: How Form Length Impacts Conversion -- https://ventureharbour.com/how-form-length-impacts-conversion-rates/
- HubSpot 2024: Form Field Conversion Impact
- Formstack 2025: Form Abandonment Study (1,500 B2B respondents)
- Forrester 2024: Optimal B2B Form Field Count
- Chili Piper: 2025 Form Conversion Benchmark Report -- https://www.chilipiper.com/post/form-conversion-rate-benchmark-report
- Zuko: 25 Conversion Rate Statistics 2025 -- https://www.zuko.io/blog/25-conversion-rate-statistics-you-need
- Reform: Form Design Best Practices -- https://www.reform.app/blog/10-form-design-best-practices-to-boost-conversion-rates

### Social Proof & Trust
- SmartBug Media: 12 Trust Signals -- https://www.smartbugmedia.com/blog/12-trust-signals-boost-conversion-rate
- Blue Fountain Media / VeriSign: Trust Badges +42% Conversion Study
- ConversionXL: Security Badges +12.3% Conversion
- Genesys Growth: Social Proof Stats 2026 -- https://genesysgrowth.com/blog/social-proof-conversion-stats-for-marketing-leaders
- CrazyEgg: Trust Signals -- https://www.crazyegg.com/blog/trust-signals/

### Scheduling & Booking
- HowdyGo: Demo Page Conversion -- https://www.howdygo.com/blog/increase-conversion-of-your-book-a-demo-page
- RevenueHero: State of Demo Conversion 2025 -- https://www.revenuehero.io/blog/the-state-of-demo-conversion-rates-in-2025
- Reply.io: Demo No-Shows Analysis -- https://reply.io/fight-demo-no-shows/
- CozyCal: Scheduling Increases Conversion -- https://www.cozycal.com/blog/scheduling-increases-customer-conversion

### SMB & Speed-to-Lead
- Kixie: Speed to Lead Statistics -- https://www.kixie.com/sales-blog/speed-to-lead-response-time-statistics-that-drive-conversions/
- Chili Piper: Speed to Lead -- https://www.chilipiper.com/article/speed-to-lead-statistics
- GTIA 2025: SMB Technology and Buying Trends
- Techaisle: Top 10 SMB Predictions 2026
- B2B Rocket: SMB vs Enterprise Sales Cycles -- https://www.b2brocket.ai/blog-posts/smb-vs-enterprise-sales-cycles-5-key-differences

### UX & Design
- NN/g: Progressive Disclosure -- https://www.nngroup.com/articles/progressive-disclosure/
- NN/g: Glassmorphism Best Practices -- https://www.nngroup.com/articles/glassmorphism/
- NN/g: Skeleton Screens -- https://www.nngroup.com/articles/skeleton-screens/
- PMC: Impact of Progress Indicators -- https://pmc.ncbi.nlm.nih.gov/articles/PMC2910434/
- Heyflow: Mastering the Thumb Zone -- https://heyflow.com/blog/mastering-the-thumb-zone/
- DesignerUp: 200+ Onboarding Flows Study -- https://designerup.co/blog/i-studied-the-ux-ui-of-over-200-onboarding-flows-heres-everything-i-learned/

### Competitor Research
- ServiceTitan, Jobber, Housecall Pro, GoHighLevel, Podium, Broadly -- direct website analysis
- Typeform, Calendly, Linear, Notion, Intercom, Drift -- onboarding flow teardowns
- Navattic 2025: Interactive Demo Benchmark Report
- Page Flows: Linear Onboarding -- https://pageflows.com/post/desktop-web/onboarding/linear/
- Startup Spells: Typeform Onboarding UX -- https://startupspells.com/p/typeform-one-field-onboarding-ux-gas-snapchat-duolingo-spotify-signup-conversion

### Mobile & Performance
- Smashing Magazine: Thumb Zone Design -- https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/
- Mobiloud: Mobile Internet Traffic 2026 -- https://www.mobiloud.com/blog/what-percentage-of-internet-traffic-is-mobile
- SanSoftwares: Click-to-Call vs Contact Forms -- https://sansoftwares.com/blogs/click-to-call-or-contact-forms-which-drives-more-leads/

---

*Full competitor teardown report available at: `research/onboarding-flow-teardown-report.md`*
