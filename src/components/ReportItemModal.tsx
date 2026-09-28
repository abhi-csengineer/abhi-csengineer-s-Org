import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  Tag,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  Laptop,
  CreditCard,
  Key,
  Backpack,
  Coffee,
  HelpCircle,
  Sparkles,
  Palette,
} from 'lucide-react';
import { CampusZone, Item, ItemCategory, ItemType } from '../types';
import { ITEM_COLORS } from '../constants/colors';
import macbookImg from '../assets/images/item_macbook_pro_1790578045644.jpg';
import airpodsImg from '../assets/images/item_airpods_pro_1790578060590.jpg';
import walletImg from '../assets/images/item_leather_wallet_1790578076252.jpg';
import hydroflaskImg from '../assets/images/item_hydroflask_1790578093209.jpg';
import keysImg from '../assets/images/item_keys_fob_1790578695575.jpg';
import backpackImg from '../assets/images/item_backpack_1790578712457.jpg';
import calculatorImg from '../assets/images/item_calculator_1790578726927.jpg';
import glassesImg from '../assets/images/item_glasses_1790578743886.jpg';

interface ReportItemModalProps {
  isOpen: boolean;
  initialType?: ItemType;
  onClose: () => void;
  onSubmit: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<void>;
}

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'IDs & Cards',
  'Keys',
  'Bags & Backpacks',
  'Books & Stationery',
  'Clothing & Accessories',
  'Water Bottles & Mugs',
  'Other',
];

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

const PRESET_IMAGES = [
  { label: 'Laptop / Tech', url: macbookImg },
  { label: 'Earbuds / Audio', url: airpodsImg },
  { label: 'Wallet / Cards', url: walletImg },
  { label: 'Bottle / Flask', url: hydroflaskImg },
  { label: 'Keys / Fob', url: keysImg },
  { label: 'Backpack / Bag', url: backpackImg },
  { label: 'Calculator', url: calculatorImg },
  { label: 'Glasses', url: glassesImg },
];

export const ReportItemModal: React.FC<ReportItemModalProps> = ({
  isOpen,
  initialType,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<ItemType>(initialType || 'lost');

  useEffect(() => {
    if (isOpen && initialType) {
      setType(initialType);
    }
  }, [isOpen, initialType]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [primaryColor, setPrimaryColor] = useState<string>('Black');
  const [campusZone, setCampusZone] = useState<CampusZone>('Main Library & Study Hub');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [identifyingFeatures, setIdentifyingFeatures] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRole, setContactRole] = useState<'Student' | 'Faculty' | 'Campus Staff' | 'Campus Safety'>('Student');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!title.trim()) {
      setErrorMsg('Please enter an item name or brief title.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please specify the exact room, desk, or area.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a short description.');
      return;
    }
    if (!contactName.trim() || !contactEmail.trim()) {
      setErrorMsg('Please provide your name and university email.');
      return;
    }
    if (!contactEmail.includes('@')) {
      setErrorMsg('Please enter a valid university email address.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        type,
        title: title.trim(),
        category,
        primaryColor,
        campusZone,
        location: location.trim(),
        date,
        description: description.trim(),
        identifyingFeatures: identifyingFeatures.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || undefined,
        contactRole,
        status: 'active',
      });

      // Reset form
      setTitle('');
      setPrimaryColor('Black');
      setLocation('');
      setDescription('');
      setIdentifyingFeatures('');
      setImageUrl('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b132b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Report Campus Item</h2>
              <p className="text-xs text-slate-400">File a report for the university network</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close report form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Prominent Lost / Found Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Report Category <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                  type === 'lost'
                    ? 'bg-amber-950/40 border-amber-500/70 text-amber-300 shadow-md shadow-amber-950/30'
                    : 'bg-[#0b132b] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>I Lost Something</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1">
                  Report missing belongings
                </span>
              </button>

              <button
                type="button"
                onClick={() => setType('found')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                  type === 'found'
                    ? 'bg-cyan-950/40 border-cyan-500/70 text-cyan-300 shadow-md shadow-cyan-950/30'
                    : 'bg-[#0b132b] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>I Found Something</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1">
                  Log found item to custody
                </span>
              </button>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Item Name &amp; Model <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. MacBook Pro 14 Space Gray, Black Car Key with RFID Fob"
              className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>

          {/* Category & Campus Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category <span className="text-cyan-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Campus Sector <span className="text-cyan-400">*</span>
              </label>
              <select
                value={campusZone}
                onChange={(e) => setCampusZone(e.target.value as CampusZone)}
                className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white focus:outline-none cursor-pointer"
              >
                {CAMPUS_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Item Color Swatch Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span>Primary Color / Finish</span>
              </label>
              <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                Selected: {primaryColor}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 p-3 bg-[#0b132b] border border-slate-700/80 rounded-xl">
              {ITEM_COLORS.map((col) => {
                const isSelected = primaryColor === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setPrimaryColor(col.name)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-800 text-white border-cyan-400 shadow-sm shadow-cyan-500/20 scale-105'
                        : 'bg-[#0f172a] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full ${col.bgClass} ${col.borderClass} border shadow-xs`}
                      style={col.name === 'Multicolor / Pattern' ? { background: col.hex } : undefined}
                    />
                    <span className="text-[11px] font-medium">{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Specific Location <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 3rd Floor Quiet Study Desk 14"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date Lost / Discovered <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white focus:outline-none"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Item Description <span className="text-cyan-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, size, case/cover, stickers, or brand markings..."
              className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Identifying Features for verification */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Private Distinguishing Features <span className="text-slate-400 font-normal">(For ownership proof verification)</span>
            </label>
            <input
              type="text"
              value={identifyingFeatures}
              onChange={(e) => setIdentifyingFeatures(e.target.value)}
              placeholder="e.g. Serial ending in 892, specific lockscreen, small scuff on corner"
              className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Photo attachment or presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Photo Attachment <span className="text-slate-400 font-normal">(Optional photo reference)</span>
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] text-slate-400">Sample presets:</span>
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors cursor-pointer ${
                    imageUrl === preset.url
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-[11px] text-slate-400 hover:text-rose-400 ml-1"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste an image URL..."
                className="w-full pl-9 pr-3.5 py-2 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <Camera className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-2 border-t border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Campus Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Full Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Jordan Chen"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  University Email <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="username@university.edu"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone / Extension <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Campus Role <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-sm text-white focus:outline-none cursor-pointer"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty / Instructor</option>
                  <option value="Campus Staff">Campus Staff / Facilities</option>
                  <option value="Campus Safety">Campus Safety &amp; Security</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 rounded-xl shadow-md shadow-cyan-950/40 active:scale-95 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting to Campus Log...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit {type === 'lost' ? 'Lost Item Report' : 'Found Item Record'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
