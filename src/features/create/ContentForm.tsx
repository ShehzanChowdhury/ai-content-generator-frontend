'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import RadioCard from '../../components/ui/RadioCard';
import InfoBox from '../../components/ui/InfoBox';
import { useContent } from '../../hooks/useContent';
import { CONTENT_TYPES } from '../../utils/constants';
import type { ContentType } from '../../store/contentSlice';

export default function ContentForm() {
  const router = useRouter();
  const { create, isCreating, error, clearContentError } = useContent();

  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('blog_post_outline');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearContentError();

    if (!topic.trim()) {
      setValidationError('Topic is required');
      return;
    }

    if (topic.length > 500) {
      setValidationError('Topic cannot exceed 500 characters');
      return;
    }

    try {
      const result = await create(topic.trim(), contentType);
      router.push(`/content/${result.id}`);
    } catch {
      // Error is handled by Redux
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create AI Content</h1>
        <p className="mt-2 text-gray-600">
          Generate AI-powered content by providing a topic and selecting a content type
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea
            id="topic"
            name="topic"
            label="Topic"
            rows={4}
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setValidationError('');
              clearContentError();
            }}
            placeholder="Enter the topic for your content (e.g., 'The benefits of remote work', 'New product launch announcement', etc.)"
            maxLength={500}
            showCharCount
            currentLength={topic.length}
            helperText="Describe what you want the AI to generate"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CONTENT_TYPES.map((type) => (
                <RadioCard
                  key={type.value}
                  value={type.value}
                  checked={contentType === type.value}
                  onChange={(value) => {
                    setContentType(value as ContentType);
                    setValidationError('');
                    clearContentError();
                  }}
                  label={type.label}
                  description={type.description}
                />
              ))}
            </div>
          </div>

          <Modal
            isOpen={!!(error || validationError)}
            onClose={() => {
              setValidationError('');
              clearContentError();
            }}
            variant="error"
            title="Error"
          >
            {error || validationError}
          </Modal>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !topic.trim()}>
              {isCreating ? 'Creating...' : 'Generate Content'}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-6">
        <InfoBox variant="info" title="Note">
          Your content will be queued for generation. It typically takes about 1 minute to process.
          You can track the status on your dashboard.
        </InfoBox>
      </div>
    </div>
  );
}


