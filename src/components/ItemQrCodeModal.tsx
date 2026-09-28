import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Copy,
  Check,
  Download,
  Printer,
  ExternalLink,
  X,
  ShieldCheck,
  Smartphone,
  Tag,
  Building,
} from 'lucide-react';
import { Item } from '../types';

interface ItemQrCodeModalProps {
  item: Item;
  onClose: () => void;
}

export const ItemQrCodeModal: React.FC<ItemQrCodeModalProps> = ({ item, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState<number>(240);
  const [qrColorTheme, setQrColorTheme] = useState<'standard' | 'brand'>('standard');
  const printRef = useRef<HTMLDivElement>(null);

  // Generate unique URL for this specific item
  const itemUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?item=${item.id}`
    : `https://campus-lostandfound.edu/items/${item.id}`;

  useEffect(() => {
    async function generateCode() {
      try {
        const darkColor = qrColorTheme === 'brand' ? '#0891b2' : '#0f172a';
        const url = await QRCode.toDataURL(itemUrl, {
          width: 320,
          margin: 2,
          color: {
            dark: darkColor,
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H', // High error correction for reliable camera scanning
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    }

    generateCode();
  }, [itemUrl, qrColorTheme]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(itemUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `campus-qr-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTag = () => {
    const printWindow = window.open('', '_blank', 'width=500,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Campus Safety Property Tag - ${item.id}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              padding: 24px;
              color: #0f172a;
              text-align: center;
            }
            .tag-box {
              border: 2px dashed #0891b2;
              border-radius: 16px;
              padding: 20px;
              max-width: 320px;
              margin: 0 auto;
            }
            .badge {
              display: inline-block;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              background: #ecfeff;
              color: #0e7490;
              padding: 4px 10px;
              border-radius: 999px;
              margin-bottom: 8px;
            }
            h2 {
              font-size: 16px;
              margin: 4px 0 12px 0;
              line-height: 1.2;
            }
            .qr-img {
              width: 180px;
              height: 180px;
              margin: 8px auto;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .ref {
              font-family: monospace;
              font-size: 13px;
              font-weight: bold;
              color: #0891b2;
              margin-top: 8px;
            }
            .meta {
              font-size: 11px;
              color: #64748b;
              margin-top: 4px;
            }
            .notice {
              margin-top: 12px;
              font-size: 9px;
              color: #94a3b8;
              border-top: 1px solid #f1f5f9;
              padding-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="tag-box">
            <div class="badge">Campus Safety Property Custody</div>
            <h2>${item.title}</h2>
            <img class="qr-img" src="${qrDataUrl}" alt="QR Code" />
            <div class="ref">REF #${item.id}</div>
            <div class="meta">${item.campusZone}</div>
            <div class="notice">Scan with any mobile device to view official verified incident report.</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0b132b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Official QR Quick-Scan</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                  REF-{item.id}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Encodes unique item URL for campus official &amp; custody scanning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close QR Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex flex-col items-center text-center">
          {/* Item Quick Context */}
          <div className="w-full text-left bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400 shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <div className="font-bold text-white truncate">{item.title}</div>
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5 truncate">
                <Building className="w-3 h-3 text-cyan-500 shrink-0" />
                <span className="truncate">{item.campusZone}</span>
                <span className="text-slate-600">·</span>
                <span className="capitalize text-slate-300">{item.type} Item</span>
              </div>
            </div>
          </div>

          {/* QR Code Graphic Frame */}
          <div className="relative group">
            <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-cyan-500/20 flex flex-col items-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${item.title}`}
                  className="w-52 h-52 object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR Code...
                </div>
              )}

              {/* Scannable Footer Text */}
              <div className="mt-2 text-center">
                <div className="text-[10px] font-mono font-bold text-slate-800 tracking-wider">
                  SCAN FOR VERIFIED DETAILS
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  ID: #{item.id}
                </div>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="absolute -top-2.5 -right-2.5 px-2.5 py-1 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg shadow-cyan-900/50">
              <ShieldCheck className="w-3 h-3" />
              <span>Campus Verified</span>
            </div>
          </div>

          {/* Color Theme Selector for QR */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">QR Style:</span>
            <button
              onClick={() => setQrColorTheme('standard')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                qrColorTheme === 'standard'
                  ? 'bg-slate-800 text-white border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Classic Slate
            </button>
            <button
              onClick={() => setQrColorTheme('brand')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                qrColorTheme === 'brand'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Cyan Brand
            </button>
          </div>

          {/* Encoded URL box */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-cyan-400" />
                <span>Encoded Direct URL</span>
              </span>
              <span className="text-[10px] text-slate-500">Universal Web Link</span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
              <input
                type="text"
                readOnly
                value={itemUrl}
                className="bg-transparent text-xs font-mono text-cyan-300 w-full focus:outline-hidden truncate select-all px-1"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0b132b] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Download QR code image as PNG"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handlePrintTag}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Print physical locker / custody label tag"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print Custody Tag</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
