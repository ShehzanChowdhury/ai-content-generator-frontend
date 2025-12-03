'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusBadge from '../../components/ui/StatusBadge';
import ContentEditor from './ContentEditor';
import { formatContentType, formatDate } from '../../utils/formatters';
import type { Content } from '../../store/contentSlice';

interface ContentDisplayProps {
  content: Content;
  onUpdate: (content: string) => Promise<void>;
  onRollback: () => Promise<void>;
  isUpdating?: boolean;
  isRollingBack?: boolean;
}

export default function ContentDisplay({
  content,
  onUpdate,
  onRollback,
  isUpdating = false,
  isRollingBack = false,
}: ContentDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [showRollbackConfirm, setShowRollbackConfirm] = useState(false);

  // Derive the current content value - use editedContent when editing, otherwise use content prop
  const currentContent = useMemo(() => {
    if (isEditing && editedContent) {
      return editedContent;
    }
    return content.content || content.generatedContent || '';
  }, [isEditing, editedContent, content.content, content.generatedContent]);

  // Initialize editedContent when entering edit mode
  const handleEdit = () => {
    setEditedContent(content.content || content.generatedContent || '');
    setIsEditing(true);
  };

  const handleSave = async (newContent: string) => {
    await onUpdate(newContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent('');
  };

  const handleRollbackClick = () => {
    setShowRollbackConfirm(true);
  };

  const handleRollbackConfirm = async () => {
    await onRollback();
    setIsEditing(false);
    setShowRollbackConfirm(false);
  };

  const handleRollbackCancel = () => {
    setShowRollbackConfirm(false);
  };

  const isProcessing =
    content.jobStatus === 'queued' ||
    content.jobStatus === 'pending' ||
    content.jobStatus === 'processing';

  if (isProcessing) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Generating content... This may take a minute.</p>
        <p className="text-sm text-gray-500 mt-2">Status: {content.jobStatus}</p>
      </div>
    );
  }

  if (content.jobStatus === 'failed') {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          Content generation failed. Please try creating a new content.
        </div>
        <Link href="/create">
          <Button>Create New Content</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.topic}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Type: {formatContentType(content.contentType)}</span>
              <span>•</span>
              <span>Created: {formatDate(content.createdAt)}</span>
            </div>
          </div>
          <StatusBadge status={content.jobStatus} />
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Content</h2>
          {!isEditing && (
            <Button variant="secondary" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <ContentEditor
            content={editedContent}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isUpdating}
            onRollback={handleRollbackClick}
            isRollingBack={isRollingBack}
            showRollback={!!content.generatedContent}
          />
        ) : (
          <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md border border-gray-200">
            {currentContent ? (
              <ReactMarkdown>{currentContent}</ReactMarkdown>
            ) : (
              <p className="text-gray-500">No content available</p>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showRollbackConfirm}
        onClose={handleRollbackCancel}
        title="Revert to Generated Content"
        variant="warning"
        onConfirm={handleRollbackConfirm}
        confirmText="Revert"
        cancelText="Cancel"
        confirmVariant="primary"
        isLoading={isRollingBack}
        showCloseButton={false}
      >
        Are you sure you want to revert to the AI-generated content? This will overwrite your current edits.
      </Modal>
    </div>
  );
}

