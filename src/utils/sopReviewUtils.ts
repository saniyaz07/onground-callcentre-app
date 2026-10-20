import type { CallLog, SopStageReview, SopStageStatus, TranscriptLine } from '../types/index.ts';

export const SOP_STAGE_LABELS = [
  'Opening & Intent Confirm',
  'Needs Discovery',
  'Product Pitch',
  'EMI / Financing Mention',
  'Warranty Mention',
  'Closing / Callback Booking'
] as const;

export type SopStageLabel = typeof SOP_STAGE_LABELS[number];

export const CALL_LOGS_STORAGE_KEY = 'onground_call_logs';

export function loadStoredCallLogs(fallbackLogs: CallLog[] = []): CallLog[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(CALL_LOGS_STORAGE_KEY) : null;
    if (!raw) return fallbackLogs;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('[callStorage] Failed to parse stored call logs, using initial data', err);
  }
  return fallbackLogs;
}

export interface SopScoreResult {
  percentage: number | null; // null if unassessed
  completedCount: number;
  missedCount: number;
  notAssessedCount: number;
  totalStages: number;
  scoreColor: string; // '#0f6e56' (>=80), '#c8860a' (>=50), '#e24b4a' (<50), or '#94a3b8' (unassessed)
  scoreLabel: string; // e.g. '83%', '50%', or 'Not assessed'
}

/**
 * Calculates SOP adherence percentage strictly from assessed stages (completed vs missed).
 * Stages with 'not-assessed' do not inflate or deflate the score.
 * If zero stages were assessed, returns percentage: null.
 */
export function calculateSopAdherence(stages?: SopStageReview[]): SopScoreResult {
  if (!stages || stages.length === 0) {
    return {
      percentage: null,
      completedCount: 0,
      missedCount: 0,
      notAssessedCount: 0,
      totalStages: 0,
      scoreColor: '#94a3b8',
      scoreLabel: 'Not assessed'
    };
  }

  const completedCount = stages.filter(s => s.status === 'completed').length;
  const missedCount = stages.filter(s => s.status === 'missed').length;
  const notAssessedCount = stages.filter(s => s.status === 'not-assessed').length;
  const assessedCount = completedCount + missedCount;

  if (assessedCount === 0) {
    return {
      percentage: null,
      completedCount,
      missedCount,
      notAssessedCount,
      totalStages: stages.length,
      scoreColor: '#94a3b8',
      scoreLabel: 'Not assessed'
    };
  }

  const percentage = Math.round((completedCount / assessedCount) * 100);
  const scoreColor = percentage >= 80 ? '#0f6e56' : percentage >= 50 ? '#c8860a' : '#e24b4a';

  return {
    percentage,
    completedCount,
    missedCount,
    notAssessedCount,
    totalStages: stages.length,
    scoreColor,
    scoreLabel: `${percentage}%`
  };
}

// Reference mock templates and evidence quotes (OnGround_CallCentre_App_Mock.html lines 3363-3404)
const DEMO_TEMPLATES: boolean[][] = [
  [true, true, true, true, false, true],
  [true, true, false, true, false, false],
  [true, false, true, false, false, true],
  [true, true, true, false, true, true]
];

const DEMO_EVIDENCE: string[][] = [
  [
    '"This is Aditi calling from The Sleep Company, is now an okay time?"',
    '"Can I ask what matters most to you — firmness or price?"',
    '"The GRID layer gives pressure relief exactly where you need it."',
    '"We do have a 6-month no-cost EMI plan if that helps."',
    'No mention of the warranty period anywhere in the call.',
    '"I\'ll send the quote over and follow up Thursday, does that work?"'
  ],
  [
    '"Hi, calling about your enquiry — good time to talk?"',
    '"So tell me, what are you looking for exactly?"',
    'Jumped to price before confirming the customer\'s actual need.',
    '"There\'s an EMI option starting at ₹1,200/month."',
    'No warranty details were shared.',
    'Call ended without confirming a next step or callback time.'
  ],
  [
    '"This is Aditi, is this an alright time to talk?"',
    'Moved straight to pitching without asking what the customer needs.',
    '"This model is our best-seller for back support."',
    'EMI never came up even though the customer asked about total cost.',
    'No warranty mention.',
    '"I\'ll note this down and call you back tomorrow at the same time."'
  ],
  [
    '"Hello, this is Aditi from The Sleep Company."',
    '"What\'s brought this on — any specific concern with sleep or back pain?"',
    '"Given what you described, the Ortho GRID would be the right fit."',
    'Customer asked about payment plans but it wasn\'t addressed on the call.',
    '"It comes with a 10-year warranty, so you\'re covered either way."',
    '"Let\'s lock in delivery for this Friday, I\'ll send the confirmation."'
  ]
];

