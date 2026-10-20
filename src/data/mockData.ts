import type { Lead, CallLog, PulseThread, CalendarEvent, QueueItem, DashboardTask, SevenDayMetric } from '../types/index.ts';
import { getDemoSampleSopStages } from '../utils/sopReviewUtils.ts';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Mukunda',
    initials: 'MK',
    avatarBg: '#e1f5ee',
    avatarColor: '#0f6e56',
    interest: 'Interested: Ortho GRID · ₹8,490',
    product: 'Ortho GRID Mattress',
    crossSell: 'Mattress Protector · ₹1,999',
    emi: 'Asked about EMI — quote the 12-month zero-interest plan',
    attractivenessScore: 90,
    expectedValue: 8490,
    badge: '2h left',
    badgeBg: '#e1f5ee',
    badgeColor: '#0f6e56',
    statusLabel: 'Open',
    statusColor: '#1d9e75',
    quoteOn: true,
    icp: 87,
    icpColor: '#1d9e75',
    intentScore: 91,
    subscores: [
      { label: 'Budget Fit', pct: 87, color: '#1d9e75' },
      { label: 'Need Match', pct: 72, color: '#c8860a' },
      { label: 'Decision Stage', pct: 60, color: '#7c3aed' }
    ],
    slaNote: null,
    notes: [
      'Asked about EMI on the Ortho GRID — lead with the 12-month zero-interest plan.',
      'Price-sensitive — compared us with a competitor, so mention the 100-night trial to reduce risk.',
      'Prefers evening calls, after 6pm.'
    ],
    problemBuckets: [
      { cat: 'Financing Related', text: 'Asked specifically about EMI options on the Ortho GRID — budget is a live concern, not a blocker.' },
      { cat: 'Quotation Demanded', text: 'Compared pricing with a competitor before reaching out — price-anchored, expects a competitive number.' },
      { cat: 'Warranty Related', text: 'Has not raised this yet — worth proactively mentioning the 100-night trial to reduce perceived risk.' }
    ],
    journey: [
      { date: '18 May', channel: 'Meta Ad', icon: 'Megaphone', color: '#1877f2', text: 'Clicked our "0% EMI on Ortho GRID" retargeting ad — first touch' },
      { date: '20 May', channel: 'AI Agent', icon: 'Bot', color: '#7c3aed', text: 'WhatsApp opt-in — shared preferred size' },
      { date: '22 May', channel: 'Voice AI', icon: 'PhoneCall', color: '#7c3aed', text: '4m 12s qualifying call — asked if pillows come bundled' },
      { date: '24 May', channel: 'WhatsApp', icon: 'MessageSquare', color: '#25D366', text: 'Asked for a quote with pillows bundled in' }
    ],
    phone: '+91 98765 43210',
    actions: 'open'
  },
  {
    id: 'lead-2',
    name: 'Kavitha R.',
    initials: 'KR',
    avatarBg: '#fff8e1',
    avatarColor: '#c8860a',
    interest: 'Interested: SmartGRID Hybrid · ₹24,990',
    product: 'SmartGRID Hybrid Mattress',
    crossSell: 'Cooling Pillow Set · ₹2,499',
    emi: 'Budget borderline — a payment plan could tip this',
    attractivenessScore: 55,
    expectedValue: 24990,
    badge: '+3d ageing',
    badgeBg: '#fff8e1',
    badgeColor: '#c8860a',
    statusLabel: 'Ageing',
    statusColor: '#c8860a',
    quoteOn: false,
    icp: 61,
    icpColor: '#c8860a',
    intentScore: 63,
    subscores: [
      { label: 'Budget Fit', pct: 61, color: '#c8860a' },
      { label: 'Need Match', pct: 42, color: '#e24b4a' },
      { label: 'Decision Stage', pct: 35, color: '#7c3aed' }
    ],
    slaNote: 'SLA missed — 5 days grace left to close',
    notes: [
      'SLA already missed — open with an apology for the delay, not a sales pitch.',
      'Low Need Match (42%) — re-confirm the SmartGRID Hybrid is still the right fit before pushing further.',
      'Has not responded to the last 2 WhatsApp messages — try a call instead.'
    ],
    problemBuckets: [
      { cat: 'Product Related', text: 'Uncertain whether SmartGRID Hybrid actually fits her need — Need Match score is low (42%), worth re-confirming fit before pushing further.' },
      { cat: 'In-Store Experience Needed', text: 'Has not responded to WhatsApp — may prefer to see/feel the product before deciding, worth inviting her back in.' },
      { cat: 'Financing Related', text: 'Budget fit is borderline (61%) — a payment plan or bundle discount could tip this.' }
    ],
    journey: [
      { date: '12 May', channel: 'Google Ad', icon: 'Search', color: '#ea4335', text: 'Searched "cooling gel mattress bangalore", clicked our top search ad' },
      { date: '15 May', channel: 'AI Agent', icon: 'Bot', color: '#7c3aed', text: 'WhatsApp auto-reply engaged — confirmed interest in the cooling gel layer' },
      { date: '19 May', channel: 'WhatsApp', icon: 'MessageSquare', color: '#25D366', text: 'Asked to hold the price for 2 days, went quiet since' }
    ],
    phone: '+91 97654 32109',
    actions: 'open'
  },
  {
    id: 'lead-3',
    name: 'Faizan A.',
    initials: 'FA',
    avatarBg: '#e8f0fe',
    avatarColor: '#185fa5',
    interest: 'Interested: Tranquo Massager Chair · ₹24,990',
    product: 'Tranquo Massager Chair',
    crossSell: 'Ergo Seat Cushion · ₹1,299',
    emi: 'Confirmed he wants the 6-month no-cost EMI plan',
    attractivenessScore: 88,
    expectedValue: 24990,
    badge: 'Confirmed date',
    badgeBg: '#e1f5ee',
    badgeColor: '#0f6e56',
    statusLabel: 'Open',
    statusColor: '#1d9e75',
    quoteOn: true,
    icp: 82,
    icpColor: '#1d9e75',
    intentScore: 85,
    subscores: [
      { label: 'Budget Fit', pct: 82, color: '#1d9e75' },
      { label: 'Need Match', pct: 78, color: '#1d9e75' },
      { label: 'Decision Stage', pct: 70, color: '#c8860a' }
    ],
    slaNote: null,
    notes: [
      'Confirmed Monday as the day he\'ll decide — call back then, don\'t let this go quiet.',
      'Wants the 6-month no-cost EMI plan — have the paperwork ready.',
      'Already compared with a competitor and preferred our warranty terms.'
    ],
    problemBuckets: [
      { cat: 'Financing Related', text: 'Explicitly asked for the no-cost EMI plan — ready to commit if financing is confirmed' },
      { cat: 'Warranty Related', text: 'Compared warranty terms with a competitor and preferred ours — reinforce this on the call' }
    ],
    journey: [
      { date: '2 Jun', channel: 'Store Visit', icon: 'Store', color: '#0f6e56', text: 'Tried the chair in-store, asked detailed questions on massage programs' },
      { date: '4 Jun', channel: 'Call', icon: 'Phone', color: '#185fa5', text: '6m 40s call — confirmed budget and asked about EMI' }
    ],
    phone: '+91 96543 21098',
    actions: 'open'
  },
  {
    id: 'lead-4',
    name: 'Ritu S.',
    initials: 'RS',
    avatarBg: '#fdf1e0',
    avatarColor: '#c2410c',
    interest: 'Interested: Smart Luxe Mattress · ₹13,390',
    product: 'Smart Luxe Mattress',
    crossSell: 'Mattress Protector · ₹1,999',
    emi: 'Not yet discussed — surface it early, she asked about total cost',
    attractivenessScore: 96,
    expectedValue: 13390,
    badge: 'Hot lead',
    badgeBg: '#e1f5ee',
    badgeColor: '#0f6e56',
    statusLabel: 'Open',
    statusColor: '#1d9e75',
    quoteOn: true,
    icp: 94,
    icpColor: '#1d9e75',
    intentScore: 96,
    subscores: [
      { label: 'Budget Fit', pct: 90, color: '#1d9e75' },
      { label: 'Need Match', pct: 88, color: '#1d9e75' },
      { label: 'Decision Stage', pct: 85, color: '#1d9e75' }
    ],
    slaNote: null,
    notes: [
      'Asked "how soon can this be delivered" — very high buying signal, close fast.',
      'Already visited the RT Nagar store last week.',
      'Has this lead in CRM from a prior visit — high expected value.'
    ],
    problemBuckets: [
      { cat: 'Quotation Demanded', text: 'Asked for delivery timeline immediately — ready to commit once price is confirmed' }
    ],
    journey: [
      { date: '28 May', channel: 'Store Visit', icon: 'Store', color: '#0f6e56', text: 'Visited RT Nagar store, tried the Smart Luxe in person' },
      { date: '30 May', channel: 'Missed Call', icon: 'PhoneMissed', color: '#e24b4a', text: 'Called back after store visit, missed — needs a callback' }
    ],
    phone: '+91 98450 00001',
    actions: 'open'
  },
  {
    id: 'lead-5',
    name: 'Divya P.',
    initials: 'DP',
    avatarBg: '#f2f2f7',
    avatarColor: '#6b6b74',
    interest: 'Browsing: Aura Executive Chair · ₹18,490',
    product: 'Aura Executive Chair',
    crossSell: 'Ergo Seat Cushion · ₹1,299',
    emi: 'Not discussed — low priority to raise financing yet',
    attractivenessScore: 38,
    expectedValue: 18490,
    badge: 'Low signal',
    badgeBg: '#f2f2f7',
    badgeColor: '#6b6b74',
    statusLabel: 'Cold',
    statusColor: '#8e8e93',
    quoteOn: false,
    icp: 34,
    icpColor: '#e24b4a',
    intentScore: 38,
    subscores: [
      { label: 'Budget Fit', pct: 40, color: '#e24b4a' },
      { label: 'Need Match', pct: 35, color: '#e24b4a' },
      { label: 'Decision Stage', pct: 20, color: '#e24b4a' }
    ],
    slaNote: null,
    notes: [
      'Gave one-word replies on the last call — low engagement.',
      'Said she\'s "just looking around" — treat as low priority this week.'
    ],
    problemBuckets: [
      { cat: 'In-Store Experience Needed', text: 'Vague, non-committal answers — may need to see the product before engaging further' }
    ],
    journey: [
      { date: '1 Jun', channel: 'Website', icon: 'Globe', color: '#8e8e93', text: 'Browsed chair category, no form filled' }
    ],
    phone: '+91 90000 44556',
    actions: 'ageing'
  }
];

