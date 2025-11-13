'use client';

import type React from 'react';
import { useEffect } from 'react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const variantStyles = {
    default: 'bg-white border-gray-200',
    destructive: 'bg-red-50 border-red-200',
  };

  const textStyles = {
    default: 'text-gray-900',
    destructive: 'text-red-900',
  };

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg ${variantStyles[variant]} p-4`}
      role="alert"
    >
      {title && <div className={`text-sm font-semibold ${textStyles[variant]}`}>{title}</div>}
      {description && (
        <div className={`mt-1 text-sm ${variant === 'default' ? 'text-gray-500' : 'text-red-700'}`}>
          {description}
        </div>
      )}
      <button
        type="button"
        onClick={() => onClose(id)}
        className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-gray-500"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};
