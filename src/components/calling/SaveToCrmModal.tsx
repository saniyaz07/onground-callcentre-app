import React, { useState } from 'react';
import { CallWrapupOutcome } from '../../types';
import { 
  Sparkles, 
  PhoneCall, 
  ThumbsUp, 
  Calendar, 
  PhoneOutgoing, 
  CheckCircle, 
  Frown, 
  Database, 
  X 
} from 'lucide-react';

export interface SaveToCrmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onSave: (summary: string, outcome: CallWrapupOutcome) => void;
  name: string;
  durationStr: string;
  initialSummary: string;
  initialOutcome?: CallWrapupOutcome;
}

interface OutcomeOption {
  label: CallWrapupOutcome;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const OUTCOMES: OutcomeOption[] = [
  { label: 'Interested', icon: ThumbsUp, color: '#0f6e56', bg: '#e1f5ee' },
  { label: 'Follow-up needed', icon: Calendar, color: '#c8860a', bg: '#fff3d6' },
  { label: 'Requested callback', icon: PhoneOutgoing, color: '#185fa5', bg: '#e8f0fe' },
  { label: 'Resolved', icon: CheckCircle, color: '#1d9e75', bg: '#e1f5ee' },
  { label: 'Not interested', icon: Frown, color: '#e24b4a', bg: '#fdecec' }
];

export const SaveToCrmModal: React.FC<SaveToCrmModalProps> = ({
  isOpen,
  onClose,
  onSkip,
  onSave,
  name,
  durationStr,
  initialSummary,
  initialOutcome = 'Interested'
}) => {
  const [summary, setSummary] = useState<string>(initialSummary);
  const [outcome, setOutcome] = useState<CallWrapupOutcome>(initialOutcome);

  // Sync state whenever modal opens or props change
  React.useEffect(() => {
    if (isOpen) {
      setSummary(initialSummary);
      setOutcome(initialOutcome);
    }
  }, [isOpen, initialSummary, initialOutcome]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[410] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS handle bar for mobile */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors text-sm font-bold z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[#e1f5ee] flex items-center justify-center flex-shrink-0 text-[#0f6e56]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Call with {name || 'the customer'}
              </h2>
              <div className="text-xs text-slate-500 font-medium">
                {durationStr || '—'} · just now
              </div>
            </div>
          </div>

          {/* AI-drafted Summary Header */}
          <div className="flex items-center gap-1.5 mt-5 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
              AI-drafted summary — edit if needed
            </span>
          </div>

          {/* Editable AI Summary Textarea */}
          <textarea 
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            placeholder="Call summary..."
            className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0f6e56] transition-colors leading-relaxed resize-y"
          />

          {/* Outcome Heading */}
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-4 mb-2">
            Outcome
          </div>

          {/* 5 Outcome Pills */}
          <div className="flex flex-wrap gap-2 mb-2">
            {OUTCOMES.map((opt) => {
              const isSelected = outcome === opt.label;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setOutcome(opt.label)}
                  style={{
                    backgroundColor: isSelected ? opt.bg : '#ffffff',
                    borderColor: isSelected ? opt.color : '#e2e8f0',
                    color: isSelected ? opt.color : '#475569'
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    isSelected ? 'shadow-sm scale-[1.02]' : 'hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Skip & Save to CRM */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={onSkip}
              className="px-5 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => onSave(summary.trim(), outcome)}
              className="flex-1 py-3 px-5 rounded-full bg-[#0f6e56] hover:bg-[#0c5945] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Save to CRM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