// Reference Queue Customers from OnGround_CallCentre_App_Mock.html line 3878
export const INITIAL_QUEUE_CUSTOMERS: QueueItem[] = [
  {
    id: 'q-1',
    name: 'Priya Iyer',
    wait: '4m 20s',
    startMinutesAgo: 4.33,
    waitLevel: 'hi',
    intent: 'Likely billing dispute — flagged before',
    phone: '+91 98450 43210',
    product: 'Ortho GRID King (Order #49281)',
    dealValue: 18490
  },
  {
    id: 'q-2',
    name: 'Suresh Nair',
    wait: '1m 50s',
    startMinutesAgo: 1.83,
    waitLevel: 'mid',
    intent: 'Plan upgrade enquiry',
    phone: '+91 97411 98765',
    product: 'SmartGRID Hybrid Upgrade',
    dealValue: 24990
  }
];

// Reference Tasks from OnGround_CallCentre_App_Mock.html line 5909
export const INITIAL_DASHBOARD_TASKS: DashboardTask[] = [
  {
    id: 'w1',
    thread: 'Call Centre Team',
    title: '2 callbacks',
    subtitle: 'next 4:30pm',
    iconType: 'phone',
    iconBg: '#e0f2fe',
    iconColor: '#0369a1',
    q: 'Confirm the 4:30pm callback',
    ctx: 'Priya Iyer · likely billing dispute',
    opts: ['Confirmed', 'Reschedule']
  },
  {
    id: 'w2',
    thread: 'AvaniBot',
    title: '2 hot leads',
    subtitle: 'untouched 24h',
    iconType: 'users',
    iconBg: '#f1ecff',
    iconColor: '#7c3aed',
    q: 'Call now or reassign the 2 hot leads',
    ctx: 'Untouched for 24h',
    opts: ['Calling now', 'Reassign']
  },
  {
    id: 'w3',
    thread: 'AvaniBot',
    title: '1 outcome',
    subtitle: 'to log',
    iconType: 'notes',
    iconBg: '#fef3c7',
    iconColor: '#b45309',
    q: "Log this morning's call outcome",
    ctx: 'Suresh Nair · plan upgrade enquiry',
    opts: ['Converted', 'Callback', 'Not interested']
  }
];

