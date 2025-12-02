'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import ContentDetailSkeleton from './ContentDetailSkeleton';
import ContentDisplay from './ContentDisplay';
import Skeleton from '../../components/ui/Skeleton';
import { useContent } from '../../hooks/useContent';
import { useJobWebSocket } from '../../hooks/useJobWebSocket';
import type { JobStatus } from '../../store/contentSlice';

export default function ContentDetailPage() {
  const params = useParams();
  const contentId = params.id as string;
  const { currentContent, isLoading, fetchById, update, rollback } = useContent();
  const [isSaving, setIsSaving] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);

  useEffect(() => {
    if (contentId) {
      fetchById(contentId);
    }
  }, [contentId, fetchById]);

  // Subscribe to job status updates via WebSocket if content is being generated
  useJobWebSocket({
    jobId: currentContent?.jobId || null,
    jobStatus: currentContent?.jobStatus as JobStatus | undefined,
    enabled: !!(
      currentContent?.jobId &&
      currentContent.jobStatus !== 'completed' &&
      currentContent.jobStatus !== 'failed'
    ),
  });

  const handleUpdate = async (content: string) => {
    if (!currentContent) return;
    setIsSaving(true);
    try {
      await update(currentContent.id, { content });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRollback = async () => {
    if (!currentContent) return;
    setIsRollingBack(true);
    try {
      await rollback(currentContent.id);
    } finally {
      setIsRollingBack(false);
    }
  };

  if (isLoading && !currentContent) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Skeleton variant="text" width="150px" height="20px" />
            </div>
            <ContentDetailSkeleton />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!currentContent) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="text-lg text-gray-600 mb-4">Content not found</div>
              <Link
                href="/dashboard"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <ContentDisplay
            content={currentContent}
            onUpdate={handleUpdate}
            onRollback={handleRollback}
            isUpdating={isSaving}
            isRollingBack={isRollingBack}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}


