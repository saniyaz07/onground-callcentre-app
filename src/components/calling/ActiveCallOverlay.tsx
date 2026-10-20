import React from 'react';
import { useCall } from '../../context/CallContext';
import { PhoneCall, PhoneOff } from 'lucide-react';
import { ConsentModal } from './ConsentModal';

export const ActiveCallOverlay: React.FC = () => {
  const {
    isIncomingAlert,
    callerName,
    callerPhone,
    callerProduct,
    callerValue,
    acceptIncoming,
    declineIncoming,
    consentRecord,
    isConsentModalOpen,
    closeConsentModal,
    grantRecordingConsent,
    declineRecordingConsent,
    withdrawRecordingConsent,
    setConsentLanguage
  } = useCall();

  return (
    <>
      {/* 1. FLOATING INCOMING CALL ALERT (When an inbound lead calls) */}
      {isIncomingAlert && (
        <div className="fixed top-16 left-3 right-3 sm:left-auto sm:right-6 z-50 bg-gradient-to-r from-[#7c2d12] to-[#c2410c] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-rose-400/50 animate-incoming-ring sm:max-w-sm select-none">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-200">
              Incoming Call · Walk-out Lead
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="mt-2">
            <h3 className="font-extrabold text-base text-white">{callerName}</h3>
            <p className="text-xs text-orange-200 mt-0.5">
              Intent Score: 96 · Interested in {callerProduct} (₹{callerValue.toLocaleString('en-IN')})
            </p>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              onClick={declineIncoming}
              className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105"
              title="Decline"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
            <button
              onClick={acceptIncoming}
              className="px-4 py-2 rounded-xl bg-[#1d9e75] hover:bg-[#168a65] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Accept & Connect</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. "Ask before you record" Consent Modal (DPDP Compliance Prototype) */}
      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={closeConsentModal}
        contactName={callerName}
        contactPhone={callerPhone}
        consentRecord={consentRecord}
        onGrantConsent={grantRecordingConsent}
        onDeclineConsent={declineRecordingConsent}
        onWithdrawConsent={withdrawRecordingConsent}
        onSetLanguage={setConsentLanguage}
      />
    </>
  );
};