// Exact Calls handled 7-day data from OnGround_CallCentre_App_Mock.html line 3855
export const CALLS_HANDLED_7DAYS: SevenDayMetric[] = [
  { day: 'Mon', val: 18, height: '58%' },
  { day: 'Tue', val: 22, height: '70%' },
  { day: 'Wed', val: 15, height: '48%' },
  { day: 'Thu', val: 26, height: '82%' },
  { day: 'Fri', val: 20, height: '64%' },
  { day: 'Sat', val: 12, height: '38%' },
  { day: 'Today', val: 14, height: '45%', isToday: true }
];

// Exact CSAT trend 7-day data from OnGround_CallCentre_App_Mock.html line 3865
export const CSAT_TREND_7DAYS: SevenDayMetric[] = [
  { day: 'Mon', val: '88%', height: '70%' },
  { day: 'Tue', val: '90%', height: '74%' },
  { day: 'Wed', val: '85%', height: '64%' },
  { day: 'Thu', val: '92%', height: '78%' },
  { day: 'Fri', val: '89%', height: '72%' },
  { day: 'Sat', val: '91%', height: '76%' },
  { day: 'Today', val: '94%', height: '84%', isToday: true }
];

export const INITIAL_CALL_LOGS: CallLog[] = [
  { 
    id: 'c-1', 
    dir: 'in', 
    name: 'Mukunda R.', 
    time: '10:42 AM', 
    duration: '4m 12s', 
    phone: '+91 98765 43210', 
    dealValue: 18490, 
    notes: 'Discussed 12mo EMI and 100-night trial. Ready for follow-up quote.',
    isDemoSample: true,
    sopStages: getDemoSampleSopStages({ dir: 'in', duration: '4m 12s', name: 'Mukunda R.' }, 0)
  },
  { 
    id: 'c-2', 
    dir: 'out', 
    name: 'Kavitha R.', 
    time: 'Yesterday', 
    duration: '2m 05s', 
    phone: '+91 97654 32109', 
    dealValue: 24990, 
    notes: 'Left voicemail reminding about held pricing.',
    isDemoSample: true,
    sopStages: getDemoSampleSopStages({ dir: 'out', duration: '2m 05s', name: 'Kavitha R.' }, 1)
  },
  { 
    id: 'c-unknown', 
    dir: 'missed', 
    name: 'Unknown', 
    time: 'Yesterday', 
    duration: '—', 
    phone: '+91 91234 56789', 
    dealValue: 12000,
    notes: 'Unsaved incoming caller — missed during floor transition.',
    isDemoSample: true,
    sopStages: getDemoSampleSopStages({ dir: 'missed', duration: '—', name: 'Unknown' }, 2)
  },
  { 
    id: 'c-3', 
    dir: 'missed', 
    name: 'Ritu S.', 
    time: 'Today 11:20 AM', 
    duration: '—', 
    phone: '+91 98450 12345', 
    dealValue: 14990, 
    notes: 'Missed call during shift break.',
    isDemoSample: true,
    sopStages: getDemoSampleSopStages({ dir: 'missed', duration: '—', name: 'Ritu S.' }, 2)
  },
  { 
    id: 'c-4', 
    dir: 'missed', 
    name: 'Faizan A.', 
    time: 'Today 10:05 AM', 
    duration: '—', 
    phone: '+91 99887 76655', 
    dealValue: 48000, 
    notes: 'Missed high value call.',
    isDemoSample: true,
    sopStages: getDemoSampleSopStages({ dir: 'missed', duration: '—', name: 'Faizan A.' }, 2)
  },
  { 
    id: 'c-5', 
    dir: 'missed', 
    name: 'Kavitha R.', 
    time: 'Yesterday 4:40 PM', 
    duration: '—', 
    phone: '+91 97654 32109', 
    dealValue: 24990, 
    notes: 'Missed inquiry on payment plan.',
    isDemoSample: true,
    sopStages: getDemoSampleSopStages({ dir: 'missed', duration: '—', name: 'Kavitha R.' }, 2)
  },
  { 
    id: 'c-6', 
    dir: 'missed', 
    name: 'Divya P.', 
    time: 'Yesterday 2:15 PM', 
    duration: '—', 
    phone: '+91 97411 22334', 
    dealValue: 32000, 
    notes: 'Missed competitor price inquiry.',
    isDemoSample: true,
    sopStages: getDemoSampleSopStages({ dir: 'missed', duration: '—', name: 'Divya P.' }, 2)
  },
  { 
    id: 'c-7', 
    dir: 'out', 
    name: 'Faizan A.', 
    time: 'Mon', 
    duration: '6m 40s', 
    phone: '+91 99887 76655', 
    dealValue: 48000, 
    notes: 'Explained motor incline angles.',
    isDemoSample: true,
    sopStages: getDemoSampleSopStages({ dir: 'out', duration: '6m 40s', name: 'Faizan A.' }, 3)
  }
];

