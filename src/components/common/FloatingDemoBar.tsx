import React, { useState } from 'react';
import { useCall } from '../../context/CallContext';
import { useApp } from '../../context/AppContext';
import { 
  Phone, 
  PhoneOutgoing, 
  ShieldCheck, 
  X,
  MessageSquare,
  MicOff,
  Square,
  UserCheck,
  UserPlus
} from 'lucide-react';

export const FloatingDemoBar: React.FC = () => {
  const { isCallActive, startCall, callerName, durationStr, withdrawRecordingConsent } = useCall();
  const { leads, showToast } = useApp();
  const [dpdpSheetOpen, setDpdpSheetOpen] = useState<boolean>(false);

  const handleStartInAppCall = () => {
    const faizanLead = leads.find(l => l.name.toLowerCase().includes('faizan')) || leads[0];
    startCall(
      faizanLead.name, 
      faizanLead.phone || '+91 98450 61245', 
      faizanLead.interest, 
      faizanLead.expectedValue, 
      'outgoing'
    );
  };

  const handleStartPhoneCall = () => {
    const lead = leads.find(l => l.name.toLowerCase().includes('mukunda')) || leads[0];
    startCall(
      lead.name, 
      lead.phone || '+91 98765 43210', 
      lead.interest, 
      lead.expectedValue, 
      'outgoing'
    );
  };

  return (
    <>
      <div 
        id="ogcBar" 
        className="fixed bottom-[68px] md:bottom-[22px] left-1/2 -translate-x-1/2 z-[999970] flex flex-col gap-[6px] items-center pointer-events-none select-none max-w-[96vw]"
      >
        <div className="flex items-center gap-[5px] flex-nowrap justify-center bg-white border border-[#e5e7eb] rounded-[22px] p-[5px_6px_5px_5px] shadow-[0_10px_24px_rgba(15,23,42,0.18)] pointer-events-auto">
          <span className="text-[10.5px] font-[800] text-[#3b2a00] bg-[#f5c542] rounded-[14px] px-[9px] py-[6px] whitespace-nowrap tracking-[0.3px]">
            DEMO
          </span>

          {!isCallActive ? (
            <>
              <button 
                onClick={handleStartInAppCall}
                className="border-none bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] rounded-[14px] px-[10px] py-[6px] text-[12px] font-[700] cursor-pointer whitespace-nowrap flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#0f6e56]" />
                <span>In-app call</span>
              </button>
              <button 
                onClick={handleStartPhoneCall}
                className="border-none bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] rounded-[14px] px-[10px] py-[6px] text-[12px] font-[700] cursor-pointer whitespace-nowrap flex items-center gap-1.5 transition-colors"
              >
                <PhoneOutgoing className="w-3.5 h-3.5 text-blue-600" />
                <span>Phone call</span>
              </button>
              <button 
                onClick={() => setDpdpSheetOpen(true)}
                title="How DPDP works in this app"
                aria-label="How DPDP works in this app"
                className="border-none bg-[#e1f5ee] hover:bg-[#c9ebd9] text-[#0f6e56] rounded-[14px] px-[9px] py-[6px] text-[12px] font-[600] cursor-pointer whitespace-nowrap flex items-center justify-center transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  showToast('Live Nudge: Customer sounded unsure. Recording paused.');
                }}
                className="border-none bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] rounded-[14px] px-[10px] py-[6px] text-[12px] font-[700] cursor-pointer whitespace-nowrap transition-colors"
              >
                “Unsure?”
              </button>
              <button 
                onClick={() => {
                  showToast('Sec 11: Customer requested copy of data. Logged to DPO.');
                }}
                className="border-none bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] rounded-[14px] px-[10px] py-[6px] text-[12px] font-[700] cursor-pointer whitespace-nowrap transition-colors"
              >
                “My data?”
              </button>
              <button 
                onClick={() => {
                  showToast('Sec 6: Customer asked to stop recording. Stopped immediately.');
                  withdrawRecordingConsent();
                }}
                className="border-none bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] rounded-[14px] px-[10px] py-[6px] text-[12px] font-[700] cursor-pointer whitespace-nowrap transition-colors"
              >
                “Stop!”
              </button>
              <button 
                onClick={() => setDpdpSheetOpen(true)}
                title="How DPDP works in this app"
                aria-label="How DPDP works in this app"
                className="border-none bg-[#e1f5ee] hover:bg-[#c9ebd9] text-[#0f6e56] rounded-[14px] px-[9px] py-[6px] text-[12px] font-[600] cursor-pointer whitespace-nowrap flex items-center justify-center transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* DPDP Bottom Sheet Modal matching mock ogcInfo() */}
      {dpdpSheetOpen && (
        <div 
          className="fixed inset-0 bg-[#0a1410]/50 z-[999985] flex items-end justify-center select-none animate-in fade-in duration-200"
          onClick={() => setDpdpSheetOpen(false)}
        >
          <div 
            className="bg-white rounded-t-[20px] w-full max-w-[520px] max-h-[84vh] overflow-y-auto p-[18px_16px_22px] box-border shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-[15px] font-[700] text-[#0f172a]">
                  How this app keeps you DPDP-safe
                </h3>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  Five rules. The app does most of the work.
                </p>
              </div>
              <button 
                onClick={() => setDpdpSheetOpen(false)}
                aria-label="Close"
                className="border-none bg-[#f1f2f6] hover:bg-[#e4e5eb] rounded-full w-[32px] h-[32px] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4 text-slate-700" />
              </button>
            </div>

            {/* 5 Rules */}
            <div className="divide-y divide-[#f1f3f8]">
              <div className="flex gap-[12px] items-start py-[12px]">
                <span className="w-[34px] h-[34px] rounded-[10px] bg-[#e1f5ee] text-[#0f6e56] flex items-center justify-center text-[17px] flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-[8px]">
                    <span className="text-[13.5px] font-[600] text-[#0f172a]">Ask first</span>
                    <span className="text-[10.5px] text-[#94a3b8] font-[600]">Sec 5–6</span>
                  </div>
                  <div className="text-[12.5px] text-[#475569] leading-[1.45] mt-0.5">
                    Read the line, then send it on WhatsApp. Nothing records until they tap Yes.
                  </div>
                </div>
              </div>

              <div className="flex gap-[12px] items-start py-[12px]">
                <span className="w-[34px] h-[34px] rounded-[10px] bg-[#f1f5f9] text-[#334155] flex items-center justify-center text-[17px] flex-shrink-0">
                  <MicOff className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-[8px]">
                    <span className="text-[13.5px] font-[600] text-[#0f172a]">No means no</span>
                    <span className="text-[10.5px] text-[#94a3b8] font-[600]">Sec 6</span>
                  </div>
                  <div className="text-[12.5px] text-[#475569] leading-[1.45] mt-0.5">
                    Carry on without recording. Offers stay off unless they say yes.
                  </div>
                </div>
              </div>

              <div className="flex gap-[12px] items-start py-[12px]">
                <span className="w-[34px] h-[34px] rounded-[10px] bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center text-[17px] flex-shrink-0">
                  <Square className="w-4 h-4 fill-current" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-[8px]">
                    <span className="text-[13.5px] font-[600] text-[#0f172a]">Stop means stop</span>
                    <span className="text-[10.5px] text-[#94a3b8] font-[600]">Sec 6</span>
                  </div>
                  <div className="text-[12.5px] text-[#475569] leading-[1.45] mt-0.5">
                    The app stops recording itself the moment it hears it.
                  </div>
                </div>
              </div>

              <div className="flex gap-[12px] items-start py-[12px]">
                <span className="w-[34px] h-[34px] rounded-[10px] bg-[#eef2ff] text-[#1e3a8a] flex items-center justify-center text-[17px] flex-shrink-0">
                  <UserCheck className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-[8px]">
                    <span className="text-[13.5px] font-[600] text-[#0f172a]">Data questions go to the DPO</span>
                    <span className="text-[10.5px] text-[#94a3b8] font-[600]">Sec 11–14</span>
                  </div>
                  <div className="text-[12.5px] text-[#475569] leading-[1.45] mt-0.5">
                    One tap. They get a reference number. Don't promise anything.
                  </div>
                </div>
              </div>

              <div className="flex gap-[12px] items-start py-[12px]">
                <span className="w-[34px] h-[34px] rounded-[10px] bg-[#fff7ed] text-[#c2410c] flex items-center justify-center text-[17px] flex-shrink-0">
                  <UserPlus className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-[8px]">
                    <span className="text-[13.5px] font-[600] text-[#0f172a]">Under 18 needs a parent</span>
                    <span className="text-[10.5px] text-[#94a3b8] font-[600]">Sec 9</span>
                  </div>
                  <div className="text-[12.5px] text-[#475569] leading-[1.45] mt-0.5">
                    Switch on “Under 18?” and the parent says yes.
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[12px] text-[#64748b] mt-[14px]">
              Every tap is logged for your DPO, on a trail nobody can quietly change.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
