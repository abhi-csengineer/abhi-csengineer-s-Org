import React from 'react';
import {
  Laptop,
  CreditCard,
  Key,
  Backpack,
  BookOpen,
  Shirt,
  Coffee,
  HelpCircle,
  LayoutGrid,
} from 'lucide-react';
import { Item, ItemCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: 'all' | ItemCategory;
  onSelectCategory: (category: 'all' | ItemCategory) => void;
  items: Item[];
}

const CATEGORIES: { label: string; value: 'all' | ItemCategory; icon: React.ElementType }[] = [
  { label: 'All Items', value: 'all', icon: LayoutGrid },
  { label: 'Electronics', value: 'Electronics', icon: Laptop },
  { label: 'IDs & Cards', value: 'IDs & Cards', icon: CreditCard },
  { label: 'Keys & Fobs', value: 'Keys', icon: Key },
  { label: 'Bags & Packs', value: 'Bags & Backpacks', icon: Backpack },
  { label: 'Books & Notes', value: 'Books & Stationery', icon: BookOpen },
  { label: 'Clothing & Gear', value: 'Clothing & Accessories', icon: Shirt },
  { label: 'Bottles & Mugs', value: 'Water Bottles & Mugs', icon: Coffee },
  { label: 'Other Items', value: 'Other', icon: HelpCircle },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  items,
}) => {
  // Count items per category
  const getCategoryCount = (val: 'all' | ItemCategory) => {
    if (val === 'all') return items.length;
    return items.filter((i) => i.category === val).length;
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.value;
          const count = getCategoryCount(cat.value);

          return (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-950/50 scale-[1.02]'
                  : 'bg-[#0f172a]/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
              <span
                className={`ml-0.5 px-2 py-0.5 rounded-md text-[10px] font-mono tabular-nums font-bold ${
                  isSelected ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/30' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