export const INITIAL_PULSE_THREADS: Record<string, PulseThread> = {
  'Call Centre Team': {
    title: '#callcentre-team',
    dateLabel: 'Today · Call Centre Team',
    messages: [
      {
        id: 'm1',
        who: 'Sunita Rao',
        init: 'SR',
        bg: '#faeeda',
        color: '#854f0b',
        text: '📋 <b>STAKEHOLDERS:</b> <b style="color:#854f0b">@You (Arvind R.)</b>, whole call centre shift',
        time: '2:05pm'
      },
      {
        id: 'm2',
        who: 'Sunita Rao',
        init: 'SR',
        bg: '#faeeda',
        color: '#854f0b',
        text: '🎯 <b>ISSUE DEFINITION:</b> Greeting-in-first-10s QA score is at 71% this week, below our 85% target.',
        time: '2:05pm'
      },
      {
        id: 'm3',
        who: 'Sunita Rao',
        init: 'SR',
        bg: '#faeeda',
        color: '#854f0b',
        text: '💡 <b>SUGGESTED RESOLUTION:</b> Let\'s push that up 🚀 — open every call with the greeting script. I\'ll check back Friday.',
        time: '2:05pm'
      },
      {
        id: 'm4',
        who: 'You',
        init: 'AR',
        text: 'On it! Will make sure I open every call with the greeting script 🙌',
        time: '2:10pm'
      },
      {
        id: 'm5',
        who: 'Sunita Rao',
        init: 'SR',
        bg: '#faeeda',
        color: '#854f0b',
        text: 'Great attitude Arvind! Keep up the momentum 💪',
        time: '2:14pm'
      }
    ]
  },
  'AvaniBot': {
    title: '#avani-coaching',
    dateLabel: 'Today · AvaniBot Coaching',
    messages: [
      {
        id: 'm-av1',
        who: 'AvaniBot',
        init: '🤖',
        bg: '#e1f5ee',
        color: '#0f6e56',
        isBot: true,
        text: '👋 Hi Arvind! You have 2 hot leads untouched for 24h. Recommend placing a quick 2-minute callback before 5:00 PM.',
        time: '9:00am'
      },
      {
        id: 'm-av2',
        who: 'AvaniBot',
        init: '🤖',
        bg: '#e1f5ee',
        color: '#0f6e56',
        isBot: true,
        text: 'Your average handle time improved by 8% this week. Great work keeping product explanations concise!',
        time: '11:15am'
      }
    ]
  },
  'All Stores': {
    title: '#all-stores',
    dateLabel: 'Today · All Stores',
    messages: [
      {
        id: 'm6',
        who: 'Manager Helper',
        init: '📢',
        bg: '#e8f0fe',
        color: '#1d4ed8',
        isBot: true,
        text: 'New Ortho Grid campaign live from 1 June — ask customers about the bundled EMI offer!',
        time: '10:22am'
      }
    ]
  },
  'Manage Shipment': {
    title: '#manage-shipment',
    dateLabel: 'Today · Manage Shipment',
    messages: [
      {
        id: 'm8',
        who: 'Shipping Agent',
        init: '📦',
        bg: '#e8f0fe',
        color: '#185fa5',
        isBot: true,
        time: '10:05am',
        card: {
          icon: 'Truck',
          title: 'Shipping Notifications',
          badge: 'Ready for delivery',
          fields: [
            ['Model', 'Ortho Grid Pro, King'],
            ['Tracking', '4RS4DDF6549B4'],
            ['Destination', 'RT Nagar, Bengaluru']
          ],
          actions: [{ label: 'View details' }, { label: 'Notify customer', style: 'primary' }]
        }
      }
    ]
  },
  'Quotation Tickets': {
    title: '#quotation-tickets',
    dateLabel: 'Today · Quotation Tickets',
    messages: [
      {
        id: 'm9',
        who: 'Ticket Desk Agent',
        init: '🎫',
        bg: '#fdecec',
        color: '#e24b4a',
        isBot: true,
        time: '9:12am',
        card: {
          icon: 'Ticket',
          title: 'Quotation approval — Mukunda R.',
          badge: 'Awaiting approval',
          fields: [
            ['Product', 'Ortho Grid Pro, bundled'],
            ['Value', '₹18,490'],
            ['Raised by', 'You (Arvind)']
          ],
          actions: [{ label: 'View lead', actionType: 'open-lead' }]
        }
      }
    ]
  }
};

