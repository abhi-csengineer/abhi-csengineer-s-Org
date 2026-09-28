import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 9, 12, 18],
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-800/80">
      {/* Items Range Info */}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <div>
          Showing{' '}
          <span className="font-semibold text-white font-mono">{startItem}</span> to{' '}
          <span className="font-semibold text-white font-mono">{endItem}</span> of{' '}
          <span className="font-semibold text-white font-mono">{totalItems}</span> items
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-800">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-hidden focus:border-cyan-400 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Controls: Previous / Page Numbers / Next */}
      <div className="flex items-center gap-1.5">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 transition-colors cursor-pointer"
          title="Go to first page"
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Back / Previous Page Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          title="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4 text-cyan-400" />
          <span>Previous</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((page, idx) => {
            if (typeof page === 'string') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-500 text-xs">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          title="Go to next page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 transition-colors cursor-pointer"
          title="Go to last page"
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
