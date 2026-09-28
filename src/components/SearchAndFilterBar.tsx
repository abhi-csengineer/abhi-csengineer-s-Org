import React from 'react';
import { Search, X, SlidersHorizontal, MapPin, ArrowUpDown, RotateCcw } from 'lucide-react';
import { CampusZone, FilterState, ItemCategory } from '../types';

interface SearchAndFilterBarProps {
  filter: FilterState;
  onFilterChange: (update: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

const CAMPUS_ZONES: CampusZone[] = [
  'Central Library',
  'STEM Quad',
  'Student Union',
  'Athletic Complex',
  'North Campus',
  'South Campus',
  'Transit Hub & Parking',
  'Residence Halls',
  'Main Library & Study Hub',
  'Science & Engineering Quad',
  'Student Union & Dining',
  'Athletics & Recreation Center',
  'North Residential Complex',
  'South Residence Halls',
  'Health & Wellness Pavilion',
  'Other Campus Grounds',
];

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  filter,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
}) => {
  const isFiltered =
    Boolean(filter.searchQuery) ||
    filter.type !== 'all' ||
    filter.category !== 'all' ||
    filter.campusZone !== 'all' ||
    filter.color !== 'all';

  return (
    <div className="space-y-4">
      {/* Upper Bar: Search and Quick Segmented Status Control */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Segmented Control */}
        <div className="flex items-center p-1 bg-[#0b132b] rounded-xl border border-slate-800 text-xs font-medium self-start md:self-auto overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => onFilterChange({ type: 'all' })}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter.type === 'all'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => onFilterChange({ type: 'lost' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter.type === 'lost'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Lost Items</span>
          </button>
          <button
            onClick={() => onFilterChange({ type: 'found' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter.type === 'found'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Found Items</span>
          </button>
          <button
            onClick={() => onFilterChange({ type: 'resolved' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              filter.type === 'resolved'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Resolved</span>
          </button>
        </div>

        {/* Secondary controls: Campus Zone dropdown & Sort dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zone Selector */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filter.campusZone}
              onChange={(e) => onFilterChange({ campusZone: e.target.value as 'all' | CampusZone })}
              className="w-full sm:w-auto appearance-none pl-8 pr-8 py-2 bg-[#0f172a] border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 rounded-xl focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">All Campus Sectors</option>
              {CAMPUS_ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <SlidersHorizontal className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filter.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as 'newest' | 'oldest' })}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-2 bg-[#0f172a] border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 rounded-xl focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset button if filtered */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-800/40 rounded-xl transition-all cursor-pointer"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Count and Active Indicators */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <span className="font-mono font-semibold text-white tabular-nums">{totalFilteredCount}</span>
          <span>{totalFilteredCount === 1 ? 'item' : 'items'}</span>
          {filter.searchQuery && (
            <>
              <span aria-hidden="true">·</span>
              <span>matching &ldquo;{filter.searchQuery}&rdquo;</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
