# Structural Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move all source code into src/ directory, split monolithic components, extract constants, clean up routing — zero visual/behavioral changes.

**Architecture:** Move-only refactor. Code is copied verbatim into new file structure. LandingPage.tsx (1238 lines) splits into shell + 8 section components. GetStartedPage.tsx (1395 lines) splits into shell + phases + forms. App.tsx routing moves from useState view-switching to React Router routes.

**Tech Stack:** React 19, React Router 7, Framer Motion, Vite 6, TypeScript, Tailwind CDN

---

## Batch 1: Foundation (types, constants, hooks, type declarations)

### Task 1: Create directory structure

```bash
mkdir -p src/{types,constants,hooks,components/{ui,layout,forms,chat},pages/{landing,get-started/phases,dashboard},api}
```

### Task 2: Extract types

**Files:**
- Create: `src/types/index.ts` — re-export barrel
- Create: `src/types/dashboard.ts` — ActivityLog, StatMetric, Tab, TimeRange, QuestionData from `types.ts`
- Create: `src/types/leads.ts` — LeadData, PlacePrediction, PlaceDetails from `components/GetStartedPage.tsx:18-65`

### Task 3: Extract constants

**Files:**
- Create: `src/constants/dashboard.ts` — STATS_DATA, RECENT_ACTIVITY, QUESTION_DATA from `constants.ts`
- Create: `src/constants/pricing.ts` — pricingTiers, faqItems, chatMessages, testimonials, featureTabs visual data from `components/LandingPage.tsx:204-407`
- Create: `src/constants/industries.ts` — INDUSTRIES, INDUSTRY_SERVICES, PAIN_POINTS from `components/GetStartedPage.tsx:69-154`
- Create: `src/constants/integrations.ts` — INTEGRATIONS, PHASES, TEAM_SIZES, CALL_VOLUMES, LEAD_VOLUMES, HOURS, ROLES from `components/GetStartedPage.tsx:113-133`

### Task 4: Extract hooks and type declarations

**Files:**
- Create: `src/hooks/useTypingEffect.ts` — from `components/GetStartedPage.tsx:158-183`
- Create: `src/google-maps.d.ts` — from `components/GetStartedPage.tsx:1362-1395`

## Batch 2: UI, Layout, Form, Chat components (all independent)

### Task 5: Move UI components

**Files:**
- Create: `src/components/ui/ScrollReveal.tsx` — from `components/LandingPage.tsx:29-39`
- Create: `src/components/ui/SectionBadge.tsx` — from `components/LandingPage.tsx:41-45`
- Create: `src/components/ui/AnimatedCounter.tsx` — from `components/LandingPage.tsx:49-78`
- Move: `components/ui/CyberCard.tsx` → `src/components/ui/CyberCard.tsx`
- Move: `components/ui/Reveal.tsx` → `src/components/ui/Reveal.tsx`
- Move: `components/ui/TaskRigLogo.tsx` → `src/components/ui/TaskRigLogo.tsx`
- Move: `components/DynamicNoise.tsx` → `src/components/ui/DynamicNoise.tsx`
- Move: `components/DotMatrixLogo.tsx` → `src/components/ui/DotMatrixLogo.tsx`
- Move: `components/DotMatrixCube.tsx` → `src/components/ui/DotMatrixCube.tsx`
- Move: `components/LoadingScreen.tsx` → `src/components/ui/LoadingScreen.tsx`

### Task 6: Move layout components

**Files:**
- Move: `components/Header.tsx` → `src/components/layout/Header.tsx` (update imports)
- Move: `components/Footer.tsx` → `src/components/layout/Footer.tsx` (update imports)
- Create: `src/components/layout/DashboardLayout.tsx` — extract dashboard chrome from `App.tsx:36-98`

### Task 7: Extract form components

**Files:**
- Create: `src/components/forms/InputField.tsx` — from `components/GetStartedPage.tsx:210-232`
- Create: `src/components/forms/ChipButton.tsx` — from `components/GetStartedPage.tsx:234-260`
- Create: `src/components/forms/Checkbox.tsx` — from `components/GetStartedPage.tsx:262-283`
- Create: `src/components/forms/SelectChips.tsx` — from `components/GetStartedPage.tsx:285-310`
- Note: shared styles (labelClass, inputClass, chipBaseClass, etc.) go in `src/components/forms/styles.ts`

### Task 8: Extract chat component

**Files:**
- Create: `src/components/chat/TypingBubble.tsx` — from `components/LandingPage.tsx:82-141`

## Batch 3: Split LandingPage into sections

### Task 9: Create landing page section components

**Files:**
- Move: `components/Hero.tsx` → `src/pages/landing/HeroSection.tsx` (update imports)
- Create: `src/pages/landing/IntegrationMarquee.tsx` — from `components/LandingPage.tsx:448-502`
- Create: `src/pages/landing/PainPointsSection.tsx` — from `components/LandingPage.tsx:505-621`
- Create: `src/pages/landing/ProductShowcase.tsx` — from `components/LandingPage.tsx:623-808`
- Create: `src/pages/landing/TestimonialsSection.tsx` — from `components/LandingPage.tsx:809-931`
- Create: `src/pages/landing/PricingSection.tsx` — from `components/LandingPage.tsx:932-1100`
- Create: `src/pages/landing/FaqSection.tsx` — from `components/LandingPage.tsx:1101-1230`
- Note: FaqSection includes the final CTA block (lines 1193-1228)

