import styled from '@emotion/styled';
import type { InputHTMLAttributes } from 'react';
import { useState } from 'react';
import { borderRadius, colors, spacing, typography } from '../tokens';
import { Icon } from './Icon';
import { Text } from './Text';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  icon?: string;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
};

const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const InputContainer = styled.div<{ $error: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[3]} ${spacing[4]};
  background-color: ${colors.white};
  border: 1px solid ${({ $error }) => ($error ? colors.error.main : colors.gray[300])};
  border-radius: ${borderRadius.lg};
  transition: all 0.2s ease-in-out;

  &:hover:not(:focus-within) {
    border-color: ${({ $error, $disabled }) =>
      $disabled ? colors.gray[300] : $error ? colors.error.dark : colors.gray[400]};
  }

  &:focus-within {
    border-color: ${({ $error }) => ($error ? colors.error.main : colors.primary[500])};
    box-shadow: 0 0 0 3px ${({ $error }) =>
      $error ? `${colors.error.main}20` : `${colors.primary[500]}20`};
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    background-color: ${colors.gray[100]};
    cursor: not-allowed;
  `}
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${typography.fontFamily.suit.join(', ')};
  font-size: ${typography.textStyles.body.b1.fontSize};
  font-weight: ${typography.textStyles.body.b1.fontWeight};
  line-height: ${typography.textStyles.body.b1.lineHeight};
  color: ${colors.text.primary};

  &::placeholder {
    color: ${colors.text.disabled};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${colors.gray[600]};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${colors.gray[800]};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${colors.gray[400]};
  }
`;

export const Input = ({
  label,
  helperText,
  error = false,
  errorMessage,
  icon,
  fullWidth = true,
  showPasswordToggle = false,
  disabled = false,
  type = 'text',
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const displayError = error && errorMessage;

  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && (
        <Text variant="C_M_12" color={colors.text.secondary}>
          {label}
        </Text>
      )}

      <InputContainer $error={error} $disabled={!!disabled}>
        {icon && <Icon name={icon} variant="ICON_STROKE_SM" color={colors.gray[600]} />}

        <StyledInput type={inputType} disabled={disabled} {...props} />

        {isPassword && showPasswordToggle && (
          <IconButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} variant="ICON_STROKE_SM" />
          </IconButton>
        )}
      </InputContainer>

      {(helperText || displayError) && (
        <Text variant="C_M_12" color={displayError ? colors.error.main : colors.text.secondary}>
          {displayError ? errorMessage : helperText}
        </Text>
      )}
    </InputWrapper>
  );
};
