import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  PhoneCall, 
  Target, 
  Sparkles, 
  Award, 
  TrendingUp, 
  ChevronRight,
  ExternalLink 
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  needsAction: boolean;
  icon: string;
  color: string;
  title: string;
  time: string;
  cta?: string | null;
  target?: 'pulse-callcentre' | 'pulse-skill' | 'calls' | null;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    needsAction: true,
    icon: '☎️',
    color: '#854f0b',
    title: 'Sunita Rao is checking greeting-QA scores Friday — reply in #callcentre-team',
    time: '2:05pm',
    cta: 'Open #callcentre-team →',
    target: 'pulse-callcentre'
  },
  {
    id: 'n2',
    needsAction: true,
    icon: '🎯',
    color: '#5b21b6',
    title: 'Skill Improvement Coach is waiting on you to pick a skill to practice',
    time: 'Today',
    cta: 'Open Skill Improvement Coach →',
    target: 'pulse-skill'
  },
  {
    id: 'n3',
    needsAction: false,
    icon: '🌟',
    color: '#0f6e56',
    title: 'Your EMI-pitch rate hit 55% this shift — target met, nice work',
    time: '1:05pm',
    cta: null,
    target: null
  },
  {
    id: 'n4',
    needsAction: false,
    icon: '🏆',
    color: '#c8860a',
    title: 'You hit a 7-day SOP streak — kudos sent automatically',
    time: 'Yesterday',
    cta: null,
    target: null
  },
  {
    id: 'n5',
    needsAction: true,
    icon: '📞',
    color: '#185fa5',
    title: "1 callback still open from this morning's queue",
    time: '11:40am',
    cta: 'Open queue →',
    target: 'calls'
  },
  {
    id: 'n6',
    needsAction: false,
    icon: '📈',
    color: '#c2410c',
    title: 'Weekly call-quality summary was sent to your registered number',
    time: 'Mon 8:00am',
    cta: null,
    target: null
  }
];

export interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export type NotifFilter = 'all' | 'action' | 'alert';

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, setPlanSubTab, setActivePulseChannel, showToast } = useApp();
  const [filter, setFilter] = useState<NotifFilter>('all');
  const [loadedCount, setLoadedCount] = useState<number>(6);

  if (!isOpen) return null;

  // Filter list by selected tab
  const filteredBase = INITIAL_NOTIFICATIONS.filter((n) => {
    if (filter === 'action') return n.needsAction;
    if (filter === 'alert') return !n.needsAction;
    return true;
  });

  // Calculate action and alert counts
  const actionCount = INITIAL_NOTIFICATIONS.filter((n) => n.needsAction).length;
  const alertCount = INITIAL_NOTIFICATIONS.length - actionCount;

  // Generate shown notifications (replicating reference mock's load more 1w ago cycle)
  const shownItems: NotificationItem[] = [];
  for (let i = 0; i < loadedCount && filteredBase.length > 0; i++) {
    const base = filteredBase[i % filteredBase.length];
    const cycle = Math.floor(i / filteredBase.length);
    shownItems.push(
      cycle === 0 
        ? base 
        : {
            ...base,
            id: `${base.id}-cycle-${cycle}`,
            time: `${cycle}w ago`
          }
    );
  }

  const handleActionClick = (item: NotificationItem) => {
    if (item.target === 'pulse-callcentre') {
      setActiveTab('pulse');
      setActivePulseChannel('Call Centre Team');
      onClose();
    } else if (item.target === 'pulse-skill') {
      setActiveTab('pulse');
      setActivePulseChannel('AvaniBot');
      onClose();
      showToast('Skill Improvement Coach: Opened AvaniBot coaching session.');
    } else if (item.target === 'calls') {
      setActiveTab('calls');
      setPlanSubTab('outgoing');
      onClose();
    } else {
      showToast('Demo Alert: Informational notification acknowledged.');
    }
  };

  return (
    <div 
      id="notificationOverlay"
      className="absolute inset-0 z-[320] bg-[#f7f7f9] flex flex-col overflow-hidden text-slate-800 select-none"
    >
      {/* Header matching mock #notificationOverlay */}
      <div className="bg-white border-b border-[#e5e5ea] px-[14px] py-[14px] flex items-center gap-[10px] flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <button
          onClick={onClose}
          className="w-[32px] h-[32px] rounded-full bg-[#f0f0f3] hover:bg-[#e4e4e9] text-[#45454d] flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer border-none text-[16px] font-bold"
          title="Back"
          aria-label="Back"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-extrabold text-[#1a1a1a] leading-tight">
            Notifications
          </h2>
          <div className="text-[12px] text-[#8e8e93] font-normal mt-0.5">
            {actionCount} need action · {alertCount} alerts
          </div>
        </div>
      </div>

      {/* 3 Tabs: All, Needs action, Alerts (matching #notifFilterRow) */}
      <div className="bg-[#f2f2f7] mx-[12px] mt-[10px] rounded-[9px] p-[2px] flex items-center flex-shrink-0">
        <button
          type="button"
          onClick={() => { setFilter('all'); setLoadedCount(6); }}
          className={`flex-1 py-[6px] px-[11px] rounded-[7px] text-[12.5px] font-bold transition-all text-center cursor-pointer border-none ${
            filter === 'all'
              ? 'bg-white text-[#1a1a1a] shadow-sm'
              : 'bg-transparent text-[#8e8e93] hover:text-[#1a1a1a]'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => { setFilter('action'); setLoadedCount(6); }}
          className={`flex-1 py-[6px] px-[11px] rounded-[7px] text-[12.5px] font-bold transition-all text-center cursor-pointer border-none ${
            filter === 'action'
              ? 'bg-white text-[#1a1a1a] shadow-sm'
              : 'bg-transparent text-[#8e8e93] hover:text-[#1a1a1a]'
          }`}
        >
          Needs action
        </button>
        <button
          type="button"
          onClick={() => { setFilter('alert'); setLoadedCount(6); }}
          className={`flex-1 py-[6px] px-[11px] rounded-[7px] text-[12.5px] font-bold transition-all text-center cursor-pointer border-none ${
            filter === 'alert'
              ? 'bg-white text-[#1a1a1a] shadow-sm'
              : 'bg-transparent text-[#8e8e93] hover:text-[#1a1a1a]'
          }`}
        >
          Alerts
        </button>
      </div>

      {/* Notification List Body matching mock renderNotificationList */}
      <div className="flex-1 overflow-y-auto p-[12px] pb-[80px]">
        {shownItems.length === 0 ? (
          <div className="text-center py-[40px] px-[20px] text-[#8e8e93] text-[13.5px]">
            Nothing here right now.
          </div>
        ) : (
          shownItems.map((item) => (
            <div
              key={item.id}
              onClick={() => item.cta && handleActionClick(item)}
              className={`flex items-start gap-[11px] bg-white rounded-[10px] p-[11px_12px] mb-[8px] border-l-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                item.needsAction ? 'border-l-[#c8860a]' : 'border-l-[#d5d5da]'
              } ${item.cta ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}`}
            >
              {/* Icon box */}
              <div 
                className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center flex-shrink-0 text-[16px]"
                style={{ backgroundColor: `${item.color}22` }}
              >
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[6px] mb-[2px]">
                  <span 
                    className={`text-[11px] font-extrabold uppercase px-[7px] py-[1px] rounded-[6px] tracking-wide ${
                      item.needsAction 
                        ? 'bg-[#fff3d6] text-[#7a4a00]' 
                        : 'bg-[#f0f0f3] text-[#6b6b74]'
                    }`}
                  >
                    {item.needsAction ? 'ACTION NEEDED' : 'ALERT'}
                  </span>
                  <span className="text-[11.5px] text-[#a8a8ad]">
                    {item.time}
                  </span>
                </div>

                <div className="text-[13.5px] text-[#1a1a1a] leading-[1.4]">
                  {item.title}
                </div>

                {item.cta && (
                  <div className="text-[12.5px] font-bold text-[#185fa5] hover:underline mt-[4px]">
                    {item.cta}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Load More Button matching mock line 2524 */}
        {shownItems.length > 0 && (
          <div 
            onClick={() => setLoadedCount(prev => prev + 6)}
            className="text-center py-[12px] text-[13px] font-bold text-[#185fa5] hover:underline cursor-pointer select-none"
          >
            Load more ↓
          </div>
        )}
      </div>
    </div>
  );
};
