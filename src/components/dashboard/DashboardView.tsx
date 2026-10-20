import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useCall } from '../../context/CallContext';
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  ChevronRight, 
  Headphones, 
  PhoneCall, 
  CheckCircle, 
  CheckCircle2, 
  X, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { CALLS_HANDLED_7DAYS, CSAT_TREND_7DAYS } from '../../data/mockData';
import { QueueItem, DashboardTask } from '../../types';

export const DashboardView: React.FC = () => {
  const { 
    agentName, 
    earnings, 
    queueCustomers, 
    dashboardTasks, 
    resolveDashboardTask, 
    resetTasks,
    openTaskThread, 
    setActiveTab, 
    setPlanSubTab,
    dateFilter,
    setDateFilter,
    dateRangeSheetOpen,
    setDateRangeSheetOpen,
    openLeadModal
  } = useApp();

  const { startCall } = useCall();

  // Selected task popover for quick actioning directly from dashboard
  const [activeTaskPopup, setActiveTaskPopup] = useState<DashboardTask | null>(null);

  // Time-aware greeting computation matching reference mock
  const getGreeting = () => {
    return 'Good afternoon 👋';
  };

  // Live ticking simulation for queue customer wait times from stable initial baseline
  const [queueTimes, setQueueTimes] = useState<{ [id: string]: string }>({
    'q-1': '4m 20s',
    'q-2': '1m 50s'
  });

  useEffect(() => {
    const startTimestamp = Date.now();
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
      setQueueTimes({
        'q-1': `${Math.floor((260 + elapsedSeconds) / 60)}m ${((260 + elapsedSeconds) % 60).toString().padStart(2, '0')}s`,
        'q-2': `${Math.floor((110 + elapsedSeconds) / 60)}m ${((110 + elapsedSeconds) % 60).toString().padStart(2, '0')}s`
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Date range selection
  const handleSelectPreset = (preset: string) => {
    setDateFilter(preset);
    setDateRangeSheetOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f2f2f7] text-slate-800 p-3 sm:p-4 select-none">
      {/* 1. HERO BANNER (.cc-hero with exact reference radial and linear gradient) */}
      <div 
        className="rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden mb-3.5"
        style={{
          background: 'radial-gradient(circle at 15% -10%, #2a3a8f 0%, transparent 45%), linear-gradient(160deg, #0b0f2e 0%, #151b4d 55%, #1e2764 100%)'
        }}
      >
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="text-xs font-semibold text-indigo-300">
              {getGreeting()}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-0.5">
              {agentName}
            </h1>
            <div className="text-xs text-indigo-200/90 font-medium mt-0.5">
              The Sleep Company · Call Centre
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* On Queue Pill with green live dot */}
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>On Queue</span>
            </div>

            {/* Date Filter Button */}
            <button 
              onClick={() => setDateRangeSheetOpen(true)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-300" />
              <span>{dateFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-300" />
            </button>
          </div>
        </div>

        {/* 4 KPI CARDS (.cc-kpi-row) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mt-3.5 sm:mt-4 relative z-10">
          {/* Card 1: OG Score™ */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2 sm:p-2.5 text-center shadow-inner">
            <div className="text-base sm:text-lg font-black text-white tabular">76</div>
            <div className="text-[10px] sm:text-[11px] font-bold text-indigo-200 uppercase tracking-wide mt-0.5">
              OG Score™
            </div>
            <div className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-extrabold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded-md mt-1 border border-emerald-800/40">
              ▲13
            </div>
          </div>

          {/* Card 2: Avg Handle Time */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2 sm:p-2.5 text-center shadow-inner">
            <div className="text-base sm:text-lg font-black text-white tabular">4m 12s</div>
            <div className="text-[10px] sm:text-[11px] font-bold text-indigo-200 uppercase tracking-wide mt-0.5">
              Avg Handle Time
            </div>
            <div className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-extrabold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded-md mt-1 border border-emerald-800/40">
              ▼8%
            </div>
          </div>

          {/* Card 3: CSAT Today */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2 sm:p-2.5 text-center shadow-inner">
            <div className="text-base sm:text-lg font-black text-white tabular">94%</div>
            <div className="text-[10px] sm:text-[11px] font-bold text-indigo-200 uppercase tracking-wide mt-0.5">
              CSAT Today
            </div>
            <div className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-extrabold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded-md mt-1 border border-emerald-800/40">
              ▲ 2pt
            </div>
          </div>

          {/* Card 4: In Queue (Clickable -> Opens Planner's Incoming view) */}
          <div 
            onClick={() => {
              setActiveTab('calls');
              setPlanSubTab('incoming');
            }}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 rounded-xl p-2 sm:p-2.5 text-center cursor-pointer transition-all shadow-inner group"
            title="Click to open Incoming Queue in Planner"
          >
            <div className="text-base sm:text-lg font-black text-white tabular">2</div>
            <div className="text-[10px] sm:text-[11px] font-bold text-indigo-200 uppercase tracking-wide mt-0.5">
              In Queue
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-blue-300 bg-blue-950/60 px-1.5 py-0.2 rounded-md mt-1 border border-blue-800/40 group-hover:bg-blue-900">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span>● live</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5 items-start">
        {/* LEFT COLUMN: Progress Banner + Who's Waiting Queue */}
        <div className="flex flex-col gap-3">
          {/* Progress Banner (.prog-banner) */}
          <div className="bg-gradient-to-r from-[#0a1a14] via-[#0f3d2f] to-[#1d9e75] rounded-2xl p-3.5 text-white shadow-md border border-emerald-800/40 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>My Progress · today</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-white tabular">3</div>
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1 mt-0.5">
                  ▲ +1
                </div>
                <div className="text-[11px] text-emerald-200/80 font-medium mt-0.5">Leads Created</div>
              </div>

              <div className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-white tabular">2</div>
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1 mt-0.5">
                  ▲ +2
                </div>
                <div className="text-[11px] text-emerald-200/80 font-medium mt-0.5">Leads Called</div>
              </div>
            </div>
          </div>

          {/* Who's Waiting Queue Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Who's waiting
              </span>
              <button 
                onClick={() => {
                  setActiveTab('calls');
                  setPlanSubTab('incoming');
                }}
                className="text-xs font-bold text-[#0f6e56] hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Open planner →</span>
              </button>
            </div>

            {/* Waiting Queue Cards (Priya Iyer & Suresh Nair) */}
            <div className="flex flex-col gap-2">
              {queueCustomers.map((q) => {
                const waitTime = queueTimes[q.id] || q.wait;
                const isHigh = q.waitLevel === 'hi';
                return (
                  <div 
                    key={q.id}
                    onClick={() => startCall(q.name, q.phone, q.product, q.dealValue)}
                    className="bg-white border border-[#ece7fa] hover:border-emerald-400 rounded-xl p-3 flex items-center gap-3 shadow-sm cursor-pointer transition-all hover:shadow-md group"
                    title={`Click to connect with ${q.name}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                      <Headphones className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                          {q.name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {q.intent}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span 
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-lg tabular ${
                          isHigh 
                            ? 'text-[#e24b4a] bg-[#fdecec]' 
                            : 'text-[#c8860a] bg-[#fff3d6]'
                        }`}
                      >
                        {waitTime}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PhoneCall className="w-3 h-3" /> Call
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Earnings Card + My Tasks */}
        <div className="flex flex-col gap-3">
          {/* Earnings Card (#hcEarn matching mock exact values) */}
          <div className="bg-white border border-[#ececef] rounded-2xl p-4 shadow-sm">
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <span>💰</span>
                <span>My earnings this month</span>
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                ₹800 to ₹6,000 slab
              </div>
            </div>

            <div className="flex items-baseline gap-2.5 mt-1.5">
              <div className="text-3xl font-extrabold text-[#0f6e56] tabular tracking-tight">
                ₹{earnings.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                ₹1,700 from coached moves
              </div>
            </div>

            {/* Progress Bar (87% reference threshold) */}
            <div className="h-2 bg-[#eef0f2] rounded-full overflow-hidden mt-3">
              <div 
                className="h-full rounded-full transition-all duration-700" 
                style={{
                  width: '87%',
                  background: 'linear-gradient(90deg, #1d9e75, #5dcaa5)'
                }}
              />
            </div>
          </div>

          {/* My Tasks Card (#hcMyTasks matching mock exact structure & interaction) */}
          <div 
            className="rounded-2xl p-4 shadow-md text-white border border-amber-900/40"
            style={{
              background: 'linear-gradient(135deg, #3b2304, #92400e)'
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-300" />
                <h3 className="font-extrabold text-sm text-white">My Tasks</h3>
              </div>
              <div className="flex items-center gap-2">
                {dashboardTasks.length < 3 && (
                  <button
                    onClick={resetTasks}
                    title="Reset tasks for testing"
                    className="text-[11px] text-amber-300 hover:text-white underline font-semibold transition-colors"
                  >
                    Reset
                  </button>
                )}
                <span className="bg-[#ef4444] text-white text-xs font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                  {dashboardTasks.length}
                </span>
              </div>
            </div>

            {dashboardTasks.length === 0 ? (
              <div className="bg-white/95 rounded-xl p-3 text-sm font-bold text-emerald-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All caught up</span>
                </div>
                <button
                  onClick={resetTasks}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Reset tasks
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {dashboardTasks.map(task => (
                  <div 
                    key={task.id}
                    data-tid={task.id}
                    onClick={() => setActiveTaskPopup(task)}
                    className="bg-white rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 transition-all shadow-sm group"
                  >
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: task.iconBg, color: task.iconColor }}
                    >
                      {task.iconType === 'phone' && <PhoneCall className="w-3.5 h-3.5" />}
                      {task.iconType === 'users' && <Headphones className="w-3.5 h-3.5" />}
                      {task.iconType === 'notes' && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 text-xs mr-1.5">
                        {task.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {task.subtitle}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTH 7-DAY CHARTS (Calls Handled + CSAT Trend) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5">
        {/* Chart 1: Calls Handled · Last 7 Days */}
        <div>
          <div className="text-[12.5px] font-bold text-[#8e8e93] uppercase tracking-[0.5px] mb-1.5 px-1">
            Calls handled · last 7 days
          </div>
          <div className="bg-white border border-[#ece7fa] rounded-[14px] p-[14px_12px_10px] shadow-[0_1px_4px_rgba(16,24,40,0.05)]">
            <div className="flex items-end gap-[6px] h-[90px]">
              {CALLS_HANDLED_7DAYS.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <span className="text-[11px] font-bold text-[#6b6b74] tabular">
                    {bar.val}
                  </span>
                  <div 
                    className={`w-full rounded-t-[4px] min-h-[4px] transition-all ${
                      bar.isToday ? 'bg-[#0f6e56]' : 'bg-[#5dcaa5]'
                    }`}
                    style={{ height: bar.height }}
                  />
                  <span className="text-[11px] text-[#a8a8ad] font-semibold">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: CSAT Trend · Last 7 Days */}
        <div>
          <div className="text-[12.5px] font-bold text-[#8e8e93] uppercase tracking-[0.5px] mb-1.5 px-1">
            CSAT trend · last 7 days
          </div>
          <div className="bg-white border border-[#ece7fa] rounded-[14px] p-[14px_12px_10px] shadow-[0_1px_4px_rgba(16,24,40,0.05)]">
            <div className="flex items-end gap-[6px] h-[90px]">
              {CSAT_TREND_7DAYS.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <span className="text-[11px] font-bold text-[#6b6b74] tabular">
                    {bar.val}
                  </span>
                  <div 
                    className={`w-full rounded-t-[4px] min-h-[4px] transition-all ${
                      bar.isToday ? 'bg-[#185fa5]' : 'bg-[#8fb3f5]'
                    }`}
                    style={{ height: bar.height }}
                  />
                  <span className="text-[11px] text-[#a8a8ad] font-semibold">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. TASK RESOLUTION / DEEP-LINK POPOVER MODAL */}
      {activeTaskPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {activeTaskPopup.thread}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{activeTaskPopup.q}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{activeTaskPopup.ctx}</p>
              </div>
              <button 
                onClick={() => setActiveTaskPopup(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4">
              <span className="text-xs font-bold text-slate-700 block mb-2">Choose Action:</span>
              <div className="flex flex-col gap-2">
                {activeTaskPopup.opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      resolveDashboardTask(activeTaskPopup.id, opt);
                      setActiveTaskPopup(null);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const targetLeadId = activeTaskPopup.id === 'w1' ? 'lead-2' : 'lead-1';
                    setActiveTaskPopup(null);
                    openLeadModal(targetLeadId);
                  }}
                  className="text-emerald-700 hover:text-emerald-900 font-bold underline flex items-center gap-1 text-left"
                >
                  <span>Open Lead Card (Leads Modal) →</span>
                </button>
                <button
                  onClick={() => {
                    const thread = activeTaskPopup.thread;
                    setActiveTaskPopup(null);
                    openTaskThread(thread, activeTaskPopup.id);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-bold underline text-left"
                >
                  Open in Pulse channel →
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setActiveTaskPopup(null)}
                  className="text-slate-500 hover:text-slate-800 font-semibold py-1 px-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DATE RANGE PICKER SHEET OVERLAY (#dateRangeOverlay) */}
      {dateRangeSheetOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Select Date Range</h3>
              <button 
                onClick={() => setDateRangeSheetOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-2 my-4 text-xs font-semibold">
              {['Today', 'This Week', 'This Month', 'Last 30 Days', 'Custom'].map((p) => (
                <button
                  key={p}
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    dateFilter === p 
                      ? 'border-[#1d9e75] bg-emerald-50 text-emerald-900 font-bold' 
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div>
                <label className="text-slate-400 text-[11px] font-semibold block mb-1">From</label>
                <input 
                  type="date" 
                  defaultValue="2026-10-13"
                  className="w-full border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800" 
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] font-semibold block mb-1">To</label>
                <input 
                  type="date" 
                  defaultValue="2026-10-19"
                  className="w-full border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800" 
                />
              </div>
            </div>

            <button
              onClick={() => handleSelectPreset('This Week')}
              className="w-full py-2 bg-[#1d9e75] hover:bg-[#168a65] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