const _calNow = new Date();
const _curYear = _calNow.getFullYear();
const _curMonthStr = String(_calNow.getMonth() + 1).padStart(2, '0');

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ev-1', date: `${_curYear}-${_curMonthStr}-18`, dayNum: 18, time: '2:30 PM', title: 'Follow-up Call with Mukunda R.', leadName: 'Mukunda', type: 'call', sharedWith: ['Sunita Rao'] },
  { id: 'ev-2', date: `${_curYear}-${_curMonthStr}-19`, dayNum: 19, time: '11:00 AM', title: 'Live Video Demo: Luxe Recliner', leadName: 'Faizan A.', type: 'demo', sharedWith: [] },
  { id: 'ev-3', date: `${_curYear}-${_curMonthStr}-20`, dayNum: 20, time: '4:00 PM', title: 'Doctor Endorsement Discussion', leadName: 'Ritu S.', type: 'call', sharedWith: [] },
  { id: 'ev-4', date: `${_curYear}-${_curMonthStr}-22`, dayNum: 22, time: '3:15 PM', title: 'In-Store Touch & Feel Experience', leadName: 'Kavitha R.', type: 'followup', sharedWith: ['Indiranagar Store Team'] },
  { id: 'ev-5', date: `${_curYear}-${_curMonthStr}-23`, dayNum: 23, time: '11:00 AM', title: 'SOP coaching session', leadName: 'Sunita Rao (Manager)', type: 'followup', sharedWith: ['Sunita Rao'] },
  { id: 'ev-6', date: `${_curYear}-${_curMonthStr}-25`, dayNum: 25, time: '6:00 PM', title: 'Discount Counter Offer Follow-up', leadName: 'Divya P.', type: 'call', sharedWith: [] },
  { id: 'ev-7', date: `${_curYear}-${_curMonthStr}-26`, dayNum: 26, time: '2:30 PM', title: 'Warranty pitch refresher', leadName: 'L&D Team', type: 'call', sharedWith: [] },
  { id: 'ev-8', date: `${_curYear}-${_curMonthStr}-28`, dayNum: 28, time: '10:00 AM', title: 'Weekly team huddle', leadName: 'Call Centre Team', type: 'demo', sharedWith: ['Call Centre Team'] }
];

