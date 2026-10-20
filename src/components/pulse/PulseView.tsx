import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Pin, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Headphones, 
  ShoppingCart, 
  CheckSquare, 
  Target, 
  Mic, 
  Send,
  MessageCircle,
  Phone,
  Search,
  Plus
} from 'lucide-react';

export const PulseView: React.FC = () => {
  const { 
    pulseThreads, 
    activePulseChannel, 
    setActivePulseChannel, 
    sendPulseMessage, 
    dashboardTasks,
    resolveDashboardTask,
    openLeadModal,
    showToast
  } = useApp();

  const [chatOverlayOpen, setChatOverlayOpen] = useState<boolean>(false);
  const [customerListOpen, setCustomerListOpen] = useState<boolean>(false);
  const [kudosOverlayOpen, setKudosOverlayOpen] = useState<boolean>(false);
  const [customAgentsOpen, setCustomAgentsOpen] = useState<boolean>(true);
  const [newMsgMenuOpen, setNewMsgMenuOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isPinnedOpen, setIsPinnedOpen] = useState<boolean>(true);
  const [customAnswers, setCustomAnswers] = useState<{ [id: string]: string }>({});
  const [inputErrors, setInputErrors] = useState<{ [id: string]: string }>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const currentThread = pulseThreads[activePulseChannel] || Object.values(pulseThreads)[0];
  const activeChannelTasks = dashboardTasks.filter(t => t.thread === activePulseChannel);
  const totalTasksCount = 2;

  const openChannel = (ch: string) => {
    setActivePulseChannel(ch);
    setChatOverlayOpen(true);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    sendPulseMessage(activePulseChannel, inputMessage);
    setInputMessage('');
  };

  const emojis = ['👍', '🙌', '🔥', '💪', '🏆', '😊', '✅', '❤️', '🎉', '📢', '💡', '🛏️'];

  return (
    <div className="flex-1 flex flex-col bg-[#f2f2f7] overflow-y-auto relative select-none font-sans">
      {/* Pulse Main Workspace List matching mock #asc-pulse */}
      <div id="asc-pulse" className="flex-1 flex flex-col pb-[90px]">
        {/* Header matching mock lines 1180-1197 */}
        <div className="bg-gradient-to-r from-[#3b1a5a] to-[#6b2fa0] px-[14px] pt-[10px] pb-[10px] flex-shrink-0 relative shadow-sm">
          <div className="flex items-center gap-[8px]">
            {/* Slack 4-square icon */}
            <div className="w-[26px] h-[26px] rounded-[8px] bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.5" fill="#E01E5A"/>
                <rect x="10" y="1" width="5" height="5" rx="1.5" fill="#36C5F0"/>
                <rect x="1" y="10" width="5" height="5" rx="1.5" fill="#2EB67D"/>
                <rect x="10" y="10" width="5" height="5" rx="1.5" fill="#ECB22E"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0 flex items-baseline gap-[6px]">
              <span className="text-[16px] font-[700] text-white">Pulse</span>
              <span className="text-[12.5px] text-white/60 truncate" id="pulseBrandLine">
                The Sleep Company · Koramangala
              </span>
            </div>
            {/* New message plus button */}
            <button 
              onClick={() => setNewMsgMenuOpen(prev => !prev)} 
              id="pulseCreateBtn" 
              title="New message" 
              className="w-[30px] h-[30px] rounded-full bg-white border-none shadow-[0_2px_8px_rgba(0,0,0,0.28)] cursor-pointer flex items-center justify-center flex-shrink-0 text-[#3b1a5a]"
            >
              <Plus className="w-4 h-4 text-[#3b1a5a] stroke-[3]" />
            </button>

            {/* New Msg Dropdown Menu */}
            {newMsgMenuOpen && (
              <div 
                id="pulseNewMsgMenu" 
                className="absolute top-[44px] right-[14px] bg-white rounded-[12px] shadow-[0_10px_28px_rgba(0,0,0,0.22)] min-w-[190px] overflow-hidden z-[400] border border-slate-100"
              >
                <div className="px-[14px] pt-[9px] pb-[5px] text-[12.5px] font-[700] text-[#8e8e93] uppercase tracking-[0.4px]">
                  New message
                </div>
                <div 
                  onClick={() => { setNewMsgMenuOpen(false); openChannel('Sunita Rao'); }} 
                  className="px-[14px] py-[10px] text-[14px] font-[600] text-[#1a1a1a] hover:bg-slate-50 cursor-pointer flex items-center gap-[9px]"
                >
                  <span className="w-[22px] h-[22px] rounded-full bg-[#FFD700] text-[#3a2a00] text-[12.5px] font-[800] flex items-center justify-center">SR</span>
                  Sunita Rao
                </div>
                <div 
                  onClick={() => { setNewMsgMenuOpen(false); openChannel('Priya Krishnan'); }} 
                  className="px-[14px] py-[10px] text-[14px] font-[600] text-[#1a1a1a] hover:bg-slate-50 cursor-pointer flex items-center gap-[9px]"
                >
                  <span className="w-[22px] h-[22px] rounded-full bg-[#fdecec] text-[#c23331] text-[12.5px] font-[800] flex items-center justify-center">PK</span>
                  Priya Krishnan
                </div>
                <div 
                  onClick={() => { setNewMsgMenuOpen(false); openChannel('Raju Kumar'); }} 
                  className="px-[14px] py-[10px] text-[14px] font-[600] text-[#1a1a1a] hover:bg-slate-50 cursor-pointer flex items-center gap-[9px]"
                >
                  <span className="w-[22px] h-[22px] rounded-full bg-[#e1f5ee] text-[#0f6e56] text-[12.5px] font-[800] flex items-center justify-center">RK</span>
                  Raju Kumar
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Search Card matching mock line 1201 */}
        <div 
          onClick={() => openChannel('AvaniBot')} 
          className="mx-[12px] my-[10px] mb-[4px] flex items-center gap-[8px] bg-white border-[1.5px] border-[#e5e5ea] rounded-[12px] px-[12px] py-[10px] cursor-pointer shadow-[0_1px_3px_rgba(16,24,40,0.05)]"
        >
          <div className="w-[26px] h-[26px] rounded-[8px] bg-[#7c3aed] flex items-center justify-center flex-shrink-0 text-[14.5px] text-white">
            ✨
          </div>
          <span className="text-[13.5px] text-[#8e8e93] flex-1">
            Ask AvaniBot or search Pulse…
          </span>
          <Search className="w-4 h-4 text-[#c5c5c5]" />
          {totalTasksCount > 0 && (
            <span className="flex items-center gap-1 bg-[#f59e0b] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm ml-1">
              <span className="text-[11px]">📌</span>
              <span>{totalTasksCount}</span>
            </span>
          )}
        </div>

        {/* AvaniBot ALWAYS ON Hero Card matching mock lines 1210-1223 */}
        <div 
          onClick={() => openChannel('AvaniBot')} 
          className="relative mx-[12px] my-[6px] rounded-[16px] p-[14px] cursor-pointer text-white overflow-hidden shadow-sm"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
        >
          <div className="flex items-center gap-[10px] relative z-10 mb-[10px]">
            <div className="w-[38px] h-[38px] rounded-full bg-white/20 flex items-center justify-center text-[18px] flex-shrink-0 shadow-inner">
              ✨
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[6px]">
                <span className="text-[15px] font-[800] text-white">AvaniBot</span>
                <span className="text-[11.5px] font-[800] text-white bg-white/20 px-[7px] py-[2px] rounded-[8px] tracking-[0.3px]">
                  ALWAYS ON
                </span>
              </div>
              <div className="text-[12.5px] text-[#e4d9fc] mt-[1px]">
                Ask me about anything happening in Pulse — daily briefs, action items, quick answers
              </div>
            </div>
          </div>
          <div className="flex gap-[7px] relative z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); openChannel('AvaniBot'); }} 
              className="flex-1 py-[8px] border-none rounded-[9px] bg-white/16 hover:bg-white/24 text-white text-[13px] font-[700] cursor-pointer flex items-center justify-center gap-[5px] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Brief</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); openChannel('AvaniBot'); }} 
              className="flex-1 py-[8px] border-none rounded-[9px] bg-white/16 hover:bg-white/24 text-white text-[13px] font-[700] cursor-pointer flex items-center justify-center gap-[5px] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask a question</span>
            </button>
          </div>
          {totalTasksCount > 0 && (
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                <span className="text-[11px]">📌</span>
                <span>{totalTasksCount}</span>
              </span>
            </div>
          )}
        </div>

        {/* Custom Agents Accordion matching mock lines 1226-1233 & lines 5560-5575 */}
        <div className="mx-[12px] my-[6px] bg-white border-[1.5px] border-[#ece2fb] rounded-[14px] overflow-hidden shadow-sm">
          <div 
            onClick={() => setCustomAgentsOpen(prev => !prev)} 
            className="flex items-center gap-[10px] px-[12px] py-[11px] cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <span className="w-[30px] h-[30px] rounded-[9px] bg-[#f1ecff] text-[#7c3aed] flex items-center justify-center flex-shrink-0 text-[16px]">
              ✨
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[14.5px] font-[800] text-[#1a1a1a]">Custom Agents</div>
              <div className="text-[13px] text-[#8e8e93]">Set up by your manager — already live, tap to open</div>
            </div>
            {customAgentsOpen ? (
              <ChevronUp className="w-4 h-4 text-[#8e8e93]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8e8e93]" />
            )}
          </div>

          {customAgentsOpen && (
            <div className="px-[10px] pb-[10px] pt-[2px] bg-white">
              {/* ROLE AGENTS */}
              <div className="pt-[8px] pb-[4px] px-[2px] flex items-center gap-[8px]">
                <span className="text-[12px] font-[800] text-[#6d28d9] tracking-[0.4px]">ROLE AGENTS</span>
                <span className="text-[11.5px] text-[#8e8e93]">run a team</span>
              </div>

              {/* # callcentre-agent */}
              <div 
                onClick={() => openChannel('Call Centre Team')}
                className="flex items-center gap-[10px] my-[5px] p-[9px_11px] bg-white border border-[#e6e8f0] border-l-[4px] border-l-[#2563eb] rounded-[10px] cursor-pointer hover:shadow-sm transition-all"
              >
                <div className="w-[30px] h-[30px] rounded-[9px] bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-[800] text-[#1a1a1a] truncate"># callcentre-agent</div>
                  <div className="text-[12px] text-[#6b7280] truncate">Call Centre Agent</div>
                </div>
                <div className="text-right flex-shrink-0">
                  {totalTasksCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                      <span className="text-[11px]">📌</span>
                      <span>{totalTasksCount}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* TASK AGENTS */}
              <div className="pt-[10px] pb-[4px] px-[2px] flex items-center gap-[8px]">
                <span className="text-[12px] font-[800] text-[#6d28d9] tracking-[0.4px]">TASK AGENTS</span>
                <span className="text-[11.5px] text-[#8e8e93]">move one metric</span>
              </div>

              {/* # cross-sell-agent */}
              <div 
                onClick={() => openChannel('Quotation Tickets')}
                className="flex items-center gap-[10px] my-[5px] p-[9px_11px] bg-white border border-[#e6e8f0] border-l-[4px] border-l-[#8b5cf6] rounded-[10px] cursor-pointer hover:shadow-sm transition-all"
              >
                <div className="w-[30px] h-[30px] rounded-[9px] bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-[800] text-[#1a1a1a] truncate"># cross-sell-agent</div>
                  <div className="text-[12px] text-[#6b7280] truncate">Your Attach rate · 5 members</div>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <span className="text-[14px] font-[800] text-[#15803d]">24% <span className="text-[11.5px]">▲2</span></span>
                  {totalTasksCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                      <span className="text-[11px]">📌</span>
                      <span>{totalTasksCount}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* # sop-agent */}
              <div 
                onClick={() => openChannel('Avani AI Coaching')}
                className="flex items-center gap-[10px] my-[5px] p-[9px_11px] bg-white border border-[#e6e8f0] border-l-[4px] border-l-[#0d9488] rounded-[10px] cursor-pointer hover:shadow-sm transition-all"
              >
                <div className="w-[30px] h-[30px] rounded-[9px] bg-[#0d9488]/10 text-[#0d9488] flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-[800] text-[#1a1a1a] truncate"># sop-agent</div>
                  <div className="text-[12px] text-[#6b7280] truncate">Your SOP adherence · 5 members</div>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <span className="text-[14px] font-[800] text-[#15803d]">81% <span className="text-[11.5px]">▲2</span></span>
                  {totalTasksCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                      <span className="text-[11px]">📌</span>
                      <span>{totalTasksCount}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* # lead-conversion-agent */}
              <div 
                onClick={() => openChannel('Manage Shipment')}
                className="flex items-center gap-[10px] my-[5px] p-[9px_11px] bg-white border border-[#e6e8f0] border-l-[4px] border-l-[#e11d48] rounded-[10px] cursor-pointer hover:shadow-sm transition-all"
              >
                <div className="w-[30px] h-[30px] rounded-[9px] bg-[#e11d48]/10 text-[#e11d48] flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-[800] text-[#1a1a1a] truncate"># lead-conversion-agent</div>
                  <div className="text-[12px] text-[#6b7280] truncate">Lead Conversion Agent</div>
                </div>
                <div className="text-right flex-shrink-0">
                  {totalTasksCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                      <span className="text-[11px]">📌</span>
                      <span>{totalTasksCount}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* # capture-agent */}
              <div 
                onClick={() => openChannel('Call Centre Team')}
                className="flex items-center gap-[10px] my-[5px] p-[9px_11px] bg-white border border-[#e6e8f0] border-l-[4px] border-l-[#0891b2] rounded-[10px] cursor-pointer hover:shadow-sm transition-all"
              >
                <div className="w-[30px] h-[30px] rounded-[9px] bg-[#0891b2]/10 text-[#0891b2] flex items-center justify-center flex-shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-[800] text-[#1a1a1a] truncate"># capture-agent</div>
                  <div className="text-[12px] text-[#6b7280] truncate">Your Capture coverage · 5 members</div>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <span className="text-[14px] font-[800] text-[#15803d]">78% <span className="text-[11.5px]">▲1</span></span>
                  {totalTasksCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                      <span className="text-[11px]">📌</span>
                      <span>{totalTasksCount}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GENERAL Section matching mock lines 1235-1240 */}
        <div className="px-[12px] pt-[10px] pb-[2px] text-[12.5px] font-[700] text-[#8e8e93] uppercase tracking-[0.5px]">
          General
        </div>
        <div 
          onClick={() => setCustomerListOpen(true)}
          className="slack-ch-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <span className="slack-ch-hash text-[#25D366] text-[16px]">
            💬
          </span>
          <div className="slack-ch-body flex-1 min-w-0">
            <span className="slack-ch-name text-[14px] font-[700] text-[#1a1a1a] block truncate">
              customer-discussions
            </span>
            <span className="slack-ch-meta text-[12px] text-[#8e8e93] block truncate">
              Relayed via WhatsApp Business
            </span>
          </div>
          <span className="slack-ch-badge bg-[#25D366] text-white text-[11px] font-[800] px-[7px] py-[1px] rounded-full">
            2
          </span>
        </div>

        {/* Kudos Hero Card matching mock lines 1246-1256 */}
        <div 
          onClick={() => setKudosOverlayOpen(true)}
          className="kudos-hero-card mx-[12px] my-[6px] rounded-[16px] p-[14px] cursor-pointer text-white overflow-hidden shadow-sm"
          style={{ background: 'linear-gradient(135deg, #c8860a, #e0a52f)' }}
        >
          <div className="flex items-center gap-[10px] relative z-10">
            <div className="w-[40px] h-[40px] rounded-full bg-white/20 flex items-center justify-center text-[20px] flex-shrink-0 shadow-inner">
              🏆
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[6px]">
                <span className="text-[14.5px] font-[800] text-white">Kudos</span>
                <span className="text-[12.5px] font-[800] text-[#7c4a00] bg-white px-[7px] py-[2px] rounded-[8px]">
                  3 NEW
                </span>
              </div>
              <div className="text-[12.5px] text-[#fff3d6] mt-[2px] truncate">
                "Great work with Mukunda — closed that objection beautifully!" — Sunita Rao
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-[17px] font-[800] text-white">12</div>
              <div className="text-[12px] text-[#fff3d6] font-[700] uppercase">All-time</div>
            </div>
          </div>
        </div>

        {/* Channels Section matching mock lines 1258-1292 */}
        <div className="px-[12px] pt-[8px] pb-[4px] text-[12.5px] font-[700] text-[#8e8e93] uppercase tracking-[0.5px]">
          Channels
        </div>

        {/* # callcentre-team */}
        <div 
          onClick={() => openChannel('Call Centre Team')}
          className="slack-ch-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <span className="slack-ch-hash text-[#8e8e93] text-[15px] font-bold">#</span>
          <div className="slack-ch-body flex-1 min-w-0">
            <span className="slack-ch-name text-[14px] font-[700] text-[#1a1a1a] block truncate">callcentre-team</span>
            <span className="slack-ch-meta text-[12px] text-[#8e8e93] block truncate">Manager: Review call QA scores this week!</span>
          </div>
          {totalTasksCount > 0 && (
            <span className="inline-flex items-center gap-1 bg-[#f59e0b] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
              <span className="text-[11px]">📌</span>
              <span>{totalTasksCount}</span>
            </span>
          )}
        </div>

        {/* # all-stores */}
        <div 
          onClick={() => openChannel('All Stores')}
          className="slack-ch-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <span className="slack-ch-hash text-[#8e8e93] text-[15px] font-bold">#</span>
          <div className="slack-ch-body flex-1 min-w-0">
            <span className="slack-ch-name text-[14px] font-[700] text-[#1a1a1a] block truncate">all-stores</span>
            <span className="slack-ch-meta text-[12px] text-[#8e8e93] block truncate">New Ortho Grid campaign from 1 June!</span>
          </div>
          <span className="slack-ch-time text-[11.5px] text-[#8e8e93]">10:22am</span>
          <span className="slack-ch-badge bg-[#ef4444] text-white text-[11px] font-[800] px-[7px] py-[1px] rounded-full">4</span>
        </div>

        {/* # avani-coaching */}
        <div 
          onClick={() => openChannel('Avani AI Coaching')}
          className="slack-ch-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <span className="slack-ch-hash text-[#7c3aed] text-[15px]">✨</span>
          <div className="slack-ch-body flex-1 min-w-0">
            <span className="slack-ch-name text-[14px] font-[700] text-[#1a1a1a] block truncate">avani-coaching</span>
            <span className="slack-ch-meta text-[12px] text-[#8e8e93] block truncate">Your warranty score dropped 12% this week</span>
          </div>
          <span className="slack-ch-time text-[11.5px] text-[#8e8e93]">9:01am</span>
          <span className="slack-ch-badge bg-[#7c3aed] text-white text-[11px] font-[800] px-[7px] py-[1px] rounded-full">1</span>
        </div>

        {/* # manage-shipment */}
        <div 
          onClick={() => openChannel('Manage Shipment')}
          className="slack-ch-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <span className="slack-ch-hash text-[#8e8e93] text-[15px] font-bold">#</span>
          <div className="slack-ch-body flex-1 min-w-0">
            <span className="slack-ch-name text-[14px] font-[700] text-[#1a1a1a] block truncate">manage-shipment</span>
            <span className="slack-ch-meta text-[12px] text-[#8e8e93] block truncate">📦 Ortho Grid Pro — ready for delivery ✓</span>
          </div>
          <span className="slack-ch-time text-[11.5px] text-[#8e8e93]">10:05am</span>
          <span className="slack-ch-badge bg-[#3b82f6] text-white text-[11px] font-[800] px-[7px] py-[1px] rounded-full">1</span>
        </div>

        {/* # quotation-tickets */}
        <div 
          onClick={() => openChannel('Quotation Tickets')}
          className="slack-ch-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <span className="slack-ch-hash text-[#8e8e93] text-[15px] font-bold">#</span>
          <div className="slack-ch-body flex-1 min-w-0">
            <span className="slack-ch-name text-[14px] font-[700] text-[#1a1a1a] block truncate">quotation-tickets</span>
            <span className="slack-ch-meta text-[12px] text-[#8e8e93] block truncate">🎫 Quotation approval — awaiting approval</span>
          </div>
          <span className="slack-ch-time text-[11.5px] text-[#8e8e93]">9:12am</span>
          <span className="slack-ch-badge bg-[#f59e0b] text-white text-[11px] font-[800] px-[7px] py-[1px] rounded-full">1</span>
        </div>

        {/* # new-hire-onboarding */}
        <div 
          onClick={() => openChannel('New Hire Onboarding')}
          className="slack-ch-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <span className="slack-ch-hash text-[#8e8e93] text-[15px] font-bold">#</span>
          <div className="slack-ch-body flex-1 min-w-0">
            <span className="slack-ch-name text-[14px] font-[700] text-[#1a1a1a] block truncate">new-hire-onboarding</span>
            <span className="slack-ch-meta text-[12px] text-[#8e8e93] block truncate">🎉 Welcome to the team!</span>
          </div>
          <span className="slack-ch-time text-[11.5px] text-[#8e8e93]">8:30am</span>
        </div>

        {/* Direct Messages Section matching mock lines 1294-1309 */}
        <div className="px-[12px] pt-[14px] pb-[4px] text-[12.5px] font-[700] text-[#8e8e93] uppercase tracking-[0.5px]">
          Direct Messages
        </div>

        <div 
          onClick={() => openChannel('Sunita Rao')}
          className="ios-chat-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <div className="ios-av w-[36px] h-[36px] rounded-full bg-[#faeeda] text-[#854f0b] font-bold text-[14px] flex items-center justify-center flex-shrink-0">
            SR
          </div>
          <div className="ios-cm flex-1 min-w-0">
            <div className="ios-cn text-[14px] font-[700] text-[#1a1a1a] flex items-center gap-[5px]">
              Sunita Rao <span className="text-[11px] bg-[#FFD700] text-[#3a2a00] px-[5px] py-[1px] rounded-[5px] font-[800]">MGR</span>
            </div>
            <div className="ios-cp text-[12.5px] text-[#8e8e93] truncate">
              🌟 Great work with Mukunda — keep it up
            </div>
          </div>
          <div className="ios-cr text-[11.5px] text-[#8e8e93]">12:40pm</div>
        </div>

        <div 
          onClick={() => openChannel('Priya Krishnan')}
          className="ios-chat-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <div className="ios-av w-[36px] h-[36px] rounded-full bg-[#fdecec] text-[#c23331] font-bold text-[14px] flex items-center justify-center flex-shrink-0">
            PK
          </div>
          <div className="ios-cm flex-1 min-w-0">
            <div className="ios-cn text-[14px] font-[700] text-[#1a1a1a]">Priya Krishnan</div>
            <div className="ios-cp text-[12.5px] text-[#8e8e93] truncate">Can you cover my 3pm slot today?</div>
          </div>
          <div className="ios-cr text-[11.5px] text-[#8e8e93]">9:55am</div>
        </div>

        <div 
          onClick={() => openChannel('Raju Kumar')}
          className="ios-chat-row flex items-center gap-[10px] px-[12px] py-[9px] bg-white mx-[12px] my-[3px] rounded-[12px] cursor-pointer hover:bg-slate-50 border border-slate-100 shadow-sm"
        >
          <div className="ios-av w-[36px] h-[36px] rounded-full bg-[#e1f5ee] text-[#0f6e56] font-bold text-[14px] flex items-center justify-center flex-shrink-0">
            RK
          </div>
          <div className="ios-cm flex-1 min-w-0">
            <div className="ios-cn text-[14px] font-[700] text-[#1a1a1a]">Raju Kumar</div>
            <div className="ios-cp text-[12.5px] text-[#8e8e93] truncate">Nice cross-sell on the Tranquo chair! 🔥</div>
          </div>
          <div className="ios-cr text-[11.5px] text-[#8e8e93]">Yesterday</div>
        </div>
      </div>

      {/* Chat Overlay matching mock #pulseChatOverlay lines 1403-1440 */}
      {chatOverlayOpen && (
        <div 
          id="pulseChatOverlay"
          className="absolute inset-0 bg-white z-[300] flex flex-col animate-in fade-in duration-150"
        >
          {/* Header */}
          <div className="bg-[#3b1a5a] px-[14px] py-[12px] flex items-center gap-[10px] flex-shrink-0">
            <button 
              onClick={() => setChatOverlayOpen(false)} 
              title="Back" 
              className="bg-white/20 hover:bg-white/30 border-none rounded-full w-[32px] h-[32px] flex items-center justify-center text-white text-[16px] font-bold cursor-pointer flex-shrink-0 transition-colors"
            >
              ←
            </button>
            <div id="pchatTitle" className="text-[15px] font-[700] text-white flex-1 truncate">
              #{currentThread.title || activePulseChannel}
            </div>
            <button 
              onClick={() => showToast('AvaniBot AI assistant search activated.')}
              title="Ask AvaniBot about this channel" 
              className="bg-white/15 hover:bg-white/25 border-none rounded-full w-[28px] h-[28px] flex items-center justify-center cursor-pointer flex-shrink-0 text-white transition-colors"
            >
              ✨
            </button>
          </div>

          {/* Dynamic Pinned "Needs your input" Bar (Mock Exact Requirement HCPin) */}
          {activeChannelTasks.length > 0 && (
            <div className="bg-[#fffaf0] border-b-[1.5px] border-[#f59e0b] p-[8px_12px] max-h-[46%] overflow-y-auto flex-shrink-0 z-[2] shadow-[0_2px_6px_rgba(146,64,14,0.08)]">
              {/* Header / Toggle */}
              <div 
                onClick={() => setIsPinnedOpen(prev => !prev)}
                className="flex items-center gap-[7px] cursor-pointer select-none"
              >
                <Pin className="w-4 h-4 text-[#b45309]" />
                <span className="text-[13.5px] font-[800] text-[#7a4a00]">Needs your input</span>
                <span className="bg-[#ef4444] text-white text-[11.5px] font-[800] px-[7px] py-[1px] rounded-[9px]">
                  {activeChannelTasks.length}
                </span>
                <span className="text-[12px] text-[#a16207]">pinned</span>
                <div className="ml-auto text-[#b45309]">
                  {isPinnedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Collapsed State Preview */}
              {!isPinnedOpen ? (
                <div className="text-xs text-slate-800 mt-1 truncate">
                  <span>{activeChannelTasks[0].q}</span>
                  {activeChannelTasks.length > 1 && (
                    <span className="text-[#a16207] font-bold ml-1.5">
                      +{activeChannelTasks.length - 1} more
                    </span>
                  )}
                </div>
              ) : (
                /* Expanded Tasks List */
                <div className="flex flex-col gap-2 mt-2">
                  {activeChannelTasks.map(task => (
                    <div 
                      key={task.id}
                      data-pin-tid={task.id}
                      className="bg-white border border-[#fde3b0] rounded-xl p-3 shadow-sm"
                    >
                      <div className="font-bold text-slate-900 text-sm">
                        {task.q}
                      </div>
                      {task.ctx && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {task.ctx}
                        </div>
                      )}

                      {/* Quick Option Buttons */}
                      {task.opts && task.opts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {task.opts.map(opt => (
                            <button
                              key={opt}
                              onClick={() => resolveDashboardTask(task.id, opt)}
                              className="border border-[#d6d6db] hover:border-emerald-500 hover:bg-emerald-50 bg-white text-slate-900 text-xs font-bold rounded-lg px-2.5 py-1.5 transition-all shadow-sm cursor-pointer"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Custom Input */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <input
                          id={`hcPinIn-${task.id}`}
                          placeholder="Or type your answer"
                          value={customAnswers[task.id] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomAnswers(prev => ({ ...prev, [task.id]: val }));
                            if (inputErrors[task.id]) {
                              setInputErrors(prev => ({ ...prev, [task.id]: '' }));
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const text = (customAnswers[task.id] || '').trim();
                              if (!text) {
                                setInputErrors(prev => ({ ...prev, [task.id]: 'Type an answer first' }));
                                return;
                              }
                              resolveDashboardTask(task.id, text);
                              setCustomAnswers(prev => ({ ...prev, [task.id]: '' }));
                            }
                          }}
                          className="flex-1 min-w-0 border border-[#e5e5ea] focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const text = (customAnswers[task.id] || '').trim();
                            if (!text) {
                              setInputErrors(prev => ({ ...prev, [task.id]: 'Type an answer first' }));
                              return;
                            }
                            resolveDashboardTask(task.id, text);
                            setCustomAnswers(prev => ({ ...prev, [task.id]: '' }));
                          }}
                          className="bg-[#92400e] hover:bg-[#78350f] text-white text-xs font-bold rounded-lg px-3 py-1.5 transition-colors shadow-sm cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                      {inputErrors[task.id] && (
                        <div className="text-[11px] text-red-600 font-semibold mt-1">
                          {inputErrors[task.id]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat Messages Body */}
          <div id="pchatBody" className="flex-1 overflow-y-auto p-[12px_14px] bg-[#f9f9f9] flex flex-col gap-[10px]">
            {currentThread.messages.map((msg) => {
              const isUser = msg.who === 'You';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-[8px] max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div 
                    className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[12.5px] flex-shrink-0 shadow-sm"
                    style={{ 
                      backgroundColor: isUser ? '#1d9e75' : (msg.bg || '#e2e8f0'), 
                      color: isUser ? '#ffffff' : (msg.color || '#334155') 
                    }}
                  >
                    {msg.init}
                  </div>

                  {/* Bubble */}
                  <div className="flex flex-col gap-1">
                    <div className={`flex items-center gap-2 text-[11px] ${isUser ? 'justify-end' : ''}`}>
                      <span className="font-bold text-[#1a1a1a]">{msg.who}</span>
                      <span className="text-[#8e8e93]">{msg.time}</span>
                    </div>

                    {msg.text && (
                      <div 
                        className={`p-[10px_14px] rounded-[14px] text-[13px] leading-relaxed shadow-sm ${
                          isUser 
                            ? 'bg-[#1d9e75] text-white rounded-tr-none' 
                            : 'bg-white border border-[#e5e5ea] text-[#1a1a1a] rounded-tl-none'
                        }`}
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    )}

                    {/* Interactive Card if present */}
                    {msg.card && (
                      <div className="bg-[#fafafc] border border-[#e5e5ea] rounded-[9px] p-[8px_10px] mt-[5px] max-w-[260px] text-xs">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 font-bold text-slate-900">
                          <span>{msg.card.title}</span>
                          {msg.card.badge && (
                            <span className="text-[10px] font-extrabold bg-[#e1f5ee] text-[#0f6e56] px-1.5 py-0.5 rounded">
                              {msg.card.badge}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 my-2 text-[11px]">
                          {msg.card.fields?.map(([k, v], i) => (
                            <div key={i}>
                              <span className="text-[#8e8e93]">{k}:</span>
                              <div className="font-bold text-slate-800">{v}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
                          {msg.card.actions?.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                if (act.actionType === 'open-lead') openLeadModal('lead-1');
                              }}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                act.style === 'primary' 
                                  ? 'bg-[#1d9e75] text-white' 
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Compose Bar matching mock lines 1412-1439 */}
          <div className="bg-white border-t border-[#e5e5ea] p-[8px_10px] flex-shrink-0">
            <div className="flex gap-[8px] items-center">
              <div className="flex-1 bg-[#f2f2f7] rounded-[20px] px-[12px] py-[8px] min-h-[36px] flex items-center">
                <input 
                  type="text"
                  placeholder={`Message #${currentThread.title || activePulseChannel}…`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  className="w-full bg-transparent border-none text-[13.5px] text-[#1a1a1a] outline-none"
                />
              </div>
              <button 
                onClick={() => setShowEmojiPicker(prev => !prev)} 
                className="w-[32px] h-[32px] rounded-full bg-[#f2f2f7] hover:bg-[#e4e4e9] border-none flex items-center justify-center cursor-pointer flex-shrink-0 text-[17px] transition-colors"
              >
                😊
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-[32px] h-[32px] rounded-full bg-[#1d9e75] hover:bg-[#168a65] disabled:opacity-40 border-none flex items-center justify-center cursor-pointer flex-shrink-0 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="pt-[8px] flex flex-wrap gap-[6px]">
                {emojis.map((em) => (
                  <span 
                    key={em}
                    onClick={() => { setInputMessage(prev => prev + em); setShowEmojiPicker(false); }}
                    className="text-[20px] cursor-pointer hover:scale-125 transition-transform p-1"
                  >
                    {em}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CUSTOMER DISCUSSIONS OVERLAY matching mock lines 1313-1342 */}
      {customerListOpen && (
        <div 
          id="pulseCustomerListOverlay" 
          className="absolute inset-0 bg-[#eceef4] z-[325] flex flex-col animate-in fade-in duration-150"
        >
          <div className="bg-gradient-to-r from-[#0f6e56] to-[#128C7E] p-[12px_14px] flex items-center gap-[10px] flex-shrink-0">
            <button 
              onClick={() => setCustomerListOpen(false)} 
              title="Back" 
              className="bg-white/20 hover:bg-white/30 border-none rounded-full w-[32px] h-[32px] flex items-center justify-center text-white text-[16px] font-bold cursor-pointer flex-shrink-0"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="text-[15px] font-[700] text-white flex items-center gap-[6px]">
                💬 customer-discussions
              </div>
              <div className="text-[12.5px] text-[#c9f7d8]">
                Relayed via WhatsApp Business · 2 open
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-[12px] space-y-[8px]">
            {/* 1 unanswered call & 1 unreplied chat */}
            <div className="bg-[#fff3cd] border border-[#f3dfa8] rounded-[10px] p-[8px_10px] flex items-center gap-[7px]">
              <Phone className="w-4 h-4 text-[#c8860a]" />
              <div className="flex-1 text-[12.5px] text-[#7c4a00] font-[600]">
                1 unanswered call &amp; 1 unreplied chat need attention
              </div>
            </div>

            <div className="pt-[10px] px-[2px] pb-[4px] text-[12.5px] font-[700] text-[#8e8e93] uppercase tracking-[0.5px]">
              Customer Conversations
            </div>

            {/* Mukunda */}
            <div 
              onClick={() => { setCustomerListOpen(false); openLeadModal('Mukunda'); }}
              className="flex items-center gap-[10px] p-[10px_12px] bg-white rounded-[12px] shadow-sm cursor-pointer hover:bg-slate-50"
            >
              <div className="w-[36px] h-[36px] rounded-full bg-[#0f6e56] text-white font-bold flex items-center justify-center text-[14px]">
                MK
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-[700] text-[#1a1a1a] flex items-center gap-1.5">
                  Mukunda <span className="text-[10px] bg-[#dcf8c6] text-[#075e54] px-1 py-0.5 rounded font-bold">WA</span>
                </div>
                <div className="text-[12px] text-[#8e8e93] truncate">Quote for Ortho GRID sent · awaiting reply</div>
              </div>
              <div className="text-right">
                <div className="text-[11.5px] text-[#8e8e93]">2:40pm</div>
                <span className="bg-[#25D366] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5">1</span>
              </div>
            </div>

            {/* Kavitha R. */}
            <div 
              onClick={() => { setCustomerListOpen(false); openLeadModal('Kavitha'); }}
              className="flex items-center gap-[10px] p-[10px_12px] bg-white rounded-[12px] shadow-sm cursor-pointer hover:bg-slate-50"
            >
              <div className="w-[36px] h-[36px] rounded-full bg-[#c8860a] text-white font-bold flex items-center justify-center text-[14px]">
                KR
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-[700] text-[#1a1a1a] flex items-center gap-1.5">
                  Kavitha R. <span className="text-[10px] bg-[#dcf8c6] text-[#075e54] px-1 py-0.5 rounded font-bold">WA</span>
                </div>
                <div className="text-[12px] text-[#8e8e93] truncate">When can I come see the hybrid mattress?</div>
              </div>
              <div className="text-right">
                <div className="text-[11.5px] text-[#8e8e93]">11:15am</div>
                <span className="bg-[#25D366] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5">2</span>
              </div>
            </div>

            {/* Ali missed call */}
            <div className="flex items-center gap-[10px] p-[10px_12px] bg-white rounded-[12px] shadow-sm">
              <div className="w-[36px] h-[36px] rounded-full bg-[#fdeaea] text-[#c0392b] font-bold flex items-center justify-center text-[14px]">
                AL
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-[700] text-[#1a1a1a] flex items-center gap-1.5">
                  Ali <span className="text-[10px] bg-[#fdeaea] text-[#c0392b] px-1 py-0.5 rounded font-bold">Missed</span>
                </div>
                <div className="text-[12px] text-[#c0392b]">Called 9:40am · not returned yet</div>
              </div>
              <button 
                onClick={() => { setCustomerListOpen(false); showToast('Connecting callback to Ali (+91 90000 11122)...'); }}
                className="bg-[#0f6e56] text-white border-none rounded-[8px] px-[9px] py-[6px] text-[12.5px] font-[700] cursor-pointer flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call back</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KUDOS OVERLAY matching mock lines 1344-1387 */}
      {kudosOverlayOpen && (
        <div 
          id="pulseKudosListOverlay" 
          className="absolute inset-0 bg-[#eceef4] z-[326] flex flex-col animate-in fade-in duration-150"
        >
          <div className="bg-gradient-to-r from-[#c8860a] to-[#e0a52f] p-[12px_14px] flex items-center gap-[10px] flex-shrink-0">
            <button 
              onClick={() => setKudosOverlayOpen(false)} 
              title="Back" 
              className="bg-white/20 hover:bg-white/30 border-none rounded-full w-[32px] h-[32px] flex items-center justify-center text-white text-[16px] font-bold cursor-pointer flex-shrink-0"
            >
              ←
            </button>
            <div className="flex-1">
              <div className="text-[15px] font-[700] text-white flex items-center gap-[6px]">
                🏆 kudos
              </div>
              <div className="text-[12.5px] text-[#fdf0d5]">
                Team recognition, sent by your leaders
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-[12px] space-y-[8px]">
            <div className="p-[7px_10px] bg-[#fff3e0] rounded-[8px] flex items-center gap-[7px] text-[12.5px] text-[#854d0e] font-[500]">
              <span>ℹ️</span>
              <span>You receive kudos — leaders send them to celebrate your wins 🎉</span>
            </div>

            <div className="pt-[8px] px-[2px] pb-[4px] text-[12.5px] font-[700] text-[#8e8e93] uppercase tracking-[0.5px]">
              📥 Incoming Kudos
            </div>

            {/* Kudos Card 1 */}
            <div className="bg-gradient-to-br from-[#fff8e1] to-white rounded-[14px] p-[12px_14px] border-[1.5px] border-[#FFD700] shadow-[0_3px_10px_rgba(255,215,0,0.2)]">
              <div className="flex items-center gap-[10px] mb-[6px]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#faeeda] text-[#854f0b] font-[700] flex items-center justify-center text-[14.5px] flex-shrink-0">
                  SR
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-[700] text-[#1a1a1a]">Sunita Rao (Manager)</div>
                  <div className="text-[12.5px] text-[#8e8e93]">12:40pm · Today</div>
                </div>
                <div className="text-[22px]">🏆</div>
              </div>
              <div className="text-[13.5px] text-[#1a1a1a] leading-[1.5] bg-[#fffbf0] rounded-[8px] p-[8px_10px]">
                "Great work with Mukunda — closed that warranty objection beautifully. Keep it up!"
              </div>
            </div>

            {/* Kudos Card 2 */}
            <div className="bg-gradient-to-br from-[#fef3f2] to-white rounded-[14px] p-[12px_14px] border-[1.5px] border-[#fca5a5] shadow-[0_2px_8px_rgba(226,75,74,0.1)]">
              <div className="flex items-center gap-[10px] mb-[6px]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#e1f5ee] text-[#0f6e56] font-[700] flex items-center justify-center text-[14.5px] flex-shrink-0">
                  RK
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-[700] text-[#1a1a1a]">Raju Kumar</div>
                  <div className="text-[12.5px] text-[#8e8e93]">Yesterday</div>
                </div>
                <div className="text-[22px]">🔥</div>
              </div>
              <div className="text-[13.5px] text-[#1a1a1a] leading-[1.5] bg-[#fff9f9] rounded-[8px] p-[8px_10px]">
                "Nice cross-sell on the Tranquo chair! Impressed by how you read the customer."
              </div>
            </div>

            {/* Kudos Card 3 */}
            <div className="bg-gradient-to-br from-[#f0fdf4] to-white rounded-[14px] p-[12px_14px] border-[1.5px] border-[#86efac] shadow-[0_2px_8px_rgba(29,158,117,0.08)]">
              <div className="flex items-center gap-[10px] mb-[6px]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#faeeda] text-[#854f0b] font-[700] flex items-center justify-center text-[14.5px] flex-shrink-0">
                  SR
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-[700] text-[#1a1a1a]">Sunita Rao (Manager)</div>
                  <div className="text-[12.5px] text-[#8e8e93]">2 days ago</div>
                </div>
                <div className="text-[22px]">💪</div>
              </div>
              <div className="text-[13.5px] text-[#1a1a1a] leading-[1.5] bg-[#f7fffe] rounded-[8px] p-[8px_10px]">
                "Top SOP score this week — 72/100 on Mukunda's conversation. Store leader!"
              </div>
            </div>

            <div className="p-[10px_12px] text-[12.5px] text-[#8e8e93] text-center">
              Your all-time kudos: <b className="text-[#1d9e75]">12</b> 🎉
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
