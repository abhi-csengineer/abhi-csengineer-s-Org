export type ItemColor =
  | 'Black'
  | 'Silver / Gray'
  | 'White'
  | 'Blue'
  | 'Red / Crimson'
  | 'Navy'
  | 'Green / Olive'
  | 'Yellow / Gold'
  | 'Orange'
  | 'Purple / Violet'
  | 'Pink'
  | 'Brown / Tan'
  | 'Multicolor / Pattern';

export interface ColorDef {
  name: ItemColor;
  hex: string;
  bgClass: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
}

export const ITEM_COLORS: ColorDef[] = [
  {
    name: 'Black',
    hex: '#1e293b',
    bgClass: 'bg-slate-900',
    borderClass: 'border-slate-600',
    badgeBg: 'bg-slate-800',
    badgeText: 'text-slate-200',
  },
  {
    name: 'Silver / Gray',
    hex: '#94a3b8',
    bgClass: 'bg-slate-400',
    borderClass: 'border-slate-300',
    badgeBg: 'bg-slate-700/80',
    badgeText: 'text-slate-200',
  },
  {
    name: 'White',
    hex: '#f8fafc',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-300',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-900',
  },
  {
    name: 'Blue',
    hex: '#38bdf8',
    bgClass: 'bg-sky-500',
    borderClass: 'border-sky-400',
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300',
  },
  {
    name: 'Navy',
    hex: '#1d4ed8',
    bgClass: 'bg-blue-700',
    borderClass: 'border-blue-500',
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-300',
  },
  {
    name: 'Red / Crimson',
    hex: '#ef4444',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-400',
    badgeBg: 'bg-red-950/80',
    badgeText: 'text-red-300',
  },
  {
    name: 'Green / Olive',
    hex: '#10b981',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-400',
    badgeBg: 'bg-emerald-950/80',
    badgeText: 'text-emerald-300',
  },
  {
    name: 'Yellow / Gold',
    hex: '#eab308',
    bgClass: 'bg-yellow-400',
    borderClass: 'border-yellow-300',
    badgeBg: 'bg-yellow-950/80',
    badgeText: 'text-yellow-300',
  },
  {
    name: 'Orange',
    hex: '#f97316',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-400',
    badgeBg: 'bg-orange-950/80',
    badgeText: 'text-orange-300',
  },
  {
    name: 'Purple / Violet',
    hex: '#a855f7',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-400',
    badgeBg: 'bg-purple-950/80',
    badgeText: 'text-purple-300',
  },
  {
    name: 'Pink',
    hex: '#ec4899',
    bgClass: 'bg-pink-500',
    borderClass: 'border-pink-400',
    badgeBg: 'bg-pink-950/80',
    badgeText: 'text-pink-300',
  },
  {
    name: 'Brown / Tan',
    hex: '#b45309',
    bgClass: 'bg-amber-700',
    borderClass: 'border-amber-600',
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-300',
  },
  {
    name: 'Multicolor / Pattern',
    hex: 'linear-gradient(135deg, #f43f5e 0%, #3b82f6 50%, #10b981 100%)',
    bgClass: 'bg-gradient-to-tr from-pink-500 via-indigo-500 to-emerald-400',
    borderClass: 'border-indigo-400',
    badgeBg: 'bg-indigo-950/80',
    badgeText: 'text-indigo-300',
  },
];

export function getColorDef(colorName?: string): ColorDef | undefined {
  if (!colorName) return undefined;
  return ITEM_COLORS.find(
    (c) => c.name.toLowerCase() === colorName.toLowerCase() || c.name.includes(colorName)
  );
}
