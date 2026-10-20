import { useState, useEffect, useRef, useCallback } from 'react';
import { TranscriptLine, MicDiagnosticInfo, ConsentRecord, ConsentMethod } from '../types';
import { SCRIPTED_PRACTICE_CONVERSATION, SCRIPTED_INCOMING_CONVERSATION, SOP_STEPS } from '../data/mockData';
import { 
  createInitialConsent, 
  grantConsent, 
  declineConsent, 
  withdrawConsent, 
  getStoredConsent 
} from '../utils/consentStorage';

export interface VoiceEngineState {
  isCallActive: boolean;
  isIncomingAlert: boolean;
  callerName: string;
  callerPhone: string;
  callerProduct: string;
  callerValue: number;
  callType: 'outgoing' | 'incoming' | 'practice';
  duration: number; // in seconds
  durationStr: string;
  isMuted: boolean;
  isOnHold: boolean;
  sentiment: 'Positive' | 'Neutral' | 'Hesitant';
  sentimentPct: number;
  transcript: TranscriptLine[];
  sopChecklist: { step: string; done: boolean }[];
  liveNotes: string;
  isRecognizing: boolean;
  speechSupported: boolean;
  micPermission: 'prompt' | 'granted' | 'denied' | 'unsupported';
  isAiSpeaking: boolean;
  micDiagnostics: MicDiagnosticInfo;
  interimTranscript: string;
  consentRecord: ConsentRecord | null;
  isConsentModalOpen: boolean;
  openConsentModal: () => void;
  closeConsentModal: () => void;
  grantRecordingConsent: (method?: ConsentMethod, isMinor?: boolean, parentPhone?: string, offersWhatsApp?: boolean) => void;
  declineRecordingConsent: (method?: ConsentMethod) => void;
  withdrawRecordingConsent: () => void;
  setConsentLanguage: (lang: string) => void;
  simulatedCustomerConsentResponse: 'yes' | 'no';
  setSimulatedCustomerConsentResponse: (res: 'yes' | 'no') => void;
  agentInputDraft: string;
  setAgentInputDraft: (text: string | ((prev: string) => string)) => void;
  currentAiSuggestion: string;
  submitAgentResponse: (overrideText?: string) => void;
  useAiSuggestion: () => void;
  waitingForAgent: boolean;
}

