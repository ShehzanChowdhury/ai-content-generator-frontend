'use client';

import { ReactNode, useEffect } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  children: ReactNode;
  showCloseButton?: boolean;
  // Confirmation dialog props
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  variant = 'error',
  children,
  showCloseButton = true,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false,
}: ModalProps) {
  const variantStyles = {
    error: {
      border: 'border-red-200',
      title: 'text-red-800',
      icon: 'text-red-600',
    },
    warning: {
      border: 'border-yellow-200',
      title: 'text-yellow-800',
      icon: 'text-yellow-600',
    },
    info: {
      border: 'border-blue-200',
      title: 'text-blue-800',
      icon: 'text-blue-600',
    },
    success: {
      border: 'border-green-200',
      title: 'text-green-800',
      icon: 'text-green-600',
    },
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-lg shadow-xl max-w-md w-full border-2 ${variantStyles[variant].border} transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {title && (
                <h3 className={`text-lg font-semibold ${variantStyles[variant].title}`}>
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            <div className={`text-sm ${variantStyles[variant].title}`}>{children}</div>
          </div>

          {/* Action Buttons (for confirmation dialogs) */}
          {onConfirm && (
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                variant={confirmVariant === 'danger' ? 'danger' : 'primary'}
                onClick={() => {
                  onConfirm();
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : confirmText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

