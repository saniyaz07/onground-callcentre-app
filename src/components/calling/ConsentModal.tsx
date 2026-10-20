import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Send, 
  Check, 
  MessageSquare, 
  Mic, 
  Volume2, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck,
  Eye,
  Edit3,
  StopCircle,
  HelpCircle,
  Phone
} from 'lucide-react';
import { 
  PRIMARY_LANGUAGES, 
  ADDITIONAL_LANGUAGES, 
  CONSENT_SCRIPTS, 
  ENGLISH_FALLBACK_SCRIPT,
  DPDP_RIGHTS,
  DPDP_RULES,
  logConsentRight
} from '../../utils/consentStorage';
import { ConsentRecord, ConsentMethod, CallChannelType } from '../../types';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactPhone: string;
  consentRecord: ConsentRecord | null;
  onGrantConsent: (method: ConsentMethod, isMinor: boolean, parentPhone?: string, offersWhatsApp?: boolean) => void;
  onDeclineConsent: (method?: ConsentMethod) => void;
  onWithdrawConsent: () => void;
  onSetLanguage: (lang: string) => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onClose,
  contactName,
  contactPhone,
  consentRecord,
  onGrantConsent,
  onDeclineConsent,
  onWithdrawConsent,
  onSetLanguage
}) => {
  if (!isOpen) return null;

  const [activeChannelTab, setActiveChannelTab] = useState<CallChannelType>('in-app');
  const [selectedLang, setSelectedLang] = useState<string>(consentRecord?.lang || 'kn');
  const [showMoreLangs, setShowMoreLangs] = useState<boolean>(false);
  const [consentMode, setConsentMode] = useState<'wa' | 'voice'>('wa');
  const [isMinor, setIsMinor] = useState<boolean>(consentRecord?.isMinor || false);
  const [offersWhatsApp, setOffersWhatsApp] = useState<boolean>(consentRecord?.offersWhatsApp || false);
  const [phoneInput, setPhoneInput] = useState<string>(
    contactPhone.replace(/\D/g, '').slice(-10) || '9845061245'
  );
  const [phoneError, setPhoneError] = useState<string>('');
  const [isWaSent, setIsWaSent] = useState<boolean>(false);
  const [showDpdpInfo, setShowDpdpInfo] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const scriptObj = CONSENT_SCRIPTS[selectedLang] || CONSENT_SCRIPTS.en;

  const handleSelectLang = (code: string) => {
    setSelectedLang(code);
    onSetLanguage(code);
  };

  const handleSendWhatsApp = () => {
    const cleanDigits = phoneInput.replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneError('');
    setIsWaSent(true);
    setActionNotice(`Simulated Consent Request dispatched to +91 ${cleanDigits}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleWaResponse = (choice: 'yes' | 'no') => {
    if (choice === 'yes') {
      onGrantConsent('WhatsApp', isMinor, isMinor ? phoneInput : undefined, offersWhatsApp);
      setActionNotice('Consent granted via WhatsApp (Simulated)');
    } else {
      onDeclineConsent('WhatsApp');
      setActionNotice('Customer declined recording on WhatsApp');
    }
  };

  const handleVerbalResponse = (choice: 'yes' | 'no') => {
    if (choice === 'yes') {
      onGrantConsent('Verbal', isMinor, undefined, offersWhatsApp);
      setActionNotice('Verbal consent recorded (Simulated clip saved)');
    } else {
      onDeclineConsent('Verbal');
      setActionNotice('Customer declined recording verbally');
    }
  };

  const handleInvokeRight = (sec: string) => {
    if (!consentRecord) return;
    const { refNumber } = logConsentRight(consentRecord, sec);
    const right = DPDP_RIGHTS[sec];
    setActionNotice(`DPO Ticket ${refNumber} generated for ${right.title} (Simulated)`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const currentStatus = consentRecord?.status || 'pending';

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[999999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#0f141e] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#0a0f18] px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white">Ask before you record</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  DEMO
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">
                Call centre · <b className="text-slate-200">{contactName}</b>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDpdpInfo(!showDpdpInfo)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950 px-2.5 py-1.5 rounded-lg border border-emerald-800/60 transition-colors flex items-center gap-1"
              title="How this app keeps you DPDP-safe"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>DPDP Rules</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Action Notice Toast */}
          {actionNotice && (
            <div className="p-2.5 rounded-xl bg-indigo-950/90 border border-indigo-700 text-indigo-200 text-xs font-semibold flex items-center gap-2 animate-pulse">
              <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* Context Selector Tabs: In-App Call vs Phone Call */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveChannelTab('in-app')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeChannelTab === 'in-app'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>In-App Call (Simulated)</span>
            </button>
            <button
              onClick={() => setActiveChannelTab('phone')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeChannelTab === 'phone'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone Call (Native tel:)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60 leading-relaxed">
            <b className="text-slate-200">Simulated Consent Demonstration</b>: No carrier dialling or legal audio recording occurs. All calls remain simulated browser prototypes.
          </div>

          {/* Current Consent State Pill */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#090d14] border border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Live Consent Status
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  currentStatus === 'granted' ? 'bg-emerald-400 animate-pulse' :
                  currentStatus === 'declined' ? 'bg-rose-500' :
                  currentStatus === 'withdrawn' ? 'bg-amber-400' :
                  'bg-slate-500'
                }`} />
                <span className={`font-bold text-sm ${
                  currentStatus === 'granted' ? 'text-emerald-300' :
                  currentStatus === 'declined' ? 'text-rose-300' :
                  currentStatus === 'withdrawn' ? 'text-amber-300' :
                  'text-slate-300'
                }`}>
                  {currentStatus === 'granted' ? `Recording ON · ${consentRecord?.consentId}` :
                   currentStatus === 'declined' ? 'Recording OFF · Consent Declined' :
                   currentStatus === 'withdrawn' ? 'Recording Stopped · Withdrawn' :
                   'Pending Consent'}
                </span>
              </div>
            </div>

            {currentStatus === 'granted' && (
              <button
                onClick={onWithdrawConsent}
                className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[11px] font-bold transition-colors"
                title="Customer requests to withdraw recording consent"
              >
                Withdraw
              </button>
            )}
          </div>

          {/* STEP 1: "Say this · right after hello" */}
          <div className="bg-[#111722] border border-slate-800/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                  1
                </span>
                <span className="font-extrabold text-sm text-slate-100">
                  Say this · right after hello
                </span>
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRIMARY_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLang(lang.code)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      selectedLang === lang.code
                        ? 'bg-[#0f6e56] text-white shadow-sm border border-emerald-500'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}

                <button
                  onClick={() => setShowMoreLangs(!showMoreLangs)}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <span>+20</span>
                  {showMoreLangs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Expanded Languages */}
              {showMoreLangs && (
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 flex-wrap animate-fadeIn">
                  {ADDITIONAL_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLang(lang.code)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                        selectedLang === lang.code
                          ? 'bg-[#0f6e56] text-white border border-emerald-500'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {lang.label} ({lang.name})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Script Box */}
            <div className="bg-[#0b1a14] border-l-4 border-[#0f6e56] rounded-r-xl p-3.5 space-y-2">
              <div className="text-sm font-medium text-emerald-100 leading-relaxed">
                "{scriptObj.script}"
              </div>

              {selectedLang !== 'en' && (
                <div className="text-[11px] text-emerald-300/70 border-t border-emerald-900/60 pt-1.5 leading-normal italic">
                  English: "{ENGLISH_FALLBACK_SCRIPT}"
                </div>
              )}

              <div className="text-[11px] text-emerald-400 font-medium">
                💡 Reassurance: {scriptObj.reassure}
              </div>
            </div>
          </div>

          {/* STEP 2: "Get their yes" */}
          <div className="bg-[#111722] border border-slate-800/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                2
              </span>
              <span className="font-extrabold text-sm text-slate-100">
                Get their yes
              </span>
            </div>

            {/* Mode Segments: WhatsApp vs Said Out Loud */}
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => { setConsentMode('wa'); setIsWaSent(false); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  consentMode === 'wa' ? 'bg-[#0f6e56] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>On WhatsApp</span>
              </button>
              <button
                onClick={() => setConsentMode('voice')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  consentMode === 'voice' ? 'bg-[#0f6e56] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Said out loud</span>
              </button>
            </div>

            {/* MODE A: WhatsApp Path */}
            {consentMode === 'wa' && (
              <div className="space-y-3">
                {!isWaSent ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 block">
                        {isMinor ? "Parent's mobile number" : "Customer's mobile number"}
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs">
                          +91
                        </span>
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="98450 xxxxx"
                          className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                        />
                        <button
                          onClick={handleSendWhatsApp}
                          className="bg-[#0f6e56] hover:bg-[#128367] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                      {phoneError && <div className="text-rose-400 text-[11px]">{phoneError}</div>}
                    </div>

                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      They get the same words on WhatsApp, and tap Yes or No. (Simulated Demo · No real WhatsApp message sent).
                    </div>

                    {/* Under 18 Toggle */}
                    <div 
                      onClick={() => setIsMinor(!isMinor)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Under 18?</span>
                        <span className="text-[11px] text-slate-400">Send it to a parent's number instead.</span>
                      </div>
                      <div className={`w-9 h-5 rounded-full relative transition-colors ${isMinor ? 'bg-[#1e3a8a]' : 'bg-slate-700'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${isMinor ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                    </div>
                  </>
                ) : (
                  /* WhatsApp Sent State */
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#2a1d07] border border-amber-600/50 text-amber-200 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-xs text-amber-300">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>Sent to +91 {phoneInput}. Waiting for their tap.</span>
                      </div>
                      <div className="text-[11px] text-amber-200/90 leading-relaxed">
                        Say: "I've sent it to your WhatsApp. Just tap Yes or No." Recording stays off until they do.
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500 text-black">
                            DEMO
                          </span>
                          <span className="text-slate-300 font-semibold">Simulate customer reply:</span>
                        </div>
                        <button
                          onClick={() => setIsWaSent(false)}
                          className="text-emerald-400 hover:underline text-[10px]"
                        >
                          Change number
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWaResponse('yes')}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Customer Taps: Yes</span>
                        </button>
                        <button
                          onClick={() => handleWaResponse('no')}
                          className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Customer Taps: No</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE B: Said Out Loud (Verbal) */}
            {consentMode === 'voice' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleVerbalResponse('yes')}
                    className="flex-1 py-2.5 rounded-xl bg-[#0f6e56] hover:bg-[#128367] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isMinor ? 'Parent said yes' : 'They said yes'}</span>
                  </button>
                  <button
                    onClick={() => handleVerbalResponse('no')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <X className="w-4 h-4" />
                    <span>They said no</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400">
                  Their spoken yes is saved as a short clip, as proof. (Simulated Demo).
                </div>

                {/* Toggles */}
                <div 
                  onClick={() => setOffersWhatsApp(!offersWhatsApp)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Offers on WhatsApp too?</span>
                    <span className="text-[11px] text-slate-400">Ask separately. Off unless they say yes.</span>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${offersWhatsApp ? 'bg-[#0f6e56]' : 'bg-slate-700'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${offersWhatsApp ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => setIsMinor(!isMinor)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Under 18?</span>
                    <span className="text-[11px] text-slate-400">A parent must say yes.</span>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors ${isMinor ? 'bg-[#1e3a8a]' : 'bg-slate-700'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${isMinor ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DPDP Rights Panel (If consent is active or customer asks) */}
          <div className="bg-[#111722] border border-slate-800/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-200 uppercase tracking-wider">
                Customer Data Rights (DPDP)
              </span>
              <span className="text-[11px] text-slate-400">One-tap DPO dispatch</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {Object.entries(DPDP_RIGHTS).map(([sec, right]) => (
                <button
                  key={sec}
                  onClick={() => handleInvokeRight(sec)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-colors flex flex-col justify-between group"
                >
                  <span className="font-bold text-slate-200 group-hover:text-emerald-300">
                    {right.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {sec} · {right.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* "How this app keeps you DPDP-safe" info modal */}
          {showDpdpInfo && (
            <div className="bg-[#0b1019] border border-emerald-800/60 rounded-2xl p-4 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="font-extrabold text-xs text-emerald-300">
                  How this app keeps you DPDP-safe
                </span>
                <button
                  onClick={() => setShowDpdpInfo(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {DPDP_RULES.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px]">
                    <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">
                        {rule.title} <span className="text-slate-500 font-normal">({rule.sec})</span>
                      </div>
                      <div className="text-slate-400 leading-snug">{rule.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer supporting explanation */}
          <div className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
            A yes creates a Consent ID tied to this call. A no is logged too, and you carry on without recording.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0a0f18] px-5 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {consentRecord?.consentId ? `Active ID: ${consentRecord.consentId}` : 'No consent record active'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
