import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  PlusCircle,
  ArrowRight,
  MapPin,
  ChevronDown,
  Check,
  AlertCircle,
  Package,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import heroBgImg from '../assets/images/campus_hero_showcase_1790578029281.jpg';
import { Item, HERO_CAMPUS_ZONES } from '../types';

interface HeroSectionProps {
  items: Item[];
  searchQuery: string;
  selectedZone: string;
  onSearchChange: (query: string) => void;
  onZoneChange: (zone: string) => void;
  onExecuteSearch: () => void;
  onOpenReportLost: () => void;
  onOpenReportFound: () => void;
  onBrowseItems: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

const POPULAR_SEARCH_TAGS = [
  'MacBook',
  'AirPods',
  'Student ID',
  'Car Keys',
  'Water Bottle',
  'Backpack',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  items,
  searchQuery,
  selectedZone,
  onSearchChange,
  onZoneChange,
  onExecuteSearch,
  onOpenReportLost,
  onOpenReportFound,
  onBrowseItems,
  searchInputRef,
}) => {
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute authentic real-time statistics directly from data
  const totalItems = items.length;
  const activeLostCount = items.filter((i) => i.type === 'lost' && i.status === 'active').length;
  const activeFoundCount = items.filter((i) => i.type === 'found' && i.status === 'active').length;
  const resolvedCount = items.filter((i) => i.status === 'resolved').length;
  const recoveryRate = totalItems > 0 ? Math.round((resolvedCount / totalItems) * 100) : 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setZoneDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for "/" key to focus search input
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchInputRef]);

  const handleSelectZone = (zone: string) => {
    onZoneChange(zone);
    setZoneDropdownOpen(false);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onExecuteSearch();
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#050914] text-slate-100 border-b border-slate-800/80">
      {/* Background with Ambient Radial Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroBgImg}
          alt="University campus"
          className="w-full h-full object-cover object-center opacity-15 select-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050914]/60 via-[#050914]/90 to-[#050914]" />
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 text-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          <span>Campus </span>
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            Lost &amp; Found
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          The official university network to report missing items, register found belongings, and quickly reconnect students and staff with what matters.
        </p>

        {/* Primary CTA Buttons Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          {/* Report Lost Item (Red / Crimson Pill) */}
          <button
            onClick={onOpenReportLost}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 shadow-lg shadow-rose-950/60 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Lost Item</span>
          </button>

          {/* Report Found Item (Emerald / Green Pill) */}
          <button
            onClick={onOpenReportFound}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Found Item</span>
          </button>

          {/* Browse Listings */}
          <button
            onClick={onBrowseItems}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer"
          >
            <span>Browse Listings</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Hero Search & Campus Zone Bar with Glow */}
        <div className="mt-10 max-w-3xl mx-auto text-left">
          <div className="rounded-2xl p-2.5 sm:p-3 bg-[#0a1226]/95 border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
            {/* Top row: Search Input + Zone Dropdown + Find Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Search input with shortcut badge */}
              <div className="relative flex-1 flex items-center bg-[#070d1e] rounded-xl border border-slate-800 focus-within:border-cyan-400/80 transition-colors px-3 py-2">
                <Search className="w-4 h-4 text-cyan-400 shrink-0 mr-2.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={handleKeyDownInput}
                  placeholder="Search by name, brand, color, or location..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden"
                />
                <span className="hidden sm:inline-flex items-center justify-center w-5 h-5 text-[11px] font-mono text-slate-500 bg-slate-800/80 rounded border border-slate-700/60 select-none ml-2">
                  /
                </span>
              </div>

              {/* Campus Zone Selector with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setZoneDropdownOpen((prev) => !prev)}
                  className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 hover:border-cyan-500/60 text-xs font-semibold text-slate-200 transition-colors cursor-pointer whitespace-nowrap min-w-[170px]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">
                      {selectedZone === 'all' ? 'All Campus Zones' : selectedZone}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      zoneDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {zoneDropdownOpen && (
                  <div className="absolute top-full right-0 sm:left-0 mt-1.5 w-64 bg-[#0d162d] border border-cyan-500/30 rounded-xl shadow-2xl shadow-black/80 py-1.5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => handleSelectZone('all')}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-cyan-950/60 transition-colors cursor-pointer ${
                        selectedZone === 'all'
                          ? 'text-cyan-300 font-bold bg-cyan-950/40'
                          : 'text-slate-300'
                      }`}
                    >
                      <span>All Campus Zones</span>
                      {selectedZone === 'all' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>

                    <div className="my-1 border-t border-slate-800/80" />

                    {HERO_CAMPUS_ZONES.map((zone) => {
                      const isSelected = selectedZone === zone;
                      return (
                        <button
                          key={zone}
                          type="button"
                          onClick={() => handleSelectZone(zone)}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-cyan-950/60 transition-colors cursor-pointer ${
                            isSelected
                              ? 'text-cyan-300 font-bold bg-cyan-950/40'
                              : 'text-slate-300'
                          }`}
                        >
                          <span className="truncate">{zone}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Find Button */}
              <button
                type="button"
                onClick={onExecuteSearch}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                Find
              </button>
            </div>

            {/* Bottom Row: Popular searches chips */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <span className="text-[11px] text-slate-400 font-medium mr-1">
                Popular searches:
              </span>
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    onSearchChange(tag);
                    onExecuteSearch();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 text-[11px] font-medium border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Stat Cards Row matching the screenshot */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto text-left">
          {/* Card 1: Active Lost Reports */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141221] to-[#0d0f1e] border border-rose-500/30 hover:border-rose-500/60 shadow-lg shadow-rose-950/20 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Active Lost Reports</span>
              <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {activeLostCount}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/70 border border-rose-800/50 text-rose-300">
                Investigating
              </span>
            </div>
          </div>

          {/* Card 2: Found In Custody */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0e1c22] to-[#09151c] border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/20 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Found In Custody</span>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Package className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {activeFoundCount}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 border border-emerald-800/50 text-emerald-300">
                Ready to Claim
              </span>
            </div>
          </div>

          {/* Card 3: Reunited Belongings */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#18112b] to-[#100c22] border border-purple-500/30 hover:border-purple-500/60 shadow-lg shadow-purple-950/20 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Reunited Belongings</span>
              <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {resolvedCount}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/70 border border-purple-800/50 text-purple-300">
                Returned
              </span>
            </div>
          </div>

          {/* Card 4: Campus Recovery Rate */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0b1c2b] to-[#081523] border border-cyan-500/30 hover:border-cyan-500/60 shadow-lg shadow-cyan-950/20 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Campus Recovery Rate</span>
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bookmark className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {recoveryRate}%
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/70 border border-cyan-800/50 text-cyan-300">
                Efficiency
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
