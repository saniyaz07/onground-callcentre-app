import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useVoiceEngine, VoiceEngineState } from '../hooks/useVoiceEngine';
import { useApp } from './AppContext';
import { generateLiveCallSopStages } from '../utils/sopReviewUtils';
import { SaveToCrmModal } from '../components/calling/SaveToCrmModal';
import { CallWrapupOutcome } from '../types';

interface CallContextType extends VoiceEngineState {
  durationStr: string;
  setLiveNotes: (notes: string) => void;
  startCall: (name: string, phone: string, product?: string, value?: number, type?: 'outgoing' | 'incoming' | 'practice') => void;
  triggerIncomingCall: (name?: string, phone?: string, product?: string, value?: number) => void;
  acceptIncoming: () => void;
  declineIncoming: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleHold: () => void;
  agentSpeakReply: (text: string, markStep?: string) => void;
  markSopDone: (stepName: string) => void;
  playDtmfTone: (f1?: number, f2?: number) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

interface WrapupModalState {
  isOpen: boolean;
  callId: string;
  name: string;
  phone: string;
  durationStr: string;
  product?: string;
  dealValue?: number;
  initialSummary: string;
  initialOutcome: CallWrapupOutcome;
}

export const CallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    addCallLog, 
    updateCallLogOutcome, 
    updateLeadOrAddFromCall, 
    setActiveTab, 
    setPlanSubTab, 
    showToast,
    leads 
  } = useApp();

  const [wrapupState, setWrapupState] = useState<WrapupModalState>({
    isOpen: false,
    callId: '',
    name: '',
    phone: '',
    durationStr: '',
    initialSummary: '',
    initialOutcome: 'Interested'
  });

  const voice = useVoiceEngine((callResult) => {
    // Generate genuine SOP adherence evaluation from real transcript and checklist milestones
    const sopStages = generateLiveCallSopStages(
      callResult.transcript || [],
      callResult.sopChecklist || [],
      callResult.durationSeconds || 0
    );

    const callId = `c-${Date.now()}`;

    // When a call ends, commit to Recent Calls with authentic contact, duration, notes and SOP evaluation
    addCallLog({
      dir: callResult.dir,
      name: callResult.name,
      time: 'Just now',
      duration: callResult.durationStr,
      phone: callResult.phone,
      dealValue: callResult.dealValue,
      notes: callResult.notes,
      sopStages,
      transcript: callResult.transcript,
      isDemoSample: false
    });

    // Auto-draft AI call summary matching mock draftAiCallSummary
    let draftedSummary = '';
    const lead = leads.find(l => callResult.name && (callResult.name.includes(l.name) || l.name.includes(callResult.name)));
    if (callResult.notes && callResult.notes.trim()) {
      draftedSummary = callResult.notes;
    } else if (lead) {
      const bucket = lead.problemBuckets && lead.problemBuckets[0] ? lead.problemBuckets[0].text : lead.interest;
      draftedSummary = `Discussed ${(lead.interest || 'their enquiry').replace('Interested: ', '')}. ${bucket}. Call lasted ${callResult.durationStr}.`;
    } else {
      draftedSummary = `Spoke with ${callResult.name || 'the customer'} for ${callResult.durationStr}. No prior lead record on file — add notes manually if needed.`;
    }

    // Open Recent Calls tab in Planner so the user immediately sees their completed call!
    setActiveTab('calls');
    setPlanSubTab('recent');

    // Trigger Save to CRM Wrapup Modal
    setWrapupState({
      isOpen: true,
      callId,
      name: callResult.name,
      phone: callResult.phone,
      durationStr: callResult.durationStr,
      dealValue: callResult.dealValue,
      initialSummary: draftedSummary,
      initialOutcome: 'Interested'
    });
  });

  const handleSaveWrapup = (summary: string, outcome: CallWrapupOutcome) => {
    // 1. Update Recent Call Log with outcome & notes
    updateCallLogOutcome(wrapupState.callId, summary, outcome);

    // 2. Update CRM Leads record with outcome & notes (persisted to localStorage)
    updateLeadOrAddFromCall({
      name: wrapupState.name,
      phone: wrapupState.phone,
      value: wrapupState.dealValue,
      summary,
      outcome,
      duration: wrapupState.durationStr
    });

    // 3. Close Modal
    setWrapupState(prev => ({ ...prev, isOpen: false }));

    // 4. Show success toast notification
    const matchedLead = leads.find(l => wrapupState.name && (wrapupState.name.includes(l.name) || l.name.includes(wrapupState.name)));
    const closingChance = matchedLead ? Math.round(matchedLead.attractivenessScore || matchedLead.intentScore || 85) : 85;
    showToast(`Nice work! Saved to CRM — ${wrapupState.name} (Estimated chance of closing: ${closingChance}%)`);
  };

  const handleSkipWrapup = () => {
    setWrapupState(prev => ({ ...prev, isOpen: false }));
  };

  const handleStartCall = React.useCallback(
    (name: string, phone: string, product?: string, value?: number, type?: 'outgoing' | 'incoming' | 'practice') => {
      setActiveTab('calls');
      voice.startCall(name, phone, product, value, type);
    },
    [setActiveTab, voice]
  );

  const handleAcceptIncoming = React.useCallback(() => {
    setActiveTab('calls');
    voice.acceptIncoming();
  }, [setActiveTab, voice]);

  const callContextValue = React.useMemo(
    () => ({
      ...voice,
      startCall: handleStartCall,
      acceptIncoming: handleAcceptIncoming
    }),
    [voice, handleStartCall, handleAcceptIncoming]
  );

  return (
    <CallContext.Provider value={callContextValue}>
      {children}
      <SaveToCrmModal
        isOpen={wrapupState.isOpen}
        onClose={handleSkipWrapup}
        onSkip={handleSkipWrapup}
        onSave={handleSaveWrapup}
        name={wrapupState.name}
        durationStr={wrapupState.durationStr}
        initialSummary={wrapupState.initialSummary}
        initialOutcome={wrapupState.initialOutcome}
      />
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCall must be used within a CallProvider');
  return context;
};
