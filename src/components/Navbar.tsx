import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  PlusCircle,
  Sparkles,
  Search,
  Menu,
  X,
  ChevronDown,
  Building2,
  FileQuestion,
  PackagePlus,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'directory' | 'smart-match' | 'my-reports' | 'contact';
  onNavigate: (view: 'dashboard' | 'directory' | 'smart-match' | 'my-reports' | 'contact') => void;
  onOpenReport: () => void;
  onOpenReportLost: () => void;
  onOpenReportFound: () => void;
  onFocusSearch: () => void;
  activeMatchCount?: number;
  itemTypeFilter: 'all' | 'lost' | 'found';
  onSelectTypeFilter: (type: 'all' | 'lost' | 'found') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenReportLost,
  onOpenReportFound,
  onFocusSearch,
  activeMatchCount = 0,
  itemTypeFilter,
  onSelectTypeFilter,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const reportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        reportDropdownRef.current &&
        !reportDropdownRef.current.contains(e.target as Node)
      ) {
        setReportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: 'dashboard' | 'directory' | 'smart-match' | 'my-reports' | 'contact') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleTypeClick = (type: 'all' | 'lost' | 'found') => {
    onSelectTypeFilter(type);
    if (currentView !== 'dashboard' && currentView !== 'directory') {
      onNavigate('directory');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050914]/90 backdrop-blur-xl border-b border-slate-800/80 transition-colors shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Top Left: Logo Wordmark + Portal Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectTypeFilter('all');
                handleNavClick('dashboard');
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 p-[1.5px] shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-all">
                <div className="w-full h-full bg-[#070e22] rounded-full flex items-center justify-center">
                  <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-none">
                    <span>Campus </span>
                    <span className="text-cyan-400">Lost &amp; Found</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                    PORTAL
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-1">
                  University Belongings Recovery Network
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Pills matching the screenshot */}
          <nav className="hidden lg:flex items-center p-1 rounded-full bg-[#0a1226] border border-slate-800 text-xs font-semibold">
            {/* All Items */}
            <button
              onClick={() => handleTypeClick('all')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                (currentView === 'dashboard' || currentView === 'directory') &&
                itemTypeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Items
            </button>

            {/* Lost Items */}
            <button
              onClick={() => handleTypeClick('lost')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                (currentView === 'dashboard' || currentView === 'directory') &&
                itemTypeFilter === 'lost'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Lost Items
            </button>

            {/* Found Items */}
            <button
              onClick={() => handleTypeClick('found')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                (currentView === 'dashboard' || currentView === 'directory') &&
                itemTypeFilter === 'found'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Found Items
            </button>

            {/* Smart Match AI */}
            <button
              onClick={() => handleNavClick('smart-match')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'smart-match'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Smart Match</span>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI
              </span>
              {activeMatchCount > 0 && (
                <span className="ml-0.5 px-1 py-0.2 text-[9px] font-bold bg-cyan-400 text-slate-950 rounded-full">
                  {activeMatchCount}
                </span>
              )}
            </button>

            {/* Contact Desks */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'contact'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Contact Desks</span>
            </button>
          </nav>

          {/* Right Action: Report Item ▾ button with dropdown */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onFocusSearch}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
              title="Search directory"
              aria-label="Search directory"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Report Item Dropdown Button */}
            <div className="relative" ref={reportDropdownRef}>
              <button
                type="button"
                onClick={() => setReportDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 shadow-lg shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Item</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    reportDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {reportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0c142b] border border-cyan-500/40 rounded-xl shadow-2xl shadow-black/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setReportDropdownOpen(false);
                      onOpenReportLost();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-rose-950/60 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-sm shadow-rose-500" />
                    <div>
                      <div className="font-bold">Report Lost Item</div>
                      <div className="text-[10px] text-slate-400 font-normal">Missing something on campus</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-800/80 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setReportDropdownOpen(false);
                      onOpenReportFound();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-emerald-950/60 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400" />
                    <div>
                      <div className="font-bold">Report Found Item</div>
                      <div className="text-[10px] text-slate-400 font-normal">Turned in or discovered</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenReportLost}
              className="px-2.5 py-1.5 rounded-full bg-cyan-500 text-white text-xs font-bold"
            >
              Report
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#070e22]/98 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl mb-3">
            <button
              onClick={() => handleTypeClick('all')}
              className={`py-1.5 text-xs font-semibold rounded-lg ${
                itemTypeFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => handleTypeClick('lost')}
              className={`py-1.5 text-xs font-semibold rounded-lg ${
                itemTypeFilter === 'lost' ? 'bg-rose-600 text-white' : 'text-slate-300'
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => handleTypeClick('found')}
              className={`py-1.5 text-xs font-semibold rounded-lg ${
                itemTypeFilter === 'found' ? 'bg-emerald-600 text-white' : 'text-slate-300'
              }`}
            >
              Found
            </button>
          </div>

          <button
            onClick={() => handleNavClick('dashboard')}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavClick('directory')}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            Browse Directory
          </button>
          <button
            onClick={() => handleNavClick('smart-match')}
            className="w-full text-left px-3 py-2 text-sm text-cyan-300 hover:bg-slate-800 rounded-xl flex items-center justify-between"
          >
            <span>Smart Match AI</span>
            {activeMatchCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-cyan-500/20 text-cyan-300 rounded">
                {activeMatchCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('my-reports')}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            My Activity
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            Contact &amp; Desks
          </button>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReportLost();
              }}
              className="py-2 px-3 text-xs font-bold rounded-xl bg-rose-600 text-white text-center"
            >
              Report Lost Item
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReportFound();
              }}
              className="py-2 px-3 text-xs font-bold rounded-xl bg-emerald-600 text-white text-center"
            >
              Report Found Item
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
