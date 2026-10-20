import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useCall } from '../../context/CallContext';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  PhoneCall, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Layers,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';

export const LeadsModal: React.FC = () => {
  const { leads, activeLeadIndex, isLeadModalOpen, closeLeadModal, nextLead, prevLead } = useApp();
  const { startCall } = useCall();

  const [expandedSections, setExpandedSections] = useState<{
    buyingSignals: boolean;
    journey: boolean;
    notes: boolean;
  }>({
    buyingSignals: true,
    journey: true,
    notes: true
  });

  if (!isLeadModalOpen) return null;

  const currentLead = leads[activeLeadIndex] || leads[0];

  const toggleSection = (section: 'buyingSignals' | 'journey' | 'notes') => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm tracking-tight">Lead Inspection Card</span>
            <span className="text-xs text-slate-400 font-medium">({activeLeadIndex + 1} of {leads.length})</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Paging Buttons in Header */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button 
                onClick={prevLead}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Previous lead"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextLead}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Next lead"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button 
              id="closeLeadModalBtn"
              onClick={closeLeadModal}
              aria-label="Close lead details"
              className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lead Hero Profile Card */}
        <div className="p-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm"
                style={{ backgroundColor: currentLead.avatarBg, color: currentLead.avatarColor }}
              >
                {currentLead.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{currentLead.name}</h2>
                  <span 
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: currentLead.badgeBg, color: currentLead.badgeColor }}
                  >
                    {currentLead.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">({currentLead.phone})</span>
                </div>
                <div className="text-xs text-slate-600 mt-1 font-medium">
                  {currentLead.product} · <b className="text-slate-900">₹{currentLead.expectedValue.toLocaleString('en-IN')}</b>
                </div>
              </div>
            </div>

            {/* ICP & Intent Gauge Pills */}
            <div className="flex items-center gap-3">
              <div className="text-center bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm min-w-[80px]">
                <div className="text-xl font-extrabold text-emerald-700 tabular">{currentLead.icp}%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ICP Fit</div>
              </div>

              <div className="text-center bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl shadow-sm min-w-[80px]">
                <div className="text-xl font-extrabold text-emerald-800 tabular">{currentLead.intentScore}</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Intent Score</div>
              </div>
            </div>
          </div>

          {/* Subscores breakdown */}
          <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80">
            {currentLead.subscores.map((sub, i) => (
              <div key={i} className="bg-white p-2 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">{sub.label}</span>
                  <b className="tabular" style={{ color: sub.color }}>{sub.pct}%</b>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${sub.pct}%`, backgroundColor: sub.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Accordions */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50/50">
          {/* Section 1: Collapsible Buying Signals */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('buyingSignals')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Collapsible Buying Signals ({currentLead.problemBuckets.length})
                </span>
              </div>
              {expandedSections.buyingSignals ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSections.buyingSignals && (
              <div className="p-3.5 pt-0 flex flex-col gap-2 border-t border-slate-100">
                {currentLead.problemBuckets.map((bucket, i) => (
                  <div key={i} className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs">
                    <div className="font-bold text-purple-900 mb-0.5">{bucket.cat}</div>
                    <div className="text-slate-700 leading-relaxed">{bucket.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Journey Milestones */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('journey')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  How We Got Here · Touchpoint Journey
                </span>
              </div>
              {expandedSections.journey ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSections.journey && (
              <div className="p-3.5 pt-0 flex flex-col gap-2 border-t border-slate-100 text-xs">
                {currentLead.journey.map((m, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 min-w-[50px]">{m.date}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white bg-slate-800">
                      {m.channel}
                    </span>
                    <span className="text-slate-700 leading-tight">{m.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Agent Strategy Notes */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('notes')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Pitch & Handling Recommendations
                </span>
              </div>
              {expandedSections.notes ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSections.notes && (
              <div className="p-3.5 pt-0 flex flex-col gap-1.5 border-t border-slate-100 text-xs">
                {currentLead.notes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer (Calling Triggers & Paging) */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <button
              onClick={prevLead}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex-1 sm:flex-initial text-center"
            >
              ← Previous Lead
            </button>
            <button
              onClick={nextLead}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex-1 sm:flex-initial text-center"
            >
              Next Lead →
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <a
              href={`tel:${currentLead.phone}`}
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
              title="Opens device native phone dialer for real carrier call"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Carrier Dial</span>
            </a>

            <button
              onClick={() => {
                closeLeadModal();
                startCall(currentLead.name, currentLead.phone, currentLead.product, currentLead.expectedValue);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#1d9e75] hover:bg-[#168a65] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all animate-pulse-glow flex-1 sm:flex-initial"
              title="Starts interactive browser voice prototype"
            >
              <PhoneCall className="w-4 h-4" />
              <span>In-App Voice Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
