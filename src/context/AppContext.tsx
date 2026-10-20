import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MainTab, PlanSubTab, Lead, CallLog, PulseThread, CalendarEvent, QueueItem, DashboardTask } from '../types';
import { 
  INITIAL_LEADS, 
  INITIAL_CALL_LOGS, 
  INITIAL_PULSE_THREADS, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_QUEUE_CUSTOMERS, 
  INITIAL_DASHBOARD_TASKS 
} from '../data/mockData';
import { 
  loadCompletedTaskIds, 
  saveCompletedTaskIds, 
  clearCompletedTaskIds, 
  deriveActiveTasks 
} from '../utils/taskStorage';

import { CALL_LOGS_STORAGE_KEY, loadStoredCallLogs } from '../utils/sopReviewUtils';

interface AppContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  planSubTab: PlanSubTab;
  setPlanSubTab: (subTab: PlanSubTab) => void;
  leads: Lead[];
  activeLeadIndex: number;
  isLeadModalOpen: boolean;
  openLeadModal: (leadIdOrIndex?: string | number) => void;
  closeLeadModal: () => void;
  nextLead: () => void;
  prevLead: () => void;
  callLogs: CallLog[];
  addCallLog: (log: Omit<CallLog, 'id'>) => void;
  updateCallLogOutcome: (callId: string, notes: string, outcome: string) => void;
  updateLeadOrAddFromCall: (callData: {
    name: string;
    phone?: string;
    product?: string;
    value?: number;
    summary: string;
    outcome: string;
    duration: string;
  }) => void;
  pulseThreads: Record<string, PulseThread>;
  activePulseChannel: string;
  setActivePulseChannel: (channel: string) => void;
  sendPulseMessage: (channel: string, text: string) => void;
  calendarEvents: CalendarEvent[];
  needsInputState: {
    status: 'pending' | 'approved' | 'rejected';
    replyText: string;
  };
  resolveNeedsInput: (action: 'approve' | 'reject', reply?: string) => void;
  shiftDuration: number;
  agentName: string;
  earnings: number;
  // Dashboard specific items
  queueCustomers: QueueItem[];
  dashboardTasks: DashboardTask[];
  completedTaskIds: string[];
  resolveDashboardTask: (taskId: string, optionChosen: string) => void;
  resetTasks: () => void;
  openTaskThread: (thread: 'Call Centre Team' | 'AvaniBot', taskId?: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  dateRangeSheetOpen: boolean;
  setDateRangeSheetOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const CRM_LEADS_STORAGE_KEY = 'onground_crm_leads';

export const loadStoredLeads = (): Lead[] => {
  if (typeof window === 'undefined') return INITIAL_LEADS;
  try {
    const raw = localStorage.getItem(CRM_LEADS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[AppContext] Failed to load stored leads', err);
  }
  return INITIAL_LEADS;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('dash');
  const [planSubTab, setPlanSubTab] = useState<PlanSubTab>('outgoing');
  const [leads, setLeads] = useState<Lead[]>(loadStoredLeads);
  const [activeLeadIndex, setActiveLeadIndex] = useState<number>(0);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [callLogs, setCallLogs] = useState<CallLog[]>(() => loadStoredCallLogs(INITIAL_CALL_LOGS));
  const [pulseThreads, setPulseThreads] = useState<Record<string, PulseThread>>(INITIAL_PULSE_THREADS);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CALL_LOGS_STORAGE_KEY, JSON.stringify(callLogs));
      }
    } catch (err) {
      console.warn('[AppContext] Failed to persist call logs', err);
    }
  }, [callLogs]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CRM_LEADS_STORAGE_KEY, JSON.stringify(leads));
      }
    } catch (err) {
      console.warn('[AppContext] Failed to persist leads', err);
    }
  }, [leads]);
  const [activePulseChannel, setActivePulseChannel] = useState<string>('Call Centre Team');
  const [calendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [shiftDuration] = useState<number>(262); // 4m 22s initial
  const [agentName] = useState<string>('Arvind Rajan');
  
  // Reference Exact Earnings: ₹5,200
  const [earnings] = useState<number>(5200);

  // Reference Queue Customers (Priya Iyer, Suresh Nair)
  const [queueCustomers] = useState<QueueItem[]>(INITIAL_QUEUE_CUSTOMERS);

  // Canonical completed task IDs persisted in localStorage under 'onground_completed_task_ids'
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(loadCompletedTaskIds);

  // Derived active dashboard tasks (w1, w2, w3)
  const dashboardTasks = deriveActiveTasks(INITIAL_DASHBOARD_TASKS, completedTaskIds);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Date Filter state
  const [dateFilter, setDateFilter] = useState<string>('This Week');
  const [dateRangeSheetOpen, setDateRangeSheetOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Unified needs input state bridged directly to task 'w1'
  const isW1Completed = completedTaskIds.includes('w1');
  const needsInputState = {
    status: (isW1Completed ? 'approved' : 'pending') as 'pending' | 'approved' | 'rejected',
    replyText: isW1Completed ? 'Acknowledged & committed: greeting target active.' : ''
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const openLeadModal = (leadIdOrIndex?: string | number) => {
    if (typeof leadIdOrIndex === 'number') {
      setActiveLeadIndex(Math.max(0, Math.min(leadIdOrIndex, leads.length - 1)));
    } else if (typeof leadIdOrIndex === 'string') {
      const idx = leads.findIndex(l => l.id === leadIdOrIndex || l.name.toLowerCase().includes(leadIdOrIndex.toLowerCase()));
      if (idx !== -1) setActiveLeadIndex(idx);
    }
    setIsLeadModalOpen(true);
  };

  const closeLeadModal = () => setIsLeadModalOpen(false);

  const nextLead = () => {
    setActiveLeadIndex(prev => (prev + 1) % leads.length);
  };

  const prevLead = () => {
    setActiveLeadIndex(prev => (prev - 1 + leads.length) % leads.length);
  };

  const addCallLog = (log: Omit<CallLog, 'id'>) => {
    const newEntry: CallLog = {
      ...log,
      id: `c-${Date.now()}`
    };
    setCallLogs(prev => [newEntry, ...prev]);
  };

  const updateCallLogOutcome = (callId: string, notes: string, outcome: string) => {
    setCallLogs(prev => prev.map(log => {
      if (log.id === callId || (!callId && log === prev[0])) {
        return { ...log, notes, outcome };
      }
      return log;
    }));
  };

  const updateLeadOrAddFromCall = (callData: {
    name: string;
    phone?: string;
    product?: string;
    value?: number;
    summary: string;
    outcome: string;
    duration: string;
  }) => {
    setLeads(prev => {
      const leadIdx = prev.findIndex(l => 
        l.name.toLowerCase().includes(callData.name.toLowerCase()) || 
        callData.name.toLowerCase().includes(l.name.toLowerCase())
      );
      const noteText = `${callData.summary} (${callData.outcome})`;

      if (leadIdx !== -1) {
        const updated = [...prev];
        const existing = updated[leadIdx];
        const existingNotes = existing.notes || [];
        const hasNote = existingNotes.includes(noteText);
        updated[leadIdx] = {
          ...existing,
          notes: hasNote ? existingNotes : [noteText, ...existingNotes],
          badge: callData.outcome === 'Follow-up needed' ? 'Callback req' : callData.outcome,
          statusLabel: callData.outcome === 'Not interested' ? 'Cold' : 'Active'
        };
        return updated;
      } else {
        const initials = callData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'LR';
        const newLead: Lead = {
          id: `lead-${Date.now()}`,
          name: callData.name,
          initials,
          avatarBg: '#e1f5ee',
          avatarColor: '#0f6e56',
          interest: `Interested: ${callData.product || 'Ortho Grid Classic'}`,
          product: callData.product || 'Ortho Grid Classic',
          crossSell: 'Mattress Protector · ₹2,499',
          emi: '12-month 0% interest EMI scheme discussed',
          attractivenessScore: 85,
          expectedValue: callData.value || 16990,
          badge: callData.outcome,
          badgeBg: '#e1f5ee',
          badgeColor: '#0f6e56',
          statusLabel: 'Active',
          statusColor: '#0f6e56',
          quoteOn: true,
          icp: 88,
          icpColor: '#1d9e75',
          intentScore: 86,
          subscores: [
            { label: 'Budget Fit', pct: 90, color: '#1d9e75' },
            { label: 'Need Match', pct: 85, color: '#1d9e75' },
            { label: 'Decision Stage', pct: 83, color: '#1d9e75' }
          ],
          slaNote: null,
          notes: [noteText],
          problemBuckets: [
            { cat: 'Orthopedic Support', text: 'Back pain relief inquiry, validated SmartGRID features.' }
          ],
          journey: [
            { date: 'Today', channel: 'In-app Call', icon: 'Phone', color: '#185fa5', text: `Call lasted ${callData.duration}. Outcome: ${callData.outcome}` }
          ],
          phone: callData.phone || '+91 98450 xxxxx',
          actions: 'open'
        };
        return [newLead, ...prev];
      }
    });
  };

  const sendPulseMessage = (channel: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}`,
      who: 'You',
      init: 'AR',
      text: text.trim(),
      time: timeStr
    };

    setPulseThreads(prev => {
      const thread = prev[channel] || { title: `#${channel.toLowerCase().replace(/\s+/g, '-')}`, dateLabel: `Today · ${channel}`, messages: [] };
      return {
        ...prev,
        [channel]: {
          ...thread,
          messages: [...thread.messages, newMsg]
        }
      };
    });
  };

  const resolveNeedsInput = (action: 'approve' | 'reject', reply?: string) => {
    const chosen = reply || (action === 'approve' ? 'Confirmed' : 'Reschedule');
    resolveDashboardTask('w1', chosen);
  };

  // Resolve a dashboard task (w1, w2, w3) from either Dashboard or Pulse
  const resolveDashboardTask = (taskId: string, optionChosen: string) => {
    const task = INITIAL_DASHBOARD_TASKS.find(t => t.id === taskId);
    if (!task) return;

    if (!completedTaskIds.includes(taskId)) {
      const nextCompleted = [...completedTaskIds, taskId];
      setCompletedTaskIds(nextCompleted);
      saveCompletedTaskIds(nextCompleted);
    }

    // Send the resolution into the target Pulse thread
    sendPulseMessage(task.thread, `<b>[Actioned Task]</b> ${task.q}: <i>${optionChosen}</i>`);

    // Show reference confirmation toast
    showToast('Task done · removed from My Tasks');
  };

  // Safe testing and development task state reset
  const resetTasks = () => {
    setCompletedTaskIds([]);
    clearCompletedTaskIds();
    showToast('Tasks reset to default');
  };

  // Open Pulse channel associated with task
  const openTaskThread = (thread: 'Call Centre Team' | 'AvaniBot', taskId?: string) => {
    setActivePulseChannel(thread);
    setActiveTab('pulse');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        planSubTab,
        setPlanSubTab,
        leads,
        activeLeadIndex,
        isLeadModalOpen,
        openLeadModal,
        closeLeadModal,
        nextLead,
        prevLead,
        callLogs,
        addCallLog,
        updateCallLogOutcome,
        updateLeadOrAddFromCall,
        pulseThreads,
        activePulseChannel,
        setActivePulseChannel,
        sendPulseMessage,
        calendarEvents,
        needsInputState,
        resolveNeedsInput,
        shiftDuration,
        agentName,
        earnings,
        queueCustomers,
        dashboardTasks,
        completedTaskIds,
        resolveDashboardTask,
        resetTasks,
        openTaskThread,
        toastMessage,
        showToast,
        dateFilter,
        setDateFilter,
        dateRangeSheetOpen,
        setDateRangeSheetOpen,
        notificationsOpen,
        setNotificationsOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
