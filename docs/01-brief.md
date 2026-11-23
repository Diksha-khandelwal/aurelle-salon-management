# 01. Project Brief: AURELLE Unisex Salon & Studio
**Brand Identity**: AURELLE — Unisex Salon & Studio  
**Tagline**: The Art of Looking Your Best  
**Flagship Location**: Navrangpura, Ahmedabad, Gujarat, India (380009)  
**Target Architecture**: React 18/19 + Vite + TypeScript + Tailwind CSS (Bilingual: English & Gujarati)  
**System Classification**: Ultra-Low Latency Cross-Device Salon Queue & Station Dispatch PWA

---

## 1. Executive Summary & Vision

**AURELLE** is a luxury unisex salon and studio situated in Navrangpura, Ahmedabad. Crafted in the spirit of calm residential luxury and timeless architectural design, AURELLE replaces chaotic physical queues with an intuitive, synchronized real-time queue orchestration platform.

Guests can check in remotely from a nearby café or home, monitor their exact position and wait countdown in real time, and arrive precisely when their stylist chair is ready. Simultaneously, front-desk receptionists, master hair stylists, colorists, and salon management operate through responsive interfaces synchronized across devices with sub-3-second latency.

```
       ┌────────────────────────────────────────────────────────┐
       │              AURELLE REAL-TIME QUEUE BUS               │
       │    (BroadcastChannel API / LocalStorage State Hub)     │
       └──────────────────────────┬─────────────────────────────┘
                                  │
    ┌─────────────────┬───────────┴───────────┬─────────────────┐
    │                 │                       │                 │
    ▼                 ▼                       ▼                 ▼
[Customer Mobile] [Reception Tablet]   [Stylist Station] [Lounge TV Display]
  - Home (/)        - Dashboard          - Chair Timer     - Fullscreen Grid
  - Join (/join)    - Walk-in Modal      - Next Dispatch   - Audio Chime
  - Status (/status) - Re-order/Eject    - Break Toggle    - Flashing Banner
```

---

## 2. Problem Statement & Operational Friction

High-end grooming and beauty studios experience intense weekend and evening rushes. Without intelligent digital queue orchestration, salons suffer from five major pain points:

1. **Lobby Congestion & Degraded Atmosphere**: Overcrowded waiting lounges destroy the tranquil, luxury ambience expected at an upscale salon.
2. **Wait Time Anxiety & Walkouts**: Guests waiting without visibility into chair times become frustrated and leave.
3. **Queue Disputes**: Manual clipboards or memory-based queue assignment lead to disputes and perceived favoritism.
4. **Chair Turnaround Gaps**: Uncoordinated transitions between front desk and styling chairs waste valuable stylist capacity.
5. **Multi-Demographic Inclusivity**: In Ahmedabad and Gujarat, lack of natural Gujarati language support creates friction for traditional patrons and families.

---

## 3. Target User Personas

| Persona | Role | Primary Device | Core Motivation & Goals |
| :--- | :--- | :--- | :--- |
| **Meera Trivedi** | Remote Guest | Smartphone | Joins queue online while shopping in Navrangpura; tracks live wait countdown and arrives when called. |
| **Ramesh Shah** | Walk-in Guest | In-Person / Desk | Visits salon in person; reception registers him in 15 seconds; relaxes in lounge guided by Wall TV. |
| **Pooja Mehta** | Front Desk Host | 10.5" iPad | Manages guest flow, registers walk-ins, assists delayed clients, and enforces the 10-minute grace period. |
| **Vikram Singh** | Master Stylist | 8" Station Tablet | Taps "Call Next" to trigger smart FIFO dispatch; tracks service stopwatch; toggles breaks. |
| **Ketan Parikh** | Studio Owner | Desktop / iPad | Monitors real-time guest throughput, INR revenue, average wait times, and 30-min closing cutoffs. |

---

## 4. Scope & Out-of-Scope Boundaries

### In-Scope (Core Deliverables)
* Full-width editorial luxury homepage with video-inspired visual language, image-based service category grid, and unisex team showcase.
* Custom animated scissors page transition (`ScissorsTransition`) between routes.
* Remote online check-in (`/join`) with 10-digit duplicate active phone guard and max-3 service selection.
* Live reactive ticket tracker (`/status/:id`) with full-screen "IT'S YOUR TURN!" modal takeover and Web Audio chime.
* Receptionist tablet dashboard (`/reception`) with walk-in registration strictly appended to the end of the FIFO queue.
* Stylist workstation view (`/barber/:slug`) with chair concurrency locks and elapsed service stopwatch.
* Waiting area wall TV display (`/display`) with active chair flashing rings and synchronized clock.
* Owner admin console (`/admin`) with queue pause switch, 30-min closing cutoff rule, service catalogue management, and stylist roster controls.
* Complete English and natural Gujarati (`ગુજરાતી`) bilingual localization.

### Out-of-Scope (Strict v1 Boundaries)
* No online payments or credit card processing (all payments happen in-person at salon desk).
* No future calendar scheduling (strict same-day real-time queue).
* No paid SMS/WhatsApp API gateway dependencies (pure Web/PWA notifications and audio chimes).
