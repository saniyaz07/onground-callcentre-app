import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCall } from '../../context/CallContext';
import { 
  LayoutDashboard, 
  PhoneCall, 
  PhoneOutgoing, 
  PhoneIncoming, 
  History, 
  Calendar as CalendarIcon, 
  Zap, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MainTab, PlanSubTab } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, planSubTab, setPlanSubTab, callLogs } = useApp();
  const { startCall } = useCall();

  const missedCount = callLogs.filter(c => c.dir === 'missed').length;

  const handleTabClick = (tab: MainTab) => {
    setActiveTab(tab);
  };

  const handleSubTabClick = (subTab: PlanSubTab) => {
    setActiveTab('calls');
    setPlanSubTab(subTab);
  };

  return (
    <aside className="hidden md:flex w-[224px] bg-gradient-to-b from-[#123c30] to-[#0d2e26] text-white flex-col justify-between shadow-[2px_0_16px_rgba(0,0,0,0.18)] p-[20px_12px] gap-1 z-20 select-none flex-shrink-0">
      <div className="flex flex-col gap-1">
        {/* Mock Top Brand Label: On-Ground.ai */}
        <div className="text-[16px] font-extrabold text-white px-[10px] pt-[4px] pb-[18px] tracking-normal">
          On-Ground.ai
        </div>

        {/* Dashboard */}
        <button
          onClick={() => handleTabClick('dash')}
          className={`w-full flex items-center gap-3 p-[8px_10px] rounded-[11px] transition-colors ${
            activeTab === 'dash' ? 'bg-white/[0.05]' : 'hover:bg-white/[0.06]'
          }`}
        >
          <span
            className={`w-[30px] h-[30px] rounded-[9px] inline-flex items-center justify-center text-[16px] transition-all ${
              activeTab === 'dash'
                ? 'bg-gradient-to-br from-[#2fbf94] to-[#0f6e56] text-white shadow-[0_3px_10px_rgba(15,110,86,0.45)]'
                : 'bg-[rgba(29,158,117,0.18)] text-[#4fd8ac]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
          </span>
          <span className={`text-[14.5px] ${activeTab === 'dash' ? 'text-white font-bold' : 'text-[#a9c4ba] font-semibold'}`}>
            Dashboard
          </span>
        </button>

        {/* Plan / Calling Section */}
        <div>
          <button
            onClick={() => handleTabClick('calls')}
            className={`w-full flex items-center justify-between p-[8px_10px] rounded-[11px] transition-colors ${
              activeTab === 'calls' ? 'bg-white/[0.05]' : 'hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-[30px] h-[30px] rounded-[9px] inline-flex items-center justify-center text-[16px] transition-all ${
                  activeTab === 'calls'
                    ? 'bg-gradient-to-br from-[#5b9bf5] to-[#1d4ed8] text-white shadow-[0_3px_10px_rgba(29,78,216,0.4)]'
                    : 'bg-[rgba(59,130,246,0.18)] text-[#7cb3f7]'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
              </span>
              <span className={`text-[14.5px] ${activeTab === 'calls' ? 'text-white font-bold' : 'text-[#a9c4ba] font-semibold'}`}>
                Plan
              </span>
            </div>
          </button>

          {/* Sub-items matching .ios-nav-sub */}
          <div className="flex flex-col gap-[2px] pt-[2px] pb-[8px] pl-[14px] mb-[2px]">
            <button
              onClick={() => handleSubTabClick('outgoing')}
              className={`flex items-center gap-[9px] p-[7px_10px] rounded-[9px] text-[13.5px] text-left transition-colors ${
                (activeTab === 'calls' && planSubTab === 'outgoing') || activeTab === 'dash'
                  ? 'bg-[rgba(93,202,165,0.14)] text-[#7ee0bb] font-extrabold'
                  : 'text-[#89a89c] hover:bg-white/[0.05] hover:text-[#cfe4dc] font-semibold'
              }`}
            >
              <PhoneOutgoing className="w-[15px] h-[15px] flex-shrink-0" />
              <span>Calls to make</span>
            </button>

            <button
              onClick={() => handleSubTabClick('incoming')}
              className={`flex items-center gap-[9px] p-[7px_10px] rounded-[9px] text-[13.5px] text-left transition-colors ${
                activeTab === 'calls' && planSubTab === 'incoming'
                  ? 'bg-[rgba(93,202,165,0.14)] text-[#7ee0bb] font-extrabold'
                  : 'text-[#89a89c] hover:bg-white/[0.05] hover:text-[#cfe4dc] font-semibold'
              }`}
            >
              <PhoneIncoming className="w-[15px] h-[15px] flex-shrink-0 text-rose-400" />
              <span>Incoming</span>
            </button>

            <button
              onClick={() => handleSubTabClick('recent')}
              className={`flex items-center gap-[9px] p-[7px_10px] rounded-[9px] text-[13.5px] text-left transition-colors ${
                activeTab === 'calls' && planSubTab === 'recent'
                  ? 'bg-[rgba(93,202,165,0.14)] text-[#7ee0bb] font-extrabold'
                  : 'text-[#89a89c] hover:bg-white/[0.05] hover:text-[#cfe4dc] font-semibold'
              }`}
            >
              <History className="w-[15px] h-[15px] flex-shrink-0" />
              <span>Recent</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('calls');
                startCall('AvaniBot Pitch Coach', '+91 90000 00000', 'SmartGRID Pitch Simulation', 18490, 'practice');
              }}
              className="flex items-center gap-[9px] p-[7px_10px] rounded-[9px] text-[13.5px] font-semibold text-[#d99a5c] hover:bg-[rgba(217,154,92,0.1)] transition-colors mt-[4px]"
            >
              <Sparkles className="w-[15px] h-[15px] flex-shrink-0" />
              <span>Practise a call</span>
            </button>
          </div>
        </div>

        {/* Calendar */}
        <button
          onClick={() => handleTabClick('calendar')}
          className={`w-full flex items-center gap-3 p-[8px_10px] rounded-[11px] transition-colors ${
            activeTab === 'calendar' ? 'bg-white/[0.05]' : 'hover:bg-white/[0.06]'
          }`}
        >
          <span
            className={`w-[30px] h-[30px] rounded-[9px] inline-flex items-center justify-center text-[16px] transition-all ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-br from-[#e0a52f] to-[#a3660a] text-white shadow-[0_3px_10px_rgba(200,134,10,0.4)]'
                : 'bg-[rgba(200,134,10,0.16)] text-[#e0a52f]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
          </span>
          <span className={`text-[14.5px] ${activeTab === 'calendar' ? 'text-white font-bold' : 'text-[#a9c4ba] font-semibold'}`}>
            Calendar
          </span>
        </button>

        {/* Pulse */}
        <button
          onClick={() => handleTabClick('pulse')}
          className={`w-full flex items-center justify-between p-[8px_10px] rounded-[11px] transition-colors ${
            activeTab === 'pulse' ? 'bg-white/[0.05]' : 'hover:bg-white/[0.06]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-[30px] h-[30px] rounded-[9px] inline-flex items-center justify-center text-[16px] transition-all ${
                activeTab === 'pulse'
                  ? 'bg-gradient-to-br from-[#9457ec] to-[#5b21b6] text-white shadow-[0_3px_10px_rgba(124,58,237,0.4)]'
                  : 'bg-[rgba(124,58,237,0.18)] text-[#a978f0]'
              }`}
            >
              <Zap className="w-4 h-4" />
            </span>
            <span className={`text-[14.5px] ${activeTab === 'pulse' ? 'text-white font-bold' : 'text-[#a9c4ba] font-semibold'}`}>
              Pulse
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
