'use client';

import styled from '@emotion/styled';
import type React from 'react';
import { useToastStore } from '../../hooks/useToast';
import { Toast } from './Toast';

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const topToasts = toasts.filter((toast) => toast.position === 'top');
  const bottomToasts = toasts.filter((toast) => toast.position !== 'top');

  return (
    <>
      {topToasts.length > 0 && (
        <StyledToasterContainer $position="top">
          {topToasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </StyledToasterContainer>
      )}
      {bottomToasts.length > 0 && (
        <StyledToasterContainer $position="bottom">
          {bottomToasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </StyledToasterContainer>
      )}
    </>
  );
};

const StyledToasterContainer = styled.div<{ $position: 'top' | 'bottom' }>`
  position: fixed;
  ${({ $position }) => ($position === 'top' ? 'top: 0;' : 'bottom: 0;')}
  right: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  pointer-events: none;
`;
