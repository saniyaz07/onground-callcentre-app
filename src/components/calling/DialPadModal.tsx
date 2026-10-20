import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useCall } from '../../context/CallContext';
import { Phone } from 'lucide-react';

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
      className="fixed inset-0 bg-black/40 z-[400] flex items-end justify-center select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-t-[20px] p-[16px] w-full max-w-[360px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle matching mock line 821 */}
        <div className="w-[36px] h-[4px] bg-[#e5e5ea] rounded-[2px] mx-auto mb-[14px]" />

        {/* Display input matching mock line 822 */}
        <input 
          id="dialerNumberDisplay" 
          readOnly 
          value={phoneNumber}
          placeholder=""
          className="w-full text-center text-[24px] font-[700] text-[#1a1a1a] border-none outline-none mb-[14px] bg-transparent tracking-wider h-[32px]"
        />

        {/* Keypad Grid matching mock line 823 & lines 3450-3456 */}
        <div id="dialerKeypadGrid" className="grid grid-cols-3 gap-[10px]">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleKeyPress(k)}
              className="h-[52px] rounded-[26px] bg-[#f2f2f7] hover:bg-[#e5e5ea] active:bg-[#dcdcde] border-none text-[19px] font-[600] text-[#1a1a1a] cursor-pointer transition-colors flex items-center justify-center"
            >
              {k}
            </button>
          ))}
        </div>

        {/* Call button matching mock line 824 */}
        <button 
          type="button"
          onClick={handleCall} 
          className="w-[56px] h-[56px] rounded-full bg-[#0f6e56] hover:bg-[#0c5945] border-none text-white mx-auto mt-[16px] flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-95"
          title="Start call"
        >
          <Phone className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
};
