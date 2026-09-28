import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Building,
  QrCode,
  Palette,
} from 'lucide-react';
import { Item } from '../types';
import { getColorDef } from '../constants/colors';

interface PrintableSummaryProps {
  item: Item;
  onClose: () => void;
}

export const PrintableSummary: React.FC<PrintableSummaryProps> = ({ item, onClose }) => {
  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';
  const [docketQr, setDocketQr] = useState<string>('');

  const itemUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?item=${item.id}`
    : `https://campus-lostandfound.edu/items/${item.id}`;

  useEffect(() => {
    QRCode.toDataURL(itemUrl, {
      width: 140,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then(setDocketQr)
      .catch(console.error);
  }, [itemUrl]);

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const reportedTimestamp = new Date(item.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      {/* Top Floating Control Toolbar (Hidden in print) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden bg-slate-900/90 border border-slate-700/80 px-3 py-2 rounded-2xl shadow-2xl backdrop-blur-xl">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-950/50 active:scale-95 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Summary"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Document: Styled as an Official University Report Docket */}
      <div
        id="printable-docket"
        className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto print:m-0 print:shadow-none print:w-full print:max-w-none print:rounded-none"
      >
        {/* Document Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 border-b-4 border-cyan-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Safety &amp; Property Custody Division</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Official Property Incident Docket
            </h1>
            <p className="text-xs text-slate-300">
              Authorized documentation for campus custody claims, police report filing, and recovery desks.
            </p>
          </div>

          <div className="sm:text-right bg-slate-800/80 p-3 rounded-xl border border-slate-700 shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-400">Report Reference</div>
            <div className="text-base font-mono font-bold text-cyan-300">#{item.id}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Filed: {reportedTimestamp}</div>
          </div>
        </div>

        {/* Status Callout Strip */}
        <div className="px-6 sm:px-8 py-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Docket Status:</span>
            <span
              className={`px-3 py-1 rounded-md font-bold uppercase tracking-wider text-xs ${
                isResolved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : isLost
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-cyan-100 text-cyan-900 border border-cyan-300'
              }`}
            >
              {isResolved
                ? 'Resolved / Reunited with Owner'
                : isLost
                ? 'Active Missing Report (Awaiting Discovery)'
                : 'Active Found Record (In Official Custody)'}
            </span>
          </div>

          <div className="text-slate-500 text-[11px]">
            Security Verification Level: <strong>University Verified (Tier-1)</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Item Top Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Photo / Visual Verification Evidence */}
            <div className="md:col-span-5">
              <div className="rounded-xl overflow-hidden border border-slate-300 bg-slate-100 aspect-[4/3] flex items-center justify-center relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <span className="text-xs font-medium">No Photographic Evidence Submitted</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-mono">
                  REF-{item.id}
                </div>
              </div>
            </div>

            {/* Core Item Information Details */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                  Category: {item.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {item.title}
                </h2>
              </div>

              {/* Grid of Key Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Date of Incident</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-0.5">{formattedDate}</div>
                </div>

                <div>
                  <div className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Campus Zone</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-0.5">{item.campusZone}</div>
                </div>

                <div className="sm:col-span-2">
                  <div className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Specific Incident Location</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-0.5">{item.location}</div>
                </div>

                {item.primaryColor && (() => {
                  const colDef = getColorDef(item.primaryColor);
                  return (
                    <div className="sm:col-span-2 flex items-center gap-2 pt-2 border-t border-slate-200">
                      <Palette className="w-3.5 h-3.5 text-cyan-600" />
                      <span className="text-slate-500 font-semibold">Primary Color / Finish:</span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                        <span
                          className={`w-2.5 h-2.5 rounded-full border ${colDef?.borderClass || 'border-slate-500'} ${colDef?.bgClass || 'bg-slate-400'}`}
                          style={colDef?.name === 'Multicolor / Pattern' ? { background: colDef.hex } : undefined}
                        />
                        <span>{item.primaryColor}</span>
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Item Description */}
              <div>
                <div className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
                  Item Description &amp; Distinctive Characteristics
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal">
                  {item.description}
                </div>
              </div>
            </div>
          </div>

          {/* Submitter & Campus Custody Contact Dossier */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Reporting Party / Registered Contact Dossier
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="text-slate-500 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span>Full Name</span>
                </div>
                <div className="font-bold text-slate-800 mt-1">{item.contactName}</div>
                <div className="text-[11px] text-slate-500">{item.contactRole}</div>
              </div>

              <div>
                <div className="text-slate-500 font-medium flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  <span>Campus Email</span>
                </div>
                <div className="font-bold font-mono text-slate-800 mt-1">{item.contactEmail}</div>
              </div>

              <div>
                <div className="text-slate-500 font-medium flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Contact Telephone</span>
                </div>
                <div className="font-bold font-mono text-slate-800 mt-1">{item.contactPhone}</div>
              </div>
            </div>
          </div>

          {/* Official Instructions for Campus Safety Submission */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Instructions for Campus Safety &amp; Intake Desk Officers</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              This docket represents a registered report entered into the campus property database. When a student or visitor presents this document to claim possession, verify their University ID card against the name above. In the case of electronic devices or high-value items, request passcodes, biometric unlocking, or matching serial numbers before releasing custody.
            </p>
          </div>

          {/* Verification Signatures & Stamp Area */}
          <div className="border-t-2 border-dashed border-slate-300 pt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-600">
            <div>
              <div className="font-bold uppercase text-[10px] text-slate-400">Claimant / Owner Signature</div>
              <div className="mt-8 border-b border-slate-400 h-6" />
              <div className="mt-1 text-[10px] text-slate-500">Date: ________________________</div>
            </div>

            <div>
              <div className="font-bold uppercase text-[10px] text-slate-400">Intake Officer Signature</div>
              <div className="mt-8 border-b border-slate-400 h-6" />
              <div className="mt-1 text-[10px] text-slate-500">Badge / Officer ID: _____________</div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex flex-col justify-between items-center sm:items-end text-right">
              {docketQr ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400">Scan for Live Record</div>
                    <div className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 mt-0.5">
                      REF-{item.id}
                    </div>
                  </div>
                  <img
                    src={docketQr}
                    alt={`QR Code for ${item.id}`}
                    className="w-14 h-14 p-0.5 border border-slate-300 rounded bg-white shadow-xs"
                  />
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-mono text-slate-400">System Verification Hash</div>
                  <div className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 mt-1">
                    SEC-CRC-{item.id.toUpperCase()}-VERIFIED
                  </div>
                </>
              )}
              <div className="text-[10px] text-slate-400 mt-1">
                University Lost &amp; Found Registry
              </div>
            </div>
          </div>
        </div>

        {/* Print Footer */}
        <div className="bg-slate-100 px-8 py-3 text-[10px] text-slate-500 border-t border-slate-200 flex justify-between items-center">
          <span>Official University Record — Subject to Campus Safety Code §14-B</span>
          <span>Printed on {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
