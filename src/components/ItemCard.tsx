import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Laptop,
  CreditCard,
  Key,
  Backpack,
  BookOpen,
  Shirt,
  Coffee,
  HelpCircle,
} from 'lucide-react';
import { Item, ItemCategory } from '../types';
import { getColorDef } from '../constants/colors';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  onQuickMatch?: (item: Item) => void;
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

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect, onQuickMatch }) => {
  const [imgError, setImgError] = useState(false);
  const CategoryIcon = CATEGORY_ICONS[item.category] || Package;

  // Format date cleanly e.g. "Sept 26, 2026"
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article
      onClick={() => onSelect(item)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/90 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-950/40 transition-all duration-300 overflow-hidden cursor-pointer card-hover-fx"
    >
      {/* Top Media Slot with Gradient Overlays & Zoom */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 border-b border-slate-800/80">
        {item.imageUrl && !imgError ? (
          <>
            <img
              src={item.imageUrl}
              alt={item.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out select-none"
              referrerPolicy="no-referrer"
            />
            {/* Subtle bottom vignette to ensure zone/date tag readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a]/90 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-[#0b132b] text-slate-500 p-4">
            <CategoryIcon className="w-10 h-10 text-slate-600 mb-2 group-hover:text-cyan-400/80 group-hover:scale-110 transition-all" />
            <span className="text-xs font-medium text-slate-400">{item.category}</span>
          </div>
        )}

        {/* Minimal High-Contrast Status Indicator on Card Image */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#080d1a]/85 backdrop-blur-md border border-white/10 text-xs font-semibold shadow-md">
          {item.status === 'resolved' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Resolved / Returned</span>
            </>
          ) : item.type === 'lost' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400 animate-pulse" />
              <span className="text-amber-300">LOST</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              <span className="text-cyan-300">FOUND</span>
            </>
          )}
        </div>

        {/* Campus Zone Indicator */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-200 bg-[#080d1a]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 truncate shadow-sm">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate font-medium">{item.campusZone}</span>
          </span>
          <span className="font-mono text-slate-300 shrink-0 ml-2 text-[10px]">{formattedDate}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata with · separator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
            <span className="text-cyan-400 font-semibold">{item.category}</span>
            {item.primaryColor && (() => {
              const colDef = getColorDef(item.primaryColor);
              return (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                    <span
                      className={`w-2.5 h-2.5 rounded-full border ${colDef?.borderClass || 'border-slate-500'} ${colDef?.bgClass || 'bg-slate-400'}`}
                      style={colDef?.name === 'Multicolor / Pattern' ? { background: colDef.hex } : undefined}
                    />
                    <span>{item.primaryColor}</span>
                  </span>
                </>
              );
            })()}
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate text-slate-300">{item.location}</span>
          </div>

          {/* Item Title */}
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 leading-snug">
            {item.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Area */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Submitter Info */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate text-[11px]">By {item.contactName} ({item.contactRole})</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {onQuickMatch && item.status === 'active' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickMatch(item);
                }}
                className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/60 rounded-lg transition-colors border border-transparent hover:border-cyan-500/30"
                title="Find Smart Match"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
