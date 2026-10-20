import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useCall } from '../../context/CallContext';
import { 
  PhoneCall, 
  Clock, 
  TrendingUp, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  Sparkles,
  Radio,
  Shield,
  LayoutDashboard,
  Calendar as CalendarIcon,
  Zap,
  PhoneOutgoing,
  PhoneIncoming,
  History
} from 'lucide-react';
import { YourRankOgScore } from './YourRankOgScore';
import { NotificationsPanel } from './NotificationsPanel';

export const TopBar: React.FC = () => {
  const { agentName, earnings, setNotificationsOpen, setActiveTab, setPlanSubTab } = useApp();
  const { isCallActive, durationStr, callerName, triggerIncomingCall, startCall, openConsentModal } = useCall();
  const [secondsOnShift, setSecondsOnShift] = useState<number>(262); // 4m 22s
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [bellPulsing, setBellPulsing] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsOnShift(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatShiftTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem.toString().padStart(2, '0')}s`;
  };

  return (
    <header className="min-h-[54px] bg-[rgba(18,60,48,0.97)] text-white px-2.5 sm:px-4 py-2 flex items-center justify-between border-b border-black/15 z-30 select-none gap-1.5 sm:gap-2">
      {/* Left: Brand Identity (.brand-logo & .brand-name matching mock lines 633-635) */}
      <div className="flex items-center flex-shrink-0 min-w-0">
        <div className="w-[30px] h-[30px] bg-[#1d9e75] rounded-[9px] flex items-center justify-center font-bold text-[14.5px] text-white flex-shrink-0 shadow-sm">
          OG
        </div>
        <span className="text-[14px] min-[360px]:text-[15px] sm:text-[16px] font-semibold text-white ml-1.5 sm:ml-2 tracking-tight hidden min-[340px]:inline truncate">
          On-Ground.ai
        </span>
      </div>

      {/* Mobile Active Call Status Indicator (Only on sm-md screens) */}
      {isCallActive && (
        <div className="hidden sm:flex md:hidden items-center gap-1.5 bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-bold animate-pulse">
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>{durationStr}</span>
        </div>
      )}

      {/* Middle: Active Call Status Indicator (Desktop only) */}
      <div className="hidden md:flex items-center gap-3 text-xs font-medium">
        {isCallActive && (
          <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full animate-pulse">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>Call in progress with <b>{callerName}</b></span>
            <span className="font-bold tabular">{durationStr}</span>
          </div>
        )}
      </div>

      {/* Right: Agent Status & Profile (.topbar-right matching mock lines 637-664) */}
      <div className="flex items-center gap-1.5 sm:gap-2 relative flex-shrink-0">
        {/* Notification Bell (.notif-bell matching mock line 638) */}
        <button 
          onClick={() => {
            setBellPulsing(false);
            setNotificationsOpen(true);
          }}
          className="relative w-[34px] sm:w-[36px] h-[34px] sm:h-[36px] rounded-full bg-gradient-to-br from-[#ff5b52] to-[#e2233d] flex items-center justify-center cursor-pointer flex-shrink-0 shadow-[0_3px_10px_rgba(226,35,61,0.45)] border-2 border-white/85 animate-[notifBellPulseRing_2.2s_ease-in-out_infinite]"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-[15px] sm:w-[17px] h-[15px] sm:h-[17px] text-white fill-white" />
          {bellPulsing && (
            <span 
              id="notifBellDot" 
              className="absolute -top-[2px] -right-[2px] w-[11px] h-[11px] rounded-full bg-[#ffd400] border-2 border-white shadow-[0_0_0_2px_rgba(226,35,61,0.35)] animate-[notifDotBlink_1.1s_ease-in-out_infinite]"
            />
          )}
        </button>

        {/* Global Ranks: Your Rank / OG Score™ (.global-ranks matching mock line 642) */}
        <div className="global-ranks flex-shrink-0">
          <YourRankOgScore />
        </div>

        {/* Agent Avatar Badge (.ar-badge with rotating gradient ring matching mock line 650) */}
        <div 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative w-[34px] sm:w-[38px] h-[34px] sm:h-[38px] rounded-full flex flex-col items-center justify-center cursor-pointer flex-shrink-0 select-none overflow-visible group"
          title={`Agent: ${agentName}`}
          aria-label="User profile menu"
        >
          <div 
            className="absolute -inset-[2px] sm:-inset-[2.5px] rounded-full animate-[badgeSpin_5s_linear_infinite]"
            style={{
              background: 'conic-gradient(#FFD700 0deg, #5dcaa5 120deg, #1d9e75 200deg, #FFD700 360deg)'
            }}
          />
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#0a2a1e] to-[#1d9e75] flex flex-col items-center justify-center z-[1] shadow-inner">
            <span className="text-[15px] sm:text-[17px] leading-none select-none">🦸‍♂️</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-white/80 tracking-[0.3px] leading-none mt-[0.5px]">AR</span>
          </div>
        </div>

        {/* Hamburger Menu Icon (.hamburger matching mock line 657) */}
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-[30px] h-[30px] rounded-[8px] bg-white/10 hover:bg-white/20 flex flex-col items-center justify-center gap-[4px] cursor-pointer border-none transition-colors flex-shrink-0"
          title="Toggle Navigation Menu"
          aria-label="Toggle menu"
        >
          <span className="w-[14px] h-[1.5px] bg-white rounded-sm block" />
          <span className="w-[14px] h-[1.5px] bg-white rounded-sm block" />
          <span className="w-[14px] h-[1.5px] bg-white rounded-sm block" />
        </button>

        {/* Dropdown Menu (.user-dropdown matching mock lines 71-79 & 658-663) */}
        {dropdownOpen && (
          <div className="absolute right-0 top-[46px] w-[260px] max-w-[calc(100vw-16px)] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-slate-200 overflow-hidden z-[500] text-slate-800 animate-in fade-in duration-150 max-h-[85vh] overflow-y-auto">
            <div className="bg-[#0a1a14] p-[12px_14px] flex items-center gap-[10px]">
              <div className="w-[36px] h-[36px] rounded-full bg-[#5dcaa5] flex items-center justify-center text-[18px] text-[#04342c] font-bold flex-shrink-0">
                🦸‍♂️
              </div>
              <div className="min-w-0">
                <div className="text-[14.5px] font-semibold text-white leading-tight truncate">{agentName}</div>
                <div className="text-[12px] text-[#9fe1cb] leading-tight truncate">Koramangala · The Sleep Company</div>
              </div>
            </div>

            {/* Mobile Navigation Links (Shown on mobile screens) */}
            <div className="md:hidden py-1 border-b border-slate-100 bg-slate-50/70">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Navigate
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setActiveTab('dash');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white text-left transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setActiveTab('calls');
                  setPlanSubTab('outgoing');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white text-left transition-colors"
              >
                <PhoneOutgoing className="w-3.5 h-3.5 text-blue-600" />
                <span>Planner: Calls to Make</span>
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setActiveTab('calls');
                  setPlanSubTab('incoming');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white text-left transition-colors"
              >
                <PhoneIncoming className="w-3.5 h-3.5 text-rose-500" />
                <span>Planner: Incoming</span>
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setActiveTab('calls');
                  setPlanSubTab('recent');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white text-left transition-colors"
              >
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Planner: Recent</span>
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setActiveTab('calendar');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white text-left transition-colors"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Calendar</span>
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setActiveTab('pulse');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-white text-left transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Pulse</span>
              </button>
            </div>

            <button 
              onClick={() => setDropdownOpen(false)}
              className="w-full flex items-center gap-[10px] p-[10px_14px] text-[13.5px] text-[#1a1a1a] cursor-pointer border-b border-[#f0f0f0] hover:bg-slate-50 text-left transition-colors font-medium"
            >
              <User className="w-4 h-4 text-[#555]" />
              <span>Avatar</span>
            </button>

            <button 
              onClick={() => setDropdownOpen(false)}
              className="w-full flex items-center gap-[10px] p-[10px_14px] text-[13.5px] text-[#1a1a1a] cursor-pointer border-b border-[#f0f0f0] hover:bg-slate-50 text-left transition-colors font-medium"
            >
              <Settings className="w-4 h-4 text-[#555]" />
              <span>Settings</span>
            </button>

            {/* Quick Simulation Triggers */}
            <button 
              onClick={() => {
                setDropdownOpen(false);
                triggerIncomingCall('Ritu S.', '+91 98450 12345', 'Ortho Grid Classic', 14990);
              }}
              className="w-full flex items-center gap-[10px] p-[10px_14px] text-[13px] text-amber-800 bg-amber-50/70 hover:bg-amber-100/70 cursor-pointer border-b border-[#f0f0f0] text-left transition-colors font-semibold"
            >
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>Simulate Incoming Call</span>
            </button>

            <button 
              onClick={() => setDropdownOpen(false)}
              className="w-full flex items-center gap-[10px] p-[10px_14px] text-[13.5px] text-[#e24b4a] hover:bg-rose-50 cursor-pointer text-left transition-colors font-medium"
            >
              <LogOut className="w-4 h-4 text-[#e24b4a]" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
