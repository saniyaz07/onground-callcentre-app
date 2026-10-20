import type { ConsentRecord, ConsentStatus, ConsentMethod, CallChannelType, ConsentHistoryItem } from '../types/index.ts';

export const CONSENT_STORAGE_KEY = 'onground_recording_consent';
export const CONSENT_EVENTS_STORAGE_KEY = 'og_consent_events';

export interface LanguageDef {
  code: string;
  label: string;
  name: string;
}

export const PRIMARY_LANGUAGES: LanguageDef[] = [
  { code: 'kn', label: 'ಕನ್ನಡ', name: 'Kannada' },
  { code: 'hi', label: 'हिंदी', name: 'Hindi' },
  { code: 'en', label: 'English', name: 'English' }
];

export const ADDITIONAL_LANGUAGES: LanguageDef[] = [
  { code: 'ta', label: 'தமிழ்', name: 'Tamil' },
  { code: 'te', label: 'తెలుగు', name: 'Telugu' },
  { code: 'mr', label: 'मराठी', name: 'Marathi' },
  { code: 'bn', label: 'বাংলা', name: 'Bengali' },
  { code: 'gu', label: 'ગુજરાતી', name: 'Gujarati' },
  { code: 'ml', label: 'മലയാളം', name: 'Malayalam' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
  { code: 'or', label: 'ଓଡ଼ିଆ', name: 'Odia' }
];

export const CONSENT_SCRIPTS: Record<string, { script: string; reassure: string }> = {
  kn: {
    script: 'ಈ ಕಾಲ್ ಅನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಬಹುದಾ? ಇದು ನಿಮ್ಮ ಸರ್ವೀಸ್ ಮತ್ತು ಫಾಲೋ-ಅಪ್‌ಗೆ ಮಾತ್ರ. ಬೇಡ ಅನ್ನಬಹುದು, ಯಾವಾಗ ಬೇಕಾದರೂ ಡಿಲೀಟ್ ಮಾಡಿಸಬಹುದು.',
    reassure: 'ರೆಕಾರ್ಡ್ ಮಾಡೋದು ನಿಮ್ಮ ಇಷ್ಟ. ಬೇಡ ಅಂದ್ರೆ ನಿಮಗೆ ಏನೂ ತೊಂದರೆ ಇಲ್ಲ.'
  },
  hi: {
    script: 'क्या हम यह कॉल रिकॉर्ड कर सकते हैं? सिर्फ़ आपकी सर्विस और फ़ॉलो-अप के लिए है। आप मना कर सकते हैं, या कभी भी डिलीट करवा सकते हैं।',
    reassure: 'रिकॉर्डिंग आपकी मर्ज़ी है। मना करने से आपकी सर्विस पर कोई असर नहीं पड़ेगा।'
  },
  en: {
    script: 'Can we record this? Only for your service and follow-up. You can say no, or ask us to delete it any time.',
    reassure: "Recording is your choice. Saying no won't change anything for you."
  },
  ta: {
    script: 'இந்த அழைப்பை பதிவு செய்யலாமா? இது உங்கள் சேவை மற்றும் பின்தொடர்தலுக்கு மட்டுமே. நீங்கள் வேண்டாம் என சொல்லலாம், எப்போது வேண்டுமானாலும் நீக்கக் கேட்கலாம்.',
    reassure: 'பதிவு செய்வது உங்கள் விருப்பம். மறுப்பதால் எந்த மாற்றமும் இருக்காது.'
  },
  te: {
    script: 'మేము ఈ కాల్‌ను రికార్డ్ చేయవచ్చా? ఇది మీ సర్వీస్ మరియు ఫాలో-అప్ కోసం మాత్రమే. మీరు వద్దని చెప్పవచ్చు, లేదా ఎప్పుడైనా తొలగించమని అడగవచ్చు.',
    reassure: 'రికార్డింగ్ మీ ఇష్టం. వద్దంటే మీ సేవలకు ఎటువంటి ఆటంకం ఉండదు.'
  },
  mr: {
    script: 'आम्ही हा कॉल रेकॉर्ड करू शकतो का? हा फक्त तुमच्या सेवेसाठी आणि फॉलो-अपसाठी आहे. तुम्ही नकार देऊ शकता किंवा कधीही डिलीट करण्यास सांगू शकता.',
    reassure: 'रेकॉर्डिंग करणे तुमची निवड आहे. नकार दिल्याने तुमच्या सेवेवर काहीही फरक पडणार नाही.'
  }
};

export const ENGLISH_FALLBACK_SCRIPT = 'Can we record this? Only for your service and follow-up. You can say no, or ask us to delete it any time.';

export const DPDP_RIGHTS: Record<string, { title: string; desc: string }> = {
  'Sec 11': { title: 'See my data', desc: 'Wants a copy of their data' },
  'Sec 12': { title: 'Correct or delete my data', desc: 'Wants their data corrected or deleted' },
  'Sec 13': { title: 'Make a complaint', desc: 'Wants to make a complaint' },
  'Sec 14': { title: 'Name someone for me', desc: 'Wants to name someone to act for them' },
  'Sec 6': { title: 'Withdraw consent', desc: 'Wants to withdraw consent' }
};

export const DPDP_RULES = [
  { icon: 'MessageSquare', bg: '#e1f5ee', color: '#0f6e56', title: 'Ask first', desc: 'Read the line, then send it on WhatsApp. Nothing records until they tap Yes.', sec: 'Sec 5–6' },
  { icon: 'MicOff', bg: '#f1f5f9', color: '#334155', title: 'No means no', desc: 'Carry on without recording. Offers stay off unless they say yes.', sec: 'Sec 6' },
  { icon: 'Square', bg: '#fef2f2', color: '#b91c1c', title: 'Stop means stop', desc: 'The app stops recording itself the moment it hears it.', sec: 'Sec 6' },
  { icon: 'Shield', bg: '#eef2ff', color: '#1e3a8a', title: 'Data questions go to the DPO', desc: "One tap. They get a reference number. Don't promise anything.", sec: 'Sec 11–14' },
  { icon: 'UserPlus', bg: '#fff7ed', color: '#c2410c', title: 'Under 18 needs a parent', desc: 'Switch on "Under 18?" and the parent says yes.', sec: 'Sec 9' }
];

let consentSeq = Math.floor(100000 + Math.random() * 800000);
let rightSeq = 1;

export const formatTimeNow = (): string => {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
};

export const createInitialConsent = (
  name: string = 'Lakshmi R.',
  phone: string = '+91 98450 xxxxx',
  channel: CallChannelType = 'in-app',
  lang: string = 'kn'
): ConsentRecord => {
  return {
    consentId: null,
    status: 'pending',
    contactName: name,
    contactPhone: phone,
    lang,
    isMinor: false,
    offersWhatsApp: false,
    timestamp: Date.now(),
    callChannel: channel,
    historyLog: [
      {
        time: formatTimeNow(),
        sec: 'Consent',
        what: `Recording consent gate initiated for ${name} · Status: Pending`
      }
    ]
  };
};

export const grantConsent = (
  current: ConsentRecord,
  method: ConsentMethod = 'Verbal',
  isMinor: boolean = false,
  parentPhone?: string,
  offersWhatsApp: boolean = false
): ConsentRecord => {
  const consentId = `CNS-2026-${consentSeq++}`;
  const now = formatTimeNow();
  const minorNote = isMinor ? ', from verified parent/guardian' : '';
  const methodNote = method === 'WhatsApp' ? 'tapped on WhatsApp (Simulated)' : 'said out loud (clip saved · Simulated)';
  
  const newLog: ConsentHistoryItem = {
    time: now,
    sec: 'Consent',
    what: `Consent ${consentId}: recording yes${minorNote}, ${methodNote}. Offers: ${offersWhatsApp ? 'Yes' : 'No'}.`
  };

  const updated: ConsentRecord = {
    ...current,
    consentId,
    status: 'granted',
    method,
    isMinor,
    parentPhone: isMinor ? (parentPhone || current.contactPhone) : undefined,
    offersWhatsApp,
    timestamp: Date.now(),
    historyLog: [...current.historyLog, newLog]
  };

  saveConsentRecord(updated);
  return updated;
};

export const declineConsent = (
  current: ConsentRecord,
  method: ConsentMethod = 'Verbal'
): ConsentRecord => {
  const now = formatTimeNow();
  const methodNote = method === 'WhatsApp' ? 'on WhatsApp (Simulated)' : 'verbally';
  
  const newLog: ConsentHistoryItem = {
    time: now,
    sec: 'Consent',
    what: `Said no to recording ${methodNote}. Logged. Recording remains OFF. Carry on talking.`
  };

  const updated: ConsentRecord = {
    ...current,
    consentId: null,
    status: 'declined',
    method,
    timestamp: Date.now(),
    historyLog: [...current.historyLog, newLog]
  };

  saveConsentRecord(updated);
  return updated;
};

export const withdrawConsent = (current: ConsentRecord): ConsentRecord => {
  const now = formatTimeNow();
  const newLog: ConsentHistoryItem = {
    time: now,
    sec: 'Sec 6',
    what: 'Recording consent withdrawn by customer. Stopped at once, erasure queued.'
  };

  const updated: ConsentRecord = {
    ...current,
    status: 'withdrawn',
    timestamp: Date.now(),
    historyLog: [...current.historyLog, newLog]
  };

  saveConsentRecord(updated);
  return updated;
};

export const logConsentRight = (
  current: ConsentRecord,
  sec: string
): { updated: ConsentRecord; refNumber: string } => {
  const refNumber = `RR-2026-0${rightSeq++}`;
  const right = DPDP_RIGHTS[sec] || { title: 'DPDP Right Invoked', desc: 'Data request' };
  const now = formatTimeNow();

  const newLog: ConsentHistoryItem = {
    time: now,
    sec,
    what: `${right.title} · ${refNumber} sent to DPO, OTP sent (Simulated)`,
    ref: refNumber
  };

  const updated: ConsentRecord = {
    ...current,
    historyLog: [...current.historyLog, newLog]
  };

  saveConsentRecord(updated);
  return { updated, refNumber };
};

export const saveConsentRecord = (record: ConsentRecord): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    
    // Also sync to og_consent_events array for audit trail
    const existingEvents: any[] = JSON.parse(window.localStorage.getItem(CONSENT_EVENTS_STORAGE_KEY) || '[]');
    const latestLog = record.historyLog[record.historyLog.length - 1];
    if (latestLog) {
      existingEvents.push({
        ts: Date.now(),
        sec: latestLog.sec,
        what: latestLog.what,
        who: record.contactName,
        cid: record.consentId,
        ref: latestLog.ref
      });
      if (existingEvents.length > 100) existingEvents.splice(0, existingEvents.length - 100);
      window.localStorage.setItem(CONSENT_EVENTS_STORAGE_KEY, JSON.stringify(existingEvents));
    }
  } catch (err) {
    console.warn('[ConsentStorage] Failed to save consent:', err);
  }
};

export const getStoredConsent = (): ConsentRecord | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.status && Array.isArray(parsed.historyLog)) {
      return parsed as ConsentRecord;
    }
    return null;
  } catch {
    return null;
  }
};

export const clearStoredConsent = (): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {}
};
