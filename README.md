# AURELLE — Unisex Salon & Studio
### The Art of Looking Your Best • Navrangpura, Ahmedabad, Gujarat (380009)

A distinctive, luxury unisex salon and real-time chair queue management web application. Built with **React 18 + Vite + TypeScript + Tailwind CSS + Zustand**, featuring full **English & Gujarati (ગુજરાતી)** bilingual localization, cross-device real-time sync (< 3s latency), animated scissors route transitions, and smart FIFO queue dispatch.

---

## Brand Identity & Aesthetic

* **Salon Name**: AURELLE
* **Subtitle**: UNISEX SALON & STUDIO
* **Tagline**: The Art of Looking Your Best
* **Flagship Sanctuary**: Opp. Commerce College Road, Navrangpura, Ahmedabad, Gujarat, India (380009)
* **Design Philosophy**: Warm residential luxury inspired by botanical deep forest greens (`#162E25`), brushed champagne gold metallics (`#C5A880`), warm linen backgrounds (`#FBF9F5`), and editorial typography (`Playfair Display` & `Plus Jakarta Sans`).
* **Bespoke Logo**: Original SVG interlocking **A–U** monogram with refined architectural crest and editorial wordmark.

---

## 7 Application Screens & Operations

1. **Customer Home (`/`)**:
   * Full-width editorial hero with large salon photography and subtle emerald dark overlays.
   * Asymmetrical editorial introduction section.
   * Floating live queue status summary (waiting count, estimated wait, available stylists).
   * 6-tile photographic service offerings grid (Haircuts, Colour, Treatments, Skin, Nails, Bridal).
   * Unisex team profiles and full-width salon atmosphere experience.
   * "Why AURELLE" distinction highlights and Navrangpura studio location details.
2. **Join Queue (`/join`)**:
   * Remote online check-in with duplicate active phone number guard.
   * Unisex service selector (max 3 services).
   * Stylist preference: "Any Stylist (First Available — Fastest Seating)" or specific team member.
   * Automated 30-minute pre-closing cutoff lock.
3. **Live Status Tracker (`/status/:id`)**:
   * Large token badge, dynamic wait estimate, and live queue position stepper.
   * Full-screen **"IT'S YOUR TURN!"** modal takeover with Web Audio chime when called to chair.
4. **Reception Dashboard (`/reception`)**:
   * Two-column tablet console: FIFO waiting queue (search, bump, cancel) + active chairs (seat client, mark no-show, complete).
   * Instant walk-in registration modal (appended strictly to the bottom of the queue).
5. **Stylist Workstation (`/barber/:slug`)**:
   * Single-chair focused view with break toggle and smart FIFO "Call Next" dispatch.
   * Live service stopwatch timer with chair concurrency locks.
6. **Wall TV Display (`/display`)**:
   * High-contrast 1080p landscape wall signage (`#0D1512` dark slate) with pulsating gold call rings, Web Audio melodic chime, and "Up Next" FIFO list.
7. **Owner Admin (`/admin`)**:
   * Operational analytics (guests served today, average wait, chair duration, INR revenue).
   * Master Queue switch (`OPEN` / `PAUSED` / `CLOSED`), 30-minute auto cutoff rule toggle, service catalogue editor with INR rates, and stylist roster management.

---

## Unique Technical Features

* **Custom Animated Scissors Page Transition (`ScissorsTransition`)**:
  * An animated pair of champagne-gold shears sweeps horizontally across the viewport during route changes with an editorial cutting wipe effect.
  * Honors `prefers-reduced-motion` and suppresses clicks during the ~800ms transition.
* **8 Unisex Services (INR ₹)**:
  1. Signature Haircut & Styling — 45 min — ₹500
  2. Hair Spa & Deep Conditioning — 60 min — ₹1,200
  3. Blow Dry & Hair Styling — 30 min — ₹450
  4. Hair Colour & Global Colour — 90 min — ₹2,000
  5. Classic Facial — 45 min — ₹900
  6. Clean-Up & Skin Refresh — 30 min — ₹600
  7. Manicure & Pedicure — 60 min — ₹850
  8. Bridal / Party Styling — 75 min — ₹1,500
* **Balanced Unisex Stylists**:
  * Vikram Singh (Senior Creative Director)
  * Ananya Sharma (Master Colorist & Occasion Stylist)
  * Alex Rivera (Advanced Hair Spa Specialist)
  * Priya Patel (Aesthetician & Wellness Specialist)
* **Smart FIFO Dispatch Algorithm**:
  * When Stylist $X$ calls "Next", the algorithm scans the queue chronologically and calls the earliest guest requesting Stylist $X$ or "Any Stylist".
* **15-Point Diagnostic Test Suite (`/test-suite`)**:
  * Tests all 15 core business rules, anti-duplicate guards, and FIFO order using fresh Zustand state evaluation with zero data corruption.

---

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile production bundle
npm run build

# Preview production build
npm run preview
```

---

## Verification

Visit `http://localhost:5173/test-suite` in your browser and click **"Execute 15-Point Test Suite"** to verify all business rules, lifecycle transitions, and FIFO ordering.
