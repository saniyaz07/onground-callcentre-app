import React, { useState } from 'react';
import { Lightbulb, Trophy, Phone, Target, Clock, Truck, X, Award, ChevronRight } from 'lucide-react';

export interface RankMetric {
  key: string;
  label: string;
  weight: number;
  value: number;
  max: number;
  icon: React.ElementType;
  displayVal: string;
}

export const RANK_METRICS: RankMetric[] = [
  { key: 'ogscore', label: 'OG Score™', weight: 40, value: 76, max: 100, icon: Trophy, displayVal: '76' },
  { key: 'leadscalled', label: 'Leads Called', weight: 20, value: 2, max: 5, icon: Phone, displayVal: '2' },
  { key: 'leadscreated', label: 'Leads Created', weight: 15, value: 3, max: 5, icon: Target, displayVal: '3' },
  { key: 'convtime', label: 'Conversation Time', weight: 15, value: 62, max: 90, icon: Clock, displayVal: '62m' },
  { key: 'delivery', label: 'On-time Delivery', weight: 10, value: 92, max: 100, icon: Truck, displayVal: '92%' }
];

export const YourRankOgScore: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Calculate composite score dynamically: sum of (min(1, value/max) * weight)
  const compositeScore = RANK_METRICS.reduce((acc, m) => {
    const achievement = Math.min(1, m.value / m.max);
    return acc + achievement * m.weight;
  }, 0);

  return (
    <>
      {/* TopBar Pill Component (.grank-pill.gold matching mock line 643) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-[5px] p-[2px_9px_2px_2px] rounded-full bg-[rgba(255,215,0,0.16)] hover:bg-[rgba(255,215,0,0.24)] border border-[rgba(255,215,0,0.35)] text-[#FFD700] transition-all cursor-pointer shadow-sm active:scale-95 group"
        title="OG Score™: 76 · Your Rank within RT Nagar: #3"
        aria-label="View Rank and OG Score details"
      >
        {/* OG Score™ circular ring badge (.og-ring.sm) */}
        <div 
          className="relative w-[32px] h-[32px] rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'conic-gradient(#1d9e75 76%, rgba(0,0,0,0.12) 0)'
          }}
        >
          <div className="absolute inset-[4px] rounded-full bg-[#0a1a14] flex items-center justify-center">
            <span className="text-[13px] font-extrabold text-white leading-none">76</span>
          </div>
        </div>

        {/* Your Rank indicator (.gr-num) */}
        <span className="text-[12px] font-extrabold tracking-[0.2px] text-[#FFD700] tabular">
          ⭐#3
        </span>
      </button>

      {/* Expandable Modal / Sheet matching mock #rankDetailOverlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[420] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in slide-in-from-bottom duration-300 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* iOS handle bar */}
            <div className="w-[36px] h-[4px] bg-[#e5e5ea] rounded-[2px] mx-auto mt-3.5 mb-1 sm:hidden" />

            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#555] flex items-center justify-center transition-colors text-sm font-bold z-10 border-none cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="p-5 sm:p-6">
              {/* Header: Your Rank */}
              <div className="text-center mb-4">
                <div className="text-[12.5px] font-extrabold text-[#5dcaa5] uppercase tracking-[0.6px] mb-1.5">
                  Your Rank
                </div>
                <div className="text-[40px] font-extrabold text-[#1a1a1a] leading-none">
                  #3
                </div>
                <div className="text-[13.5px] text-[#8e8e93] mt-1">
                  within <span className="text-[#1a1a1a] font-medium">RT Nagar</span> · 6 staff ranked
                </div>
              </div>

              {/* Context Explanation */}
              <div className="bg-[#f7f7f5] rounded-[12px] p-[12px_14px] mb-3.5 border border-slate-100">
                <p className="text-[12.5px] text-[#4b4b52] leading-[1.5]">
                  Your rank is a weighted blend of the same numbers in <b>My Progress</b> above — not just one metric. Here's exactly how it adds up this period.
                </p>
              </div>

              {/* Metrics Breakdown with Progress Bars */}
              <div className="mb-3.5">
                {[
                  { key: 'ogscore', label: 'OG Score™', weight: 40, value: 76, max: 100, icon: '🏆', displayVal: '76' },
                  { key: 'leadscalled', label: 'Leads Called', weight: 20, value: 2, max: 5, icon: '📞', displayVal: '2' },
                  { key: 'leadscreated', label: 'Leads Created', weight: 15, value: 3, max: 5, icon: '🎯', displayVal: '3' },
                  { key: 'convtime', label: 'Conversation Time', weight: 15, value: 62, max: 90, icon: '⏱️', displayVal: '62m' },
                  { key: 'delivery', label: 'On-time Delivery', weight: 10, value: 92, max: 100, icon: '🚚', displayVal: '92%' }
                ].map((r) => {
                  const achievement = Math.min(1, r.value / r.max);
                  return (
                    <div key={r.key} className="mb-[11px]">
                      <div className="flex items-center justify-between mb-1 text-[13px]">
                        <span className="font-bold text-[#1a1a1a] flex items-center gap-1.5">
                          <span>{r.icon}</span>
                          <span>{r.label}</span>
                        </span>
                        <span className="text-[#8e8e93]">
                          <b className="text-[#1a1a1a] font-bold">{r.displayVal}</b>
                          {' '}· {r.weight}% weight
                        </span>
                      </div>
                      <div className="h-[6px] bg-[#eef0f2] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#5dcaa5] to-[#1d9e75] rounded-full transition-all duration-500"
                          style={{ width: `${(achievement * 100).toFixed(0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Composite Score Row */}
                <div className="flex items-center justify-between pt-2 border-t border-[#eee] mt-1">
                  <span className="text-[13px] font-extrabold text-[#1a1a1a]">
                    Composite score
                  </span>
                  <span className="text-[16px] font-extrabold text-[#1d9e75]">
                    {compositeScore.toFixed(1)} / 100
                  </span>
                </div>
              </div>

              {/* Actionable Insight Box */}
              <div className="bg-gradient-to-br from-[#0a1a14] to-[#1d3a2e] rounded-[12px] p-[12px_14px] text-white mt-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[16px]">💡</span>
                  <div className="text-[13px] leading-[1.5] text-white">
                    Closing 1 more lead this week would add ~4 points — enough to pass #2. <b>Leads Called</b> is your fastest lever right now.
                  </div>
                </div>
              </div>

              {/* Store Defaults Footnote */}
              <div className="text-[12.5px] text-[#b5b5bb] text-center mt-3 leading-normal">
                Weights are store defaults, set by your manager under Settings → Customer Interaction preferences.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
