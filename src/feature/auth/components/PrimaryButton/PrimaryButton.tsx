import styled from '@emotion/styled';
import type React from 'react';
import { tokens } from '@/shared/tokens';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const PrimaryButton = ({
  width = '100%',
  disabled = false,
  children,
  ...props
}: PrimaryButtonProps) => {
  return (
    <StyledButton width={width} disabled={disabled} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{ width: string; disabled: boolean }>`
  width: ${({ width }) => width};
  height: 48px;
  background-color: ${({ disabled }) => (disabled ? tokens.colors.neutral[300] : tokens.colors.primary[500])};
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? tokens.colors.neutral[300] : tokens.colors.primary[600])};
  }

  &:disabled {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ disabled }) => (disabled ? tokens.colors.neutral[400] : tokens.colors.primary[600])};
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;
