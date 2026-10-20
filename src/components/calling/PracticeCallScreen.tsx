import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useCall } from '../../context/CallContext';
import { 
  Trophy, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Radio, 
  Volume2, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Circle, 
  Check, 
  Clock, 
  ExternalLink,
  MessageSquare,
  FileText,
  HelpCircle,
  Flag
} from 'lucide-react';
import { Lead } from '../../types';

const CANONICAL_SOP_STAGES = [
  { key: 'opening', label: 'Opening & Intent Confirm' },
  { key: 'needs', label: 'Needs Discovery' },
  { key: 'pitch', label: 'Product Pitch' },
  { key: 'financing', label: 'EMI / Financing Mention' },
  { key: 'warranty', label: 'Warranty Mention' },
  { key: 'closing', label: 'Closing / Callback Booking' }
];

const AI_QUICK_REPLIES = [
  'Send price on WhatsApp',
  'Offer callback slot',
  'Explain warranty terms',
  'Escalate to manager'
];

const AI_ANSWER_KB = [
  { match: ['return', 'refund', 'trial'], answer: 'Every mattress comes with a 100-night home trial — full refund if it\'s not the right fit, no questions asked.' },
  { match: ['warranty'], answer: 'Standard warranty is 10 years against manufacturing defects, extendable on select models.' },
  { match: ['deliver', 'shipping'], answer: 'Delivery is 2–3 business days within city limits, up to 7 days elsewhere. Installation is included.' },
  { match: ['emi', 'installment', 'installement', 'finance', 'financing'], answer: 'We offer 0% interest EMI from 3 to 24 months depending on order value — no processing fee.' },
  { match: ['discount', 'offer', 'coupon', 'code'], answer: 'The price shown already reflects the best current offer — no additional codes stack on top of it.' },
  { match: ['exchange', 'old mattress', 'pickup'], answer: 'We pick up and recycle the old mattress free of charge on delivery of the new one, if requested at checkout.' }
];

