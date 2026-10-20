import React from 'react';
import { useApp } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlannerView } from './components/planner/PlannerView';
import { CalendarView } from './components/calendar/CalendarView';
import { PulseView } from './components/pulse/PulseView';
import { LeadsModal } from './components/leads/LeadsModal';
import { ActiveCallOverlay } from './components/calling/ActiveCallOverlay';
import { 
  CheckCircle2, 
  LayoutDashboard, 
  PhoneCall, 
  Calendar as CalendarIcon, 
  Zap 
} from 'lucide-react';
import { NotificationsPanel } from './components/layout/NotificationsPanel';
import { FloatingDemoBar } from './components/common/FloatingDemoBar';

export const App: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    toastMessage, 
    callLogs, 
    dashboardTasks,
    notificationsOpen,
    setNotificationsOpen
  } = useApp();

  const missedCount = callLogs.filter(c => c.dir === 'missed').length;

  return (
    <div className="w-screen h-screen flex bg-[#e5e7eb] overflow-hidden select-none font-sans">
      {/* Persistent Navigation Sidebar (desktop full height) */}
      <Sidebar />

      {/* Main Screen Container (.screen - max-w-[1180px] h-screen) */}
      <div className="flex-1 flex flex-col max-w-[1180px] h-full bg-[#f2f2f7] overflow-hidden relative shadow-md">
        {/* Top Bar with brand logo, agent shift status & simulation triggers */}
        <TopBar />

        {/* Dynamic Main Workspace Screen */}
        <main className="flex-1 flex flex-col overflow-y-auto relative bg-[#f2f2f7]">
          {activeTab === 'dash' && <DashboardView />}
          {activeTab === 'calls' && <PlannerView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'pulse' && <PulseView />}

          {/* Notifications in-screen overlay */}
          {notificationsOpen && (
            <NotificationsPanel 
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          )}
        </main>

        {/* Floating DPDP Demo Bar */}
        <FloatingDemoBar />

        {/* Mobile Bottom Navigation Bar (Phone-width layout) */}
        <nav className="md:hidden h-14 bg-[#123c30] border-t border-[#0d2e26] flex items-center justify-around px-2 z-30 flex-shrink-0">
        <button
          onClick={() => setActiveTab('dash')}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 text-[10px] font-bold ${
            activeTab === 'dash' ? 'text-[#5dcaa5]' : 'text-[#a9c4ba] hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 gap-0.5 text-[10px] font-bold ${
            activeTab === 'calls' ? 'text-[#1d9e75]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-5 h-5" />
          <span>Planner</span>
          {missedCount > 0 && (
            <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 text-[10px] font-bold ${
            activeTab === 'calendar' ? 'text-[#1d9e75]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarIcon className="w-5 h-5" />
          <span>Calendar</span>
        </button>
        <button
          onClick={() => setActiveTab('pulse')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 gap-0.5 text-[10px] font-bold ${
            activeTab === 'pulse' ? 'text-[#1d9e75]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Pulse</span>
          {dashboardTasks.length > 0 && (
            <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-[#f59e0b]" />
          )}
        </button>
      </nav>
      </div>

      {/* Overlays & Modals */}
      <LeadsModal />
      <ActiveCallOverlay />

      {/* Floating Toast Notification (Reference hcsToast) */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-7 left-1/2 -translate-x-1/2 bg-[#0f172a] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl z-[999999] flex items-center gap-2 border border-slate-700 animate-fadeIn whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default App;
