import React from 'react';
import { Phone, PlusCircle } from 'lucide-react';

interface FloatingActionDockProps {
  onReportLost: () => void;
  onReportFound: () => void;
  onOpenContact: () => void;
}

export const FloatingActionDock: React.FC<FloatingActionDockProps> = ({
  onReportLost,
  onReportFound,
  onOpenContact,
}) => {
  return (
    <aside
      aria-label="Campus quick actions"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-[#0a1226]/90 border border-slate-700/80 backdrop-blur-xl shadow-2xl shadow-cyan-950/60"
    >
      <button
        onClick={onReportLost}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-slate-900/90 hover:bg-rose-950/60 text-slate-200 hover:text-white border border-rose-500/30 hover:border-rose-500/70 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-105"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500 animate-pulse" />
        <span>Report Lost</span>
      </button>

      <button
        onClick={onReportFound}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-slate-900/90 hover:bg-emerald-950/60 text-slate-200 hover:text-white border border-emerald-500/30 hover:border-emerald-500/70 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-105"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
        <span>Report Found</span>
      </button>

      <button
        onClick={onOpenContact}
        className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all cursor-pointer"
      >
        <Phone className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Contact Desks</span>
      </button>
    </aside>
  );
};