### Task 10: Create LandingPage shell

**Files:**
- Create: `src/pages/landing/LandingPage.tsx` — shell that composes all sections
- Keeps: state (openFaq, activeFeature, featureProgress, chatRef, etc.), effects, nav bar
- Passes props down to section components

## Batch 4: Split GetStartedPage

### Task 11: Create GetStartedPage sub-components

**Files:**
- Create: `src/pages/get-started/PhaseNavigation.tsx` — phase dots, step counter, collapsed summary, expand/collapse
- Create: `src/pages/get-started/phases/Phase1.tsx` — Phase1Content from `GetStartedPage.tsx:990-1132`
- Create: `src/pages/get-started/phases/Phase2.tsx` — Phase2Content from `GetStartedPage.tsx:1134-1230`
- Create: `src/pages/get-started/phases/Phase3.tsx` — Phase3Content from `GetStartedPage.tsx:1232-1273`
- Create: `src/pages/get-started/phases/Phase4.tsx` — Phase4Content from `GetStartedPage.tsx:1275-1287`
- Create: `src/pages/get-started/phases/Phase5.tsx` — Phase5Content from `GetStartedPage.tsx:1289-1360`
- Create: `src/pages/get-started/SuccessState.tsx` — from `GetStartedPage.tsx:910-986`
- Create: `src/pages/get-started/ContinueButton.tsx` — from `GetStartedPage.tsx:893-906`
- Create: `src/pages/get-started/PhaseSubtitle.tsx` — from `GetStartedPage.tsx:346-360`

### Task 12: Create GetStartedPage shell

**Files:**
- Create: `src/pages/get-started/GetStartedPage.tsx` — shell with all state, Google Places logic, phase navigation, form rendering
- Animation variants (staggerContainer, staggerItem) stay in the shell or a shared file

## Batch 5: Move remaining pages + dashboard

### Task 13: Move standalone pages

**Files:**
- Move: `components/LoginPage.tsx` → `src/pages/LoginPage.tsx`
- Move: `components/AccountSettings.tsx` → `src/pages/AccountSettings.tsx`
- Move: `components/ContactPage.tsx` → `src/pages/ContactPage.tsx`
- Move: `components/PrivacyPage.tsx` → `src/pages/PrivacyPage.tsx`
- Move: `components/TermsPage.tsx` → `src/pages/TermsPage.tsx`

### Task 14: Create dashboard page

**Files:**
- Create: `src/pages/dashboard/DashboardPage.tsx` — extract from App.tsx dashboard view
- Move: `components/DashboardHero.tsx` → `src/pages/dashboard/DashboardHero.tsx`
- Move: `components/StatsGrid.tsx` → `src/pages/dashboard/StatsGrid.tsx`
- Move: `components/ActivityFeed.tsx` → `src/pages/dashboard/ActivityFeed.tsx`
- Move: `components/QuestionsChart.tsx` → `src/pages/dashboard/QuestionsChart.tsx`

## Batch 6: App shell + config

### Task 15: Create App.tsx with clean routing

**Files:**
- Create: `src/App.tsx` — React Router only, no useState view switching
- Routes: `/` → LandingPage, `/login` → LoginPage, `/dashboard` → DashboardPage, `/privacy`, `/terms`, `/contact`, `/get-started`
- LandingPage gets `onLoginClick` that navigates to `/login`
- LoginPage gets `onLogin` that navigates to `/dashboard`
- DashboardPage uses DashboardLayout

### Task 16: Create main.tsx + update config

**Files:**
- Create: `src/main.tsx` — from `index.tsx`, update App import
- Modify: `index.html:239` — change `src="/index.tsx"` to `src="/src/main.tsx"`
- Modify: `vite.config.ts` — update `@` alias to point to `src/`
- Modify: `tsconfig.json` — update paths to point to `src/`

## Batch 7: Cleanup + verify

### Task 17: Delete old files

- Delete: `LandingPage.tsx` (root duplicate)
- Delete: all files in `components/` directory
- Delete: `types.ts`, `constants.ts` (root)
- Delete: `App.tsx`, `index.tsx` (root)
- Keep: `api/contact.js` at root (Vercel serverless convention)

### Task 18: Build + fix

```bash
npm run build
```
Fix any TypeScript errors or missing imports. Iterate until clean build.

### Task 19: Commit

```bash
git add -A
git commit -m "refactor: restructure into src/ with split components, extracted constants, clean routing"
```

### Task 20: Notify

```bash
openclaw system event --text "Done: Task Rig HiFi refactor complete - restructured into src/ with split components, extracted constants, clean routing" --mode now
```
