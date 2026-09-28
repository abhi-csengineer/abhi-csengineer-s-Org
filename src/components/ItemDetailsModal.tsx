import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Laptop,
  CreditCard,
  Key,
  Backpack,
  BookOpen,
  Shirt,
  Coffee,
  HelpCircle,
  Package,
  Printer,
  FileDown,
  Palette,
  QrCode,
  Copy,
  Check,
  Download,
  Smartphone,
  ExternalLink as LinkIcon,
} from 'lucide-react';
import QRCode from 'qrcode';
import { Item, ItemCategory, SmartMatchResult } from '../types';
import { calculateLocalMatch } from '../services/aiMatch';
import { PrintableSummary } from './PrintableSummary';
import { ItemQrCodeModal } from './ItemQrCodeModal';
import { getColorDef } from '../constants/colors';

interface ItemDetailsModalProps {
  item: Item | null;
  allItems: Item[];
  onClose: () => void;
  onInitiateClaim: (item: Item) => void;
  onMarkResolved: (itemId: string) => void;
  onSelectRelatedItem?: (item: Item) => void;
}

const CATEGORY_ICONS: Record<ItemCategory, React.ElementType> = {
  Electronics: Laptop,
  'IDs & Cards': CreditCard,
  Keys: Key,
  'Bags & Backpacks': Backpack,
  'Books & Stationery': BookOpen,
  'Clothing & Accessories': Shirt,
  'Water Bottles & Mugs': Coffee,
  Other: HelpCircle,
};

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  allItems,
  onClose,
  onInitiateClaim,
  onMarkResolved,
  onSelectRelatedItem,
}) => {
  const [potentialMatches, setPotentialMatches] = useState<SmartMatchResult[]>([]);
  const [imgError, setImgError] = useState(false);
  const [showPrintable, setShowPrintable] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [inlineQr, setInlineQr] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate unique deep-link URL for this item
  const itemUrl = item && typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?item=${item.id}`
    : `https://campus-lostandfound.edu/items/${item?.id || ''}`;

  useEffect(() => {
    if (!item) return;

    // Generate quick QR data URL for inline display
    QRCode.toDataURL(itemUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setInlineQr(url))
      .catch((err) => console.error('Failed generating inline QR', err));
  }, [item, itemUrl]);

  useEffect(() => {
    if (!item) return;
    setImgError(false);

    // Compute potential matching counterpart items
    const counterparts = allItems.filter(
      (candidate) =>
        candidate.id !== item.id &&
        candidate.type !== item.type &&
        candidate.status === 'active'
    );

    const matches: SmartMatchResult[] = [];
    counterparts.forEach((counterpart) => {
      const lost = item.type === 'lost' ? item : counterpart;
      const found = item.type === 'found' ? item : counterpart;
      const match = calculateLocalMatch(lost, found);
      if (match && match.confidence >= 50) {
        matches.push(match);
      }
    });

    setPotentialMatches(matches.sort((a, b) => b.confidence - a.confidence));
  }, [item, allItems]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const CategoryIcon = CATEGORY_ICONS[item.category] || Package;
  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-[#0b132b]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                isResolved
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-emerald-950/30'
                  : isLost
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-amber-950/30'
                  : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-cyan-950/30'
              }`}
            >
              {isResolved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RESOLVED / RETURNED</span>
                </>
              ) : isLost ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400 animate-pulse" />
                  <span>LOST ITEM REPORT</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                  <span>FOUND ITEM IN CUSTODY</span>
                </>
              )}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Ref ID: <span className="font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-white/5">{item.id}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 text-xs font-semibold rounded-xl border border-cyan-700/60 transition-all cursor-pointer shadow-sm"
              title="Show official QR code for quick scanning"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">QR Quick-Scan</span>
            </button>

            <button
              onClick={() => setShowPrintable(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-750 hover:text-cyan-300 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer shadow-sm"
              title="Print official incident summary or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export PDF / Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Main Title and Image Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image Section */}
            <div className="md:col-span-5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 relative shadow-xl shadow-black/40 group">
                {item.imageUrl && !imgError ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-500 bg-gradient-to-br from-slate-900 to-[#0b132b]">
                    <CategoryIcon className="w-12 h-12 text-slate-600 mb-2" />
                    <span className="text-xs font-medium text-slate-400">{item.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Core Specifications */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
                  <span>{item.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{item.campusZone}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {item.title}
                </h2>
              </div>

              {/* Location and Date details */}
              <div className="space-y-2.5 p-3.5 rounded-xl bg-[#0b132b]/80 border border-slate-800 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">Specific Location:</span>
                    <span className="text-slate-200 font-medium">{item.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block">Date Reported / Misplaced:</span>
                    <span className="text-slate-200 font-medium">{formattedDate}</span>
                  </div>
                </div>

                {item.primaryColor && (() => {
                  const colDef = getColorDef(item.primaryColor);
                  return (
                    <div className="flex items-center gap-2.5 pt-1 border-t border-slate-800/80">
                      <Palette className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Primary Color:</span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-medium text-slate-200">
                          <span
                            className={`w-2.5 h-2.5 rounded-full border ${colDef?.borderClass || 'border-slate-500'} ${colDef?.bgClass || 'bg-slate-400'}`}
                            style={colDef?.name === 'Multicolor / Pattern' ? { background: colDef.hex } : undefined}
                          />
                          <span>{item.primaryColor}</span>
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Detailed Description
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              {item.description}
            </p>
          </div>

          {/* Identifying Features / Proof Guidance */}
          {item.identifyingFeatures && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Verification / Identifying Notes</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                {item.identifyingFeatures}
              </p>
            </div>
          )}

          {/* Contact / Submitter Profile */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isLost ? 'Owner Contact Info' : 'Finder / Custody Info'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#0b132b]/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Reported By</span>
                  <span className="text-white font-medium">
                    {item.contactName} ({item.contactRole})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Campus Email</span>
                  <a
                    href={`mailto:${item.contactEmail}`}
                    className="text-cyan-400 hover:underline font-mono"
                  >
                    {item.contactEmail}
                  </a>
                </div>
              </div>

              {item.contactPhone && (
                <div className="flex items-center gap-2.5 sm:col-span-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone / Extension</span>
                    <a
                      href={`tel:${item.contactPhone}`}
                      className="text-slate-200 hover:text-white font-mono"
                    >
                      {item.contactPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Campus Official Quick-Scan QR Code Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0b132b] to-slate-900 border border-cyan-500/30 shadow-lg shadow-cyan-950/30">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* QR Code Canvas / Image */}
              <div className="p-2.5 bg-white rounded-xl shadow-md border border-cyan-400/40 shrink-0 relative group">
                {inlineQr ? (
                  <img
                    src={inlineQr}
                    alt={`QR Code for ${item.title}`}
                    className="w-28 h-28 object-contain cursor-pointer"
                    onClick={() => setShowQrModal(true)}
                    title="Click to enlarge or print custody tag"
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center text-[10px] text-slate-500">
                    Generating...
                  </div>
                )}
                <div
                  className="absolute inset-0 bg-cyan-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl cursor-pointer"
                  onClick={() => setShowQrModal(true)}
                >
                  <span className="bg-slate-900/90 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-cyan-500/40">
                    Enlarge
                  </span>
                </div>
              </div>

              {/* QR Info and Actions */}
              <div className="flex-1 text-center sm:text-left space-y-2.5 min-w-0 w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-cyan-400 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Campus Official Quick-Scan QR
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                    REF-{item.id}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Encodes this item's unique direct URL for rapid scanning by Campus Safety officers, library front desks, and custody staff.
                </p>

                {/* Direct Encoded Link Pill with Copy Button */}
                <div className="flex items-center gap-2 p-1.5 bg-[#070d1e] rounded-xl border border-slate-800 text-xs">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400 ml-1 shrink-0" />
                  <span className="font-mono text-[11px] text-slate-400 truncate flex-1 select-all text-left">
                    {itemUrl}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(itemUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      } catch {}
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Copy unique link to clipboard"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-cyan-400" />
                        <span className="text-[11px]">Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Enlarge / Tag Layout</span>
                  </button>

                  {inlineQr && (
                    <a
                      href={inlineQr}
                      download={`campus-qr-${item.id}.png`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Download PNG</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Adjacent Smart Match Suggestions */}
          {potentialMatches.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Potential Smart Matches Found ({potentialMatches.length})</span>
                </h4>
                <span className="text-[11px] text-slate-400">AI correlated records</span>
              </div>

              <div className="space-y-2">
                {potentialMatches.slice(0, 2).map((match) => {
                  const counterpart = isLost ? match.foundItem : match.lostItem;
                  return (
                    <div
                      key={match.id}
                      className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 hover:border-cyan-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {match.confidence}% Match
                          </span>
                          <span className="text-xs font-bold text-white line-clamp-1">
                            {counterpart.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-1">
                          {match.reasoning}
                        </p>
                      </div>

                      {onSelectRelatedItem && (
                        <button
                          onClick={() => onSelectRelatedItem(counterpart)}
                          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 shrink-0 self-end sm:self-auto cursor-pointer"
                        >
                          <span>Compare Item</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom CTA Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0b132b] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {!isResolved && (
              <button
                type="button"
                onClick={() => onMarkResolved(item.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/30 border border-slate-700 hover:border-emerald-600/40 rounded-xl transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark Reunited / Resolved</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPrintable(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-xl transition-all cursor-pointer shadow-sm"
              title="Export official incident proof for Campus Safety office"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Campus Safety Proof (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-xl transition-all cursor-pointer shadow-sm"
              title="Generate scannable QR code for campus custody officers"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>QR Scanner Tag</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>

            {!isResolved && (
              <button
                onClick={() => onInitiateClaim(item)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-md shadow-cyan-950/40 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLost ? 'I Found This Item' : 'Contact Finder / Claim'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Render Printable Summary / PDF Export Docket */}
      {showPrintable && (
        <PrintableSummary
          item={item}
          onClose={() => setShowPrintable(false)}
        />
      )}

      {/* Render Item QR Code Modal */}
      {showQrModal && (
        <ItemQrCodeModal
          item={item}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
};
