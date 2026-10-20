import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useCall } from '../../context/CallContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Share2, 
  PhoneCall, 
  Check, 
  Mail,
  Users,
  X
} from 'lucide-react';
import { CalendarEvent } from '../../types';
import { 
  buildMonthGrid, 
  navigateMonth, 
  MONTH_NAMES, 
  CalendarCell 
} from '../../utils/calendarUtils';

const DEFAULT_UPCOMING_INVITES = [
  { id: 'inv-1', day: 23, time: '11:00 AM', title: 'SOP coaching session', meta: 'With Sunita Rao (Manager) — via #callcentre-team' },
  { id: 'inv-2', day: 26, time: '2:30 PM', title: 'Warranty pitch refresher', meta: 'With L&D team — flagged from your last 3 calls' },
  { id: 'inv-3', day: 28, time: '10:00 AM', title: 'Weekly team huddle', meta: 'With Call Centre team — #callcentre-team' }
];

export const CalendarView: React.FC = () => {
  const { calendarEvents, openLeadModal } = useApp();
  const { startCall } = useCall();

  // Anchored date state (Mock lines 3937-3939)
  const today = new Date();
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth()); // 0-11
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [selectedInviteTitle, setSelectedInviteTitle] = useState<string>('');
  const [sharedPersons, setSharedPersons] = useState<string[]>(['Sunita Rao']);

  // Month navigation handlers
  const handlePrevMonth = () => {
    const { year, month } = navigateMonth(viewYear, viewMonth, -1);
    setViewYear(year);
    setViewMonth(month);
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    const { year, month } = navigateMonth(viewYear, viewMonth, 1);
    setViewYear(year);
    setViewMonth(month);
    setSelectedDay(null);
  };

  const handleJumpToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDay(now.getDate());
  };

  // Build current month grid (Sunday to Saturday)
  const monthCells = buildMonthGrid(viewYear, viewMonth);

  // Days with scheduled event dots
  const eventDays = [23, 26, 28];

  const handleCellClick = (cell: CalendarCell) => {
    if (!cell.isCurrentMonth) {
      if (cell.isLeading) {
        const { year, month } = navigateMonth(viewYear, viewMonth, -1);
        setViewYear(year);
        setViewMonth(month);
        setSelectedDay(cell.day);
      } else {
        const { year, month } = navigateMonth(viewYear, viewMonth, 1);
        setViewYear(year);
        setViewMonth(month);
        setSelectedDay(cell.day);
      }
      return;
    }
    setSelectedDay(cell.day);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f2f2f7] text-slate-800 overflow-y-auto select-none p-3 sm:p-4 pb-20" id="asc-calendar">
      {/* 1. Header (Mock lines 1129) */}
      <div className="max-w-[820px] mx-auto w-full pt-1 pb-1">
        <div className="text-[16px] font-bold text-[#1a1a1a] flex items-center">
          <CalendarIcon className="w-4 h-4 mr-[7px] text-[#185fa5]" />
          <span>Calendar</span>
        </div>
        <div className="text-[12.5px] text-[#8e8e93] mt-[1px]">
          Mirrored from your mailbox — invites created here land there too
        </div>
      </div>

      {/* 2. Mailbox Sync Banner (Mock lines 1131-1134) */}
      <div className="max-w-[820px] mx-auto w-full my-2.5">
        <div className="bg-gradient-to-r from-[#e8f0fe] to-[#eef3fd] rounded-[14px] p-[11px_13px] flex items-center gap-[9px] border border-[#dbe7fb]">
          <div className="w-[30px] h-[30px] rounded-[9px] bg-white flex items-center justify-center flex-shrink-0 shadow-[0_1px_3px_rgba(24,95,165,0.15)]">
            <Mail className="w-4 h-4 text-[#185fa5]" />
          </div>
          <div className="text-[12.5px] text-[#0c2b52] leading-[1.4]">
            Store visits, coaching sessions, and meeting invites all show up here — and in your mailbox.
          </div>
        </div>
      </div>

      {/* 3. Calendar Card (.cal-card matching mock lines 1136-1145 & 316-327) */}
      <div className="max-w-[820px] mx-auto w-full bg-white rounded-[22px] border border-[#eceef4] shadow-[0_2px_10px_rgba(16,24,40,0.06),0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden flex-shrink-0">
        {/* Month Navigation */}
        <div className="m-[14px_14px_0] sm:m-[16px_20px_0] flex items-center justify-between gap-2">
          <button 
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            className="w-[32px] h-[32px] rounded-[10px] bg-[#f2f2f7] hover:bg-[#e5e5ea] border-none flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#555]" />
          </button>

          <div id="calMonthLabel" className="text-[16px] font-extrabold text-[#1a1a1a] tracking-tight flex-1 text-center">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleJumpToday}
              title="Jump to today"
              className="h-[28px] px-[11px] rounded-[10px] bg-[#e8f0fe] border border-[#d3e3fc] text-[13px] font-bold text-[#185fa5] hover:bg-[#dbe7fb] cursor-pointer flex-shrink-0 transition-colors"
            >
              Today
            </button>
            <button 
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="w-[32px] h-[32px] rounded-[10px] bg-[#f2f2f7] hover:bg-[#e5e5ea] border-none flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#555]" />
            </button>
          </div>
        </div>

        {/* Weekday Row (S M T W T F S) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 p-[0_8px] sm:p-[0_20px] mt-4 mb-2 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((letter, i) => (
            <div key={i} className="text-center text-[12px] sm:text-[13.5px] font-extrabold text-[#a8a8ad] uppercase tracking-[0.4px] pb-1">
              {letter}
            </div>
          ))}
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 p-[0_8px_16px] sm:p-[0_18px_20px]">
          {monthCells.map((cell) => {
            const isToday = cell.isCurrentMonth && 
              cell.day === today.getDate() && 
              cell.month === today.getMonth() && 
              cell.year === today.getFullYear();
            const isSelected = cell.isCurrentMonth && selectedDay === cell.day;
            const hasEventDot = cell.isCurrentMonth && eventDays.includes(cell.day);

            if (!cell.isCurrentMonth) {
              return (
                <div 
                  key={cell.dateKey} 
                  className="aspect-square flex flex-col items-center justify-center cursor-default text-transparent"
                />
              );
            }

            let cellClass = "aspect-square flex flex-col items-center justify-center relative rounded-[10px] sm:rounded-[14px] cursor-pointer text-[15px] sm:text-[19px] font-bold transition-all ";
            if (isSelected && !isToday) {
              cellClass += "bg-gradient-to-br from-[#185fa5] to-[#1d4ed8] text-white shadow-[0_4px_10px_rgba(24,95,165,0.35)] scale-[1.02]";
            } else if (isToday) {
              cellClass += "bg-[#e8f0fe] text-[#185fa5] font-extrabold shadow-[0_4px_14px_rgba(24,95,165,0.25)] ring-2 ring-[#185fa5]";
            } else {
              cellClass += "bg-white text-[#1a1a1a] border border-[#f0f0f4] shadow-[0_2px_8px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)] hover:shadow-[0_6px_16px_rgba(16,24,40,0.16)] hover:-translate-y-0.5";
            }

            return (
              <div
                key={cell.dateKey}
                onClick={() => handleCellClick(cell)}
                className={cellClass}
              >
                <span>{cell.day}</span>
                {hasEventDot && (
                  <span 
                    className={`w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full absolute bottom-2 sm:bottom-2.5 ${
                      isSelected && !isToday 
                        ? 'bg-white shadow-[0_0_0_1.5px_#185fa5]' 
                        : isToday 
                        ? 'bg-[#e24b4a] shadow-[0_0_0_1.5px_#e8f0fe]' 
                        : 'bg-[#e24b4a] shadow-[0_0_0_1.5px_#fff]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Upcoming Section (Mock lines 1147-1149 & 296-303) */}
      <div className="max-w-[820px] mx-auto w-full mt-4 flex-shrink-0">
        <div className="text-[12.5px] font-bold text-[#8e8e93] uppercase tracking-[0.5px] mb-2 px-1">
          Upcoming
        </div>

        <div className="flex flex-col gap-2.5">
          {DEFAULT_UPCOMING_INVITES.map((inv) => (
            <div 
              key={inv.id}
              onClick={() => {
                setSelectedInviteTitle(inv.title);
                setShareModalOpen(true);
              }}
              className="bg-white border border-[#eceef2] rounded-[14px] p-[12px_13px_12px_14px] flex gap-3 items-start shadow-[0_1px_4px_rgba(16,24,40,0.04)] hover:shadow-[0_4px_14px_rgba(16,24,40,0.09)] hover:-translate-y-0.5 transition-all relative cursor-pointer overflow-hidden group"
            >
              {/* Blue vertical marker on left border */}
              <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-[3px] bg-gradient-to-b from-[#185fa5] to-[#1d4ed8]" />

              {/* Time Column */}
              <div className="w-[52px] text-right flex-shrink-0 pt-[1px]">
                <div className="text-[12.5px] font-extrabold text-[#185fa5] leading-[1.3]">
                  {inv.time}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0 pl-1">
                <div className="text-[14px] font-bold text-[#1a1a1a] leading-[1.35] group-hover:text-[#185fa5] transition-colors">
                  {inv.title}
                </div>
                <div className="text-[13px] text-[#8e8e93] mt-[3px] flex items-center gap-1">
                  <span>{inv.meta}</span>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInviteTitle(inv.title);
                  setShareModalOpen(true);
                }}
                className="text-[#8e8e93] hover:text-[#185fa5] transition-colors p-1"
                title="Share invite"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Calendar Share Picker Modal (Mock lines 1152-1163) */}
      {shareModalOpen && (
        <div 
          className="fixed inset-0 z-[450] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShareModalOpen(false)}
        >
          <div 
            className="w-full max-w-[480px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in slide-in-from-bottom duration-300 text-slate-800 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[36px] h-[4px] bg-[#e5e5ea] rounded-[2px] mx-auto mb-3 sm:hidden" />
            
            <button 
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#555] flex items-center justify-center transition-colors text-sm font-bold border-none cursor-pointer"
            >
              ✕
            </button>

            <div className="text-[16px] font-semibold text-[#1a1a1a]">Share invite</div>
            <div className="text-[15px] text-[#8e8e93] mt-[2px] mb-3.5 truncate">
              {selectedInviteTitle || 'Calendar Session'}
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {['Sunita Rao (Manager)', 'Call Centre Team (#callcentre-team)', 'AvaniBot AI Coach'].map((person) => {
                const isSelected = sharedPersons.includes(person);
                return (
                  <div 
                    key={person}
                    onClick={() => {
                      setSharedPersons(prev => 
                        prev.includes(person) ? prev.filter(p => p !== person) : [...prev, person]
                      );
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-purple-50/70 border-purple-300 text-purple-950 font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-xs">{person}</span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-purple-700 text-white' : 'border border-slate-300'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setShareModalOpen(false)}
              className="w-full p-[11px] border-none rounded-[10px] text-[14.5px] font-bold text-white bg-gradient-to-r from-[#4c1d95] to-[#6d28d9] cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
