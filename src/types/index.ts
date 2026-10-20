export type MainTab = 'dash' | 'calls' | 'calendar' | 'pulse';
export type PlanSubTab = 'outgoing' | 'incoming' | 'recent';

export interface LeadSubscore {
  label: string;
  pct: number;
  color: string;
}

export interface ProblemBucket {
  cat: string;
  text: string;
}

export interface JourneyMilestone {
  date: string;
  channel: string;
  icon: string;
  color: string;
  text: string;
}

export interface Lead {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  interest: string;
  product: string;
  crossSell: string;
  emi: string;
  attractivenessScore: number;
  expectedValue: number;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  statusLabel: string;
  statusColor: string;
  quoteOn: boolean;
  icp: number;
  icpColor: string;
  intentScore: number;
  subscores: LeadSubscore[];
  slaNote: string | null;
  notes: string[];
  problemBuckets: ProblemBucket[];
  journey: JourneyMilestone[];
  phone: string;
  actions: string;
}

export type SopStageStatus = 'completed' | 'missed' | 'not-assessed';

export type CallWrapupOutcome = 'Interested' | 'Follow-up needed' | 'Requested callback' | 'Resolved' | 'Not interested';

export interface SopStageReview {
  label: string;
  status: SopStageStatus;
  evidence?: string;
}

export interface CallLog {
  id: string;
  dir: 'in' | 'out' | 'missed';
  name: string;
  time: string;
  duration: string;
  phone?: string;
  notes?: string;
  dealValue?: number;
  outcome?: string;
  isDemoSample?: boolean;
  sopStages?: SopStageReview[];
  transcript?: TranscriptLine[];
}

export interface PulseMessage {
  id: string;
  who: string;
  init: string;
  bg?: string;
  color?: string;
  text?: string;
  time: string;
  isBot?: boolean;
  card?: {
    icon?: string;
    title: string;
    badge?: string;
    fields?: [string, string][];
    actions?: { label: string; style?: string; actionType?: string }[];
  };
}

export interface PulseThread {
  title: string;
  dateLabel: string;
  messages: PulseMessage[];
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  dayNum: number;
  time: string;
  title: string;
  leadName: string;
  type: 'call' | 'demo' | 'followup';
  sharedWith: string[];
}

export interface TranscriptLine {
  id: string;
  speaker: 'Customer' | 'Agent' | 'Coach';
  text: string;
  time: string;
}

export interface QueueItem {
  id: string;
  name: string;
  wait: string;
  startMinutesAgo: number;
  waitLevel: 'hi' | 'mid' | 'lo';
  intent: string;
  phone: string;
  product: string;
  dealValue: number;
}

export interface DashboardTask {
  id: string;
  thread: 'Call Centre Team' | 'AvaniBot';
  title: string;
  subtitle: string;
  iconType: 'phone' | 'users' | 'notes';
  iconBg: string;
  iconColor: string;
  q: string;
  ctx: string;
  opts: string[];
  resolved?: boolean;
  resolvedOption?: string;
}

export interface SevenDayMetric {
  day: string;
  val: string | number;
  height: string;
  isToday?: boolean;
}

export interface MicDiagnosticInfo {
  apiSupported: boolean;
  permissionState: 'prompt' | 'granted' | 'denied' | 'unavailable';
  streamActive: boolean;
  streamTrackLabel: string;
  recognitionState: 'idle' | 'starting' | 'listening' | 'sound-detected' | 'speech-detected' | 'stopped' | 'error';
  lastError: string | null;
  lastEvent: string;
  lang: string;
  latestRecognizedWords?: string;
}

export type ConsentStatus = 'pending' | 'granted' | 'declined' | 'withdrawn';
export type ConsentMethod = 'WhatsApp' | 'Verbal';
export type CallChannelType = 'in-app' | 'phone';

export interface ConsentHistoryItem {
  time: string;
  sec: string;
  what: string;
  ref?: string;
}

export interface ConsentRecord {
  consentId: string | null;
  status: ConsentStatus;
  contactName: string;
  contactPhone: string;
  lang: string;
  method?: ConsentMethod;
  isMinor: boolean;
  parentPhone?: string;
  offersWhatsApp: boolean;
  timestamp: number;
  callChannel: CallChannelType;
  historyLog: ConsentHistoryItem[];
}

