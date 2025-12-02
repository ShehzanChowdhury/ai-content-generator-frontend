import { ReactNode } from 'react';

interface AlertProps {
  variant?: 'error' | 'warning' | 'info' | 'success';
  children: ReactNode;
  className?: string;
}

export default function Alert({ variant = 'error', children, className = '' }: AlertProps) {
  const variantStyles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
  };

  return (
    <div className={`rounded-md border p-4 ${variantStyles[variant]} ${className}`}>
      <div className="text-sm">{children}</div>
    </div>
  );
}


