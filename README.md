# On-Ground.ai — Call Centre Advisor App

> Built by **Saniya Zareen Ansari**  
> **Live Demo:** [https://onground-callcentre-app.vercel.app/](https://onground-callcentre-app.vercel.app/)  
> **GitHub Repository:** [https://github.com/saniyaz07/onground-callcentre-app](https://github.com/saniyaz07/onground-callcentre-app)

---

## 1. Project Overview

On-Ground.ai Call Centre is a front-end web application built for retail call-centre advisors. It provides an agent console to manage daily customer calls, follow up on warm retail leads, track personal shift targets, and handle voice calling with AI-assisted coaching nudges and SOP adherence tracking.

---

## 2. Live Demo

The project is deployed on Vercel:  
👉 **[https://onground-callcentre-app.vercel.app/](https://onground-callcentre-app.vercel.app/)**

---

## 3. Features & Code Map

Here is the breakdown of implemented screens and where the code lives:

* **Top Bar & Shell** (`src/components/layout/TopBar.tsx`, `src/App.tsx`)
  * Agent identity, online status, live shift timer, and simulation triggers.
  * Slide-over Notifications panel (`src/components/layout/NotificationsPanel.tsx`).
  * Your Rank & OG Score™ popover (`src/components/layout/YourRankOgScore.tsx`).
* **Sidebar Navigation** (`src/components/layout/Sidebar.tsx`)
  * Navigation links for Dashboard, Planner tabs, Practice Call, Calendar, and Pulse.
  * Mobile bottom navigation bar for small screens (`src/App.tsx`).
* **Dashboard View** (`src/components/dashboard/DashboardView.tsx`)
  * Time-aware greeting and 4 reference KPI cards (OG Score™, Avg Handle Time, CSAT Today, In Queue).
  * "Who's Waiting" queue cards with priority tags and one-click call triggers.
  * Earnings progress card with slab tracking.
  * "My Tasks" interactive checklist with action modals; task completion persists across browser reloads (`src/utils/taskStorage.ts`).
  * 7-day historical bar charts for calls handled and CSAT trends (`src/data/mockData.ts`).
* **Planner View** (`src/components/planner/PlannerView.tsx`)
  * **Calls to Make (Outgoing):** Ranked leads with expandable buying signals, ICP scores, pagination, and direct Call buttons.
  * **Incoming (Missed Calls):** Missed call list with value-at-stake counter and one-click call-back buttons.
  * **Recent Calls:** Call history logs with duration tags and click-to-review drawer with SOP adherence scoring (`src/utils/sopReviewUtils.ts`).
* **Phone Keypad / Dial Pad** (`src/components/calling/DialPadModal.tsx`)
  * Floating keypad button on Planner view.
  * Interactive 0–9, `*`, `#` buttons with Web Audio DTMF tone generator.
  * Live number display, backspace, clear, contact name matching, and direct calling.
* **Practice Call & Active Calling Screen** (`src/components/calling/PracticeCallScreen.tsx`, `src/components/calling/ActiveCallOverlay.tsx`)
  * Two-column call interface: left column shows active timer, sentiment gauge, and live conversation transcript; right column shows deal value, AI assist recommendations, and live SOP checklist.
  * Post-call wrap-up modal to log call outcomes and save notes to Recent Calls (`src/components/calling/SaveToCrmModal.tsx`).
* **Voice Recording Consent Modal** (`src/components/calling/ConsentModal.tsx`)
  * DPDP Act-compliant consent scripts in English, Hindi, and Kannada.
  * Supports verbal confirmation, simulated WhatsApp verification, and under-18 guardian flows (`src/utils/consentStorage.ts`).
* **Calendar View** (`src/components/calendar/CalendarView.tsx`)
  * Full month calendar matrix for October 2026 with correct weekday alignment (`src/utils/calendarUtils.ts`).
  * Daily scheduled callbacks and appointment sharing drawer.
* **Pulse View** (`src/components/pulse/PulseView.tsx`)
  * Team channel sidebar (`#callcentre-team`, `#avani-coaching`, `#manage-shipment`, etc.).
  * Pinned "Needs your input" card synced with active dashboard tasks.
  * Real-time chat bubbles and Store Kudos recognition modal.
* **Leads Modal** (`src/components/leads/LeadsModal.tsx`)
  * Full lead inspection popup with ICP score and intent gauges.
  * Collapsible buying signals (financing, quotes, warranty) and journey touchpoints.
  * Previous / Next lead pagination controls.

---

## 4. Tech Stack

* **Framework:** React 18
* **Build Tool:** Vite 5
* **Language:** TypeScript 5
* **Styling:** Tailwind CSS 3
* **Icons:** Lucide React (`lucide-react`)
* **State Management:** React Context (`AppContext`, `CallContext`) + browser `localStorage`
* **Audio & Speech APIs:** Web Speech API (`SpeechRecognition`, `speechSynthesis`) + Web Audio API (`AudioContext` for DTMF oscillators)
* **Deployment:** Vercel (configured via `vercel.json` for SPA rewrites)

---

## 5. Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm (v9 or higher)

### Installation & Local Run
```bash
# 1. Clone the repository
git clone https://github.com/saniyaz07/onground-callcentre-app.git

# 2. Navigate to project directory
cd onground-callcentre-app

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```
Open **http://localhost:3000** in your browser.

### Run Tests & Production Build
```bash
# Run automated verification test suite (16 suites)
npm test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Calling Implementation

The calling feature in this application is implemented using client-side web APIs and front-end simulations:

1. **In-Browser Simulated Voice Call (`src/hooks/useVoiceEngine.ts`):**
   * Uses the browser's native **Web Speech API** (`webkitSpeechRecognition`) to transcribe agent speech from the microphone into the live call transcript.
   * Uses **`window.speechSynthesis`** to voice simulated customer responses and retail objections.
   * Uses **Web Audio API** oscillators to generate authentic dual-tone DTMF sounds when tapping the keypad.
   * Provides **1-Click Quick Speak fallback buttons** so that evaluation works smoothly even if microphone access is denied or if running in browsers that do not support Web Speech recognition.
2. **Device Dialer Handoff:**
   * External lead rows provide standard `tel:` protocol links to hand off numbers to the device's native dialer.
3. **Honest Limitations:**
   * This project **does not** connect to a real telecom carrier, VoIP SIP trunk, or telephony backend (such as Twilio or Asterisk). All call states, timers, and transcripts are simulated in-browser for prototype evaluation.

---

## 7. What's Implemented / Limitations

### What's Implemented
* Complete visual matching of the On-Ground.ai reference mockup (Dashboard, Planner, Calendar, Pulse, Modals).
* In-app voice calling drawer with dual-column layout, live transcript, and AI coaching.
* Interactive dial pad with DTMF tone synthesis and contact matching.
* Real-time SOP checklist validation and post-call CRM save modal.
* LocalStorage persistence for completed tasks, consent records, and recent calls.
* Responsive layouts tested across desktop, tablet, and mobile screen widths.
* Client-side SPA routing via `vercel.json` to prevent 404s on page reloads.

### Limitations
* **No Server Database:** Data persistence is handled via React Context and browser `localStorage`. Resetting browser storage resets data back to initial mock datasets.
* **No Real Telecom Infrastructure:** Calling is a client-side simulation (Web Speech + Web Audio) rather than real cellular telephony.

---

## 8. AI Tools Used

* **Antigravity (Google DeepMind):** Used as an AI pair-programming assistant for scaffolding TypeScript interfaces, translating reference HTML structures into modular React components, and generating automated verification test scripts.

---

## 9. Author

* **Saniya Zareen Ansari**  
* GitHub: [@saniyaz07](https://github.com/saniyaz07)  
* Project: [https://github.com/saniyaz07/onground-callcentre-app](https://github.com/saniyaz07/onground-callcentre-app)  
* Live App: [https://onground-callcentre-app.vercel.app/](https://onground-callcentre-app.vercel.app/)