export function useVoiceEngine(
  onCallEnded?: (call: {
    name: string;
    phone: string;
    durationStr: string;
    dealValue: number;
    notes: string;
    dir: 'in' | 'out';
    transcript?: TranscriptLine[];
    sopChecklist?: { step: string; done: boolean }[];
    durationSeconds?: number;
  }) => void
) {
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isIncomingAlert, setIsIncomingAlert] = useState<boolean>(false);
  const [callerName, setCallerName] = useState<string>('Mukunda R.');
  const [callerPhone, setCallerPhone] = useState<string>('+91 98765 43210');
  const [callerProduct, setCallerProduct] = useState<string>('Ortho GRID Mattress');
  const [callerValue, setCallerValue] = useState<number>(18490);
  const [callType, setCallType] = useState<'outgoing' | 'incoming' | 'practice'>('outgoing');
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOnHold, setIsOnHold] = useState<boolean>(false);
  const [sentiment, setSentiment] = useState<'Positive' | 'Neutral' | 'Hesitant'>('Positive');
  const [sentimentPct, setSentimentPct] = useState<number>(65);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [sopChecklist, setSopChecklist] = useState<{ step: string; done: boolean }[]>(
    SOP_STEPS.map(s => ({ step: s, done: false }))
  );
  const [liveNotes, setLiveNotes] = useState<string>('');
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [consentRecord, setConsentRecord] = useState<ConsentRecord | null>(() => getStoredConsent());
  const [isConsentModalOpen, setIsConsentModalOpen] = useState<boolean>(false);
  const [simulatedCustomerConsentResponse, setSimulatedCustomerConsentResponse] = useState<'yes' | 'no'>('yes');
  const [agentInputDraft, setAgentInputDraft] = useState<string>('');
  const [currentAiSuggestion, setCurrentAiSuggestion] = useState<string>('');
  const [waitingForAgent, setWaitingForAgent] = useState<boolean>(false);

  // Diagnostic state directly derived from actual browser events
  const [micDiagnostics, setMicDiagnostics] = useState<MicDiagnosticInfo>({
    apiSupported: typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
    permissionState: 'prompt',
    streamActive: false,
    streamTrackLabel: 'None',
    recognitionState: 'idle',
    lastError: null,
    lastEvent: 'initialized',
    lang: 'en-IN'
  });

  // Synchronous State Mirrors (Refs) to prevent stale closure bugs in SpeechRecognition & timers
  const isCallActiveRef = useRef<boolean>(false);
  const isOnHoldRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);
  const durationRef = useRef<number>(0);
  const isRecognizingRef = useRef<boolean>(false);
  const isStartingRef = useRef<boolean>(false);
  const isAiSpeakingRef = useRef<boolean>(false);
  const callTypeRef = useRef<'outgoing' | 'incoming' | 'practice'>('outgoing');
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const consentRecordRef = useRef<ConsentRecord | null>(consentRecord);
  const simulatedCustomerConsentResponseRef = useRef<'yes' | 'no'>('yes');
  const consentHandledRef = useRef<boolean>(false);
  const agentInputDraftRef = useRef<string>('');
  const waitingForAgentRef = useRef<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const pendingBotTimeoutRef = useRef<number | null>(null);
  const speechWatchdogTimeoutRef = useRef<number | null>(null);
  const recognitionRestartTimeoutRef = useRef<number | null>(null);
  const interimDebounceTimeoutRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const conversationStepRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const lastSpeechRestartRef = useRef<number>(0);
  const restartCountRef = useRef<number>(0);
  const lastInterimPhraseRef = useRef<string>('');
  const advanceConversationRef = useRef<() => void>(() => {});

  // Check speech recognition support
  const speechSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Synchronize ref mirrors
  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  useEffect(() => {
    isOnHoldRef.current = isOnHold;
  }, [isOnHold]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    isRecognizingRef.current = isRecognizing;
  }, [isRecognizing]);

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);

  useEffect(() => {
    callTypeRef.current = callType;
  }, [callType]);

  useEffect(() => {
    consentRecordRef.current = consentRecord;
  }, [consentRecord]);

  useEffect(() => {
    simulatedCustomerConsentResponseRef.current = simulatedCustomerConsentResponse;
  }, [simulatedCustomerConsentResponse]);

  useEffect(() => {
    agentInputDraftRef.current = agentInputDraft;
  }, [agentInputDraft]);

  useEffect(() => {
    waitingForAgentRef.current = waitingForAgent;
  }, [waitingForAgent]);

  // Warm and keep SpeechSynthesis voices cached in memory
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
      };
    }
  }, []);

  // Cancel any scheduled bot response
  const cancelPendingBotReply = useCallback(() => {
    if (pendingBotTimeoutRef.current) {
      clearTimeout(pendingBotTimeoutRef.current);
      pendingBotTimeoutRef.current = null;
    }
    if (speechWatchdogTimeoutRef.current) {
      clearTimeout(speechWatchdogTimeoutRef.current);
      speechWatchdogTimeoutRef.current = null;
    }
  }, []);

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Recording Consent Modal Controls
  const openConsentModal = useCallback(() => {
    setIsConsentModalOpen(true);
  }, []);

  const closeConsentModal = useCallback(() => {
    setIsConsentModalOpen(false);
  }, []);

  // Mark an SOP step as done
  const markSopDone = useCallback((stepName: string) => {
    setSopChecklist(prev => prev.map(s => s.step === stepName ? { ...s, done: true } : s));
  }, []);

  // Play DTMF keypad tone using Web Audio API
  const playDtmfTone = useCallback((freq1: number = 697, freq2: number = 1209) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.frequency.value = freq1;
      osc2.frequency.value = freq2;
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext fallback
    }
  }, []);

  // Speak text via SpeechSynthesis with robust Hold, Voice Selection, Watchdog, and GC protection
  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // STRICT CHECK: Do NOT speak if call is inactive or on hold
    if (!isCallActiveRef.current || isOnHoldRef.current) {
      return;
    }

    try {
      // Clear any previous speech watchdog timer
      if (speechWatchdogTimeoutRef.current) {
        clearTimeout(speechWatchdogTimeoutRef.current);
        speechWatchdogTimeoutRef.current = null;
      }

      // In Chromium, if paused, resume synthesis
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-IN';

      // Pick best matching English voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const matchingVoice = voices.find(v => v.lang === 'en-IN') ||
                              voices.find(v => v.lang.startsWith('en')) ||
                              null;
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      // Pin utterance to ref to avoid Chromium garbage collection bug
      activeUtteranceRef.current = utterance;

      let hasFinished = false;
      const finishSpeech = (source: string) => {
        if (hasFinished) return;
        hasFinished = true;
        console.log(`[VoiceEngine] Speech finished (${source})`);

        if (speechWatchdogTimeoutRef.current) {
          clearTimeout(speechWatchdogTimeoutRef.current);
          speechWatchdogTimeoutRef.current = null;
        }

        activeUtteranceRef.current = null;
        setIsAiSpeaking(false);
        isAiSpeakingRef.current = false;

        // Crucial: Guarantee recognition is actively listening for the agent's spoken reply
        if (isCallActiveRef.current && !isOnHoldRef.current && !isMutedRef.current) {
          if (!isRecognizingRef.current) {
            console.log('[VoiceEngine] Recognition was not active; starting for agent speech capture...');
            startRecognition();
          }
        }

        if (onEnd && isCallActiveRef.current && !isOnHoldRef.current) {
          onEnd();
        }
      };

      utterance.onstart = () => {
        console.log('[VoiceEngine] Customer speech started:', text.slice(0, 35) + '...');
        if (!isCallActiveRef.current || isOnHoldRef.current) {
          try { window.speechSynthesis.cancel(); } catch {}
          activeUtteranceRef.current = null;
          setIsAiSpeaking(false);
          isAiSpeakingRef.current = false;
          return;
        }
        setIsAiSpeaking(true);
        isAiSpeakingRef.current = true;
      };

      utterance.onend = () => {
        finishSpeech('onend');
      };

      utterance.onerror = (e: any) => {
        console.warn('[VoiceEngine] Customer speech onerror:', e?.error);
        finishSpeech('onerror');
      };

      window.speechSynthesis.speak(utterance);

      // Chromium watchdog: if onend/onerror fails to fire on Windows, guarantee completion
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const watchdogMs = Math.max(2500, Math.round((wordCount / 2.2) * 1000) + 1200);
      speechWatchdogTimeoutRef.current = window.setTimeout(() => {
        if (!hasFinished && isAiSpeakingRef.current) {
          console.warn(`[VoiceEngine] Speech watchdog triggered after ${watchdogMs}ms`);
          finishSpeech('watchdog');
        }
      }, watchdogMs);

      // Extra safeguard against Chrome getting stuck in paused state
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (err) {
      console.warn('[VoiceEngine] speakText error:', err);
      setIsAiSpeaking(false);
      isAiSpeakingRef.current = false;
      if (onEnd) onEnd();
    }
  }, []);

  // Advance scripted conversational turn for active call mode (one question at a time)
  const advanceCustomerTurn = useCallback((stepIdxOverride?: number) => {
    if (!isCallActiveRef.current || isOnHoldRef.current) {
      isSubmittingRef.current = false;
      return;
    }

    const currentType = callTypeRef.current;
    const script = currentType === 'incoming' 
      ? SCRIPTED_INCOMING_CONVERSATION 
      : SCRIPTED_PRACTICE_CONVERSATION;

    const stepIdx = stepIdxOverride !== undefined ? stepIdxOverride : conversationStepRef.current;
    if (stepIdx < script.length) {
      const turn = script[stepIdx];
      const nowTime = formatTime(durationRef.current);

      // Add Customer message
      setTranscript(prev => [
        ...prev,
        { 
          id: `t-cust-${Date.now()}-${Math.random()}`, 
          speaker: 'Customer', 
          text: turn.text, 
          time: nowTime 
        }
      ]);

      if (turn.triggerSop) {
        markSopDone(turn.triggerSop);
      }
      conversationStepRef.current = stepIdx + 1;

      // Speak customer question audio. Once speaking concludes, display AI suggestion and wait for agent
      speakText(turn.text, () => {
        if (!isCallActiveRef.current || isOnHoldRef.current) {
          isSubmittingRef.current = false;
          return;
        }
        if (turn.suggestedReply) {
          setCurrentAiSuggestion(turn.suggestedReply);
        }
        setWaitingForAgent(true);
        waitingForAgentRef.current = true;
        isSubmittingRef.current = false;
      });
    } else {
      setCurrentAiSuggestion("Call goal achieved. Wrap up and thank the customer.");
      setWaitingForAgent(false);
      waitingForAgentRef.current = false;
      isSubmittingRef.current = false;
    }
  }, [speakText, markSopDone]);

  const advanceConversation = advanceCustomerTurn;
  advanceConversationRef.current = advanceCustomerTurn;

  // Recording Consent Handlers (DPDP Compliance Prototype)
  const grantRecordingConsent = useCallback((
    method: ConsentMethod = 'Verbal',
    isMinor: boolean = false,
    parentPhone?: string,
    offersWhatsApp: boolean = false
  ) => {
    setConsentRecord(prev => {
      const base = prev || createInitialConsent(callerName, callerPhone, callTypeRef.current === 'outgoing' ? 'phone' : 'in-app');
      const updated = grantConsent(base, method, isMinor, parentPhone, offersWhatsApp);

      const nowTime = formatTime(durationRef.current);
      const minorText = isMinor ? ' (Parent Verified)' : '';
      setTranscript(t => [
        ...t,
        {
          id: `t-sys-${Date.now()}`,
          speaker: 'Coach',
          text: `🔒 Consent ${updated.consentId} · Recording ON (Simulated Demo${minorText}) · Method: ${method}`,
          time: nowTime
        }
      ]);
      return updated;
    });

    // If modal was used to grant consent on incoming call and conversation hasn't greeted yet:
    if (callTypeRef.current === 'incoming' && !consentHandledRef.current) {
      consentHandledRef.current = true;
      setIsConsentModalOpen(false);
      const replyText = "Yes, that's fine, you can record this call for service and follow-up.";
      const replyTime = formatTime(durationRef.current);
      setTranscript(t => [
        ...t,
        {
          id: `t-cust-consent-${Date.now()}`,
          speaker: 'Customer',
          text: replyText,
          time: replyTime
        }
      ]);
      speakText(replyText, () => {
        if (pendingBotTimeoutRef.current) clearTimeout(pendingBotTimeoutRef.current);
        pendingBotTimeoutRef.current = window.setTimeout(() => {
          if (!isCallActiveRef.current || isOnHoldRef.current) return;
          advanceCustomerTurn(0);
        }, 500);
      });
    }
  }, [callerName, callerPhone, speakText, advanceCustomerTurn]);

  const declineRecordingConsent = useCallback((method: ConsentMethod = 'Verbal') => {
    setConsentRecord(prev => {
      const base = prev || createInitialConsent(callerName, callerPhone, callTypeRef.current === 'outgoing' ? 'phone' : 'in-app');
      const updated = declineConsent(base, method);

      const nowTime = formatTime(durationRef.current);
      setTranscript(t => [
        ...t,
        {
          id: `t-sys-${Date.now()}`,
          speaker: 'Coach',
          text: `🚫 Recording consent declined · Not recording. Carry on talking.`,
          time: nowTime
        }
      ]);
      return updated;
    });

    // If modal was used to decline consent on incoming call and conversation hasn't greeted yet:
    if (callTypeRef.current === 'incoming' && !consentHandledRef.current) {
      consentHandledRef.current = true;
      setIsConsentModalOpen(false);
      const replyText = "No, I'd rather you didn't record this call, please.";
      const replyTime = formatTime(durationRef.current);
      setTranscript(t => [
        ...t,
        {
          id: `t-cust-consent-${Date.now()}`,
          speaker: 'Customer',
          text: replyText,
          time: replyTime
        }
      ]);
      speakText(replyText, () => {
        if (pendingBotTimeoutRef.current) clearTimeout(pendingBotTimeoutRef.current);
        pendingBotTimeoutRef.current = window.setTimeout(() => {
          if (!isCallActiveRef.current || isOnHoldRef.current) return;
          advanceCustomerTurn(0);
        }, 500);
      });
    }
  }, [callerName, callerPhone, speakText, advanceCustomerTurn]);

  const withdrawRecordingConsent = useCallback(() => {
    setConsentRecord(prev => {
      if (!prev) return null;
      const updated = withdrawConsent(prev);

      const nowTime = formatTime(durationRef.current);
      setTranscript(t => [
        ...t,
        {
          id: `t-sys-${Date.now()}`,
          speaker: 'Coach',
          text: `⚠️ Recording consent withdrawn by customer · Recording stopped immediately.`,
          time: nowTime
        }
      ]);
      return updated;
    });
  }, []);

  const setConsentLanguage = useCallback((lang: string) => {
    setConsentRecord(prev => prev ? { ...prev, lang } : null);
  }, []);

  // Submit Human Agent response (Spoken via microphone or typed via keyboard)
  const submitAgentResponse = useCallback((overrideText?: string) => {
    if (!isCallActiveRef.current || isOnHoldRef.current) {
      return;
    }

    if (isSubmittingRef.current) {
      console.log('[VoiceEngine] Submission already in flight; ignoring double trigger');
      return;
    }

    const textToSend = (overrideText !== undefined ? overrideText : agentInputDraftRef.current).trim();
    if (!textToSend) {
      return;
    }

    isSubmittingRef.current = true;

    // Reset draft and interim indicators
    setAgentInputDraft('');
    agentInputDraftRef.current = '';
    lastInterimPhraseRef.current = '';
    setInterimTranscript('');
    setWaitingForAgent(false);
    waitingForAgentRef.current = false;
    setCurrentAiSuggestion('');

    const nowTime = formatTime(durationRef.current);
    setTranscript(prev => [
      ...prev,
      { id: `t-agent-${Date.now()}-${Math.random()}`, speaker: 'Agent', text: textToSend, time: nowTime }
    ]);

    setMicDiagnostics(prev => ({
      ...prev,
      recognitionState: 'listening',
      latestRecognizedWords: textToSend,
      lastEvent: `Submitted: "${textToSend}"`
    }));

    // If incoming call and consent has not yet been answered by customer
    if (callTypeRef.current === 'incoming' && !consentHandledRef.current) {
      consentHandledRef.current = true;
      setIsConsentModalOpen(false);

      const willAgree = simulatedCustomerConsentResponseRef.current === 'yes';

      if (willAgree) {
        const replyText = "Yes, that's fine, you can record this call for service and follow-up.";
        grantRecordingConsent('Verbal', false, undefined, true);

        const replyTime = formatTime(durationRef.current);
        setTranscript(prev => [
          ...prev,
          { id: `t-cust-consent-${Date.now()}`, speaker: 'Customer', text: replyText, time: replyTime }
        ]);

        speakText(replyText, () => {
          if (pendingBotTimeoutRef.current) clearTimeout(pendingBotTimeoutRef.current);
          pendingBotTimeoutRef.current = window.setTimeout(() => {
            if (!isCallActiveRef.current || isOnHoldRef.current) return;
            advanceCustomerTurn(0);
          }, 500);
        });
      } else {
        const replyText = "No, I'd rather you didn't record this call, please.";
        declineRecordingConsent('Verbal');

        const replyTime = formatTime(durationRef.current);
        setTranscript(prev => [
          ...prev,
          { id: `t-cust-consent-${Date.now()}`, speaker: 'Customer', text: replyText, time: replyTime }
        ]);

        speakText(replyText, () => {
          if (pendingBotTimeoutRef.current) clearTimeout(pendingBotTimeoutRef.current);
          pendingBotTimeoutRef.current = window.setTimeout(() => {
            if (!isCallActiveRef.current || isOnHoldRef.current) return;
            advanceCustomerTurn(0);
          }, 500);
        });
      }
      return;
    }

    // Normal conversational turn: match SOP milestones from speech
    const lower = textToSend.toLowerCase();
    if (lower.includes('sleep company') || lower.includes('hello') || lower.includes('morning') || lower.includes('afternoon') || lower.includes('arvind') || lower.includes('namaste')) {
      markSopDone('1. Warm greeting & brand introduction (first 10s)');
    }
    if (lower.includes('stiffness') || lower.includes('back') || lower.includes('spine') || lower.includes('ortho') || lower.includes('pain') || lower.includes('posture')) {
      markSopDone('2. Acknowledge inquiry & validate sleep concern');
    }
    if (lower.includes('smartgrid') || lower.includes('100') || lower.includes('trial') || lower.includes('patented') || lower.includes('polymer')) {
      markSopDone('3. Highlight Patented SmartGRID feature & 100-night trial');
      setSentiment('Positive');
      setSentimentPct(85);
    }
    if (lower.includes('emi') || lower.includes('interest') || lower.includes('month') || lower.includes('cost') || lower.includes('price') || lower.includes('card')) {
      markSopDone('4. Offer bundled 0% interest 12-month EMI scheme');
      setSentiment('Positive');
      setSentimentPct(92);
    }
    if (lower.includes('whatsapp') || lower.includes('link') || lower.includes('order') || lower.includes('book') || lower.includes('checkout')) {
      markSopDone('5. Lock commitment or schedule callback');
    }

    // Advance to customer's next turn after natural pause (600ms)
    if (pendingBotTimeoutRef.current) clearTimeout(pendingBotTimeoutRef.current);
    pendingBotTimeoutRef.current = window.setTimeout(() => {
      if (!isCallActiveRef.current || isOnHoldRef.current) {
        isSubmittingRef.current = false;
        return;
      }
      advanceCustomerTurn();
    }, 600);
  }, [grantRecordingConsent, declineRecordingConsent, speakText, advanceCustomerTurn, markSopDone]);

  // Copy AI Suggestion into the agent's editable draft input
  const useAiSuggestion = useCallback(() => {
    if (currentAiSuggestion) {
      setAgentInputDraft(currentAiSuggestion);
      agentInputDraftRef.current = currentAiSuggestion;
    }
  }, [currentAiSuggestion]);

  // Unified Handler for Agent Spoken or Quick-Replied Speech
  const handleAgentSpeech = useCallback((spokenText: string) => {
    submitAgentResponse(spokenText);
  }, [submitAgentResponse]);

  // Request microphone permission explicitly via getUserMedia
  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      console.warn('[VoiceEngine] navigator.mediaDevices.getUserMedia unavailable');
      setMicPermission('unsupported');
      setMicDiagnostics(prev => ({
        ...prev,
        permissionState: 'unavailable',
        lastEvent: 'getUserMedia unsupported'
      }));
      return false;
    }

    // Fast check: If permissions API indicates granted, skip test stream to avoid driver churn
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      try {
        const queryRes = await navigator.permissions.query({ name: 'microphone' as any });
        if (queryRes.state === 'granted') {
          setMicPermission('granted');
          setMicDiagnostics(prev => ({
            ...prev,
            permissionState: 'granted',
            streamActive: true,
            streamTrackLabel: 'Microphone Active (System Default)',
            lastEvent: 'Microphone access verified'
          }));
          return true;
        }
      } catch {}
    }

    try {
      console.log('[VoiceEngine] Requesting microphone access via getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const track = stream.getAudioTracks()[0];
      const trackLabel = track ? track.label : 'Microphone Stream Active';
      console.log('[VoiceEngine] Microphone access granted:', { label: trackLabel, enabled: track?.enabled, readyState: track?.readyState });

      // Release the test tracks immediately so the microphone device is completely free
      // for SpeechRecognition without causing 'audio-capture' hardware locks in Windows.
      stream.getTracks().forEach(t => t.stop());
      audioStreamRef.current = null;

      setMicPermission('granted');
      setMicDiagnostics(prev => ({
        ...prev,
        permissionState: 'granted',
        streamActive: true,
        streamTrackLabel: trackLabel,
        lastEvent: 'Microphone access verified'
      }));
      return true;
    } catch (err: any) {
      console.warn('[VoiceEngine] Microphone permission error:', err);
      setMicPermission('denied');
      setMicDiagnostics(prev => ({
        ...prev,
        permissionState: 'denied',
        streamActive: false,
        lastError: err.name || 'PermissionDenied',
        lastEvent: `getUserMedia error: ${err.name}`
      }));
      return false;
    }
  }, []);

  // Start Speech Recognition
  const startRecognition = useCallback(() => {
    if (!speechSupported) {
      setMicPermission('unsupported');
      setMicDiagnostics(prev => ({
        ...prev,
        apiSupported: false,
        recognitionState: 'error',
        lastError: 'SpeechRecognition not available in this browser'
      }));
      return;
    }

    // Do not start if call inactive, on hold, or muted
    if (!isCallActiveRef.current || isOnHoldRef.current || isMutedRef.current) {
      console.log('[VoiceEngine] Recognition start skipped (call inactive, held, or muted)');
      return;
    }

    // Concurrency guard: Do not re-enter if already active or in process of starting
    if (isStartingRef.current || (isRecognizingRef.current && recognitionRef.current)) {
      console.log('[VoiceEngine] Recognition is already active or starting');
      return;
    }

    // Clear any pending restart timeout
    if (recognitionRestartTimeoutRef.current) {
      clearTimeout(recognitionRestartTimeoutRef.current);
      recognitionRestartTimeoutRef.current = null;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setMicPermission('unsupported');
      return;
    }

    isStartingRef.current = true;

    try {
      if (recognitionRef.current) {
        const oldRec = recognitionRef.current;
        oldRec.onstart = null;
        oldRec.onaudiostart = null;
        oldRec.onsoundstart = null;
        oldRec.onspeechstart = null;
        oldRec.onspeechend = null;
        oldRec.onsoundend = null;
        oldRec.onaudioend = null;
        oldRec.onresult = null;
        oldRec.onerror = null;
        oldRec.onend = null;
        try { oldRec.abort(); } catch {}
        recognitionRef.current = null;
      }

      console.log('[VoiceEngine] Initializing webkitSpeechRecognition instance...');
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true; // Crucial for instant live recognition
      recognition.lang = 'en-IN';
      recognition.maxAlternatives = 1;

      setMicDiagnostics(prev => ({
        ...prev,
        recognitionState: 'starting',
        lastEvent: 'recognition.start() called'
      }));

      recognition.onstart = () => {
        console.log('[VoiceEngine] Lifecycle: onstart (service listening)');
        isStartingRef.current = false;
        isRecognizingRef.current = true;
        setIsRecognizing(true);
        setMicPermission('granted');
        restartCountRef.current = 0;
        setMicDiagnostics(prev => ({
          ...prev,
          recognitionState: 'listening',
          permissionState: 'granted',
          lastEvent: 'onstart: listening'
        }));
      };

      recognition.onaudiostart = () => {
        console.log('[VoiceEngine] Lifecycle: onaudiostart (audio capture started)');
        setMicDiagnostics(prev => ({
          ...prev,
          lastEvent: 'onaudiostart'
        }));
      };

      recognition.onsoundstart = () => {
        console.log('[VoiceEngine] Lifecycle: onsoundstart (sound detected)');
        setMicDiagnostics(prev => ({
          ...prev,
          recognitionState: 'sound-detected',
          lastEvent: 'onsoundstart'
        }));
      };

      recognition.onspeechstart = () => {
        console.log('[VoiceEngine] Lifecycle: onspeechstart (human speech detected)');
        setMicDiagnostics(prev => ({
          ...prev,
          recognitionState: 'speech-detected',
          lastEvent: 'onspeechstart'
        }));
      };

      recognition.onspeechend = () => {
        console.log('[VoiceEngine] Lifecycle: onspeechend (speech paused)');
        setMicDiagnostics(prev => ({
          ...prev,
          lastEvent: 'onspeechend'
        }));
      };

      recognition.onsoundend = () => {
        setMicDiagnostics(prev => ({
          ...prev,
          lastEvent: 'onsoundend'
        }));
      };

      recognition.onaudioend = () => {
        setMicDiagnostics(prev => ({
          ...prev,
          lastEvent: 'onaudioend'
        }));
      };

      recognition.onresult = (event: any) => {
        if (!isCallActiveRef.current || isOnHoldRef.current || isMutedRef.current) {
          return;
        }

        // Avoid capturing customer audio feedback from speakers
        if (isAiSpeaking || isAiSpeakingRef.current) {
          return;
        }

        let finalPhrase = '';
        let interimPhrase = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            finalPhrase += text + ' ';
          } else {
            interimPhrase += text;
          }
        }

        console.log('[VoiceEngine] onresult:', { finalPhrase: finalPhrase.trim(), interimPhrase: interimPhrase.trim() });

        if (interimPhrase.trim()) {
          lastInterimPhraseRef.current = interimPhrase.trim();
          setInterimTranscript(interimPhrase.trim());
          setMicDiagnostics(prev => ({
            ...prev,
            recognitionState: 'speech-detected',
            latestRecognizedWords: interimPhrase.trim(),
            lastEvent: `Hearing: "${interimPhrase.trim()}"`
          }));

          // Silence Debounce: If Chrome holds words in interim without isFinal, commit after 850ms
          if (interimDebounceTimeoutRef.current) {
            clearTimeout(interimDebounceTimeoutRef.current);
          }
          interimDebounceTimeoutRef.current = window.setTimeout(() => {
            if (lastInterimPhraseRef.current && isCallActiveRef.current && !isOnHoldRef.current && !isMutedRef.current) {
              const phrase = lastInterimPhraseRef.current;
              lastInterimPhraseRef.current = '';
              setInterimTranscript('');
              setAgentInputDraft(prev => (prev ? prev + ' ' : '') + phrase);
              setMicDiagnostics(prev => ({
                ...prev,
                recognitionState: 'listening',
                latestRecognizedWords: phrase,
                lastEvent: `Drafted: "${phrase}"`
              }));
            }
          }, 850);
        }

        if (finalPhrase.trim()) {
          if (interimDebounceTimeoutRef.current) {
            clearTimeout(interimDebounceTimeoutRef.current);
            interimDebounceTimeoutRef.current = null;
          }
          const spokenText = finalPhrase.trim();
          lastInterimPhraseRef.current = '';
          setInterimTranscript('');
          setAgentInputDraft(prev => (prev ? prev + ' ' : '') + spokenText);
          setMicDiagnostics(prev => ({
            ...prev,
            recognitionState: 'listening',
            latestRecognizedWords: spokenText,
            lastEvent: `Drafted: "${spokenText}"`
          }));
        }
      };

      recognition.onerror = (e: any) => {
        isStartingRef.current = false;
        const errCode = e.error || 'unknown';
        console.warn('[VoiceEngine] onerror:', errCode);

        setMicDiagnostics(prev => ({
          ...prev,
          lastError: errCode,
          lastEvent: `Speech error: ${errCode}`
        }));

        if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
          setMicPermission('denied');
          setMicDiagnostics(prev => ({ ...prev, permissionState: 'denied', recognitionState: 'error' }));
          isRecognizingRef.current = false;
          setIsRecognizing(false);
          return;
        }

        if (errCode === 'audio-capture') {
          console.warn('[VoiceEngine] Hardware audio-capture lock. Stopping test tracks and retrying recognition...');
          setMicDiagnostics(prev => ({ ...prev, recognitionState: 'error', streamActive: false }));
          if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(t => t.stop());
            audioStreamRef.current = null;
          }
          if (isCallActiveRef.current && !isOnHoldRef.current && !isMutedRef.current) {
            recognitionRestartTimeoutRef.current = window.setTimeout(() => {
              if (isCallActiveRef.current && !isOnHoldRef.current && !isMutedRef.current) {
                startRecognition();
              }
            }, 600);
          }
          return;
        }

        if (errCode === 'aborted') {
          setMicDiagnostics(prev => ({ ...prev, recognitionState: 'idle' }));
          isRecognizingRef.current = false;
          setIsRecognizing(false);
          return;
        }

        if (errCode === 'no-speech') {
          return;
        }
      };

      recognition.onend = () => {
        console.log('[VoiceEngine] Lifecycle: onend (recognition session closed)');
        isStartingRef.current = false;
        isRecognizingRef.current = false;
        setIsRecognizing(false);

        setMicDiagnostics(prev => ({
          ...prev,
          recognitionState: 'stopped',
          lastEvent: 'Recognition session paused/ended'
        }));

        if (interimDebounceTimeoutRef.current) {
          clearTimeout(interimDebounceTimeoutRef.current);
          interimDebounceTimeoutRef.current = null;
        }

        // If uncommitted interim speech exists when Chrome pauses, commit it now
        if (lastInterimPhraseRef.current && isCallActiveRef.current && !isOnHoldRef.current && !isMutedRef.current) {
          const textToCommit = lastInterimPhraseRef.current;
          lastInterimPhraseRef.current = '';
          setInterimTranscript('');
          console.log('[VoiceEngine] Committing pending interim speech on session end:', textToCommit);
          handleAgentSpeech(textToCommit);
        }

        // Keep microphone listening continuously if call is active, unmuted, and not on hold
        if (isCallActiveRef.current && !isOnHoldRef.current && !isMutedRef.current) {
          const now = Date.now();
          if (now - lastSpeechRestartRef.current < 1000) {
            restartCountRef.current++;
          } else {
            restartCountRef.current = 0;
          }
          lastSpeechRestartRef.current = now;

          const delay = restartCountRef.current < 4 ? 250 : restartCountRef.current < 8 ? 600 : 1200;

          recognitionRestartTimeoutRef.current = window.setTimeout(() => {
            if (isCallActiveRef.current && !isOnHoldRef.current && !isMutedRef.current) {
              console.log(`[VoiceEngine] Restarting recognition (restartCount=${restartCountRef.current}, delay=${delay}ms)...`);
              startRecognition();
            }
          }, delay);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      isStartingRef.current = false;
      console.warn('[VoiceEngine] SpeechRecognition failed to start:', err);
      setMicDiagnostics(prev => ({
        ...prev,
        recognitionState: 'error',
        lastError: err?.message || 'start_failed',
        lastEvent: `start threw: ${err?.message}`
      }));
      if (isCallActiveRef.current && !isOnHoldRef.current && !isMutedRef.current) {
        recognitionRestartTimeoutRef.current = window.setTimeout(() => {
          if (isCallActiveRef.current && !isOnHoldRef.current && !isMutedRef.current && !isRecognizingRef.current) {
            startRecognition();
          }
        }, 400);
      }
    }
  }, [speechSupported, isAiSpeaking, handleAgentSpeech]);

  // Timer runner
  useEffect(() => {
    if (isCallActive && !isOnHold) {
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive, isOnHold]);

  // Start Call (Outgoing, Incoming or Practice)
  const startCall = async (
    name: string,
    phone: string,
    product: string = 'Ortho GRID Mattress',
    value: number = 18490,
    type: 'outgoing' | 'incoming' | 'practice' = 'outgoing'
  ) => {
    console.log('[VoiceEngine] Starting call with:', { name, type, product });

    // 0. Proactively prime and unpause SpeechSynthesis within user click gesture
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {}
    }

    setIsIncomingAlert(false);
    setCallerName(name);
    setCallerPhone(phone);
    setCallerProduct(product);
    setCallerValue(value);
    setCallType(type);
    callTypeRef.current = type;
    setDuration(0);
    setIsMuted(false);
    setIsOnHold(false);
    setSentiment('Positive');
    setSentimentPct(68);
    setLiveNotes('');
    setSopChecklist(SOP_STEPS.map(s => ({ step: s, done: false })));
    conversationStepRef.current = 0;
    lastInterimPhraseRef.current = '';
    setInterimTranscript('');

    // Set synchronous refs immediately
    isCallActiveRef.current = true;
    isOnHoldRef.current = false;
    isMutedRef.current = false;
    durationRef.current = 0;

    // Initialize or sync Recording Consent for the current caller
    const initialConsent = createInitialConsent(name, phone, type === 'outgoing' ? 'phone' : 'in-app');
    setConsentRecord(initialConsent);
    consentHandledRef.current = false;

    if (type === 'incoming') {
      setIsConsentModalOpen(true);
      setCurrentAiSuggestion("Can we record this? Only for your service and follow-up. You can say no, or ask us to delete it any time.");
      setWaitingForAgent(true);
      waitingForAgentRef.current = true;
    } else {
      setCurrentAiSuggestion('');
      setWaitingForAgent(false);
      waitingForAgentRef.current = false;
    }

    // Initial greeting transcript: specialized for incoming vs outgoing/practice
    const initialTranscript: TranscriptLine[] = [
      { 
        id: 't-init', 
        speaker: 'Agent', 
        text: type === 'incoming'
          ? `Hello, The Sleep Company Indiranagar, Arvind speaking. How can I assist you today?`
          : `Hello, good day! Arvind from The Sleep Company Indiranagar. Am I speaking with ${name}?`, 
        time: '00:00' 
      }
    ];
    setTranscript(initialTranscript);
    setIsCallActive(true);

    // Play connection tone
    playDtmfTone(440, 480);

    // 1. Proactively request microphone permission on user gesture
    if (speechSupported) {
      await requestMicPermission();
      // Small 80ms delay for Windows WASAPI audio device release after getUserMedia track close
      await new Promise(res => setTimeout(res, 80));
    }

    // 2. Start speech recognition
    startRecognition();

    // 3. For practice/outgoing calls: schedule first customer speech after 900ms
    // For incoming calls: DO NOT play customer greeting until consent is answered!
    cancelPendingBotReply();
    if (type !== 'incoming') {
      window.setTimeout(() => {
        if (!isCallActiveRef.current || isOnHoldRef.current) return;
        advanceCustomerTurn(0);
      }, 900);
    }
  };

  // Simulate incoming call
  const triggerIncomingCall = (
    name: string = 'Lakshmi R.',
    phone: string = '+91 98450 xxxxx',
    product: string = 'Ortho GRID Classic',
    value: number = 16990
  ) => {
    setCallerName(name);
    setCallerPhone(phone);
    setCallerProduct(product);
    setCallerValue(value);
    setCallType('incoming');
    callTypeRef.current = 'incoming';
    setIsIncomingAlert(true);
    playDtmfTone(440, 480);
  };

  const acceptIncoming = () => {
    setIsIncomingAlert(false);
    startCall(callerName, callerPhone, callerProduct, callerValue, 'incoming');
  };

  const declineIncoming = () => {
    setIsIncomingAlert(false);
  };

  // Agent speaks a quick reply (for fallback or rapid answering)
  const agentSpeakReply = (text: string, markStep?: string) => {
    if (!isCallActiveRef.current || isOnHoldRef.current) return;
    if (markStep) markSopDone(markStep);
    handleAgentSpeech(text);
  };

  // End Call & Cleanup
  const endCall = () => {
    console.log('[VoiceEngine] Ending call...');
    isCallActiveRef.current = false;
    isOnHoldRef.current = false;
    isMutedRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    cancelPendingBotReply();

    if (interimDebounceTimeoutRef.current) {
      clearTimeout(interimDebounceTimeoutRef.current);
      interimDebounceTimeoutRef.current = null;
    }

    if (recognitionRestartTimeoutRef.current) {
      clearTimeout(recognitionRestartTimeoutRef.current);
      recognitionRestartTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      const oldRec = recognitionRef.current;
      oldRec.onstart = null;
      oldRec.onaudiostart = null;
      oldRec.onsoundstart = null;
      oldRec.onspeechstart = null;
      oldRec.onspeechend = null;
      oldRec.onsoundend = null;
      oldRec.onaudioend = null;
      oldRec.onresult = null;
      oldRec.onerror = null;
      oldRec.onend = null;
      try { oldRec.abort(); } catch {}
      recognitionRef.current = null;
    }
    isRecognizingRef.current = false;
    setIsRecognizing(false);

    activeUtteranceRef.current = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    setMicDiagnostics(prev => ({
      ...prev,
      recognitionState: 'idle',
      streamActive: false,
      lastEvent: 'Call ended & microphone released'
    }));

    const finalDuration = durationRef.current;
    const durationStr = `${Math.floor(finalDuration / 60)}m ${(finalDuration % 60).toString().padStart(2, '0')}s`;
    setIsCallActive(false);
    setIsOnHold(false);
    setIsMuted(false);
    setInterimTranscript('');
    setAgentInputDraft('');
    agentInputDraftRef.current = '';
    setCurrentAiSuggestion('');
    setWaitingForAgent(false);
    waitingForAgentRef.current = false;

    if (onCallEnded) {
      onCallEnded({
        name: callerName,
        phone: callerPhone,
        durationStr,
        dealValue: callerValue,
        notes: liveNotes || `Completed ${callType} call. Outcome: Positive engagement.`,
        dir: callType === 'incoming' ? 'in' : 'out',
        transcript: [...transcript],
        sopChecklist: [...sopChecklist],
        durationSeconds: finalDuration
      });
    }
  };

  // Toggle Mute: disables microphone capture without ending call or stopping customer audio
  const toggleMute = () => {
    setIsMuted(prev => {
      const nextMute = !prev;
      isMutedRef.current = nextMute;
      console.log('[VoiceEngine] toggleMute:', nextMute ? 'MUTED' : 'UNMUTED');

      if (nextMute) {
        if (recognitionRef.current) {
          const oldRec = recognitionRef.current;
          oldRec.onstart = null;
          oldRec.onaudiostart = null;
          oldRec.onsoundstart = null;
          oldRec.onspeechstart = null;
          oldRec.onspeechend = null;
          oldRec.onsoundend = null;
          oldRec.onaudioend = null;
          oldRec.onresult = null;
          oldRec.onerror = null;
          oldRec.onend = null;
          try { oldRec.abort(); } catch {}
          recognitionRef.current = null;
        }
        isRecognizingRef.current = false;
        setIsRecognizing(false);
        setMicDiagnostics(d => ({ ...d, recognitionState: 'stopped', lastEvent: 'Microphone muted by agent' }));
      } else {
        if (isCallActiveRef.current && !isOnHoldRef.current) {
          setMicDiagnostics(d => ({ ...d, lastEvent: 'Microphone unmuted' }));
          startRecognition();
        }
      }
      return nextMute;
    });
  };

  // Toggle Hold: pauses conversation audio, cancels pending customer speech, and suspends microphone
  const toggleHold = () => {
    setIsOnHold(prev => {
      const nextHold = !prev;
      isOnHoldRef.current = nextHold;
      console.log('[VoiceEngine] toggleHold:', nextHold ? 'HELD' : 'RESUMED');

      if (nextHold) {
        playDtmfTone(400, 400);

        activeUtteranceRef.current = null;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsAiSpeaking(false);
        cancelPendingBotReply();

        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch {}
        }
        isRecognizingRef.current = false;
        setIsRecognizing(false);
        setMicDiagnostics(d => ({ ...d, recognitionState: 'stopped', lastEvent: 'held' }));
      } else {
        playDtmfTone(600, 800);

        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        if (!isMutedRef.current) {
          startRecognition();
        }
      }
      return nextHold;
    });
  };

  return {
    isCallActive,
    isIncomingAlert,
    callerName,
    callerPhone,
    callerProduct,
    callerValue,
    callType,
    duration,
    durationStr: formatTime(duration),
    isMuted,
    isOnHold,
    sentiment,
    sentimentPct,
    transcript,
    sopChecklist,
    liveNotes,
    setLiveNotes,
    isRecognizing,
    speechSupported,
    micPermission,
    isAiSpeaking,
    micDiagnostics,
    interimTranscript,
    startCall,
    triggerIncomingCall,
    acceptIncoming,
    declineIncoming,
    endCall,
    toggleMute,
    toggleHold,
    agentSpeakReply,
    markSopDone,
    playDtmfTone,
    consentRecord,
    isConsentModalOpen,
    openConsentModal,
    closeConsentModal,
    grantRecordingConsent,
    declineRecordingConsent,
    withdrawRecordingConsent,
    setConsentLanguage,
    simulatedCustomerConsentResponse,
    setSimulatedCustomerConsentResponse,
    agentInputDraft,
    setAgentInputDraft,
    currentAiSuggestion,
    submitAgentResponse,
    useAiSuggestion,
    waitingForAgent
  };
}
