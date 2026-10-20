import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useCall } from '../../context/CallContext';
import { Phone, X, Delete } from 'lucide-react';

export interface DialPadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DTMF_FREQUENCIES: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477]
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

export const DialPadModal: React.FC<DialPadModalProps> = ({ isOpen, onClose }) => {
  const { leads } = useApp();
  const { startCall, playDtmfTone } = useCall();
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setPhoneNumber('');
    }
  }, [isOpen]);

  // Handle keyboard typing while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Backspace') {
        setPhoneNumber(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        handleCall();
      } else if (KEYS.includes(e.key)) {
        handleKeyPress(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, phoneNumber]);

  if (!isOpen) return null;

  const handleKeyPress = (k: string) => {
    setPhoneNumber(prev => prev + k);
    const freqs = DTMF_FREQUENCIES[k];
    if (freqs && playDtmfTone) {
      playDtmfTone(freqs[0], freqs[1]);
    }
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const matchedLead = leads.find(l => {
    if (!digitsOnly || digitsOnly.length < 4) return false;
    const leadDigits = (l.phone || '').replace(/\D/g, '');
    return leadDigits.includes(digitsOnly) || digitsOnly.includes(leadDigits);
  });

  const handleCall = () => {
    const contactName = matchedLead ? matchedLead.name : (phoneNumber || 'Unknown number');
    const product = matchedLead ? (matchedLead.product || 'Ortho GRID Mattress') : 'Ortho GRID Mattress';
    const dealValue = matchedLead ? (matchedLead.expectedValue || 18490) : 18490;

    onClose();
    startCall(contactName, phoneNumber.trim() || '+91 98450 12345', product, dealValue, 'outgoing');
  };

  return (
    <div 
      id="dialerKeypadSheet" 
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[999980] flex items-end justify-center select-none p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-t-[24px] sm:rounded-[24px] p-4 sm:p-5 w-full max-w-[360px] shadow-2xl relative animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar: iOS Drag Handle & Close Button */}
        <div className="flex items-center justify-between mb-2">
          <div className="w-7" />
          <div className="w-9 h-1 bg-slate-300 rounded-full" />
          <button
            id="closeDialpadBtn"
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer border-none"
            title="Close keypad"
            aria-label="Close keypad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display input & Backspace */}
        <div className="relative flex items-center mb-3">
          <input 
            id="dialerNumberDisplay" 
            readOnly 
            value={phoneNumber}
            placeholder={matchedLead ? matchedLead.name : "Tap digits or type"}
            className="w-full text-center text-[22px] sm:text-[24px] font-[700] text-[#1a1a1a] border-none outline-none bg-transparent tracking-wider h-[36px] placeholder:text-slate-400 placeholder:text-base placeholder:font-normal"
          />
          {phoneNumber.length > 0 && (
            <button
              type="button"
              onClick={handleBackspace}
              className="absolute right-1 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
              title="Backspace"
              aria-label="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Matched Contact Pill */}
        {matchedLead && (
          <div className="text-center mb-2.5">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span>{matchedLead.name}</span>
              <span className="text-emerald-600 font-normal">({matchedLead.product})</span>
            </span>
          </div>
        )}

        {/* Keypad Grid matching mock line 823 & lines 3450-3456 */}
        <div id="dialerKeypadGrid" className="grid grid-cols-3 gap-2.5">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleKeyPress(k)}
              className="h-[50px] sm:h-[52px] rounded-[26px] bg-[#f2f2f7] hover:bg-[#e5e5ea] active:bg-[#dcdcde] border-none text-[18px] sm:text-[19px] font-[600] text-[#1a1a1a] cursor-pointer transition-colors flex items-center justify-center active:scale-95 select-none"
            >
              {k}
            </button>
          ))}
        </div>

        {/* Call button matching mock line 824 */}
        <button 
          type="button"
          onClick={handleCall} 
          className="w-[56px] h-[56px] rounded-full bg-[#0f6e56] hover:bg-[#0c5945] border-none text-white mx-auto mt-3.5 flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-95"
          title="Start call"
          aria-label="Start call"
        >
          <Phone className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
};
