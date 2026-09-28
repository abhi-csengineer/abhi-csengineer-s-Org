import React, { useState } from 'react';
import { X, ShieldCheck, Mail, User, Phone, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { ClaimSubmission, Item } from '../types';

interface ClaimModalProps {
  item: Item | null;
  onClose: () => void;
  onSubmitClaim: (claim: Omit<ClaimSubmission, 'id' | 'submittedAt'>) => Promise<void>;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, onClose, onSubmitClaim }) => {
  const [claimantName, setClaimantName] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!item) return null;

  const isLost = item.type === 'lost';
  const claimType: 'i_found_this' | 'this_is_mine' = isLost ? 'i_found_this' : 'this_is_mine';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!claimantName.trim() || !claimantEmail.trim() || !proofDetails.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      await onSubmitClaim({
        itemId: item.id,
        claimantName: claimantName.trim(),
        claimantEmail: claimantEmail.trim(),
        claimantPhone: claimantPhone.trim(),
        claimType,
        proofDetails: proofDetails.trim(),
        status: 'pending',
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Verification submission failed. Please try again.');
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
        className="relative w-full max-w-lg rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b132b]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {isLost ? 'Report Found Belonging' : 'Item Verification & Claim'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Direct inquiry regarding: &ldquo;{item.title}&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-[#0b132b] border border-slate-800">
            <div className="text-slate-400 text-[11px]">Contacting:</div>
            <div className="text-white font-medium text-xs mt-0.5">
              {item.contactName} ({item.contactRole}) · <span className="text-cyan-400 font-mono">{item.contactEmail}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Your Full Name <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                placeholder="e.g. Taylor Smith"
                className="w-full pl-8 pr-3 py-2 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Your Campus Email <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={claimantEmail}
                onChange={(e) => setClaimantEmail(e.target.value)}
                placeholder="tsmith@university.edu"
                className="w-full pl-8 pr-3 py-2 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={claimantPhone}
                onChange={(e) => setClaimantPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full pl-8 pr-3 py-2 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {isLost
                ? 'Where did you find this item / current location? *'
                : 'Ownership Proof & Distinguishing Details *'}
            </label>
            <textarea
              required
              rows={3}
              value={proofDetails}
              onChange={(e) => setProofDetails(e.target.value)}
              placeholder={
                isLost
                  ? 'Describe where you found it, condition, or which campus desk you turned it into...'
                  : 'Describe unique traits, password/wallpaper hints, contents, or serial numbers to confirm ownership...'
              }
              className="w-full p-2.5 bg-[#0b132b] border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              {isLost
                ? 'The owner will receive this message with your campus contact details.'
                : 'Campus security and finders verify proof before releasing valuable property.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Send Notification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
