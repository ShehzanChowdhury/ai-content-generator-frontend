'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ContentTable from './ContentTable';
import Pagination from './Pagination';
import DashboardSkeleton from './DashboardSkeleton';
import { useContent } from '../../hooks/useContent';
import { useMultipleJobWebSocket } from '../../hooks/useMultipleJobWebSocket';

export default function DashboardContent() {
  const { contents, isLoading, pagination, fetchAll, remove } = useContent();
  const hasFetched = useRef(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Only fetch once on mount
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAll(1, 10);
    }
  }, [fetchAll]);

  // Memoize active jobs to prevent unnecessary re-renders
  const activeJobIds = useMemo(() => {
    return contents
      .filter((c) => c.jobId && c.jobStatus !== 'completed' && c.jobStatus !== 'failed')
      .map((c) => c.jobId!);
  }, [contents]);

  // Subscribe to job status updates via WebSocket
  useMultipleJobWebSocket({
    jobIds: activeJobIds,
    enabled: activeJobIds.length > 0,
  });

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    
    setIsDeleting(true);
    try {
      await remove(deleteConfirmId);
      await fetchAll(pagination.page, pagination.limit);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  if (isLoading && contents.length === 0) {
    return <DashboardSkeleton />;
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600 mb-4">No content yet. Create your first piece of content!</p>
        <Link href="/create">
          <Button>Create Content</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <ContentTable contents={contents} onDelete={handleDeleteClick} />
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPrevious={() => fetchAll(pagination.page - 1, pagination.limit)}
        onNext={() => fetchAll(pagination.page + 1, pagination.limit)}
      />
      
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={handleDeleteCancel}
        title="Delete Content"
        variant="warning"
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        showCloseButton={false}
      >
        Are you sure you want to delete this content? This action cannot be undone.
      </Modal>
    </>
  );
}

