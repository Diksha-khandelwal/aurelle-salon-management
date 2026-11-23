# 04. Incremental Build Plan & Engineering Prompts
**Target Architecture**: React 18/19 + Vite + TypeScript + Tailwind CSS + Zustand  
**Brand Identity**: AURELLE Unisex Salon & Studio (Navrangpura, Ahmedabad)

---

## 1. System Overview

AURELLE is engineered as an ultra-low latency, cross-device salon queue management web application. It combines an editorial luxury customer experience with high-precision salon operational consoles.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AURELLE APPLICATION ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Routing Layer         :  React Router DOM v6                               │
│  State & Persistence   :  Zustand + LocalStorage Migration Layer            │
│  Real-Time Bus         :  BroadcastChannel API ('aurelle_queue_bus')        │
│  Page Transition       :  ScissorsTransition (Animated SVG Sweep ~800ms)    │
│  Styling & Theme       :  Tailwind CSS v3 + Playfair Display / Jakarta Sans │
│  Audio Synthesis       :  Web Audio API (Synthesized Melodic Chime)         │
│  Localization Engine   :  Custom React Context Dictionary (EN & GU)         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 8-Step Build & Verification Roadmap

* **Step 1: Identity & Theme Setup**: Interlocking A–U monogram logo (`AurelleLogo`), botanical green and champagne gold palette, and Google Fonts.
* **Step 2: Shared Queue Store & Smart FIFO Dispatch**: Zustand store (`useQueueStore`) with `localStorage` safe migration, smart preference filtering, and chair concurrency locks.
* **Step 3: Customer Screens**: Editorial homepage with video-inspired visual language, multi-select `/join` form, and reactive `/status/:id` tracker.
* **Step 4: Operations Console**: Receptionist tablet console (`/reception`) with walk-in intake modal.
* **Step 5: Workstation & TV Display**: Stylist chair view (`/barber/:slug`) with stopwatch timer and wall TV signage (`/display`) with audio chime.
* **Step 6: Admin Settings**: Executive dashboard (`/admin`) with queue controls and service pricing.
* **Step 7: Animated Scissors Transition**: Custom SVG shears transition (`ScissorsTransition`) triggered strictly on route changes.
* **Step 8: 15-Point Diagnostics & Production Build**: Automated test suite (`/test-suite`) verifying all business rules, followed by `npm run build`.
