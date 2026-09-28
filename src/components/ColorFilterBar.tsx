import React from 'react';
import { Palette, X } from 'lucide-react';
import { ITEM_COLORS } from '../constants/colors';
import { Item } from '../types';

interface ColorFilterBarProps {
  selectedColor: 'all' | string;
  onSelectColor: (color: 'all' | string) => void;
  items: Item[];
}

export const ColorFilterBar: React.FC<ColorFilterBarProps> = ({
  selectedColor,
  onSelectColor,
  items,
}) => {
  // Count items per color
  const getColorCount = (colorName: string) => {
    return items.filter(
      (item) =>
        item.primaryColor?.toLowerCase() === colorName.toLowerCase() ||
        (colorName.includes('/') &&
          item.primaryColor &&
          colorName.toLowerCase().includes(item.primaryColor.toLowerCase()))
    ).length;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filter by Item Color</span>
          {selectedColor !== 'all' && (
            <span className="text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full font-mono">
              Active: {selectedColor}
            </span>
          )}
        </div>

        {selectedColor !== 'all' && (
          <button
            onClick={() => onSelectColor('all')}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear Color</span>
          </button>
        )}
      </div>

      {/* Horizontal Swatches Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {/* All Colors Button */}
        <button
          onClick={() => onSelectColor('all')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedColor === 'all'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'bg-[#0f172a]/90 text-slate-400 hover:text-white border border-slate-800/80 hover:bg-slate-800/50'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 border border-white/20 shrink-0" />
          <span>All Swatches</span>
        </button>

        {ITEM_COLORS.map((col) => {
          const isSelected = selectedColor === col.name;
          const count = getColorCount(col.name);

          return (
            <button
              key={col.name}
              onClick={() => onSelectColor(isSelected ? 'all' : col.name)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-slate-800/90 text-white border-cyan-400/80 shadow-md shadow-cyan-950/40 scale-[1.03]'
                  : 'bg-[#0f172a]/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
              title={`${col.name} (${count} items)`}
            >
              {/* Color Dot Swatch */}
              <span
                className={`w-3.5 h-3.5 rounded-full ${col.bgClass} ${col.borderClass} border shadow-sm shrink-0 transition-transform group-hover:scale-110`}
                style={col.name === 'Multicolor / Pattern' ? { background: col.hex } : undefined}
              />

              <span className="font-medium">{col.name}</span>

              {count > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
