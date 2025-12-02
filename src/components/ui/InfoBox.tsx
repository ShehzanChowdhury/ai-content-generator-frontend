import { ReactNode } from 'react';

interface InfoBoxProps {
  variant?: 'info' | 'warning' | 'success';
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function InfoBox({
  variant = 'info',
  title,
  children,
  className = '',
}: InfoBoxProps) {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  const iconColors = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    success: 'text-green-400',
  };

  return (
    <div className={`border rounded-lg p-4 ${variantStyles[variant]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className={`h-5 w-5 ${iconColors[variant]}`} viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={`text-sm ${title ? 'mt-2' : ''}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}


