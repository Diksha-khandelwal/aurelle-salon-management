# 03. Business Logic, Queue Rules & State Machine
**System**: AURELLE Unisex Salon & Studio Real-Time Queue Management System  
**Framework**: React 18/19 + Vite + TypeScript + Tailwind CSS  
**Target Environments**: Mobile PWA, Reception Tablet, Stylist Station, Lounge TV Display

---

## 1. Step-by-Step Scenario Walkthroughs

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CUSTOMER & CHAIR LIFECYCLE FLOW                       │
│                                                                             │
│  [ Join Queue ] ──> [ WAITING ] ──> [ CALLED ] ──> [ IN_SERVICE ] ──> [DONE]│
│                           │              │                                  │
│                           ├──> [CANCEL]  └──> [NO-SHOW]                     │
│                           │                    │                            │
│                           └────────────────────┴───> (Re-add to Bottom)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Scenario 1: Main Remote Customer Flow (Happy Path)
1. Guest navigates to `aurelle.in/` on smartphone.
2. Clicks `[Join Queue Now]` taking them to `/join`.
3. Enters Name ("Meera Trivedi") and 10-digit Phone ("9825011223").
4. Selects services (e.g., Signature Haircut + Hair Spa).
5. Selects Stylist Preference ("Any Stylist (Fastest)" or specific stylist).
6. System issues Token `A-106` and redirects to `/status/token-106`.
7. Guest relaxes at a nearby Navrangpura café while observing live position countdown.
8. Stylist calls turn: smartphone triggers full-screen gold alert modal and luxury chime.
9. Guest takes seat; stylist taps `[Start Service]`; upon completion, taps `[Done]`.

### Scenario 2: Walk-In Customer Flow at Reception
1. Guest walks into the Navrangpura studio without prior booking.
2. Receptionist taps `[+ Register Walk-In Guest]` on tablet.
3. Enters details, services, and stylist preference.
4. Token is generated and appended strictly to the end of the FIFO queue.
5. Guest relaxes in the lounge watching the Wall TV Display.

### Scenario 3: Stylist Workstation Lifecycle & Concurrency Lock
1. Stylist chair is `AVAILABLE`.
2. Stylist taps `[Call Next Available]`.
3. Smart FIFO algorithm selects earliest waiting guest requesting this stylist or `ANY`.
4. Chair locks into `CALLING` with 10-minute grace timer.
5. Stylist taps `[Start Service]`; stopwatch begins ticking; `[Call Next]` is locked.
6. Stylist finishes treatment and taps `[Done]`; chair resets to `AVAILABLE`.

### Scenario 4: No-Show & 10-Minute Grace Handling
1. If called guest fails to arrive within 10 minutes, receptionist can mark `No-Show` or trigger a `Grace Bump (+10m)`.
2. A grace bump archives the old token and re-queues the client at the very end of the waiting queue with a fresh token.

### Scenario 5: Voluntary Cancellation
1. Waiting guest taps `[Cancel My Spot]` on mobile status tracker.
2. Modal confirmation prevents accidental surrender.
3. Upon confirmation, token updates to `CANCELLED`, queue compacts, and downstream wait times update instantly.

---

## 2. Queue State Machine Matrix

| From State | Allowed Target State | Triggering Actor | Guard Conditions | Side Effects |
| :--- | :--- | :--- | :--- | :--- |
| *None* | `WAITING` | Customer / Reception | Phone not active; Queue `OPEN`; $\le 3$ services. | Token appended; wait time calculated. |
| `WAITING` | `CALLED` | Stylist / Reception | Assigned stylist `AVAILABLE`; matches preference. | Locks chair to `CALLING`; chime plays; TV flashes. |
| `WAITING` | `CANCELLED` | Customer / Reception | Token in `WAITING`. | Queue compacts; wait times adjust. |
| `CALLED` | `IN_SERVICE` | Stylist | Guest present; taps `[Start Service]`. | Stopwatch starts; concurrency lock engages. |
| `CALLED` | `NO_SHOW` | Reception / Stylist | $\ge 10$ minutes elapsed without seating. | Frees chair to `AVAILABLE`. |
| `IN_SERVICE`| `COMPLETED` | Stylist | Stylist taps `[Done]`. | Frees chair to `AVAILABLE`; logs duration. |

---

## 3. Mathematical Wait Time Formula & Zero-Barber Guard

$$\text{Estimated Wait Time (mins)} = \frac{\sum_{i \in \text{Ahead}} D_i + \sum_{b \in \text{Busy}} R_b}{\max(1, N_{\text{active}})}$$

* **Zero-Barber Guard**: When all stylists toggle to `ON_BREAK`, $N_{\text{active}} = 0$. The system gracefully freezes countdowns and displays `"Stylists temporarily on break. Queue paused."` (Gujarati: `"બધા જ સ્ટાઇલિસ્ટ હાલમાં બ્રેક પર છે. કતાર થોભાવેલ છે."`) without division-by-zero errors.
