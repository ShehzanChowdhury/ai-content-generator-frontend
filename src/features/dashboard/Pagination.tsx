'use client';

import Button from '../../components/ui/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  onPrevious,
  onNext,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Showing page {page} of {totalPages} ({total} total)
      </div>
      <div className="flex space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrevious}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}


