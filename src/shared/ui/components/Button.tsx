import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import { borderRadius, colors, shadows, typography } from '../tokens';
import { Icon } from './Icon';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'contained' | 'outlined' | 'text';
type ButtonIconPosition = 'left' | 'right' | 'only';

type ButtonProps = {
  children?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  rounded?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: ButtonIconPosition;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

const getButtonHeight = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return '32px';
    case 'medium':
      return '40px';
    case 'large':
      return '48px';
  }
};

const getButtonPadding = (size: ButtonSize, iconPosition?: ButtonIconPosition) => {
  if (iconPosition === 'only') {
    switch (size) {
      case 'small':
        return '8px';
      case 'medium':
        return '10px';
      case 'large':
        return '12px';
    }
  }

  switch (size) {
    case 'small':
      return '0 16px';
    case 'medium':
      return '0 20px';
    case 'large':
      return '0 24px';
  }
};

const getButtonTextStyle = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return typography.textStyles.button.sml;
    case 'medium':
      return typography.textStyles.button.med;
    case 'large':
      return typography.textStyles.button.lrg;
  }
};

const getIconSize = (size: ButtonSize): 'xs' | 'sm' | 'md' | 'lg' | 'xl' => {
  switch (size) {
    case 'small':
      return 'xs';
    case 'medium':
      return 'sm';
    case 'large':
      return 'md';
  }
};

const StyledButton = styled.button<{
  $size: ButtonSize;
  $variant: ButtonVariant;
  $rounded: boolean;
  $fullWidth: boolean;
  $iconPosition?: ButtonIconPosition;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $size }) => ($size === 'small' ? '4px' : '8px')};
  height: ${({ $size }) => getButtonHeight($size)};
  padding: ${({ $size, $iconPosition }) => getButtonPadding($size, $iconPosition)};
  border: none;
  border-radius: ${({ $rounded, $size }) =>
    $rounded ? borderRadius.full : $size === 'small' ? borderRadius.md : borderRadius.lg};
  font-family: ${typography.fontFamily.suit.join(', ')};
  font-size: ${({ $size }) => getButtonTextStyle($size).fontSize};
  font-weight: ${({ $size }) => getButtonTextStyle($size).fontWeight};
  line-height: ${({ $size }) => getButtonTextStyle($size).lineHeight};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
  white-space: nowrap;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant }) => {
    switch ($variant) {
      case 'contained':
        return `
          background-color: ${colors.primary[500]};
          color: ${colors.white};
          box-shadow: ${shadows.sm};

          &:hover:not(:disabled) {
            background-color: ${colors.primary[600]};
            box-shadow: ${shadows.md};
          }

          &:active:not(:disabled) {
            background-color: ${colors.primary[700]};
            box-shadow: ${shadows.sm};
          }

          &:disabled {
            background-color: ${colors.gray[300]};
            color: ${colors.gray[500]};
            cursor: not-allowed;
            box-shadow: none;
          }
        `;
      case 'outlined':
        return `
          background-color: transparent;
          color: ${colors.primary[500]};
          border: 1px solid ${colors.primary[500]};

          &:hover:not(:disabled) {
            background-color: ${colors.primary[50]};
            border-color: ${colors.primary[600]};
            color: ${colors.primary[600]};
          }

          &:active:not(:disabled) {
            background-color: ${colors.primary[100]};
            border-color: ${colors.primary[700]};
            color: ${colors.primary[700]};
          }

          &:disabled {
            border-color: ${colors.gray[300]};
            color: ${colors.gray[400]};
            cursor: not-allowed;
          }
        `;
      case 'text':
        return `
          background-color: transparent;
          color: ${colors.primary[500]};

          &:hover:not(:disabled) {
            background-color: ${colors.primary[50]};
            color: ${colors.primary[600]};
          }

          &:active:not(:disabled) {
            background-color: ${colors.primary[100]};
            color: ${colors.primary[700]};
          }

          &:disabled {
            color: ${colors.gray[400]};
            cursor: not-allowed;
          }
        `;
    }
  }}
`;

export const Button = ({
  children,
  size = 'medium',
  variant = 'contained',
  rounded = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  className,
  type = 'button',
}: ButtonProps) => {
  const iconSize = getIconSize(size);

  const renderContent = () => {
    if (!icon) {
      return children;
    }

    if (iconPosition === 'only') {
      return <Icon name={icon} size={iconSize} />;
    }

    if (iconPosition === 'left') {
      return (
        <>
          <Icon name={icon} size={iconSize} />
          {children}
        </>
      );
    }

    return (
      <>
        {children}
        <Icon name={icon} size={iconSize} />
      </>
    );
  };

  return (
    <StyledButton
      $size={size}
      $variant={variant}
      $rounded={rounded}
      $fullWidth={fullWidth}
      $iconPosition={icon ? iconPosition : undefined}
      disabled={disabled}
      onClick={onClick}
      className={className}
      type={type}
    >
      {renderContent()}
    </StyledButton>
  );
};
