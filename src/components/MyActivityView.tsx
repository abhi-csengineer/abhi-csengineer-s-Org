import React, { useState } from 'react';
import { ShieldCheck, Plus, CheckCircle2, Clock, MapPin, Calendar, ArrowRight, User, Printer } from 'lucide-react';
import { Item } from '../types';
import { PrintableSummary } from './PrintableSummary';

interface MyActivityViewProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onOpenReport: () => void;
  onMarkResolved: (itemId: string) => void;
}

export const MyActivityView: React.FC<MyActivityViewProps> = ({
  items,
  onSelectItem,
  onOpenReport,
  onMarkResolved,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found' | 'resolved'>('all');
  const [printableItem, setPrintableItem] = useState<Item | null>(null);

  const filtered = items.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'resolved') return item.status === 'resolved';
    return item.type === filterType && item.status !== 'resolved';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Activity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Campus Activity &amp; My Filings</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track and manage your submitted loss reports and recovered belongings.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Report</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterType === 'all'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Activity ({items.length})
        </button>
        <button
          onClick={() => setFilterType('lost')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterType === 'lost'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Lost ({items.filter((i) => i.type === 'lost' && i.status === 'active').length})
        </button>
        <button
          onClick={() => setFilterType('found')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterType === 'found'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Found ({items.filter((i) => i.type === 'found' && i.status === 'active').length})
        </button>
        <button
          onClick={() => setFilterType('resolved')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterType === 'resolved'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Reunited / Resolved ({items.filter((i) => i.status === 'resolved').length})
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0f172a] border border-slate-800 text-slate-400 space-y-3">
            <p className="text-sm">No items in this filter category.</p>
            <button
              onClick={() => setFilterType('all')}
              className="text-xs text-cyan-400 hover:underline"
            >
              View all items
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const isResolved = item.status === 'resolved';
            const isLost = item.type === 'lost';

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isResolved
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : isLost
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {isResolved ? 'RESOLVED' : isLost ? 'LOST' : 'FOUND'}
                    </span>
                    <span className="text-xs text-cyan-400 font-medium">{item.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400 truncate">{item.location}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">Contact: {item.contactName} ({item.contactEmail})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {!isResolved && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkResolved(item.id);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40 border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mark Reunited</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrintableItem(item);
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:bg-cyan-950/40 border border-cyan-800/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Export official PDF/Print report for campus safety"
                  >
                    <Printer className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden md:inline">Print Proof</span>
                  </button>

                  <button
                    type="button"
                    className="p-2 text-slate-400 group-hover:text-cyan-400 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {printableItem && (
        <PrintableSummary
          item={printableItem}
          onClose={() => setPrintableItem(null)}
        />
      )}
    </div>
  );
};
