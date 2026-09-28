import React from 'react';
import { ArrowLeft, ArrowRight, Home, ChevronRight } from 'lucide-react';

interface ViewNavigationHeaderProps {
  currentView: 'dashboard' | 'directory' | 'smart-match' | 'my-reports' | 'contact';
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoHome: () => void;
}

const VIEW_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  directory: 'Browse Directory',
  'smart-match': 'Smart Match AI',
  'my-reports': 'My Activity',
  contact: 'Contact & Desks',
};

export const ViewNavigationHeader: React.FC<ViewNavigationHeaderProps> = ({
  currentView,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onGoHome,
}) => {
  if (currentView === 'dashboard') return null;

  return (
    <div className="bg-[#070e22]/90 border-b border-slate-800/80 px-4 sm:px-8 py-2.5 backdrop-blur-md sticky top-16 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Navigation History Controls: Back & Forward */}
        <div className="flex items-center gap-2">
          {/* Back Button */}
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back Page</span>
          </button>

          {/* Forward Button */}
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Go forward to next page"
          >
            <span>Next Page</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <button
            onClick={onGoHome}
            className="hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-cyan-300 font-semibold truncate max-w-[200px] sm:max-w-none">
            {VIEW_TITLES[currentView] || currentView}
          </span>
        </div>
      </div>
    </div>
  );
};
