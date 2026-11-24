# AURELLE — UNISEX SALON & STUDIO
## Complete Project History, Technical Architecture & Context Transfer Document

> **Purpose**: This document serves as the comprehensive, authoritative technical record of the AURELLE Real-Time Salon Queue Management System web application. It encapsulates the full development journey, user requirements, algorithmic specifications, architectural decisions, file catalog, bug resolutions, and deployment configurations to enable seamless context transfer to ChatGPT or any subsequent engineering team.

---

## 1. Executive Project Summary

- **Project Name**: AURELLE — Unisex Salon & Studio Queue Management System
- **Repository**: [https://github.com/Diksha-khandelwal/aurelle-salon-management.git](https://github.com/Diksha-khandelwal/aurelle-salon-management.git)
- **Deployment Platform**: Vercel (Configured with SPA rewrites in `vercel.json`)
- **Primary Tech Stack**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Zustand 4, Lucide React, Web Audio API, Web Speech API (`SpeechSynthesis`), BroadcastChannel API.
- **Physical/Fictional Location**: Commerce College Road, Navrangpura, Ahmedabad, Gujarat, India (PIN: 380009).
- **Brand Aesthetic**: High-luxury botanical unisex salon & studio inspired by premium editorial design language. Palette of Botanical Forest Green (`#162E25`), Champagne Gold (`#C5A880`), Warm Cream Linen (`#FBF9F5`), and Charcoal Black (`#1C1917`).
- **Core Capability**: Real-time multi-device queue coordination (<5s synchronization latency across customer phones, reception tablets, barber workstations, and 1080p wall displays) with smart FIFO dispatch, zero-dependency audio/speech announcements, and bilingual support (English & Gujarati).

---

## 2. Chronological Development History

### Phase 1: Inception & Documentation Suite Creation
- **Trigger**: The user provided a reference template website (`https://www.peteralexandersalon.com/`) and requested a complete, production-grade documentation suite inside a `/docs` folder for a Real-Time Salon Queue Management System.
- **Deliverables Created**:
  1. `docs/01-brief.md`: Problem statement (weekend congestion, disputes, lost revenue), user personas (Remote Customer, Walk-in, Receptionist, Barbers, Owner), project objectives, strict boundaries (no online payments, no future booking calendar, no SMS API costs).
  2. `docs/02-screens.md`: Complete specifications for 7 screens, design tokens, color palette, typography scales, card layouts, mobile responsiveness.
  3. `docs/03-flows-rules.md`: State machine diagrams, smart FIFO dispatch rules, concurrency guards, wait-time calculation formulas, 10-minute grace period logic.
  4. `docs/04-build-plan.md`: Technical build phases, milestones, testing protocols.

### Phase 2: Core Application Implementation
- **Trigger**: The user instructed: *"do the implementation according to the doc files"*.
- **Implementation Accomplished**:
  - Initialized React + Vite + TypeScript application with Tailwind CSS.
  - Implemented Zustand store (`src/store/useQueueStore.ts`) managing tokens, barbers, services, settings, and cross-tab `BroadcastChannel`.
  - Built state machine guards (`src/utils/guards.ts`) ensuring strict transition enforcement (`WAITING` -> `CALLED` -> `IN_SERVICE` -> `COMPLETED`, `NO_SHOW`, `CANCELLED`).
  - Implemented dynamic wait-time calculation (`src/utils/waitCalculator.ts`).
  - Synthesized two-tone melodic chime via Web Audio API (`src/utils/audioChime.ts`).
  - Built all 7 primary screens + bilingual dictionary (`src/i18n/translations.ts`) + 15-point diagnostic test suite (`src/pages/TestSuiteScreen.tsx`).

### Phase 3: Master Rebranding to "AURELLE Unisex Salon & Studio"
- **Trigger**: The user requested a complete transformation from the initial Peter Alexander identity into an original luxury unisex brand: **AURELLE — Unisex Salon & Studio** located in Navrangpura, Ahmedabad, Gujarat, India with INR (₹) currency.
- **Transformations Executed**:
  - Replaced all Peter Alexander references across the entire codebase, headings, metadata, and data seed files.
  - Designed an SVG interlocking **A + U Monogram Logo** with bespoke serif typography (`src/components/common/AurelleLogo.tsx`).
  - Overhauled navigation into a luxury editorial header with `Staff & Ops` dropdown, language switcher, and Join Queue CTA.
  - Rebuilt the homepage (`src/pages/HomeScreen.tsx`) with 6 editorial sections: Hero, Studio Intro, Live Queue Panel, Service Offerings Grid, Stylist Team Showcase, Full-Width Atmosphere Scrim, Brand Distinction, and Visit Sanctuary footer.
  - Introduced the initial animated Japanese shears route transition.

### Phase 4: Visual Refinements & Roster Expansion (8 Stylists)
- **Trigger**: User provided feedback on screenshot reviews:
  1. Hero background photo was obscured by an overly opaque green overlay.
  2. The fixed header was overlapping the headings of operational pages (`/reception`, `/barber/:slug`, `/admin`, etc.).
  3. Stylist team needed to be expanded from 4 to 8 stylists (Vikram, Ananya, Alex, Priya, Meera, Arjun, Riya, Kabir).
- **Transformations Executed**:
  - Calibrated hero background image overlay to `bg-[#0F221B]/45` + subtle directional gradients, balancing photo clarity with crisp white typography.
  - Added `MainLayout` in `App.tsx` with responsive `pt-24 sm:pt-28` offset on non-home/non-display routes, completely eliminating navigation overlap.
  - Expanded `INITIAL_BARBERS` to 8 stylists with authentic high-resolution portrait photography and specialties.
  - Upgraded Wall TV Display and Reception floor console to gracefully support 8 workstations (4x2 grid).

### Phase 5: Two-Layer Physical Scissors Page-Cut Transition
- **Trigger**: The user rejected single-overlay screen transitions and horizontal line tracers, requiring an authentic **physical sheet-of-paper cutting effect** where the active outgoing page is sliced horizontally along `y = 50%` and parted open into two sections to reveal the destination page already rendered underneath.
- **Transformations Executed**:
  - Re-architected `src/components/common/ScissorsTransition.tsx` into a 3-layer architecture.
  - Layer 1 (bottom): Incoming route mounted immediately.
  - Layer 2 (middle): Outgoing route cloned and rendered in two halves (Top half `clipPath: polygon(0 0, 100% 0, 100% 50.1%, 0 50.1%)`, Bottom half `clipPath: polygon(0 49.9%, 100% 49.9%, 100% 100%, 0 100%)`).
  - Layer 3 (topmost): Realistic Japanese convex hairdressing shears SVG gliding from left to right over 2050ms with 5 rhythmic snips.
  - As shears traverse, top half tilts and lifts upward, bottom half tilts and drops downward, casting real drop shadows on the parting cut.

### Phase 6: Spoken Token Voice Announcements on Wall TV Display
- **Trigger**: The user requested replacing the simple TV chime with a realistic, pleasant female salon receptionist voice announcement using browser Web Speech API (`SpeechSynthesis`).
- **Transformations Executed**:
  - Built `src/utils/speechAnnouncement.ts`.
  - Implemented 3-phase audio sequence: (1) One soft 2-tone chime -> (2) 280ms breathing pause -> (3) Spoken announcement. Zero audio collision.
  - Enforced digit-by-digit token pronunciation preserving leading zeros (`A-115` -> "Token A, one one five. Please proceed to Chair One").
  - Implemented intelligent female voice selection prioritizing high-fidelity natural/neural voices (`Microsoft Jenny/Neerja`, `Google UK English Female`, `Microsoft Heera/Zira`).
  - Added non-repeating humorous welcoming lines (e.g. "Your stylist is ready to make some magic!").
  - Integrated speech controls (Voice ON/OFF, Language, Volume, Test Announcement) into `WallDisplayScreen.tsx`.

---

## 3. Comprehensive Requirements & Specifications

### 3.1 Personas & Screens (7 Screens + Test Suite)
1. **Customer Home (`/`)**: Brand storytelling, live queue tracker card, quick token status lookup form, curated services overview, stylist team showcase, studio philosophy, and location/hours.
2. **Customer Remote Join (`/join`)**: 3-step check-in wizard. Step 1: Client Name & Phone (with 10-digit Indian mobile validation & duplicate active token prevention). Step 2: Multi-select services (maximum 3 services per visit). Step 3: Stylist selection ("Any Stylist (Fastest)" vs. specific stylist).
3. **Live My Status Tracker (`/status/:id`)**: Real-time position counter, estimated wait countdown, allocated stylist card, full-screen approach modal (`CALLED`), and voluntary cancel action.
4. **Receptionist Tablet Dashboard (`/reception`)**: Split-screen console. Left: Chronological FIFO queue with manual walk-in intake button and search filter. Right: 8 active stylist workstations with live service stopwatch timers, "Call Next" triggers, "Start Service", "Complete (Done)", and "Mark No-Show" actions.
5. **Barber Workstation View (`/barber/:slug`)**: Personalized chair view for individual stylists. Station vacancy status, smart FIFO "Call Next" action, real-time stopwatch timer, and "Take Break / End Break" toggle.
6. **Waiting Area Wall TV Display (`/display`)**: Dark botanical aesthetic (`#0D1512`), high-contrast 4x2 grid of 8 chairs, digital salon clock, "Now Serving" flash animations, up-next FIFO ticker, and spoken female receptionist voice announcements.
7. **Owner Admin & Analytics (`/admin`)**: Master queue toggle (Open/Paused), 30-minute auto-cutoff switch, daily analytics KPI cards (total served, average service duration, no-show rate), full service menu pricing/duration editor, and stylist roster management.
8. **15-Point Diagnostics Suite (`/test-suite`)**: Automated end-to-end verification harness executing 15 business rule assertions and restoring pristine state upon completion.

---

## 4. Algorithmic & Business Rule Specifications

### 4.1 Smart FIFO Queue Dispatch Algorithm
When Stylist $X$ clicks "Call Next":
1. Stylist workstation concurrency lock: Stylist must have `status === 'AVAILABLE'` and `currentTokenId === null`. If stylist is `BUSY` or `ON_BREAK`, the call is rejected.
2. System queries all tokens where `status === 'WAITING'`.
3. Filters for clients where `preferredBarberId === 'ANY' || preferredBarberId === Stylist_X_Id`.
4. Sorts filtered candidates strictly by `joinTime` in ascending chronological order ($\text{FIFO}$).
5. The earliest candidate is selected and transitioned:
   - Token `status` becomes `'CALLED'`.
   - Token `calledTime` is set to current ISO timestamp.
   - Token `assignedBarberId` is bound to Stylist $X$.
   - Stylist status becomes `'BUSY'` and `currentTokenId` is bound to Token ID.
6. If no matching candidate exists, returns a non-blocking notification: *"No matching clients waiting for this stylist."*

### 4.2 Dynamic Wait Time Estimation Formula
For any token $i$ at position $K$ in the waiting queue:
$$\text{Wait Time} = \frac{\sum_{j=1}^{K-1} \text{Duration}(T_j) + \text{Duration}(T_i)}{\max(1, N_{\text{active\_stylists}})} + \text{RemainingTime}_{\text{active\_chairs}}$$
- If all stylists are `ON_BREAK`, returns `isAllOnBreak: true` and displays fallback notice rather than dividing by zero or displaying `NaN`.

### 4.3 Lifecycle State Machine Guard Rules
Strict state transition validation (`src/utils/guards.ts`):
- `WAITING` $\rightarrow$ `CALLED` (Allowed)
- `WAITING` $\rightarrow$ `CANCELLED` (Customer voluntary exit)
- `WAITING` $\rightarrow$ `IN_SERVICE` (**Forbidden** — must be called first)
- `CALLED` $\rightarrow$ `IN_SERVICE` (Stylist starts chair service)
- `CALLED` $\rightarrow$ `NO_SHOW` (After 10-minute grace period expiry)
- `CALLED` $\rightarrow$ `WAITING` (Grace period bump to bottom of queue with fresh token)
- `IN_SERVICE` $\rightarrow$ `COMPLETED` (Stylist completes service, chair becomes `AVAILABLE`)
- Any transition from `COMPLETED`, `CANCELLED`, or `NO_SHOW` is terminal.

---

## 5. Technical Architecture & Tech Stack

```
SalonQueueManagementSystem/
├── docs/                      # Production specifications & functional briefs
│   ├── 01-brief.md
│   ├── 02-screens.md
│   ├── 03-flows-rules.md
│   └── 04-build-plan.md
├── public/                    # Static web assets & web manifest
├── src/
│   ├── components/
│   │   ├── admin/             # Analytics, QueueControl, RosterManager, ServiceManager
│   │   ├── barber/            # StopwatchTimer workstation component
│   │   ├── common/            # Header, Footer, AurelleLogo, ScissorsTransition
│   │   ├── customer/          # ServiceSelector, BarberPreferenceSelector, CallAlertModal
│   │   ├── display/           # ChairDisplayCard, UpNextList
│   │   └── reception/         # ActiveChairsColumn, WaitingQueueColumn, WalkInModal
│   ├── context/               # LanguageContext (English & Gujarati)
│   ├── data/                  # seedData.ts (8 stylists, 8 services, initial tokens)
│   ├── i18n/                  # translations.ts (Full bilingual dictionary)
│   ├── pages/                 # 8 primary application page views
│   ├── store/                 # useQueueStore.ts (Zustand store + BroadcastChannel)
│   ├── types/                 # queue.ts (Domain models, Token, Barber, Service)
│   ├── utils/                 # audioChime, speechAnnouncement, guards, waitCalculator
│   ├── App.tsx                # BrowserRouter, MainLayout, ScissorsTransition wrapper
│   └── main.tsx               # React DOM entry point
├── vercel.json                # Vercel SPA routing rewrites
├── vite.config.ts             # Vite configuration with @ path aliases
└── tailwind.config.js         # Custom luxury theme tokens (forest, champagne, linen)
```

### 5.1 Dependencies & Libraries (`package.json`)
```json
{
  "name": "salon-queue-management-system",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.441.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "tailwind-merge": "^2.5.2",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

---

## 6. Technical Deep-Dives: Core Custom Subsystems

### 6.1 Two-Layer Physical Scissors Page-Cut Transition
- **File**: `src/components/common/ScissorsTransition.tsx`
- **Challenge**: Traditional page transitions fade out the old page or show a full-screen loading curtain. The user required a literal simulation of cutting through the visible page like paper.
- **Solution**:
  1. `App.tsx` wraps `<Routes>` inside `<ScissorsTransition>`.
  2. When `location.pathname` changes, `lastLocationRef.current` preserves the outgoing route, and `scrollOffsetRef.current = window.scrollY` captures the scroll position.
  3. The **Incoming Route (Layer 1)** mounts immediately at the base DOM layer.
  4. The **Outgoing Route (Layer 2)** is cloned and duplicated into two clipping wrappers:
     - Top half: `clipPath: 'polygon(0% 0%, 100% 0%, 100% 50.1%, 0% 50.1%)'`
     - Bottom half: `clipPath: 'polygon(0% 49.9%, 100% 49.9%, 100% 100%, 0% 100%)'`
     - A 0.2% sub-pixel overlap eliminates any hairline gap prior to cutting.
  5. The **Scissors (Layer 3)** is an SVG Japanese convex hairdressing shear:
     - Pivot dial with gold knurled coin-edge bezel and deep emerald cabochon jewel (`#162E25`) with diamond gleam.
     - Ergonomic crane handle with pinky tang and silencer bumper.
     - Sweeps across `y = 50%` horizontally (`left: -18vw` to `left: 120vw`) over 2050ms with 5 rhythmic snips.
  6. As the shears travel, the top half tilts and peels up (`translate3d(-1%, -38%, 0) rotate(-3.5deg)`), and bottom half drops down (`translate3d(-1%, 38%, 0) rotate(3.5deg)`), casting drop shadows along the cut edge.
  7. Upon completion (2050ms), the outgoing elements unmount cleanly.

### 6.2 TV Wall Spoken Voice Announcement System
- **Files**: `src/utils/speechAnnouncement.ts`, `src/utils/audioChime.ts`, `src/pages/WallDisplayScreen.tsx`
- **Challenge**: Default browser TTS sounds robotic, overlaps with chimes, repeats across re-renders, and butchers token numbers by pronouncing "115" as "one hundred fifteen".
- **Solution**:
  1. **Strict 3-Phase Sequence**:
     - Phase 1: `await audioService.playCallChime()` — Web Audio API 2-tone melodic chime (A5 880Hz + E6 1318.5Hz). Returns a `Promise<void>` that resolves after 750ms.
     - Phase 2: `await new Promise(r => setTimeout(r, 280))` — 280ms breathing pause preventing audio collision.
     - Phase 3: Speech synthesis utterance begins.
  2. **Digit-by-Digit Token Formatting**:
     - `A-115` is parsed into letter `"A"` and individual digits `"one one five"`.
     - `B-008` is parsed into `"B"` and `"zero zero eight"`, strictly preserving leading zeros.
  3. **Female Voice Scoring Algorithm**:
     - Analyzes `window.speechSynthesis.getVoices()`.
     - Evaluates neural/natural indicators (+55 pts), female name tokens (+45 pts: Jenny, Neerja, Heera, Aria, Zira, Samantha, etc.), disqualifies male names (-65 pts: David, Mark, Ravi, etc.), and prioritizes Indian English (+30 pts) and British English (+20 pts).
     - Result on Windows: Automatically selects `Microsoft Neerja Online (Natural)` / `Microsoft Jenny Online (Natural)` in Edge, `Google UK English Female` in Chrome, or `Microsoft Heera` / `Microsoft Zira` offline.
  4. **Non-Repeating Humorous Welcome Lines**:
     - Collection of 7 salon lines (e.g. *"Your stylist is ready to make some magic!"*, *"Chair {ChairName} is ready for you. Let the pampering begin!"*).
     - Tracks `lastHumorousIndex` so no line is spoken twice consecutively.
  5. **Deduplication Engine**:
     - Deduplicates at both the React component level (`announcedCallsRef`) and the service queue level by composite key: `${token.id}_${token.calledTime}`.
     - Multiple store re-renders or BroadcastChannel messages cannot trigger duplicate speech.

---

## 7. Roster of Eight (8) Stylists

| Chair | Stylist Name | Professional Title | Rating | Specialty Focus | Unsplash Asset ID |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **1** | **Vikram Singh** | Senior Creative Director & Precision Stylist | 4.95 | Precision Haircuts, Texture Architecture | `photo-1507003211169-0a1dd7228f2d` |
| **2** | **Ananya Sharma** | Master Colorist & Occasion Stylist | 4.98 | Global Colour & Balayage, Bridal Styling | `photo-1534528741775-53994a69daeb` |
| **3** | **Alex Rivera** | Advanced Hair Spa & Texture Specialist | 4.88 | Keratin Restorative Therapy, Deep Spa | `photo-1500648767791-00dcc994a43e` |
| **4** | **Priya Patel** | Aesthetician & Wellness Specialist | 4.92 | Signature Facials, Manicure & Pedicure | `photo-1573496359142-b8d87734a5a2` |
| **5** | **Meera Kapoor** | Bridal & Couture Hair Artisan | 4.96 | Bridal Updos, Editorial Braiding | `photo-1580489944761-15a19d654956` |
| **6** | **Arjun Mehta** | Contemporary Hair Designer | 4.91 | Modern Precision Fades, Scissor Sculpting | `photo-1519085360753-af0119f7cbe7` |
| **7** | **Riya Desai** | Blow Dry & Texture Artist | 4.89 | Silk Press & Smoothing, Volume Blowout | `photo-1544005313-94ddf0286df2` |
| **8** | **Kabir Malhotra** | Master Balayage & Highlights Colorist | 4.94 | Creative Highlights, Foilayage Artistry | `photo-1506794778202-cad84cf45f1d` |

---

## 8. 15-Point Diagnostics & Test Suite Verification

Accessible in-app at `/test-suite` (`src/pages/TestSuiteScreen.tsx`), all 15 automated test cases verify with 100% pass rate:

1. **Remote Check-In Creation**: Verifies token creation with `WAITING` status and sequential token numbering.
2. **Duplicate Phone Guard**: Validates that a phone number with an active waiting ticket cannot rejoin.
3. **Service Multi-Select Cap**: Enforces the maximum 3-service limit per client.
4. **Walk-in Reception Append**: Verifies that front-desk walk-ins are placed strictly at the tail of the FIFO queue.
5. **Smart FIFO Barber Match**: Confirms calling for Stylist $X$ selects the earliest client wanting Stylist $X$ or "ANY".
6. **"Any Barber" FIFO Priority**: Confirms clients choosing fastest available chair are assigned to the first free workstation.
7. **Single-Chair Concurrency Lock**: Blocks a stylist from calling a second client while actively in service.
8. **Full-Screen Customer Alert Transition**: Validates state machine enforces `WAITING` $\rightarrow$ `CALLED` prior to seating.
9. **10-Min Grace Period Expiry / No-Show**: Validates transition to `NO_SHOW` when customer fails to arrive.
10. **Grace Bump to Bottom**: Verifies bumping a client re-queues them at the bottom with a fresh token.
11. **Customer Voluntary Cancel**: Validates that client ticket surrender compacts queue order.
12. **Zero-Barber Break Fallback**: Validates wait time calculation returns finite numbers without `NaN` when all stylists are on break.
13. **30-Min Auto Cutoff Rule**: Confirms settings toggle disables new intake 30 minutes prior to salon closing.
14. **Bilingual Toggle Persistence**: Confirms `salon_preferred_lang` persists across browser sessions in `localStorage`.
15. **TV Flash & Audio Chime System**: Verifies audio context synthesizer and broadcast listener initialization.

---

## 9. Bug Fixes & Technical Troubleshooting Log

1. **Swapped Component Exports**:
   - *Issue*: Early compile error `Module '../components/admin/QueueControlPanel' has no exported member 'QueueControlPanel'`.
   - *Cause*: Content of `QueueControlPanel.tsx` and `ServiceManager.tsx` had been crossed during initial scaffolding.
   - *Fix*: Sorted exports and verified clean separation of admin concerns.
2. **FIFO Append Stale State in Test 04**:
   - *Issue*: `Test 04 Walk-in Reception Append` reported failure in the test suite.
   - *Cause*: Test was reading a stale closure of `store.tokens` rather than the updated snapshot.
   - *Fix*: Switched to reading live state directly via `useQueueStore.getState().tokens`.
3. **Fixed Header Overlap on Operational Pages**:
   - *Issue*: Fixed header (`z-50`, ~72px height) collided with the top banners of `/reception`, `/barber/:slug`, and `/admin`.
   - *Fix*: Created `MainLayout` in `App.tsx` applying `pt-24 sm:pt-28` to all routes except Home (`/`) and Wall Display (`/display`).
4. **Opaque Green Screen in Page Transition**:
   - *Issue*: Previous transition rendered solid green curtains (`#162E25`) that hid the outgoing page prematurely.
   - *Fix*: Rewrote `ScissorsTransition.tsx` into a dual-layer physical paper cut with transparent overlay, splitting the outgoing page along `y = 50%` and peeling the two halves apart.
5. **Robotic Speech & Audio Collision**:
   - *Issue*: TV chime played simultaneously with speech; token numbers like `A-115` were pronounced "one hundred fifteen".
   - *Fix*: Made chime return a Promise resolving after 750ms + 280ms pause before speech; added regex tokenizer to pronounce digits individually ("one one five") preserving leading zeros.

---

## 10. Deployment & Hosting Configuration

### 10.1 GitHub Configuration
- **Remote URL**: `https://github.com/Diksha-khandelwal/aurelle-salon-management.git`
- **Default Branch**: `main`
- **Commit History**: Clean initial commit `a1b2dab` containing full AURELLE production code.

### 10.2 Vercel Configuration (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Ensures client-side routing (`/join`, `/reception`, `/barber/vikram`, `/display`, etc.) routes properly to `index.html` on direct page reloads or deep links without 404 errors.

---

## 11. Known Limitations & Roadmap for Future Engineering

1. **Current Persistence Architecture**:
   - Currently uses `localStorage` (`aurelle_salon_queue_state_v2`) combined with browser `BroadcastChannel` (`aurelle_queue_bus`).
   - *Limitation*: Real-time sync works across multiple browser tabs, windows, and monitors on the same device or network session, but does not persist across separate remote physical devices without a central server.
   - *Recommended Next Step*: Connect Zustand store to a Supabase or Firebase Realtime backend via WebSockets.
2. **Gujarati Text-to-Speech OS Dependency**:
   - Browser `SpeechSynthesis` depends on the operating system having a Gujarati voice installed. On standard Windows/macOS installations, Gujarati voices are absent by default.
   - The system handles this gracefully by detecting missing voices and speaking in warm Indian English (`en-IN`, e.g. `Microsoft Heera`).
   - *Recommended Next Step*: For true bilingual spoken audio regardless of OS, integrate an optional Cloud TTS proxy (e.g. Google Cloud TTS or ElevenLabs).
3. **Hardware Integrations**:
   - Receipt thermal printer support at reception for physical paper tickets.
   - SMS / WhatsApp Business API webhooks (e.g. Twilio) to dispatch text alerts to patrons when they are 2nd in line.

---
*Document generated and validated against local codebase on 2026-11-24.*
