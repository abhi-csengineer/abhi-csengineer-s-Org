import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Compass,
  Search,
  Plus,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  CheckCircle2,
  RefreshCw,
  FolderOpen,
  HelpCircle,
  Building,
  RotateCcw,
  Phone,
} from 'lucide-react';
import { Item, FilterState, ItemCategory, CampusZone, ClaimSubmission } from './types';
import { fetchItems, createItem, updateItemStatus, submitClaim } from './services/storage';
import { runSmartMatchScanner } from './services/aiMatch';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { ItemCard } from './components/ItemCard';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ReportItemModal } from './components/ReportItemModal';
import { ClaimModal } from './components/ClaimModal';
import { SmartMatchView } from './components/SmartMatchView';
import { MyActivityView } from './components/MyActivityView';
import { ContactView } from './components/ContactView';
import { ColorFilterBar } from './components/ColorFilterBar';
import { FloatingActionDock } from './components/FloatingActionDock';
import { matchCampusZone } from './utils/zoneMatcher';
import { ItemType } from './types';

function AppContent() {
  const { showToast } = useToast();

  // Primary State
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'directory' | 'smart-match' | 'my-reports' | 'contact'>('dashboard');

  // Modals
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [claimTargetItem, setClaimTargetItem] = useState<Item | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<ItemType>('lost');

  // Filters
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    type: 'all',
    category: 'all',
    campusZone: 'all',
    color: 'all',
    sortBy: 'newest',
  });

  // AI Matches
  const [matchCount, setMatchCount] = useState(0);

  // Ref to search input in hero
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch Items on Mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchItems();
        setItems(data);
        const matches = await runSmartMatchScanner(data);
        setMatchCount(matches.length);

        // Check for scanned QR direct link param (?item=item-xxx or ?itemId=item-xxx)
        if (typeof window !== 'undefined') {
          const searchParams = new URLSearchParams(window.location.search);
          const targetItemId = searchParams.get('item') || searchParams.get('itemId');
          if (targetItemId) {
            const scannedItem = data.find(
              (it) => it.id.toLowerCase() === targetItemId.toLowerCase()
            );
            if (scannedItem) {
              setSelectedItem(scannedItem);
              showToast(
                'info',
                'Scanned QR Record Loaded',
                `Opened verified incident docket #${scannedItem.id}`
              );
            }
          }
        }
      } catch (err) {
        console.error('Failed to load items', err);
        showToast('error', 'Failed loading campus items', 'Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update match count whenever items change
  useEffect(() => {
    if (items.length > 0) {
      runSmartMatchScanner(items).then((m) => setMatchCount(m.length));
    }
  }, [items]);

  // Sync URL query params with selected item for shareable direct links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (selectedItem) {
      url.searchParams.set('item', selectedItem.id);
      window.history.replaceState({}, '', url.toString());
    } else {
      if (url.searchParams.has('item') || url.searchParams.has('itemId')) {
        url.searchParams.delete('item');
        url.searchParams.delete('itemId');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [selectedItem]);

  // Focus Search handler
  const handleFocusSearch = () => {
    if (currentView !== 'dashboard' && currentView !== 'directory') {
      setCurrentView('directory');
    }
    setTimeout(() => {
      searchInputRef.current?.focus();
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }, 100);
  };

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Status / Type filter
        if (filter.type === 'resolved') {
          if (item.status !== 'resolved') return false;
        } else if (filter.type !== 'all') {
          if (item.type !== filter.type || item.status === 'resolved') return false;
        }

        // Category filter
        if (filter.category !== 'all' && item.category !== filter.category) {
          return false;
        }

        // Campus Zone filter
        if (filter.campusZone !== 'all' && !matchCampusZone(filter.campusZone, item.campusZone)) {
          return false;
        }

        // Color filter
        if (filter.color !== 'all') {
          if (!item.primaryColor) return false;
          const target = filter.color.toLowerCase();
          const itemCol = item.primaryColor.toLowerCase();
          if (target !== itemCol && !target.includes(itemCol) && !itemCol.includes(target)) {
            return false;
          }
        }

        // Search Query (title, description, location, category, contactName)
        if (filter.searchQuery.trim()) {
          const query = filter.searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          const matchLoc = item.location.toLowerCase().includes(query);
          const matchCat = item.category.toLowerCase().includes(query);
          const matchFeatures = item.identifyingFeatures?.toLowerCase().includes(query);
          const matchCol = item.primaryColor?.toLowerCase().includes(query);
          const matchZone = item.campusZone.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchLoc && !matchCat && !matchFeatures && !matchCol && !matchZone) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return filter.sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [items, filter]);

  // Handlers
  const handleOpenReportLost = () => {
    setReportModalType('lost');
    setReportModalOpen(true);
  };

  const handleOpenReportFound = () => {
    setReportModalType('found');
    setReportModalOpen(true);
  };

  const handleFilterUpdate = (update: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...update }));
  };

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      type: 'all',
      category: 'all',
      campusZone: 'all',
      color: 'all',
      sortBy: 'newest',
    });
  };

  const handleCreateItem = async (newItemData: Omit<Item, 'id' | 'createdAt'>) => {
    try {
      const created = await createItem(newItemData);
      setItems((prev) => [created, ...prev]);
      showToast(
        'success',
        created.type === 'lost' ? 'Lost Item Reported' : 'Found Item Logged',
        `Your listing "${created.title}" is now active on the campus directory.`
      );
    } catch (err: any) {
      showToast('error', 'Submission Failed', err?.message || 'Could not record item.');
      throw err;
    }
  };

  const handleMarkResolved = async (itemId: string) => {
    try {
      const updated = await updateItemStatus(itemId, 'resolved');
      if (updated) {
        setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
        if (selectedItem?.id === itemId) {
          setSelectedItem(updated);
        }
        showToast('success', 'Case Resolved!', 'Item successfully marked as reunited with owner.');
      }
    } catch (err) {
      showToast('error', 'Update Failed', 'Could not update item status.');
    }
  };

  const handleSubmitClaim = async (claimData: Omit<ClaimSubmission, 'id' | 'submittedAt'>) => {
    try {
      await submitClaim(claimData);
      showToast(
        'success',
        'Inquiry Dispatched',
        'Campus custody and item reporter have been notified with your verification details.'
      );
    } catch (err) {
      showToast('error', 'Claim Failed', 'Could not send verification inquiry.');
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 antialiased">
      {/* Universal Campus Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenReport={() => setReportModalOpen(true)}
        onOpenReportLost={handleOpenReportLost}
        onOpenReportFound={handleOpenReportFound}
        onFocusSearch={handleFocusSearch}
        activeMatchCount={matchCount}
        itemTypeFilter={filter.type === 'resolved' ? 'all' : filter.type}
        onSelectTypeFilter={(type) => handleFilterUpdate({ type })}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* VIEW 1: DASHBOARD (Home visual showcase) */}
        {currentView === 'dashboard' && (
          <div>
            {/* Hero Showcase with real statistics, interactive zone selector & search */}
            <HeroSection
              items={items}
              searchQuery={filter.searchQuery}
              selectedZone={filter.campusZone}
              onSearchChange={(q) => handleFilterUpdate({ searchQuery: q })}
              onZoneChange={(zone) => handleFilterUpdate({ campusZone: zone as any })}
              onExecuteSearch={() => {
                setCurrentView('directory');
                window.scrollTo({ top: 320, behavior: 'smooth' });
              }}
              onOpenReportLost={handleOpenReportLost}
              onOpenReportFound={handleOpenReportFound}
              onBrowseItems={() => {
                setCurrentView('directory');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              searchInputRef={searchInputRef}
            />

            {/* Showcase Section: Categories & Recent Listings */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
              {/* Category selector row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Explore by Category
                  </h2>
                  <span className="text-xs text-slate-400">
                    {items.length} active university catalog records
                  </span>
                </div>
                <CategoryFilter
                  selectedCategory={filter.category}
                  onSelectCategory={(cat) => handleFilterUpdate({ category: cat })}
                  items={items}
                />
              </div>

              {/* Color Swatch Filter Row */}
              <div className="pt-2">
                <ColorFilterBar
                  selectedColor={filter.color}
                  onSelectColor={(col) => handleFilterUpdate({ color: col })}
                  items={items}
                />
              </div>

              {/* Search, Status & Zone Controls */}
              <div className="pt-4 border-t border-slate-800">
                <SearchAndFilterBar
                  filter={filter}
                  onFilterChange={handleFilterUpdate}
                  onResetFilters={handleResetFilters}
                  totalFilteredCount={filteredItems.length}
                />
              </div>

              {/* Items Grid or Empty State */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Campus Listings</h3>
                    <p className="text-xs text-slate-400">
                      Recent reports from students, instructors, and security
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentView('directory')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    View All Directory &rarr;
                  </button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 space-y-4 animate-pulse"
                      >
                        <div className="aspect-[16/10] bg-slate-800/60 rounded-xl" />
                        <div className="h-4 bg-slate-800 rounded w-1/3" />
                        <div className="h-5 bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-800 rounded w-full" />
                      </div>
                    ))}
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                      <Package className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">No Matching Campus Items</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      We couldn&apos;t find any records matching your active filters. Try clearing your search or file a new report.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                      >
                        Clear Filters
                      </button>
                      <button
                        onClick={() => setReportModalOpen(true)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md cursor-pointer"
                      >
                        Report This Item
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onSelect={setSelectedItem}
                        onQuickMatch={(item) => {
                          setSelectedItem(item);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Contact & Assistance Strip */}
              <div className="rounded-2xl bg-gradient-to-r from-[#0c1836] via-[#0f172a] to-[#0b132b] border border-cyan-500/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h4 className="text-sm font-bold text-white">Need Direct Campus Officer Assistance?</h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    Visit one of 4 physical property intake desks or reach out to Campus Safety 24/7 at <span className="font-mono text-cyan-300 font-semibold">(555) 880-SAFE</span>.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-xs font-bold text-cyan-300 transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Campus Desks &amp; Inquiries &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: BROWSE DIRECTORY */}
        {currentView === 'directory' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Campus Property Directory</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Full searchable registry of lost and found articles across all university sectors.
                </p>
              </div>

              <button
                onClick={() => setReportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>File a Report</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <CategoryFilter
              selectedCategory={filter.category}
              onSelectCategory={(cat) => handleFilterUpdate({ category: cat })}
              items={items}
            />

            {/* Color Swatch Filter Row */}
            <ColorFilterBar
              selectedColor={filter.color}
              onSelectColor={(col) => handleFilterUpdate({ color: col })}
              items={items}
            />

            {/* Search and Filters */}
            <SearchAndFilterBar
              filter={filter}
              onFilterChange={handleFilterUpdate}
              onResetFilters={handleResetFilters}
              totalFilteredCount={filteredItems.length}
            />

            {/* Items Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#0f172a] border border-slate-800 p-4 space-y-4 animate-pulse"
                  >
                    <div className="aspect-[16/10] bg-slate-800/60 rounded-xl" />
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-5 bg-slate-800 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 px-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">No listings match your search</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  We checked active records across all buildings and sectors. If you recently misplaced or found something, you can file a new report immediately.
                </p>
                <div className="flex items-center justify-center gap-3 pt-3">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md cursor-pointer"
                  >
                    Report an Item
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onSelect={setSelectedItem}
                    onQuickMatch={(item) => setSelectedItem(item)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SMART MATCH AI */}
        {currentView === 'smart-match' && (
          <SmartMatchView
            items={items}
            onSelectItem={setSelectedItem}
            onInitiateReunion={(lost, found) => {
              setClaimTargetItem(found);
            }}
          />
        )}

        {/* VIEW 4: MY ACTIVITY */}
        {currentView === 'my-reports' && (
          <MyActivityView
            items={items}
            onSelectItem={setSelectedItem}
            onOpenReport={() => setReportModalOpen(true)}
            onMarkResolved={handleMarkResolved}
          />
        )}

        {/* VIEW 5: CONTACT & CAMPUS DESKS */}
        {currentView === 'contact' && (
          <ContactView onReportClick={() => setReportModalOpen(true)} />
        )}
      </main>

      {/* Universal Footer adhering to Frontend Design Constitution */}
      <footer className="border-t border-slate-800/80 bg-[#080d1a] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">Campus Lost &amp; Found</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>University Property &amp; Safety Division</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-400">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('directory')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Directory
            </button>
            <button
              onClick={() => setCurrentView('smart-match')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Smart Match
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Contact &amp; Desks
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer font-medium"
            >
              Report Item
            </button>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            &copy; 2026 University Campus Services
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ItemDetailsModal
        item={selectedItem}
        allItems={items}
        onClose={() => setSelectedItem(null)}
        onInitiateClaim={(item) => {
          setSelectedItem(null);
          setClaimTargetItem(item);
        }}
        onMarkResolved={handleMarkResolved}
        onSelectRelatedItem={(related) => {
          setSelectedItem(related);
        }}
      />

      <ReportItemModal
        isOpen={reportModalOpen}
        initialType={reportModalType}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleCreateItem}
      />

      <ClaimModal
        item={claimTargetItem}
        onClose={() => setClaimTargetItem(null)}
        onSubmitClaim={handleSubmitClaim}
      />

      {/* Floating Action Dock from the user's interface */}
      <FloatingActionDock
        onReportLost={handleOpenReportLost}
        onReportFound={handleOpenReportFound}
        onOpenContact={() => {
          setCurrentView('contact');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
