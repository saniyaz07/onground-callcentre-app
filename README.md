# On-Ground.ai — Call Centre Advisor Application

> **Engineering Internship Working Product Submission**  
> **Candidate Submission for**: Mukunda Dwarkanath (`mukunda@on-ground.ai`) & Rashmi Sehgal (`rashmi@on-ground.ai`)  
> **Built by Candidate**: Saniya Zareen Ansari  
> **Live Deployed Web Application**: [https://onground-callcentre-app.vercel.app](https://onground-callcentre-app.vercel.app)  
> **GitHub Repository**: [https://github.com/saniyaz07/onground-callcentre-app](https://github.com/saniyaz07/onground-callcentre-app)  
> **Repository Directory**: `D:\onground-callcentre-app`  

---

## 1. Project Overview

This application is a production-grade rebuild of the **On-Ground.ai Call Centre Advisor App (v9 · Retail)** — the dedicated shift console that offline retail agents keep open to manage walk-in recovery, customer follow-ups, store goals, and live voice interactions for enterprise retail brands (*The Sleep Company*, *Furnishka*, *Duroflex*).

The implementation strictly honors the core assignment requirement:
> ⚠️ **"REQUIRED: BUILD A WORKING PRODUCT — Your product demo must include the CALLING FEATURE working. Mock screens alone are not enough."**

---

## 2. Technology Stack & Rationale

| Layer | Choice | Rationale |
| :--- | :--- | :--- |
| **Framework** | **React 18 + Vite 5** | Instant hot-module replacement (HMR), lightweight bundle size (< 260 kB gzipped), and high rendering performance on Chrome laptops. |
| **Language** | **TypeScript 5** | Strict type safety across domain entities (`Lead`, `CallLog`, `PulseThread`, `CalendarEvent`, `QueueItem`, `DashboardTask`). |
| **Styling** | **Tailwind CSS 3** | Pixel-faithful replication of the mock's typography, dark forest green headers (`#123c30`), and emerald accents (`#1d9e75`). |
| **Voice Engine** | **Web Speech API + Web Audio API** | Real-time speech synthesis (`window.speechSynthesis`), live microphone transcription (`webkitSpeechRecognition`), and dual-frequency DTMF keypad audio oscillators. |
| **Icons** | **Lucide Icons** | Clean, accessible SVG iconography. |
| **State** | **React Context (`AppContext` + `CallContext`)** | Centralized, synchronized state linking active calls, leads pagination, calendar events, and Recent Call logs without unnecessary backend overhead. |

---

## 3. Screen-by-Screen Implementation Checklist

All **eight required screens and interactions** from the assignment brief have been built and verified:

### 1. App Shell & Navigation
* **Top Bar**: Persistent brand logo (`OG`), online status indicator, live shift timer (`4m 22s` ticking up), conversion rate (`34%`), and active call notification pill.
* **Sidebar**: Charcoal dark theme with active tab indicators for **Dashboard**, **Planner** (Calls to make, Incoming, Recent, Practice call), **Calendar**, and **Pulse**.
* **Quick Action Controls**: Instant simulation triggers for both incoming lead callbacks and AI practice sessions.

### 2. Dashboard (`#asc-dash` Reference Rebuild)
* **Hero Banner (`.cc-hero`)**:
  * Time-aware greeting (`Good morning 👋`, `Good afternoon 👋`, `Good evening 👋`).
  * Agent identity: **Arvind Rajan**, **The Sleep Company · Call Centre**, and **Rank #3**.
  * Status indicator: **`On Queue`** pill with pulsing live dot.
  * Date filter control: Interactive **`This Week`** picker opening the reference date preset sheet (`Today`, `This Week`, `This Month`, `Custom`).
* **Four Reference KPI Cards**:
  * **Weekly OG Score™**: `76` (trend `▲ 13`).
  * **Average Handle Time**: `4m 12s` (trend `▲ 8%`).
  * **CSAT Today**: `94%` (trend `▲ 2pt`).
  * **In Queue**: `2` (live indicator, one-click jump directly to Planner's Incoming view).
* **My Progress Banner**:
  * `Leads Created`: 3 (`▲ +1`).
  * `Leads Called`: 2 (`▲ +2`).
* **Who's Waiting Queue (`#dashQueueDetail`)**:
  * **Priya Iyer**: `4m 20s` wait (high-priority red badge `#e24b4a`), *Likely billing dispute — flagged before*. One-click launches call.
  * **Suresh Nair**: `1m 50s` wait (mid-priority amber badge `#c8860a`), *Plan upgrade enquiry*. One-click launches call.
  * **`Open planner →`**: Navigates directly to Planner → Incoming.
* **Earnings Card (`#hcEarn`)**:
  * Monthly Earnings: **₹5,200**.
  * Slab: **₹800 to ₹6,000 slab**.
  * Coached Moves: **₹1,700 from coached moves**.
  * Progress Bar: **87%** width with `linear-gradient(90deg, #1d9e75, #5dcaa5)`.
* **My Tasks (`#hcMyTasks`)**:
  * Displays active reference tasks (`w1`: 2 callbacks next 4:30pm for Priya Iyer; `w2`: 2 hot leads untouched 24h; `w3`: 1 outcome to log for Suresh Nair).
  * Meaningful resolution: choosing an action resolves the task, removes it from the list, decrements the red badge count, and triggers the confirmation toast: *"Task done · removed from My Tasks"*.
* **Both Seven-Day Charts**:
  1. **Calls handled · last 7 days**: Mon: 18, Tue: 22, Wed: 15, Thu: 26, Fri: 20, Sat: 12, Today: 14.
  2. **CSAT trend · last 7 days**: Mon: 88%, Tue: 90%, Wed: 85%, Thu: 92%, Fri: 89%, Sat: 91%, Today: 94%.

### 3. Plan: Calls to Make (Outgoing)
* Leads ordered by priority and intent score (Mukunda: 91, Faizan: 89, Ritu: 85, Divya: 70, Kavitha: 63).
* Expandable row cards displaying cross-sell opportunities, EMI needs, and ICP match scores.
* Functional lead pagination (Page 1 of 2, Next/Previous controls).
* Direct **"Call"** button on each row triggering the in-app voice engine.

### 4. Plan: Incoming (Missed Calls)
* Summary header showing **Missed Today** count and **Expected Value at Stake** (₹74,980+).
* Urgency badges and customer context tags.
* Prominent **"Call back"** button on every row that immediately initializes an outgoing connection to that customer.

### 5. Plan: Recent Calls
* Comprehensive call log tracking direction (`Inbound`, `Outbound`, `Missed`), timestamp, and call duration.
* Interactive click opens the **Call Review Modal** displaying call summaries, duration, and notes.

### 6. Calendar View
* Full month grid view for **October 2026** with date event indicators.
* **"Today"** quick jump button and month navigation.
* Selected day agenda pane showing scheduled customer demos and callbacks.
* **"Share Appointment"** modal allowing invites to be shared with Sunita Rao, Indiranagar Floor Staff, or Field Teams.

### 7. Pulse Home & Channel Chat
* Unified sidebar featuring AvaniBot AI assistant status and active team channels (`#callcentre-team`, `#all-stores`, `#avani-coaching`, `#manage-shipment`, `#quotation-tickets`).
* **Pinned "Needs Your Input" Card**:
  * Pinned above the channel thread detailing QA score targets (71% vs 85%).
  * **"Acknowledge & Commit"** and **"Request Review"** buttons.
  * Inline response input that commits the acknowledgment directly to the team feed.
* Real-time chat bubbles (received on the left with avatar/timestamps, agent sent on the right in emerald).
* **Store Kudos Modal**: Team recognition feed with shoutouts and bonus point awards.

### 8. Leads Modal
* Comprehensive lead inspection card with **ICP Score** and **Lead Intent Score** gauges.
* **Collapsible Buying Signals Accordion**:
  * *Financing Related* (EMI concerns).
  * *Quotation Demanded* (Competitor comparisons).
  * *Warranty Related* (100-night trial objections).
* Customer touchpoint history journey (Meta ads, WhatsApp opt-in, Voice AI qualifying call).
* Previous / Next lead pagination controls.
* Dual calling options: Standard `tel:` link and **In-App Voice Call (Prototype)**.

---

## 4. The Working Calling Engine (Core Priority)

The voice calling module provides a realistic, two-way conversational experience:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        In-App Voice Call Drawer                        │
├───────────────────────────────────┬────────────────────────────────────┤
│           Left Column             │            Right Column            │
│       (Streaming Audio)           │         (AI Co-Pilot Panel)        │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Call Status: IN PROGRESS        │ • Main Objective (What to Offer)   │
│ • Real-time Timer (00:00)         │ • Live SOP Checklist (Auto-ticks)  │
│ • Live Sentiment Bar (Dynamic %)  │ • "Ask AI" Mid-call Assistant      │
│ • Mute & Hold Controls            │ • DTMF Audio Keypad (1-9, *, 0, #) │
│ • Web SpeechRecognition Voice Mic │ • Live Call Notes (Auto-saved)     │
│ • Web SpeechSynthesis Customer    │                                    │
│ • Graceful Fallback Quick Replies │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Modes Supported
1. **AI-to-Human Practice Call (`AvaniBot Pitch Coach`)**:
   - The customer bot raises realistic retail objections (foam vs SmartGRID price difference, return policy, EMI options).
   - Speaks through your computer speaker using `window.speechSynthesis`.
   - Listens to the agent's microphone via `webkitSpeechRecognition` and renders transcript speech in real time.
2. **Customer Lead Call-back (`Mukunda / Priya / Suresh / Ritu`)**:
   - Plays DTMF ringback audio tones.
   - Automatically tracks conversation duration.
   - When the agent clicks **"End Call"**, the call record, notes, and duration are **instantly committed to Recent Calls**, updating dashboard metrics.

### Simulated Calling vs. Real Carrier Telephony (Honest Disclosure)

| Feature Aspect | In-App Voice Call (Prototype) | Carrier Dial (`tel:`) |
| :--- | :--- | :--- |
| **Network Type** | **In-Browser Web APIs (Web Audio + Web Speech)** | **Real Cellular / PSTN Carrier Network** |
| **Credentials Required** | **None** (100% self-contained local evaluation) | **Device SIM Card or Cellular Carrier Plan** |
| **Microphone Input** | Browser `webkitSpeechRecognition` (Chrome/Edge) | Native phone mic / carrier hardware |
| **Audio Output** | Browser `window.speechSynthesis` + DTMF Web Audio | Native phone earphone / carrier audio |
| **Fallback Controls** | 1-Click Quick Speak buttons for instant conversational advance | Standard device redial / keypad |
| **Outcome Logging** | Auto-saves live notes, duration & outcome directly to Recent Calls | User manual note-taking |

### Graceful Fallback Mechanism
* If the user runs the app in a browser without microphone permissions or on a non-Chrome engine, the calling engine automatically activates **1-Click Quick Speak buttons** (*"0% EMI 12-Month Plan"*, *"100-Night Trial"*, *"Free Pillow Bundle"*).
* Clicking a quick reply speaks the line, updates the transcript, and advances the customer's conversational state.

---

## 5. How to Run Locally & Demo Guide

### Prerequisites
* **Node.js**: v18+ (tested on Node v24.20.0)
* **npm**: v9+ (tested on npm 11.19.0)

### Quick Start
```bash
# 1. Navigate to the project directory
cd D:\onground-callcentre-app

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in Google Chrome.

### Production Deployment & Live Website
* **Live Website URL**: [https://onground-callcentre-app.vercel.app](https://onground-callcentre-app.vercel.app)
* **Hosting Platform**: Vercel (Hobby / Free Plan)
* **Framework Preset**: Vite
* **Root Directory**: `./`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **SPA Routing**: Configured via `vercel.json` rewrites (`/(.*)` -> `/index.html`) to support seamless browser navigation and page reloads on all sub-routes.

### Production Build & Preview
```bash
# Build production bundle
npm run build

# Preview production bundle locally
npm run preview
```

### Guided Evaluator Walkthrough (5-Minute Tour)
1. **Dashboard & KPIs**:
   - Note the **Rank #3**, **Arvind Rajan**, and time-aware greeting.
   - Verify the 4 KPI cards (`76` OG Score™, `4m 12s` Avg Handle Time, `94%` CSAT, `2` In Queue).
   - Click the date range button (`This Week`) to open the date preset modal.
   - Review the two 7-day bar charts (Calls handled & CSAT trend).
2. **Synchronized Task Completion & Persistence**:
   - In **My Tasks**, observe 3 active tasks (`w1`, `w2`, `w3`).
   - Click task `w1` (*"Confirm the 4:30pm callback"*), choose **"Confirmed"**.
   - Notice: Task disappears from Dashboard, toast appears (*"Task done · removed from My Tasks"*), badge decrements to `2`.
   - Click **Pulse** in the sidebar: Notice `#callcentre-team` pending badge `📌 1` has cleared, and the confirmation note appears in the live chat.
   - **Refresh the browser page (`F5`)**: Notice `w1` **remains completed** (stored in `localStorage` under `onground_completed_task_ids`).
   - Click **Reset** in My Tasks to restore tasks to initial default.
3. **Working In-App Voice Call**:
   - In **Who's Waiting**, click **Priya Iyer** or click **"AI Practice Call"** in the top bar.
   - The dual-column calling drawer opens with live timer, sentiment gauge, DTMF audio keypad, and live notes.
   - Speak into your microphone (or click any **Quick Speak** button).
   - Type notes into **Live Call Notes** and click **"End Call"**.
   - Notice: You are instantly navigated to **Planner → Recent**, and your completed call is logged at the top!
4. **Leads Inspection & Pagination**:
   - Go to **Planner → Calls to make**.
   - Expand any lead (e.g. Mukunda) to view buying signals and ICP scores.
   - Click **"Open Full Lead Inspection Modal"**: browse subscores, journey milestones, and test the **Previous / Next** pagination buttons.
5. **Calendar Scheduling & Sharing**:
   - Click **Calendar** in the sidebar to view the **October 2026** grid.
   - Click any day with an event dot (e.g. Oct 18, 19, 20, 22, 25).
   - Click the **Share** icon on an event to open the team notification modal and toggle team recipients.
6. **Responsive Phone-Width Layout**:
   - Press `F12` and switch Chrome DevTools to **Mobile View** (e.g. iPhone 14 or 375px width).
   - The desktop sidebar cleanly hides, and a mobile bottom navigation bar appears.
   - In Pulse, tap the mobile **"Channels"** button to open the channel drawer.

---

## 6. Architecture & Directory Structure

```
D:\onground-callcentre-app\
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts                 # Domain models (Lead, CallLog, CalendarEvent, PulseThread, QueueItem, DashboardTask)
│   ├── data/
│   │   └── mockData.ts              # Authentic data extracted from reference mock
│   ├── utils/
│   │   └── taskStorage.ts           # Safe localStorage persistence, task validation, and derivation
│   ├── context/
│   │   ├── AppContext.tsx           # Global navigation, tasks, leads, queue and toast state
│   │   └── CallContext.tsx          # Active call engine, live transcript, and duration sync
│   ├── hooks/
│   │   └── useVoiceEngine.ts        # Web Speech API + Web Audio DTMF synthesis
│   └── components/
│       ├── layout/
│       │   ├── TopBar.tsx           # Brand header, timer, online status & simulator triggers
│       │   └── Sidebar.tsx          # Persistent multi-level navigation
│       ├── dashboard/
│       │   └── DashboardView.tsx    # Exact reference hero banner, 4 KPIs, queue cards, earnings & dual charts
│       ├── planner/
│       │   └── PlannerView.tsx      # Calls to make (paginated), Incoming callbacks & Recent review
│       ├── calendar/
│       │   └── CalendarView.tsx     # October 2026 month grid & team share drawer
│       ├── pulse/
│       │   └── PulseView.tsx        # Unified Slack-style channels, Needs Input card & Kudos
│       ├── leads/
│       │   └── LeadsModal.tsx       # ICP gauge, Intent score & collapsible buying signals
│       └── calling/
│           └── ActiveCallOverlay.tsx# Dual-column live call screen, DTMF keypad & transcript
```

---

## 7. AI Tools & Assistance Disclosure

In compliance with the assignment ground rules (*"AI tools: allowed. List them in your README and be ready to explain your code"*):
* **AI Tool Used**: **Antigravity (Google DeepMind)**.
* **Usage**: Used for rapid scaffolding of TypeScript interfaces, converting static HTML structures into clean modular React components, and generating Web Audio API DTMF oscillator logic for keypad tones.
* **Code Understanding**: All state management, Web Speech hooks, and React component hierarchies are fully understood and can be explained during the technical interview.

---

## 8. Known Limitations
1. **PSTN Carrier Calls**: As specified by the assignment instructions, telephone carrier dialing is simulated in the browser prototype. Real cellular calls trigger the device's native `tel:` protocol.
2. **Speech Recognition Support**: Web Speech API (`webkitSpeechRecognition`) is natively supported in Google Chrome and Microsoft Edge. On browsers without native support (Firefox / Safari), the built-in scripted fallback buttons seamlessly handle conversational turns.

---

## 9. Task-State Synchronization & Persistence Remediation (October 19, 2026)

### A. Root Cause Analysis
During audit testing of the Dashboard and Pulse task flows:
1. **Bifurcated State**: The Dashboard was rendering tasks from `dashboardTasks` while Pulse was maintaining a separate hardcoded state (`needsInputState`). Resolving a task on one view failed to update the other.
2. **Missing Persistence**: Tasks were stored strictly in memory React state. On page reload, all tasks reset back to initial state.
3. **Missing Channel Badges**: Pulse channels in the sidebar did not display the reference `📌 n` badges indicating active pending tasks for each channel.

### B. Architectural Remediation
1. **Canonical Task Repository**: `INITIAL_DASHBOARD_TASKS` in `src/data/mockData.ts` serves as the authoritative definition (`w1`, `w2`, `w3`).
2. **Persistent Storage Module (`src/utils/taskStorage.ts`)**:
   - Manages `localStorage` key `onground_completed_task_ids`.
   - Validates data against `KNOWN_TASK_IDS = ['w1', 'w2', 'w3']`.
   - Handles corrupted JSON, malformed arrays, and storage unavailability gracefully without application crash.
3. **Unified AppContext State**:
   - Derived active tasks: `INITIAL_DASHBOARD_TASKS.filter(t => !completedTaskIds.includes(t.id))`.
   - Single resolution handler `resolveDashboardTask(taskId, option)` updates `completedTaskIds`, persists to storage, sends a formatted note to the target Pulse channel, and fires the confirmation toast: *"Task done · removed from My Tasks"*.
   - Added `resetTasks()` to allow one-click testing reset from both UI and automated tests.
4. **Dynamic Channel Badges & Pinned Task Cards (`src/components/pulse/PulseView.tsx`)**:
   - Sidebar channel buttons dynamically render pending counts: `Call Centre Team` starts with `📌 1` (`w1`), and `AvaniBot` starts with `📌 2` (`w2`, `w3`).
   - Pinned collapsible `"Needs your input"` drawer displays active tasks for the currently open channel with interactive option buttons and custom text replies.
   - When all tasks are completed, the Dashboard displays *"All caught up"* with a green checkmark, badges clear, and state persists across browser refreshes.

### C. Automated Verification Results
Run the verification test suite at any time:
```bash
npm test
```
**Test Results (All 14 Test Suites Passed)**:
- `✓ Queue Customer 1: Priya Iyer (4m 20s, hi, billing dispute) verified`
- `✓ Queue Customer 2: Suresh Nair (1m 50s, mid, plan upgrade) verified`
- `✓ Initial tasks verified: w1 (Call Centre Team: 1), w2 & w3 (AvaniBot: 2), Total: 3`
- `✓ Storage key and malformed/corrupted data validation verified`
- `✓ Resolution path 1 (w1 resolved): Total 2, Call Centre Team: 0 (badge cleared), AvaniBot: 2`
- `✓ Resolution path 2 (w2 resolved): Total 1, AvaniBot: 1`
- `✓ Resolution path 3 (all resolved): Total 0, Empty state ("All caught up")`
- `✓ Reload persistence simulation verified: w1 & w3 remain completed, w2 active`
- `✓ Reset tasks mechanism verified: all tasks and badges restored`
- `✓ Calls handled 7-day data (18, 22, 15, 26, 20, 12, 14) verified`
- `✓ CSAT trend 7-day data (88%, 90%, 85%, 92%, 89%, 91%, 94%) verified`
- `✓ Leads dataset (5 leads, pagination 3/2, buying signals, subscores) verified`
- `✓ Call logs model (incoming 5 missed calls, Lakshmi R. demo banner spec, call commit to Recent) verified`
- `✓ Pulse channels (5 required channels, chat threads, cards) verified`
- `✓ Calendar events (8 events, valid dates, attendees, sharing) verified`
- `✓ Calendar: Leap year calculations verified`
- `✓ Calendar: Days in month (28, 29, 30, 31) verified`
- `✓ Calendar: Sunday-to-Saturday weekday order verified`
- `✓ Calendar: Month grid generation & cell alignment verified`
- `✓ Calendar: December-to-January navigation boundary wrapping verified`
- `✓ Recent Calls: All required reference contacts (Faizan A., Mukunda R., Kavitha R., Unknown, Ritu S., Divya P.) present`
- `✓ Recent Calls: Time, duration formatting (dash for missed, "Xm Ys" for connected) verified`
- `✓ SOP Review: 6 canonical stages verified`
- `✓ SOP Review: Dynamic adherence scoring (83%, 67%, 50%, 17%, Not assessed) verified`
- `✓ SOP Review: Live call transcript-to-SOP evaluation (100% adherence) verified`
- `✓ Recent Calls: Storage key (onground_call_logs) verified`
- `✓ Consent State: Pending (Lakshmi R., initial null ID, history log) verified`
- `✓ Consent State: Granted via Verbal (Consent ID generated, offers opted in) verified`
- `✓ Consent State: Granted via WhatsApp (Simulated tap, Consent ID generated) verified`
- `✓ Consent State: Declined (Verbal & WhatsApp refusal logged, recording remains OFF) verified`
- `✓ Consent State: Parent/Guardian Verified (Under-18 flow, parent phone recorded) verified`
- `✓ Consent State: Withdrawal (Sec 6 withdrawal, recording halted immediately) verified`
- `✓ DPDP Rights: Sec 11 Data Request (DPO ticket RR-2026- generated) verified`
- `✓ Consent Scripts & Storage Key (kn, hi, en scripts & onground_recording_consent) verified`

---

## 10. Voice Calling & Microphone Engine Architecture

### A. Root Causes of Microphone Silence in Incoming Calls
1. **Device Lock by `getUserMedia` Probe**: In early prototypes, `requestMicPermission` opened a persistent MediaStream track. On Windows, this acquired an exclusive WASAPI lock on the microphone, causing `SpeechRecognition` to silently drop speech or throw an `audio-capture` error.
2. **Ghost Listeners & Race Conditions on Abort**: When restarting speech recognition, calling `.abort()` on the previous instance without detaching its listeners caused stale `onend` callbacks to fire asynchronously, creating overlapping restart attempts.
3. **Synthesis / Recognition Collisions in Web Speech**: In Chromium, starting `window.speechSynthesis` can cause background speech recognition to pause or end prematurely.

### B. Implemented Fixes
1. **Immediate Audio Track Release**: `requestMicPermission()` inspects permission and immediately releases all hardware tracks (`stream.getTracks().forEach(t => t.stop())`), leaving the microphone completely free for `webkitSpeechRecognition`.
2. **Clean Listener Detachment**: All event handlers (`onstart`, `onaudiostart`, `onresult`, `onend`, `onerror`) are stripped from old recognition instances before calling `abort()`.
3. **Turn-End Auto-Restart**: When customer speech finishes (`utterance.onend` and `utterance.onerror`), the engine explicitly verifies that speech recognition is running and starts it if dormant.
4. **Graduated Continuous Backoff**: In `recognition.onend`, auto-restarts use a graduated backoff (`250ms -> 600ms -> 1200ms`) without ever permanently abandoning listening.
5. **Interactive Diagnostics Panel**: The in-call drawer features a real-time diagnostics header displaying:
   - Status badge: `Listening` (pulsing green), `Processing` (speech detected), `Stopped` (idle/held/muted), or `Error` (with descriptive remediation advice).
   - Live stream status, language (`en-IN`), permission state, and latest recognized words preview.
   - 1-Click Quick Speak options available as an instant fallback on any device or browser environment.

---

## 11. “Ask Before You Record” Voice Consent Architecture (DPDP Prototype)

### A. Compliance Workflow & Design
In accordance with India's Digital Personal Data Protection (DPDP) Act rules and the reference mock specification:
1. **Step 1: "Say this · right after hello"**:
   - Offers localized consent scripts in **Kannada (`kn`)**, **Hindi (`hi`)**, and **English (`en`)**, with an expandable **+20 languages** selector.
   - Provides native verbatim scripts and reassuring explanations:
     - *"Can we record this? Only for your service and follow-up. You can say no, or ask us to delete it any time."*
     - *"Recording is your choice. Saying no won't change anything for you."*
2. **Step 2: "Get their yes"**:
   - **Mode A: On WhatsApp**:
     - Pre-fills phone number with `+91` format.
     - Supports **"Under 18?"** parent/guardian toggle, requiring parent phone dispatch.
     - Simulated Dispatch button clearly marked as prototype (no external cellular or WhatsApp messages are dispatched).
     - Interactive simulation of customer response: **Customer Taps Yes** or **Customer Taps No**.
   - **Mode B: Said Out Loud (Verbal)**:
     - Action buttons: **"They said yes"** (or **"Parent said yes"**) vs. **"They said no"**.
     - Toggles for WhatsApp offers opt-in and under-18 parental verification.
3. **Consent Outcome States**:
   - **Yes (Granted)**: Issues a verifiable Consent ID (`CNS-2026-XXXXXX`), sets live badge to `● Recording ON · CNS-XXXXXX`, and posts a system milestone to the live transcript.
   - **No (Declined)**: Records refusal, sets live badge to `○ Recording OFF · Declined`, guarantees recording remains off, and allows the call to proceed unrecorded.
   - **Pending**: Displayed during initial call greeting until explicit customer consent is received.
   - **Withdrawal (Sec 6)**: Allows the customer or agent to withdraw recording consent at any point during the call, immediately stopping recording and queuing data erasure.
4. **DPDP Rights Module**:
   - Provides one-tap escalation to the Data Protection Officer (DPO) for **Sec 11** (See my data), **Sec 12** (Correct or delete), **Sec 13** (Complaints), **Sec 14** (Nomination), and **Sec 6** (Consent withdrawal), generating reference numbers (`RR-2026-0X`).
   - Includes interactive **"How this app keeps you DPDP-safe"** drawer outlining the 5 core operational rules.