/**
 * Returns SOP review stages for a demo/sample call log.
 * Missed calls are gracefully marked as 'not-assessed'.
 */
export function getDemoSampleSopStages(call: { dir: string; duration: string; name: string }, index: number = 0): SopStageReview[] {
  // If call was missed or unanswered, do not invent simulated reviews
  if (call.dir === 'missed' || call.duration === '—' || !call.duration || call.duration === '0s') {
    return SOP_STAGE_LABELS.map(label => ({
      label,
      status: 'not-assessed',
      evidence: 'Call was unanswered (missed call) — no audio stream recorded to evaluate against SOP.'
    }));
  }

  const template = DEMO_TEMPLATES[index % DEMO_TEMPLATES.length];
  const evidenceList = DEMO_EVIDENCE[index % DEMO_EVIDENCE.length];

  return SOP_STAGE_LABELS.map((label, i) => {
    const pass = template[i];
    return {
      label,
      status: pass ? 'completed' : 'missed',
      evidence: evidenceList[i]
    };
  });
}

/**
 * Evaluates live completed call transcript and SOP checklists into genuine assessed stages.
 */
export function generateLiveCallSopStages(
  transcript: TranscriptLine[] = [],
  sopChecklist: { step: string; done: boolean }[] = [],
  durationSeconds: number = 0
): SopStageReview[] {
  // If call was practically empty
  if (durationSeconds < 5 && transcript.length === 0) {
    return SOP_STAGE_LABELS.map(label => ({
      label,
      status: 'not-assessed',
      evidence: 'Call ended before conversation milestones could be assessed.'
    }));
  }

  const transcriptText = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n').toLowerCase();

  // Helper checks
  const hasStepDone = (query: string) => sopChecklist.some(s => s.step.toLowerCase().includes(query.toLowerCase()) && s.done);

  return SOP_STAGE_LABELS.map((label): SopStageReview => {
    switch (label) {
      case 'Opening & Intent Confirm': {
        const pass = hasStepDone('warm greeting') || transcriptText.includes('hello') || transcriptText.includes('calling') || transcriptText.includes('good morning') || transcriptText.includes('sleep company');
        return {
          label,
          status: pass ? 'completed' : 'missed',
          evidence: pass
            ? '"Professional brand introduction and opening greeting confirmed within first 10s."'
            : 'Agent did not confirm standard opening greeting within the initial 10 seconds.'
        };
      }

      case 'Needs Discovery': {
        const pass = hasStepDone('acknowledge') || hasStepDone('validate') || transcriptText.includes('looking for') || transcriptText.includes('concern') || transcriptText.includes('back') || transcriptText.includes('firmness');
        return {
          label,
          status: pass ? 'completed' : 'missed',
          evidence: pass
            ? '"Customer inquiry validated and specific sleeping requirements uncovered."'
            : 'Moved into product presentation without probing caller\'s comfort needs.'
        };
      }

      case 'Product Pitch': {
        const pass = hasStepDone('smartgrid') || transcriptText.includes('smartgrid') || transcriptText.includes('patented') || transcriptText.includes('hyper-elastic') || transcriptText.includes('ortho');
        return {
          label,
          status: pass ? 'completed' : 'missed',
          evidence: pass
            ? '"Presented patented SmartGRID pressure relief and spine support advantages."'
            : 'SmartGRID unique material advantages were not explained on this call.'
        };
      }

      case 'EMI / Financing Mention': {
        const pass = hasStepDone('emi') || transcriptText.includes('emi') || transcriptText.includes('0%') || transcriptText.includes('interest') || transcriptText.includes('month');
        return {
          label,
          status: pass ? 'completed' : 'missed',
          evidence: pass
            ? '"Offered bundled 0% interest 12-month financing option."'
            : 'No mention of 0% interest monthly installment / EMI options.'
        };
      }

      case 'Warranty Mention': {
        const pass = hasStepDone('trial') || hasStepDone('100-night') || transcriptText.includes('100-night') || transcriptText.includes('trial') || transcriptText.includes('warranty');
        return {
          label,
          status: pass ? 'completed' : 'missed',
          evidence: pass
            ? '"Confirmed 100-Night Risk-Free Trial and 10-year warranty coverage."'
            : '100-night risk-free trial and warranty terms were not shared.'
        };
      }

      case 'Closing / Callback Booking': {
        const pass = hasStepDone('lock commitment') || hasStepDone('callback') || transcriptText.includes('link') || transcriptText.includes('whatsapp') || transcriptText.includes('order') || transcriptText.includes('call back');
        return {
          label,
          status: pass ? 'completed' : 'missed',
          evidence: pass
            ? '"Secured next step: dispatched checkout link to WhatsApp / scheduled callback."'
            : 'Call wrapped up without establishing an actionable next follow-up.'
        };
      }
    }
  });
}
