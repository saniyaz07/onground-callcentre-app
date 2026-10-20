import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useCall } from '../../context/CallContext';
import { 
  PhoneOutgoing, 
  PhoneIncoming, 
  PhoneMissed,
  History, 
  PhoneCall, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  MinusCircle,
  ListChecks,
  Clock, 
  ExternalLink,
  MessageSquare,
  Play,
  FileText,
  AlertTriangle,
  PhoneOff,
  Grid3X3,
  X
} from 'lucide-react';
import { Lead, CallLog } from '../../types';
import { calculateSopAdherence, getDemoSampleSopStages } from '../../utils/sopReviewUtils';
import { DialPadModal } from '../calling/DialPadModal';
import { PracticeCallScreen } from '../calling/PracticeCallScreen';

export const PlannerView: React.FC = () => {
  const { planSubTab, setPlanSubTab, leads, callLogs, openLeadModal } = useApp();
  const { 
    isCallActive,
    isIncomingAlert,
    callerName,
    acceptIncoming,
    declineIncoming,
    startCall, 
    triggerIncomingCall 
  } = useCall();

  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const leadsPerPage = 2;

  // Selected call for review drawer
  const [selectedCallReview, setSelectedCallReview] = useState<CallLog | null>(null);

  // Phone Keypad / Dial Pad modal state
  const [isKeypadOpen, setIsKeypadOpen] = useState<boolean>(false);

  // Pagination for leads
  const sortedLeads = [...leads].sort((a, b) => b.attractivenessScore - a.attractivenessScore);
  const totalPages = Math.max(1, Math.ceil(sortedLeads.length / leadsPerPage));
  const paginatedLeads = sortedLeads.slice((currentPage - 1) * leadsPerPage, currentPage * leadsPerPage);

  // Missed calls for Incoming tab (matching mock lines 3256-3284)
  const missedCalls = callLogs
    .filter(c => c.dir === 'missed')
    .map(c => {
      const lead = leads.find(l => c.name && (c.name.startsWith(l.name) || l.name.startsWith(c.name)));
      const value = lead ? (lead.expectedValue || 0) : (c.name === 'Unknown' ? 0 : (c.dealValue || 0));
      const signalTag = lead 
        ? (lead.icp >= 80 ? 'Visited store / in CRM' : (lead.icp >= 55 ? 'Warm lead' : 'Cold lead'))
        : 'No prior record';
      const valueTag = lead && lead.expectedValue ? `₹${lead.expectedValue.toLocaleString('en-IN')} expected` : 'New contact';
      return { call: c, lead, value, signalTag, valueTag };
    })
    .sort((a, b) => b.value - a.value);

  const totalValueAtStake = missedCalls.reduce((acc, m) => acc + m.value, 0);

  return (
    <div className="flex-1 flex flex-col bg-[#f2f2f7] text-slate-800 overflow-y-auto select-none relative">
      {/* Planner Header Gradient (Mock Exact lines 670-680) */}
      <div className="p-[14px_16px_12px] bg-gradient-to-r from-[#1a1a2e] to-[#2d2d5f] rounded-b-[18px] text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15.5px] text-[#a5b4fc]">Today's calling plan</div>
            <div className="text-[17px] font-bold text-white mt-[2px]">Planner</div>
          </div>
          <div className="text-right">
            <div className="text-[13.5px] font-extrabold text-white bg-white/[0.12] p-[5px_10px] rounded-[9px]">
              Tue, 20 Oct
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Incoming Call Alert (Mock Exact: lines 682-690) */}
      {isIncomingAlert && (
        <div 
          id="dialerIncomingCall"
          className="bg-gradient-to-r from-[#7c2d12] to-[#c2410c] m-3 rounded-2xl p-4 text-white text-center shadow-xl border border-rose-500/40 animate-pulse flex-shrink-0"
        >
          <div className="text-[12.5px] text-[#fed7aa] uppercase tracking-[0.5px] mb-1">Incoming call</div>
          <div id="dialerIncomingName" className="text-[17px] font-extrabold mb-0.5 text-white">{callerName}</div>
          <div id="dialerIncomingSub" className="text-[12.5px] text-[#fed7aa] mb-3.5">
            🎯 Intent 96 · calling from +91 98450 xxxxx
          </div>
          <div className="flex justify-center gap-5">
            <button 
              onClick={declineIncoming}
              className="w-[52px] h-[52px] rounded-full bg-[#e24b4a] hover:bg-rose-700 border-none text-white cursor-pointer flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
              title="Decline"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
            <button 
              onClick={acceptIncoming}
              className="w-[52px] h-[52px] rounded-full bg-[#1d9e75] hover:bg-emerald-600 border-none text-white cursor-pointer flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md animate-pulse"
              title="Accept & Connect"
            >
              <PhoneCall className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {isCallActive ? (
        /* PRACTICE CALL / ACTIVE CALL DUAL COLUMN VIEW (Mock Exact: lines 691-781) */
        <PracticeCallScreen />
      ) : (
        <>
          {/* Mobile Sub-Navigation Bar for Planner (Calls to make | Incoming | Recent) */}
          <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-3 py-2 gap-2 flex-shrink-0">
            <button 
              onClick={() => setPlanSubTab('outgoing')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all ${
                planSubTab === 'outgoing' ? 'bg-[#1d9e75] text-white shadow-sm' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Calls to make
            </button>
            <button 
              onClick={() => setPlanSubTab('incoming')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all relative ${
                planSubTab === 'incoming' ? 'bg-[#1d9e75] text-white shadow-sm' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <span>Incoming</span>
              {missedCalls.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                  {missedCalls.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setPlanSubTab('recent')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all ${
                planSubTab === 'recent' ? 'bg-[#1d9e75] text-white shadow-sm' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Recent
            </button>
          </div>

          {/* Main Content Area (#planPanelsWrap) */}
          <div id="planPanelsWrap" className="flex-1 flex flex-col pb-20">
        {/* TAB 1: CALLS TO MAKE (OUTGOING) */}
        {planSubTab === 'outgoing' && (
          <div className="flex flex-col">
            <div className="p-[14px_14px_4px]">
              <div className="text-[14.5px] font-extrabold text-[#1a1a1a]">Planned outgoing calls</div>
              <div className="text-[12.5px] text-[#8e8e93] mt-[1px]">
                Ranked by lead attractiveness score — tap a lead for the full picture
              </div>
            </div>

            {/* Leads Cards */}
            <div className="p-[6px_12px] flex flex-col gap-2">
              {paginatedLeads.map((lead) => {
                const isExpanded = expandedLeadId === lead.id;
                const scoreColor = lead.attractivenessScore >= 80 ? '#0f6e56' : lead.attractivenessScore >= 55 ? '#c8860a' : '#e24b4a';
                return (
                  <div 
                    key={lead.id}
                    className="bg-white border border-[#ece7fa] rounded-[13px] overflow-hidden shadow-[0_1px_4px_rgba(16,24,40,0.05)] transition-all"
                  >
                    {/* Header Row (.plan-row-head) */}
                    <div 
                      onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                      className="flex items-center gap-[10px] p-[10px_12px] cursor-pointer hover:bg-slate-50/50"
                    >
                      <div 
                        className="w-[36px] h-[36px] rounded-full flex items-center justify-center font-extrabold text-[14.5px] flex-shrink-0"
                        style={{ backgroundColor: lead.avatarBg, color: lead.avatarColor }}
                      >
                        {lead.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] font-bold text-[#1a1a1a]">{lead.name}</div>
                        <div className="text-[12.5px] text-[#8e8e93] truncate">{lead.interest}</div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div 
                          className="text-[14.5px] font-extrabold tabular"
                          style={{ color: scoreColor }}
                        >
                          {lead.attractivenessScore}
                        </div>
                        <div className="text-[11px] text-[#a8a8ad] uppercase">score</div>
                      </div>

                      <div className="text-[#c5c5c5] ml-1 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-[15px] h-[15px]" /> : <ChevronDown className="w-[15px] h-[15px]" />}
                      </div>
                    </div>

                    {/* Expandable Details Row (.plan-row-detail) */}
                    {isExpanded && (
                      <div className="p-[0_13px_14px] border-t border-[#f2eef9] animate-in fade-in duration-150">
                        <div className="text-[12.5px] font-extrabold text-[#8e8e93] uppercase tracking-[0.4px] mt-[10px] mb-1">
                          Story so far
                        </div>
                        <div className="text-[13.5px] text-[#3a3a42] leading-[1.5]">
                          {(lead.journey || []).map(j => j.text).join(' → ') || 'No prior journey logged yet.'}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-[10px]">
                          <div className="bg-[#f7f7f9] rounded-[9px] p-[8px_10px]">
                            <div className="text-[11px] font-extrabold text-[#8e8e93] uppercase">Preferred product</div>
                            <div className="text-[13px] font-bold text-[#1a1a1a] mt-[2px]">{lead.product || '—'}</div>
                          </div>
                          <div className="bg-[#f7f7f9] rounded-[9px] p-[8px_10px]">
                            <div className="text-[11px] font-extrabold text-[#8e8e93] uppercase">Cross-sell</div>
                            <div className="text-[13px] font-bold text-[#1a1a1a] mt-[2px]">{lead.crossSell || '—'}</div>
                          </div>
                        </div>

                        <div className="bg-[#fff8e1] border border-[#f5cf94] rounded-[9px] p-[8px_10px] mt-2">
                          <div className="text-[11px] font-extrabold text-[#a16207] uppercase">EMI / financing</div>
                          <div className="text-[13px] text-[#7c4a00] mt-[2px]">{lead.emi || 'Not discussed yet'}</div>
                        </div>

                        <button 
                          onClick={() => startCall(lead.name, lead.phone, lead.product, lead.expectedValue)}
                          className="w-full mt-3 p-[11px] border-none rounded-[10px] text-[14.5px] font-bold text-white bg-[#0f6e56] hover:bg-[#0c5945] cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <PhoneCall className="w-[15px] h-[15px]" />
                          <span>Place call</span>
                        </button>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2.5 mt-2 border-t border-slate-100 text-xs">
                          <button
                            onClick={() => openLeadModal(lead.id)}
                            className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                          >
                            <span>Open Full Lead Inspection Modal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-slate-400">Phone: <b>{lead.phone}</b></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls (#planOutgoingPager) */}
            <div className="flex items-center justify-center gap-3 p-[10px_12px_4px]">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-[30px] h-[30px] rounded-full border border-[#e5e5ea] bg-white cursor-pointer flex items-center justify-center disabled:opacity-40"
              >
                <ChevronLeft className="w-[15px] h-[15px] text-[#555]" />
              </button>
              <span className="text-[12.5px] font-bold text-[#6b6b74]">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-[30px] h-[30px] rounded-full border border-[#e5e5ea] bg-white cursor-pointer flex items-center justify-center disabled:opacity-40"
              >
                <ChevronRight className="w-[15px] h-[15px] text-[#555]" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING (MISSED CALLS WITH VALUE AT STAKE) */}
        {planSubTab === 'incoming' && (
          <div className="flex flex-col">
            <div className="p-[14px_14px_4px]">
              <div className="text-[14.5px] font-extrabold text-[#1a1a1a]">Missed calls</div>
              <div className="text-[12.5px] text-[#8e8e93] mt-[1px]">
                Ranked by expected value — call the highest-value leads back first
              </div>
            </div>

            {/* Summary Box (#planIncomingSummary) */}
            <div className="flex items-center gap-4 m-[8px_14px_4px] bg-[#faf9f6] rounded-[12px] p-[11px_14px]">
              <div>
                <div className="text-[18px] font-extrabold text-[#1a1a1a]">{missedCalls.length}</div>
                <div className="text-[11px] font-extrabold text-[#8e8e93] uppercase">Missed today</div>
              </div>
              <div className="w-[1px] h-[24px] bg-[#e5e5ea]" />
              <div>
                <div className="text-[18px] font-extrabold text-[#0f6e56]">₹{totalValueAtStake.toLocaleString('en-IN')}</div>
                <div className="text-[11px] font-extrabold text-[#8e8e93] uppercase">Expected value at stake</div>
              </div>
            </div>

            {/* Missed Calls List (#planIncomingList) */}
            <div className="p-[6px_12px] flex flex-col gap-2">
              {missedCalls.map(({ call, lead, signalTag, valueTag }) => (
                <div 
                  key={call.id} 
                  className="bg-white border border-[#ece7fa] rounded-[13px] overflow-hidden shadow-[0_1px_4px_rgba(16,24,40,0.05)]"
                >
                  <div className="flex items-center gap-[10px] p-[10px_12px]">
                    <div className="w-[36px] h-[36px] rounded-full bg-[#fdecec] flex items-center justify-center flex-shrink-0">
                      <PhoneMissed className="w-4 h-4 text-[#e24b4a]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[14.5px] font-bold text-[#1a1a1a]">{call.name || 'Unknown'}</div>
                      <div className="text-[12.5px] text-[#8e8e93] truncate">
                        Missed {call.time} · {signalTag}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`text-[13.5px] font-extrabold ${lead ? 'text-[#0f6e56]' : 'text-[#8e8e93]'}`}>
                        {valueTag}
                      </div>
                      <button
                        onClick={() => startCall(call.name, call.phone || '+91 98450 12345', lead?.product || 'Ortho Grid Classic', lead?.expectedValue || 14990)}
                        className="border-none bg-[#0f6e56] hover:bg-[#0c5945] text-white rounded-[7px] p-[5px_9px] text-[12px] font-bold cursor-pointer mt-[2px] flex items-center gap-1 ml-auto"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call back</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RECENT CALLS (LOG & REVIEW VS SOP) */}
        {planSubTab === 'recent' && (
          <div className="flex flex-col">
            <div className="p-[14px_14px_4px]">
              <div className="text-[14.5px] font-extrabold text-[#1a1a1a]">Recent calls</div>
              <div className="text-[12.5px] text-[#8e8e93] mt-[1px]">Tap a call to review it against SOP</div>
            </div>

            {/* Calls list (#planRecentList) */}
            <div className="p-[6px_12px] flex flex-col gap-2">
              {callLogs.map((c, i) => {
                const iconMap = {
                  in: { icon: PhoneIncoming, color: '#0f6e56', bg: '#e1f5ee' },
                  out: { icon: PhoneOutgoing, color: '#185fa5', bg: '#e8f0fe' },
                  missed: { icon: PhoneMissed, color: '#e24b4a', bg: '#fdecec' }
                };
                const m = iconMap[c.dir] || iconMap.out;
                const Icon = m.icon;
                return (
                  <div 
                    key={c.id || i}
                    onClick={() => setSelectedCallReview(c)}
                    className="bg-white border border-[#ece7fa] rounded-[13px] overflow-hidden shadow-[0_1px_4px_rgba(16,24,40,0.05)] cursor-pointer hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-[10px] p-[10px_12px]">
                      <div 
                        className="w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: m.bg }}
                      >
                        <Icon className="w-4 h-4" style={{ color: m.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] font-bold text-[#1a1a1a] flex items-center flex-wrap gap-1">
                          <span>{c.name}</span>
                          {c.outcome && (
                            <span className="text-[12.5px] font-bold text-[#0f6e56] bg-[#e1f5ee] px-1.5 py-0.5 rounded-[6px] ml-1.5">
                              {c.outcome}
                            </span>
                          )}
                        </div>
                        <div className="text-[12.5px] text-[#8e8e93]">
                          {c.time} · {c.duration}
                        </div>
                      </div>
                      <ChevronRight className="w-[15px] h-[15px] text-[#c5c5c5] flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {/* Floating Keypad button (.dialerKeypadSheet trigger matching mock lines 818-826) */}
      <div 
        onClick={() => setIsKeypadOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 w-[54px] h-[54px] rounded-full bg-gradient-to-br from-[#4338ca] to-[#6d28d9] shadow-[0_6px_20px_rgba(67,56,202,0.45)] flex items-center justify-center cursor-pointer z-[999975] hover:scale-105 active:scale-95 transition-all text-white"
        title="Open phone keypad / dial pad"
        aria-label="Open phone keypad"
      >
        <Grid3X3 className="w-[22px] h-[22px] text-white" />
      </div>

      {/* Phone Keypad / Dial Pad Modal */}
      <DialPadModal 
        isOpen={isKeypadOpen} 
        onClose={() => setIsKeypadOpen(false)} 
      />

      {/* SOP Review Drawer Sheet */}
      {selectedCallReview && (
        <div 
          className="fixed inset-0 z-[450] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCallReview(null)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a1a14] to-[#0f6e56] text-white p-5 flex items-start justify-between flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-emerald-300" />
                  <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                    Call SOP Review
                  </span>
                </div>
                <h3 className="text-xl font-extrabold mt-1 text-white flex items-center gap-2">
                  <span>{selectedCallReview.name}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                    {selectedCallReview.dir === 'in' ? 'Incoming' : selectedCallReview.dir === 'out' ? 'Outgoing' : 'Missed'}
                  </span>
                </h3>
                <div className="text-xs text-emerald-100/80 mt-1 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedCallReview.time}</span>
                  <span>·</span>
                  <span>Duration: {selectedCallReview.duration}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCallReview(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm font-bold"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Adherence Score Card */}
              {(() => {
                const stages = selectedCallReview.sopStages || getDemoSampleSopStages(selectedCallReview);
                const score = calculateSopAdherence(stages);
                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        SOP Script Adherence
                      </div>
                      <div className="text-2xl font-black mt-0.5" style={{ color: score.scoreColor }}>
                        {score.scoreLabel}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {score.completedCount} of {score.totalStages} required stages verified
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Stages List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Script Checklist & Compliance
                </h4>
                {(() => {
                  const stages = selectedCallReview.sopStages || getDemoSampleSopStages(selectedCallReview);
                  return stages.map((stg, idx) => {
                    const isHit = stg.status === 'completed';
                    return (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl border transition-all ${
                          isHit 
                            ? 'bg-emerald-50/60 border-emerald-200' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isHit ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <MinusCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="font-bold text-xs text-slate-900">{stg.label}</span>
                          </div>
                          <span 
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              isHit 
                                ? 'bg-emerald-200 text-emerald-900' 
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isHit ? 'PASSED' : 'MISSED'}
                          </span>
                        </div>
                        {stg.evidence && (
                          <div className="text-[11px] text-slate-600 mt-1 pl-6 italic">
                            "{stg.evidence}"
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Call Summary Notes */}
              {selectedCallReview.notes && (
                <div className="bg-[#fef9c3]/50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block mb-1">
                    Call Summary & CRM Note
                  </span>
                  {selectedCallReview.notes}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedCallReview(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0f6e56] text-white hover:bg-[#0c5945] transition-all"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
