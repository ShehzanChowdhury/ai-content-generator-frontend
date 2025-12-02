'use client';

import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';

interface ContentEditorProps {
  content: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
  onRollback?: () => void;
  isRollingBack?: boolean;
  showRollback?: boolean;
}

export default function ContentEditor({
  content,
  onSave,
  onCancel,
  isSaving = false,
  onRollback,
  isRollingBack = false,
  showRollback = false,
}: ContentEditorProps) {
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = async () => {
    await onSave(editedContent);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        rows={20}
        className="font-mono"
      />
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        {showRollback && onRollback && (
          <Button
            variant="secondary"
            onClick={onRollback}
            disabled={isRollingBack}
          >
            {isRollingBack ? 'Reverting...' : 'Revert to Generated'}
          </Button>
        )}
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