export const SOP_STEPS = [
  '1. Warm greeting & brand introduction (first 10s)',
  '2. Acknowledge inquiry & validate sleep concern',
  '3. Highlight Patented SmartGRID feature & 100-night trial',
  '4. Offer bundled 0% interest 12-month EMI scheme',
  '5. Lock commitment or schedule callback'
];

export const SCRIPTED_PRACTICE_CONVERSATION = [
  {
    speaker: 'Customer' as const,
    text: "Hello? Yes, I was looking at the Ortho GRID mattress on your site, but I see a lot of competitors offering foam mattresses for ₹5,000 less. Why should I buy yours?",
    time: '00:03',
    suggestedReply: "I completely understand price is key! Unlike regular memory foam that sinks and traps body heat, our patented SmartGRID uses medical-grade hyper-elastic polymer that stays cool and dynamically supports your spine.",
    triggerSop: '3. Highlight Patented SmartGRID feature & 100-night trial'
  },
  {
    speaker: 'Customer' as const,
    text: "That sounds good, but what if my back still hurts after sleeping on it for a week? Can I return it?",
    time: '00:22',
    suggestedReply: "Absolutely! We provide a 100-Night Risk-Free Trial right in your home. If it doesn't give you superior sleep, we pick it up with 100% money-back guarantee.",
    triggerSop: '3. Highlight Patented SmartGRID feature & 100-night trial'
  },
  {
    speaker: 'Customer' as const,
    text: "Okay, that reduces the risk. Do you have any no-cost EMI options for HDFC or ICICI cards?",
    time: '00:45',
    suggestedReply: "Yes! We have an exclusive 0% interest 12-month EMI offer running today, which brings your monthly investment down to just around ₹1,540 per month.",
    triggerSop: '4. Offer bundled 0% interest 12-month EMI scheme'
  },
  {
    speaker: 'Customer' as const,
    text: "Great, please share the checkout link on my WhatsApp and apply that 12-month zero EMI plan.",
    time: '01:05',
    suggestedReply: "Done! I have sent the link directly to your WhatsApp with the mattress protector bundled in. Thank you for choosing The Sleep Company!",
    triggerSop: '5. Lock commitment or schedule callback'
  }
];

