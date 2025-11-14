import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showFirstLast?: boolean;
  showInfo?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showFirstLast = true,
  showInfo = true,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      {/* Info */}
      {showInfo && totalItems && itemsPerPage && (
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        {/* First page */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={clsx(
              'p-2 rounded-lg border transition-colors',
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50 border-gray-300'
            )}
            title="First page"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
        )}

        {/* Previous page */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            'p-2 rounded-lg border transition-colors',
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50 border-gray-300'
          )}
          title="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page numbers */}
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-700"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                className={clsx(
                  'px-3 py-2 rounded-lg border transition-colors min-w-[40px]',
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 border-gray-300'
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next page */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            'p-2 rounded-lg border transition-colors',
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50 border-gray-300'
          )}
          title="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Last page */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={clsx(
              'p-2 rounded-lg border transition-colors',
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50 border-gray-300'
            )}
            title="Last page"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
