# 02. UI/UX Specifications & Visual Design System
**Brand**: AURELLE — Unisex Salon & Studio  
**Visual Direction**: Warm Residential Luxury, Botanical Minimalism, Editorial Typography, Tactile Micro-Interactions  
**Stack Alignment**: React 18 + Vite + Tailwind CSS + Lucide Icons

---

## 1. Visual Design System

The visual design system of AURELLE fuses deep botanical greens, warm cream canvas textures, brushed champagne metallics, and crisp hairline borders.

```
       ┌────────────────────────────────────────────────────────┐
       │                 THE AURELLE COLOR SUITE                │
       │                                                        │
       │  [#162E25]       [#C5A880]       [#FBF9F5]   [#1C1917] │
       │  Botanical Green Champagne Gold  Warm Linen  Charcoal  │
       │  (Primary)       (Accent)        (Canvas)    (Ink)     │
       └────────────────────────────────────────────────────────┘
```

### 1.1 Color Palette Specifications

| Token Name | Hex Code | Tailwind Utility Class | Intended Usage & Context |
| :--- | :--- | :--- | :--- |
| **Primary Brand (Deep Forest)** | `#162E25` | `bg-[#162E25]`, `text-[#162E25]` | Dominant brand elements, primary CTAs, main navigation header, customer hero cards. |
| **Primary Hover (Dark Pine)** | `#0F221B` | `hover:bg-[#0F221B]` | Interactive hover state for primary action buttons. |
| **Secondary Accent (Champagne Gold)** | `#C5A880` | `bg-[#C5A880]`, `text-[#C5A880]` | Accent badges, borders on active cards, token highlights, secondary icons. |
| **Muted Gold (Antique Brass)** | `#A88B65` | `text-[#A88B65]`, `border-[#A88B65]` | Subdued metadata, secondary labels, active tabs. |
| **Background Canvas (Warm Linen)** | `#FBF9F5` | `bg-[#FBF9F5]` | Global mobile & tablet body background; eliminates harsh glare. |
| **Surface Card (Warm Alabaster)** | `#FFFFFF` | `bg-white` | Elevated content cards, input containers, modal dialog bodies. |
| **Subtle Card Tint (Soft Sand)** | `#F5F2EB` | `bg-[#F5F2EB]` | Secondary containers, table header strips, inactive list items. |
| **Hairline Border (Stone Sand)** | `#E7E2D8` | `border-[#E7E2D8]` | Universal container borders, dividers, card outlines (1px hairline). |
| **Primary Text (Espresso Charcoal)** | `#1C1917` | `text-[#1C1917]` | Main headings, primary content copy, prominent token numbers. |
| **Muted Text (Warm Slate Grey)** | `#78716C` | `text-[#78716C]` | Subtitles, duration indicators, secondary metadata, timestamps. |
| **Display TV Dark Slate** | `#0D1512` | `bg-[#0D1512]` | High-contrast cinematic backdrop for the wall-mounted lounge TV. |

---

## 2. Canonical Unisex Seed Data

### 2.1 Stylist Team Seed Data
1. **Vikram Singh** (`vikram`): Senior Creative Director & Precision Stylist (Chair 1, Rating 4.95)
2. **Ananya Sharma** (`ananya`): Master Colorist & Occasion Stylist (Chair 2, Rating 4.98)
3. **Alex Rivera** (`alex`): Advanced Hair Spa & Texture Specialist (Chair 3, Rating 4.88)
4. **Priya Patel** (`priya`): Aesthetician & Wellness Specialist (Chair 4, Rating 4.92)

### 2.2 Unisex Service Catalogue (INR ₹)
1. **Signature Haircut & Styling** — 45 min — ₹500
2. **Hair Spa & Deep Conditioning** — 60 min — ₹1,200
3. **Blow Dry & Hair Styling** — 30 min — ₹450
4. **Hair Colour & Global Colour** — 90 min — ₹2,000
5. **Classic Facial** — 45 min — ₹900
6. **Clean-Up & Skin Refresh** — 30 min — ₹600
7. **Manicure & Pedicure** — 60 min — ₹850
8. **Bridal / Party Styling** — 75 min — ₹1,500

---

## 3. UI/UX Specifications for all 7 Screens

* **Customer Home (`/`)**: 9-section editorial layout with full-width photography, asymmetrical intro, live queue summary card, 6-tile service image grid, stylist carousel, full-width salon experience, why Aurelle, and Navrangpura studio location.
* **Join Queue (`/join`)**: Step-by-step registration with 10-digit duplicate active phone check, service multi-select (up to 3), stylist preference selector, and 30-min cutoff guard.
* **Live Status Tracker (`/status/:id`)**: Reactive token card with dynamic wait countdown, step stepper, voluntary cancel modal, and full-screen `CallAlertModal` with Web Audio chime.
* **Reception Dashboard (`/reception`)**: Two-column iPad console for waiting queue and active chairs with walk-in intake modal.
* **Stylist Workstation (`/barber/:slug`)**: Single-chair focused UI with break status toggle, smart FIFO "Call Next" query, and elapsed stopwatch timer.
* **Wall TV Display (`/display`)**: 1080p landscape non-scrolling digital signage with pulsating gold call rings and audio chime.
* **Owner Admin (`/admin`)**: Operations KPI bar, queue toggle, 30-min auto cutoff rule, service catalogue rates, and stylist roster management.
