import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  MapPin,
  Calendar,
  ExternalLink,
  Laptop,
  Package,
} from 'lucide-react';
import { Item, SmartMatchResult } from '../types';
import { runSmartMatchScanner } from '../services/aiMatch';
import { getColorDef } from '../constants/colors';

interface SmartMatchViewProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onInitiateReunion: (lost: Item, found: Item) => void;
}

export const SmartMatchView: React.FC<SmartMatchViewProps> = ({
  items,
  onSelectItem,
  onInitiateReunion,
}) => {
  const [matches, setMatches] = useState<SmartMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterGrade, setFilterGrade] = useState<'All' | 'High' | 'Medium'>('All');
  const [scannedOnce, setScannedOnce] = useState(false);

  const runScan = async () => {
    setLoading(true);
    try {
      // Simulate brief neural computation delay for realistic SaaS feedback
      await new Promise((resolve) => setTimeout(resolve, 600));
      const results = await runSmartMatchScanner(items);
      setMatches(results);
      setScannedOnce(true);
    } catch (err) {
      console.error('Failed scanning smart matches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runScan();
  }, [items]);

  const filteredMatches = matches.filter((m) => {
    if (filterGrade === 'All') return true;
    return m.matchGrade === filterGrade;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1836] via-[#0f172a] to-[#080d1a] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Intelligent Campus Reconciliation Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Smart Match AI
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Automatically correlates active Lost and Found reports by analyzing campus building zones, timestamps, brand descriptors, and serial number hints to accelerate property recovery.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={runScan}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 rounded-xl shadow-lg shadow-cyan-900/30 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing Campus Database...' : 'Run Match Scanner'}</span>
            </button>

            <span className="text-xs text-slate-400">
              {matches.length} possible {matches.length === 1 ? 'match' : 'matches'} discovered
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      {matches.length > 0 && (
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 mr-1">Filter Confidence:</span>
            <button
              onClick={() => setFilterGrade('All')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterGrade === 'All'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              onClick={() => setFilterGrade('High')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterGrade === 'High'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              High Confidence ({matches.filter((m) => m.matchGrade === 'High').length})
            </button>
            <button
              onClick={() => setFilterGrade('Medium')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterGrade === 'Medium'
                  ? 'bg-slate-800 text-slate-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Medium / Potential ({matches.filter((m) => m.matchGrade === 'Medium').length})
            </button>
          </div>
        </div>
      )}

      {/* Loading State Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 animate-pulse space-y-4"
            >
              <div className="h-4 bg-slate-800 rounded w-1/4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-28 bg-slate-800/60 rounded-xl" />
                <div className="h-28 bg-slate-800/60 rounded-xl" />
              </div>
              <div className="h-10 bg-slate-800/40 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* No Match State */}
      {!loading && matches.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Direct Matches Detected</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Smart Match AI constantly monitors incoming lost and found listings across all campus sectors. As new reports are filed, high-probability matches will appear here automatically.
          </p>
          <button
            onClick={runScan}
            className="px-4 py-2 text-xs font-semibold text-cyan-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Re-scan Database
          </button>
        </div>
      )}

      {/* Match Cards List */}
      {!loading && (
        <div className="space-y-6">
          {filteredMatches.map((match) => {
            const isHighConfidence = match.confidence >= 80;

            return (
              <div
                key={match.id}
                className="relative rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all duration-200 overflow-hidden"
              >
                {/* Match Header Bar */}
                <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b132b]/80 gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold tabular-nums ${
                        isHighConfidence
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{match.confidence}% Match Confidence</span>
                    </span>

                    <span className="text-xs text-slate-400">
                      Grade: <strong className="text-white">{match.matchGrade} Correlation</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => onInitiateReunion(match.lostItem, match.foundItem)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-lg shadow-sm cursor-pointer"
                  >
                    <span>Connect Both Parties</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {/* Left Column: Lost Item */}
                  <div className="p-5 rounded-2xl bg-amber-950/15 border border-amber-500/25 space-y-3.5 shadow-md">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400 animate-pulse" />
                        Lost Report
                      </span>
                      <span className="text-slate-400 font-mono text-[11px] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                        Ref #{match.lostItem.id}
                      </span>
                    </div>

                    <div className="flex gap-3.5 items-start">
                      {match.lostItem.imageUrl && (
                        <img
                          src={match.lostItem.imageUrl}
                          alt={match.lostItem.title}
                          className="w-16 h-16 rounded-xl object-cover border border-amber-500/30 shrink-0 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-white line-clamp-1">{match.lostItem.title}</h4>
                        <div className="mt-1 space-y-1 text-xs text-slate-300">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{match.lostItem.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Lost on {new Date(match.lostItem.date).toLocaleDateString()}</span>
                          </div>
                          {match.lostItem.primaryColor && (() => {
                            const col = getColorDef(match.lostItem.primaryColor);
                            return (
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                <span
                                  className={`w-2 h-2 rounded-full border ${col?.borderClass || 'border-slate-500'} ${col?.bgClass || 'bg-slate-400'}`}
                                  style={col?.name === 'Multicolor / Pattern' ? { background: col.hex } : undefined}
                                />
                                <span>Color: {match.lostItem.primaryColor}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-[#0b132b]/80 p-2.5 rounded-xl border border-slate-800">
                      {match.lostItem.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-amber-500/20">
                      <span className="text-[11px] text-slate-400">
                        Owner: <strong className="text-slate-200">{match.lostItem.contactName}</strong> ({match.lostItem.contactRole})
                      </span>
                      <button
                        onClick={() => onSelectItem(match.lostItem)}
                        className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Found Item */}
                  <div className="p-5 rounded-2xl bg-cyan-950/15 border border-cyan-500/25 space-y-3.5 shadow-md">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                        Found Record
                      </span>
                      <span className="text-slate-400 font-mono text-[11px] bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                        Ref #{match.foundItem.id}
                      </span>
                    </div>

                    <div className="flex gap-3.5 items-start">
                      {match.foundItem.imageUrl && (
                        <img
                          src={match.foundItem.imageUrl}
                          alt={match.foundItem.title}
                          className="w-16 h-16 rounded-xl object-cover border border-cyan-500/30 shrink-0 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-white line-clamp-1">{match.foundItem.title}</h4>
                        <div className="mt-1 space-y-1 text-xs text-slate-300">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{match.foundItem.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Found on {new Date(match.foundItem.date).toLocaleDateString()}</span>
                          </div>
                          {match.foundItem.primaryColor && (() => {
                            const col = getColorDef(match.foundItem.primaryColor);
                            return (
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                <span
                                  className={`w-2 h-2 rounded-full border ${col?.borderClass || 'border-slate-500'} ${col?.bgClass || 'bg-slate-400'}`}
                                  style={col?.name === 'Multicolor / Pattern' ? { background: col.hex } : undefined}
                                />
                                <span>Color: {match.foundItem.primaryColor}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-[#0b132b]/80 p-2.5 rounded-xl border border-slate-800">
                      {match.foundItem.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-cyan-500/20">
                      <span className="text-[11px] text-slate-400">
                        Custody: <strong className="text-slate-200">{match.foundItem.contactName}</strong> ({match.foundItem.contactRole})
                      </span>
                      <button
                        onClick={() => onSelectItem(match.foundItem)}
                        className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Reasoning and Matched Attributes */}
                <div className="px-6 py-4 bg-[#080d1a]/90 border-t border-slate-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">AI Match Assessment:</span>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                        {match.reasoning}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px]">
                    <span className="text-slate-500 font-medium">Correlations:</span>
                    {match.matchedAttributes.map((attr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