export const PracticeCallScreen: React.FC = () => {
  const { leads } = useApp();
  const {
    callerName,
    callerPhone,
    callerProduct,
    callerValue,
    callType,
    durationStr,
    isMuted,
    isOnHold,
    sentiment,
    sentimentPct,
    transcript,
    sopChecklist,
    liveNotes,
    setLiveNotes,
    isRecognizing,
    micPermission,
    isAiSpeaking,
    micDiagnostics,
    interimTranscript,
    endCall,
    toggleMute,
    toggleHold,
    agentSpeakReply,
    markSopDone,
    consentRecord,
    openConsentModal,
    agentInputDraft,
    setAgentInputDraft,
    currentAiSuggestion,
    submitAgentResponse,
    useAiSuggestion,
    waitingForAgent
  } = useCall();

  const [askAiQuery, setAskAiQuery] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [manualSopDone, setManualSopDone] = useState<Record<string, boolean>>({});

  // Match the lead record or synthesize a high-fidelity record
  const currentLead: Lead = useMemo(() => {
    const found = leads.find(l => callerName && (callerName.includes(l.name) || l.name.includes(callerName)));
    if (found) return found;

    return {
      id: 'demo-lead-practice',
      name: callerName || 'Mukunda R.',
      initials: (callerName || 'Mukunda R.').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MR',
      avatarBg: '#dcfce7',
      avatarColor: '#166534',
      phone: callerPhone || '+91 98450 12345',
      attractivenessScore: 88,
      intentScore: 88,
      interest: `Interested: ${callerProduct || 'Ortho GRID'} · ₹${(callerValue || 18490).toLocaleString('en-IN')}`,
      product: callerProduct || 'Ortho GRID Mattress',
      expectedValue: callerValue || 18490,
      crossSell: 'Contour Pillows (2-pack) · ₹2,999',
      emi: '0% EMI from ₹1,540/mo',
      icp: 92,
      icpColor: '#0f6e56',
      subscores: [
        { label: 'Budget fit', pct: 92, color: '#0f6e56' },
        { label: 'Need match', pct: 88, color: '#185fa5' },
        { label: 'Decision stage', pct: 75, color: '#c8860a' }
      ],
      journey: [
        { channel: 'WhatsApp', date: 'Yesterday', icon: '💬', color: '#1d9e75', text: 'Enquired about Ortho GRID dimensions, firmness, and trial policy.' },
        { channel: 'Store Visit', date: '3 days ago', icon: '🏬', color: '#6d28d9', text: 'Tested King size firm mattress at RT Nagar store for 15 mins.' }
      ],
      problemBuckets: [
        { cat: 'Quotation Demanded', text: 'Requested itemized quote including GST, delivery timeline, and warranty terms.' },
        { cat: 'Financing Preference', text: 'Customer is comparing 12-month 0% interest credit card options without down payment.' }
      ],
      notes: [
        'Customer is comparing Ortho GRID with memory foam. Emphasize medical-grade polymer spine support and 100-night trial.'
      ],
      badge: 'High Intent',
      badgeBg: '#e1f5ee',
      badgeColor: '#0f6e56',
      statusLabel: 'Pending follow-up',
      statusColor: '#0f6e56',
      quoteOn: true,
      slaNote: 'SLA: Call within 2 hrs',
      actions: 'Call now'
    };
  }, [leads, callerName, callerPhone, callerProduct, callerValue]);

  // Evaluate dynamic SOP stage completion from transcript text and checklist
  const transcriptCombined = useMemo(() => {
    return transcript.map(t => `${t.speaker}: ${t.text}`).join(' ').toLowerCase();
  }, [transcript]);

  const liveSopStatus = useMemo(() => {
    const isStepHit = (stepQuery: string) => sopChecklist.some(s => s.step.toLowerCase().includes(stepQuery.toLowerCase()) && s.done);

    const opening = manualSopDone['opening'] || isStepHit('warm greeting') || transcriptCombined.includes('hello') || transcriptCombined.includes('calling') || transcriptCombined.includes('sleep company') || transcriptCombined.includes('namaste');
    const needs = manualSopDone['needs'] || isStepHit('validate') || isStepHit('acknowledge') || transcriptCombined.includes('looking for') || transcriptCombined.includes('firmness') || transcriptCombined.includes('comparison') || transcriptCombined.includes('price');
    const pitch = manualSopDone['pitch'] || isStepHit('smartgrid') || transcriptCombined.includes('smartgrid') || transcriptCombined.includes('grid layer') || transcriptCombined.includes('pressure relief') || transcriptCombined.includes('spine');
    const financing = manualSopDone['financing'] || isStepHit('emi') || transcriptCombined.includes('emi') || transcriptCombined.includes('0%') || transcriptCombined.includes('pay it off') || transcriptCombined.includes('installment');
    const warranty = manualSopDone['warranty'] || transcriptCombined.includes('warranty') || transcriptCombined.includes('10-year') || transcriptCombined.includes('100-night') || transcriptCombined.includes('trial');
    const closing = manualSopDone['closing'] || isStepHit('lock') || isStepHit('commitment') || transcriptCombined.includes('go ahead') || transcriptCombined.includes('delivery') || transcriptCombined.includes('callback') || transcriptCombined.includes('order');

    return {
      opening,
      needs,
      pitch,
      financing,
      warranty,
      closing
    };
  }, [sopChecklist, transcriptCombined, manualSopDone]);

  // SOP Nudge: Trigger genuine coaching alert if agent drifts off SOP
  const sopNudge = useMemo(() => {
    if (liveSopStatus.pitch && !liveSopStatus.financing) {
      return {
        title: 'Drifting off SOP',
        text: "EMI hasn't come up yet and the pitch is done — this customer responds well to financing options. Mention the no-cost EMI plan before moving to close."
      };
    }
    if (liveSopStatus.financing && !liveSopStatus.warranty) {
      return {
        title: 'Drifting off SOP',
        text: "Warranty hasn't been mentioned — worth reinforcing the 10-year warranty to close the price conversation with confidence."
      };
    }
    return null;
  }, [liveSopStatus]);

  // Live drafted summary sentence by sentence as conversation advances
  const liveSummaryText = useMemo(() => {
    const agentStatements = transcript
      .filter(t => t.speaker === 'Agent')
      .map(t => t.text.replace(/^(Namaste!?|Hi |Hello,?|Great —?|Sure —?)/i, '').trim());

    if (agentStatements.length === 0) {
      return 'Building as the call progresses…';
    }
    return `Discussed ${currentLead.product}. ` + agentStatements.slice(-3).join(' ');
  }, [transcript, currentLead]);

  // Gamification metrics
  const dealValueStr = `₹${(currentLead.expectedValue || 18490).toLocaleString('en-IN')}`;
  const ogScoreBoost = Math.max(4, Math.round((currentLead.intentScore || 80) / 12));
  const leaderboardRank = Math.max(1, 3 - Math.floor(ogScoreBoost / 3));

  const handleAskAi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!askAiQuery.trim()) return;
    const qLower = askAiQuery.toLowerCase();
    
    // Check lead notes
    let matchedAnswer: string | null = null;
    if (currentLead.notes && currentLead.notes.length) {
      const hit = currentLead.notes.find(n => qLower.split(' ').some(w => w.length > 3 && n.toLowerCase().includes(w)));
      if (hit) matchedAnswer = hit;
    }

    if (!matchedAnswer) {
      const kbHit = AI_ANSWER_KB.find(k => k.match.some(m => qLower.includes(m)));
      if (kbHit) matchedAnswer = kbHit.answer;
    }

    if (!matchedAnswer) {
      matchedAnswer = `Grounded guidance for ${callerName}: Recommend emphasizing medical-grade SmartGRID spine alignment, 100-night trial, and 12-month 0% EMI.`;
    }

    setAiAnswer(matchedAnswer);
    setAskAiQuery('');
  };

  const handleToggleSopPill = (key: string) => {
    setManualSopDone(prev => ({ ...prev, [key]: !prev[key] }));
    const stage = CANONICAL_SOP_STAGES.find(s => s.key === key);
    if (stage) {
      markSopDone(stage.label);
    }
  };

  const completedSopCount = Object.values(liveSopStatus).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col lg:flex-row items-start gap-3 p-3 select-none w-full max-w-full">
      {/* ======================================================== */}
      {/* LEFT COLUMN: ACTIVE CALL CONTROLLER + LIVE TRANSCRIPT    */}
      {/* ======================================================== */}
      <div className="flex-1 min-w-0 flex flex-col gap-3 w-full">
        {/* 1. Active Call Controller Banner (Mock Exact: linear-gradient(135deg, #0a2e1a, #0f6e56)) */}
        <div 
          id="dialerActiveCall"
          className="bg-gradient-to-r from-[#0a2e1a] to-[#0f6e56] rounded-2xl p-4 text-center text-white shadow-lg border border-emerald-700/40"
        >
          <div className="text-[12.5px] font-extrabold uppercase tracking-[0.5px] text-[#a8dcc4] mb-1">
            {isOnHold ? 'CALL ON HOLD' : 'CALL IN PROGRESS'}
          </div>
          <div id="dialerActiveName" className="text-[17px] font-extrabold mb-0.5 text-white">
            {callerName}
          </div>
          <div id="dialerActiveTimer" className="text-[22px] font-extrabold tabular mb-2 text-emerald-200 tracking-wider">
            {durationStr}
          </div>

          {/* Sentiment Gauge */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-[12.5px] text-[#c9ede0]">Sentiment</span>
            <div className="w-[70px] h-[5px] rounded-[3px] bg-white/20 overflow-hidden">
              <div 
                id="sentimentFill"
                className="h-full rounded-[3px] transition-all duration-500"
                style={{ 
                  width: `${sentimentPct}%`,
                  backgroundColor: sentimentPct >= 65 ? '#5dcaa5' : sentimentPct >= 40 ? '#e0b04a' : '#e2694b'
                }}
              />
            </div>
            <span 
              id="sentimentLabel" 
              className="text-[12.5px] font-bold"
              style={{ color: sentimentPct >= 65 ? '#5dcaa5' : sentimentPct >= 40 ? '#e0b04a' : '#e2694b' }}
            >
              {sentiment}
            </span>
          </div>

          {/* DPDP Consent Status Gate */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <button
              onClick={openConsentModal}
              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
                consentRecord?.status === 'granted'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/80 hover:bg-emerald-900/80'
                  : consentRecord?.status === 'declined'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-600/80 hover:bg-rose-900/80'
                  : 'bg-amber-950/80 text-amber-300 border-amber-600/80 hover:bg-amber-900/80'
              }`}
              title="Click to view or update DPDP Voice Recording Consent"
            >
              {consentRecord?.status === 'granted' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : consentRecord?.status === 'declined' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>
                {consentRecord?.status === 'granted'
                  ? `Consent ${consentRecord.consentId?.slice(-6) || 'CR-2026'} · Rec ON`
                  : consentRecord?.status === 'declined'
                  ? 'Consent: Declined (Rec OFF)'
                  : 'Consent: Pending (Rec OFF)'}
              </span>
            </button>
          </div>

          {/* Audio Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`w-[46px] h-[46px] rounded-full border-none text-white flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isMuted ? 'bg-[#e24b4a] ring-2 ring-rose-400' : 'bg-white/15 hover:bg-white/25'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-[18px] h-[18px]" /> : <Mic className="w-[18px] h-[18px]" />}
            </button>

            <button
              onClick={toggleHold}
              className={`w-[46px] h-[46px] rounded-full border-none text-white flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isOnHold ? 'bg-[#c8860a] ring-2 ring-amber-400 animate-pulse' : 'bg-white/15 hover:bg-white/25'
              }`}
              title={isOnHold ? 'Resume call' : 'Hold call'}
              aria-label={isOnHold ? 'Resume call' : 'Hold call'}
            >
              {isOnHold ? <Play className="w-[18px] h-[18px] fill-current" /> : <Pause className="w-[18px] h-[18px]" />}
            </button>

            <button
              onClick={endCall}
              className="w-[46px] h-[46px] rounded-full border-none text-white bg-[#e24b4a] hover:bg-rose-700 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              title="End Call & Save to CRM"
              aria-label="End call"
            >
              <PhoneOff className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* 2. Audio & Microphone Status Strip */}
        <div className={`px-3.5 py-2 rounded-xl border flex items-center justify-between text-xs transition-colors shadow-sm ${
          isOnHold 
            ? 'bg-amber-950/80 border-amber-600/70 text-amber-200' 
            : isMuted 
            ? 'bg-amber-950/60 border-amber-700/50 text-amber-200'
            : micPermission === 'denied'
            ? 'bg-rose-950/70 border-rose-700/60 text-rose-200'
            : isAiSpeaking 
            ? 'bg-blue-950/70 border-blue-700/60 text-blue-200'
            : isRecognizing
            ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-200'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            {isOnHold ? (
              <Pause className="w-3.5 h-3.5 text-amber-400 fill-current" />
            ) : isMuted ? (
              <MicOff className="w-3.5 h-3.5 text-amber-400" />
            ) : micPermission === 'denied' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            ) : isAiSpeaking ? (
              <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            ) : isRecognizing ? (
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            ) : (
              <Radio className="w-3.5 h-3.5 text-slate-400" />
            )}

            <span className="font-semibold text-[11.5px]">
              {isOnHold 
                ? 'Call on Hold · Audio recognition suspended.' 
                : isMuted 
                ? 'Microphone Muted · Voice not captured.'
                : micPermission === 'denied'
                ? 'Microphone blocked by browser · Use Quick Speak below.'
                : isAiSpeaking 
                ? 'Customer speaking...' 
                : isRecognizing
                ? 'Microphone Listening · Speak or type response below'
                : 'Voice recognition ready'}
            </span>
          </div>

          {interimTranscript && (
            <span className="text-[10.5px] italic text-emerald-300 truncate max-w-[200px]">
              Hearing: "{interimTranscript}"
            </span>
          )}
        </div>

        {/* 3. Live Streaming Transcript Container (Mock Exact: #dialerLiveTranscript) */}
        <div 
          id="dialerLiveTranscript" 
          className="bg-[#12151c] rounded-2xl border border-[#262b38] overflow-hidden flex flex-col shadow-inner"
        >
          {/* Header */}
          <div className="p-[10px_14px] flex items-center justify-between border-b border-[#262b38]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5dcaa5] animate-ping" />
              <span className="text-[12.5px] font-extrabold text-[#e5e5ea] uppercase tracking-[0.4px]">
                Live Transcript
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-bold">
              {transcript.length} turns
            </span>
          </div>

          {/* Transcript Lines Area */}
          <div 
            id="transcriptLines"
            className="p-[12px_14px] max-h-[380px] min-h-[200px] overflow-y-auto flex flex-col gap-2.5"
          >
            {transcript.map((line) => {
              const isAgent = line.speaker === 'Agent';
              return (
                <div 
                  key={line.id} 
                  className={`flex gap-2 ${isAgent ? '' : 'flex-row-reverse'}`}
                >
                  <div 
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-extrabold flex-shrink-0"
                    style={{ 
                      backgroundColor: isAgent ? '#1d2a1f' : '#2a3252',
                      color: isAgent ? '#5dcaa5' : '#aab4dd'
                    }}
                  >
                    {isAgent ? 'AR' : 'C'}
                  </div>

                  <div className="max-w-[82%]">
                    <div 
                      className="text-[11.5px] text-[#6b7280] mb-[2px]"
                      style={{ textAlign: isAgent ? 'left' : 'right' }}
                    >
                      {isAgent ? 'You' : 'Customer'}
                    </div>
                    <div 
                      className="text-[13.5px] leading-[1.45] text-[#dcdad1] p-[8px_11px]"
                      style={{ 
                        backgroundColor: isAgent ? '#1a1f2b' : '#1f2540',
                        borderRadius: isAgent ? '4px 12px 12px 12px' : '12px 4px 12px 12px'
                      }}
                    >
                      {line.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Suggested Response Banner */}
          {currentAiSuggestion && (
            <div className="m-2 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-start justify-between gap-2 shadow-inner">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
                    AI Suggested Response
                  </div>
                  <div className="text-xs text-slate-200 mt-0.5 leading-snug break-words">
                    "{currentAiSuggestion}"
                  </div>
                </div>
              </div>
              <button
                onClick={useAiSuggestion}
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1 flex-shrink-0"
              >
                <Sparkles className="w-3 h-3" />
                <span>Insert</span>
              </button>
            </div>
          )}

          {/* Human Agent Response Composer */}
          <div className="p-3 bg-[#0d1017] border-t border-[#262b38] flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>Agent Response Composer · Speak or type</span>
              {agentInputDraft && (
                <button
                  onClick={() => setAgentInputDraft('')}
                  className="text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={agentInputDraft}
                onChange={(e) => setAgentInputDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (agentInputDraft.trim()) {
                      submitAgentResponse(agentInputDraft);
                    }
                  }
                }}
                placeholder="Speak into microphone or type your response here..."
                className="flex-1 bg-[#141923] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-sans"
              />
              <button
                onClick={() => submitAgentResponse(agentInputDraft)}
                disabled={!agentInputDraft.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  agentInputDraft.trim()
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
                title="Send your response (Enter)"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>

            {/* Quick Speak Fallback Actions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Speak:</span>
              {[
                { label: '0% EMI 12-Month Plan', text: 'We offer an exclusive 0% interest 12-month EMI plan starting at just ₹1,540 per month.' },
                { label: '100-Night Trial', text: 'You get our full 100-night risk-free trial right at home with 100% money-back guarantee.' },
                { label: 'Free Pillow Bundle', text: 'If you order today, I can bundle 2 orthopedic contour pillows worth ₹2,999 completely free.' }
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => agentSpeakReply(btn.text)}
                  className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-emerald-300 text-[10.5px] font-semibold border border-slate-700 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: AI ASSIST (PURPLE BANNER + CASE HISTORY)    */}
      {/* ======================================================== */}
      <div 
        id="dialerAiAssistCol"
        className="w-full lg:w-[380px] min-w-0 flex-shrink-0 max-h-none lg:max-h-[720px] overflow-visible lg:overflow-y-auto"
      >
        <div 
          id="dialerAiAssist"
          className="bg-white rounded-[18px] border border-[#e5e5ea] shadow-[0_4px_20px_rgba(76,29,149,0.1)] overflow-hidden"
        >
          {/* Top Purple Banner (Mock Exact: linear-gradient(120deg,#4c1d95,#6d28d9 60%,#8b5cf6)) */}
          <div className="bg-gradient-to-r from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6] p-[12px_16px] flex items-center gap-2 relative overflow-hidden">
            <div className="w-7 h-7 rounded-[9px] bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-extrabold text-white">AI Assist</span>
            <span className="ml-auto flex items-center gap-1 text-[12.5px] text-white font-extrabold uppercase tracking-[0.4px] bg-white/16 px-[9px] py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5dcaa5] animate-ping" />
              Live
            </span>
          </div>

          {/* Gamify Strip (#aiAssistGamifyStrip) */}
          <div 
            id="aiAssistGamifyStrip"
            className="flex items-center gap-2 sm:gap-3.5 p-[8px_12px] sm:p-[9px_16px] bg-gradient-to-r from-[#0a1a14] via-[#0f3d2f] to-[#0f6e56] border-b border-white/10 flex-wrap sm:flex-nowrap"
          >
            <Trophy className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
            <div className="flex gap-2.5 sm:gap-4 flex-1 flex-wrap sm:flex-nowrap items-center text-xs sm:text-sm">
              <div className="whitespace-nowrap">
                <span id="aiGamifyValue" className="text-xs sm:text-[15px] font-extrabold text-white">{dealValueStr}</span>
                <span className="text-[11px] sm:text-[12.5px] text-[#9fe1cb] font-semibold ml-1">unlock</span>
              </div>
              <div className="whitespace-nowrap">
                <span id="aiGamifyPts" className="text-xs sm:text-[15px] font-extrabold text-[#FFD700]">+{ogScoreBoost}</span>
                <span className="text-[11px] sm:text-[12.5px] text-[#9fe1cb] font-semibold ml-1">OG Score™</span>
              </div>
              <div className="whitespace-nowrap">
                <span id="aiGamifyRank" className="text-xs sm:text-[15px] font-extrabold text-white">#{leaderboardRank}</span>
                <span className="text-[11px] sm:text-[12.5px] text-[#9fe1cb] font-semibold ml-1">rank if closed</span>
              </div>
            </div>
          </div>

          {/* 1. Main Objective — What to Offer (Mock Exact: #aiAssistPreCall) */}
          <div className="p-[13px_16px_4px]">
            <div className="text-[12.5px] font-extrabold text-[#a3660a] uppercase tracking-[0.4px] mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Main objective — what to offer</span>
            </div>

            <div id="aiAssistPreCall" className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <div className="text-2xl flex-shrink-0">🛏️</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-extrabold text-[#1a1a1a]">
                    {currentLead.product} · {dealValueStr}
                  </div>
                  <div className="text-[12px] text-[#8e8e93] leading-[1.35] mt-[1px]">
                    {currentLead.interest || 'Highest-intent product in this thread'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                {currentLead.crossSell && (
                  <div className="flex-1 min-w-0 bg-[#f7f7f9] rounded-lg p-[6px_9px]">
                    <div className="text-[10px] font-extrabold tracking-[0.4px] text-[#0f6e56] uppercase mb-[1px]">
                      🔁 Cross-sell this
                    </div>
                    <div className="text-[13px] font-bold text-[#1a1a1a] truncate">
                      {currentLead.crossSell}
                    </div>
                  </div>
                )}
                {currentLead.emi && (
                  <div className="flex-1 min-w-0 bg-[#f7f7f9] rounded-lg p-[6px_9px]">
                    <div className="text-[10px] font-extrabold tracking-[0.4px] text-[#0f6e56] uppercase mb-[1px]">
                      💳 Offer this EMI
                    </div>
                    <div className="text-[13px] font-bold text-[#1a1a1a] truncate">
                      {currentLead.emi}
                    </div>
                  </div>
                )}
              </div>

              {/* Buying Intent / Problem Badges */}
              {currentLead.problemBuckets && currentLead.problemBuckets.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {currentLead.problemBuckets.map((b, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center gap-1 text-[12px] font-bold text-[#1a1a1a] bg-[#fff3d6] rounded-xl px-2.5 py-1"
                    >
                      <Flag className="w-3 h-3 text-[#c8860a] fill-[#c8860a]" />
                      <span>{b.cat}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. SOP Checklist — This Call (Mock Exact: #liveSopChecklist + #sopNudgeBox) */}
          <div className="p-[10px_16px_4px]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[12.5px] font-extrabold text-[#3a3a42] uppercase tracking-[0.4px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7c3aed]" />
                <span>SOP checklist — this call</span>
              </div>
              <span className="text-[11px] font-extrabold text-[#7c3aed]">
                {completedSopCount} / {CANONICAL_SOP_STAGES.length}
              </span>
            </div>

            <div id="liveSopChecklist" className="flex flex-wrap gap-1.5 mb-2">
              {CANONICAL_SOP_STAGES.map((stg) => {
                const isDone = (liveSopStatus as any)[stg.key];
                return (
                  <button
                    key={stg.key}
                    onClick={() => handleToggleSopPill(stg.key)}
                    className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-[14px] transition-all cursor-pointer border-none ${
                      isDone 
                        ? 'bg-[#e1f5ee] text-[#0f6e56]' 
                        : 'bg-[#f2f2f7] text-[#8e8e93] hover:bg-slate-200'
                    }`}
                    title="Click to toggle SOP checklist milestone"
                  >
                    {isDone ? (
                      <Check className="w-3 h-3 text-[#0f6e56]" />
                    ) : (
                      <Circle className="w-2.5 h-2.5 text-[#8e8e93]" />
                    )}
                    <span>{stg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SOP Drifting Nudge Banner */}
            {sopNudge && (
              <div 
                id="sopNudgeBox"
                className="mt-2 bg-gradient-to-r from-[#fff8e1] to-[#fffbf0] border border-[#f5cf94] rounded-xl p-2.5 shadow-sm"
              >
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 text-[#a16207] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[12px] font-extrabold text-[#a16207] uppercase tracking-[0.3px] mb-0.5">
                      {sopNudge.title}
                    </div>
                    <div className="text-[13px] text-[#7c4a00] leading-[1.45]">
                      {sopNudge.text}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Ask AI About This Call */}
          <div className="p-[10px_16px_14px]">
            <div className="text-[12.5px] font-bold text-[#6d28d9] uppercase tracking-[0.4px] mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI about this call</span>
            </div>

            <form onSubmit={handleAskAi} className="flex gap-1.5 mb-2">
              <input
                id="aiAssistAskInput"
                type="text"
                value={askAiQuery}
                onChange={(e) => setAskAiQuery(e.target.value)}
                placeholder="e.g. return policy? competitor difference?"
                className="flex-1 text-[13px] text-[#1a1a1a] bg-[#faf9f6] border border-[#e4d9fc] rounded-[10px] px-3 py-2 font-sans focus:outline-none focus:border-[#6d28d9]"
              />
              <button
                type="submit"
                className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white border-none rounded-[10px] px-3.5 flex items-center justify-center cursor-pointer transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Suggested Tip Box (#aiAssistSuggested) */}
            <div 
              id="aiAssistSuggested"
              className="text-[13.5px] text-[#1a1a1a] leading-[1.55] bg-gradient-to-r from-[#f7f4ff] to-[#f1ecff] border border-[#e4d9fc] rounded-xl p-[10px_12px] mb-3 font-medium"
            >
              {aiAnswer ? (
                <div>
                  <div className="text-[11px] text-[#8e8e93] mb-1">Grounded AI Answer:</div>
                  💡 {aiAnswer}
                </div>
              ) : (
                <div>
                  💡 <b>Tip:</b> {currentLead.notes && currentLead.notes.length ? currentLead.notes[0] : 'Customer is comparing prices. Highlight 100-night trial and 0% EMI.'}
                </div>
              )}
            </div>

            {/* Quick Replies (#aiAssistQuickReplies) */}
            <div id="aiAssistQuickReplies" className="flex gap-1.5 flex-wrap mb-4">
              {AI_QUICK_REPLIES.map((r, i) => (
                <span
                  key={i}
                  onClick={() => setAgentInputDraft(r)}
                  className="text-[12.5px] font-bold text-[#4c1d95] bg-[#f1ecff] border border-[#ddc9fb] rounded-2xl px-2.5 py-1 cursor-pointer hover:bg-[#e4d9fc] transition-colors"
                >
                  {r}
                </span>
              ))}
            </div>

            {/* 4. Live Call Summary Drafting */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-[#7c3aed]" />
              <div className="text-[12px] font-extrabold text-[#3a3a42] uppercase tracking-[0.4px]">
                Summary, drafting as you talk
              </div>
            </div>
            <div 
              id="liveSummaryBox"
              className="text-[13px] text-[#4b4b52] leading-[1.5] bg-[#faf9f6] border border-dashed border-[#ddd6ea] rounded-xl p-2.5 mb-4 min-h-[44px]"
            >
              {liveSummaryText}
            </div>

            {/* 5. Case History (#aiAssistCaseHistory) */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="text-[12px] font-extrabold text-[#3a3a42] uppercase tracking-[0.4px]">
                📋 Case History
              </div>
            </div>

            <div id="aiAssistCaseHistory" className="flex flex-col gap-2.5">
              {/* Intent Score & ICP Gauge */}
              <div className="bg-[#f7f7fb] rounded-xl p-3">
                <div className="flex items-center gap-2.5 mb-2">
                  <div 
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `conic-gradient(${currentLead.icpColor || '#1d9e75'} ${currentLead.icp || 88}%, #e5e5ea 0)` }}
                  >
                    <div className="w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center text-[11px] font-extrabold" style={{ color: currentLead.icpColor || '#1d9e75' }}>
                      {currentLead.icp || 88}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-bold text-[#1a1a1a]">
                      Intent Score {currentLead.intentScore || 88}/100
                    </div>
                    <div className="text-[12px] text-[#8e8e93]">
                      ICP fit {currentLead.icp || 88}%
                    </div>
                  </div>
                </div>

                {/* Subscores */}
                {currentLead.subscores && (
                  <div className="flex flex-col gap-1.5">
                    {currentLead.subscores.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[11.5px] text-[#5c5c66] w-[80px] flex-shrink-0">{s.label}</span>
                        <div className="flex-1 h-[5px] bg-[#e5e5ea] rounded-[3px] overflow-hidden">
                          <div className="h-full rounded-[3px]" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                        </div>
                        <span className="text-[11.5px] font-bold w-[26px] text-right flex-shrink-0" style={{ color: s.color }}>
                          {s.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cross-channel journey */}
              {currentLead.journey && currentLead.journey.length > 0 && (
                <div>
                  <div className="text-[12px] font-bold text-[#8e8e93] uppercase tracking-[0.4px] mb-1.5">
                    How they've interacted with us
                  </div>
                  <div className="flex flex-col gap-2">
                    {currentLead.journey.map((j, i) => {
                      const isLast = i === currentLead.journey!.length - 1;
                      return (
                        <div key={i} className="flex gap-2">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div 
                              className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px]"
                              style={{ backgroundColor: `${j.color}22` }}
                            >
                              {j.icon}
                            </div>
                            {!isLast && <div className="w-[2px] flex-1 bg-[#e5e5ea] my-1" />}
                          </div>
                          <div className="flex-1 pb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[12.5px] font-bold text-[#1a1a1a]">{j.channel}</span>
                              <span className="text-[11.5px] text-[#a8a8ad]">{j.date}</span>
                            </div>
                            <div className="text-[12px] text-[#5c5c66] mt-0.5 leading-[1.4]">
                              {j.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Likes / concerns (problemBuckets) */}
              {currentLead.problemBuckets && currentLead.problemBuckets.length > 0 && (
                <div>
                  <div className="text-[12px] font-bold text-[#8e8e93] uppercase tracking-[0.4px] mb-1.5">
                    What they liked / are concerned about
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {currentLead.problemBuckets.map((p, i) => (
                      <div 
                        key={i}
                        className="bg-white border border-[#ece7fa] border-l-[3px] border-l-[#7c3aed] rounded-lg p-2"
                      >
                        <div className="text-[11.5px] font-extrabold text-[#6d28d9] uppercase tracking-[0.3px] mb-0.5">
                          {p.cat}
                        </div>
                        <div className="text-[12px] text-[#3a3a42] leading-[1.4]">
                          {p.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Deal-Closing Panel (Gamified Expected Value Unlock) */}
              <div className="bg-gradient-to-r from-[#0a1a14] via-[#0f3d2f] to-[#0f6e56] rounded-2xl p-4 text-white relative overflow-hidden shadow-lg mt-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Trophy className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-[12px] font-extrabold uppercase tracking-[0.4px] text-white">
                    Close this, unlock
                  </span>
                </div>

                <div className="flex items-center justify-between relative z-10 mb-3">
                  <div>
                    <div className="text-[18px] font-extrabold text-white">{dealValueStr}</div>
                    <div className="text-[11.5px] text-[#9fe1cb] font-semibold">Deal value</div>
                  </div>
                  <div>
                    <div className="text-[18px] font-extrabold text-[#FFD700]">+{ogScoreBoost} pts</div>
                    <div className="text-[11.5px] text-[#9fe1cb] font-semibold">OG Score™ boost</div>
                  </div>
                  <div>
                    <div className="text-[18px] font-extrabold text-white">#{leaderboardRank}</div>
                    <div className="text-[11.5px] text-[#9fe1cb] font-semibold">Leaderboard rank</div>
                  </div>
                </div>

                <button
                  onClick={endCall}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1d9e75] to-[#10b981] hover:from-[#178562] hover:to-[#059669] text-white font-extrabold text-xs shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer relative z-10"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Close Deal & Save to CRM</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