export const SCRIPTED_INCOMING_CONVERSATION = [
  {
    speaker: 'Customer' as const,
    text: "Hello Arvind! Yes, I was looking at the Ortho GRID mattress on your site, but had a quick question regarding EMI and warranty.",
    time: '00:02',
    suggestedReply: "Namaste Lakshmi! You've reached The Sleep Company. I'd be glad to guide you through our Ortho GRID mattress, zero-cost EMI options, and 10-year warranty.",
    triggerSop: '1. Warm greeting & brand introduction (first 10s)'
  },
  {
    speaker: 'Customer' as const,
    text: "I actually suffer from morning back stiffness. Will the Ortho GRID give proper spine alignment, or does it sink like regular memory foam?",
    time: '00:18',
    suggestedReply: "Our patented SmartGRID hyper-elastic polymer provides targeted orthopedic support that keeps your spine neutrally aligned without sinking.",
    triggerSop: '2. Acknowledge inquiry & validate sleep concern'
  },
  {
    speaker: 'Customer' as const,
    text: "That sounds reassuring. What if it doesn't suit me at home, and do you offer zero-interest EMI on credit cards?",
    time: '00:38',
    suggestedReply: "We give you a 100-Night Risk-Free Trial right in your home with 100% money-back guarantee, plus 0% interest 12-month EMI starting around ₹1,415 per month!",
    triggerSop: '3. Highlight Patented SmartGRID feature & 100-night trial'
  },
  {
    speaker: 'Customer' as const,
    text: "That is perfect! Please share the WhatsApp checkout link with the 12-month zero EMI plan.",
    time: '00:58',
    suggestedReply: "I've sent the WhatsApp checkout link with the bundled 12-month zero EMI scheme. Thank you for choosing The Sleep Company!",
    triggerSop: '4. Offer bundled 0% interest 12-month EMI scheme'
  }
];
