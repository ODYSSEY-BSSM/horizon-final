import styled from '@emotion/styled';
import * as SelectPrimitive from '@radix-ui/react-select';
import { borderRadius, colors, shadows, spacing, typography } from '../tokens';
import { Icon } from './Icon';
import { Text } from './Text';

export type SelectOption = {
  value: string;
  label: string;
  isNew?: boolean;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

const SelectWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const StyledTrigger = styled(SelectPrimitive.Trigger)<{ $error: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing[2]};
  padding: ${spacing[3]} ${spacing[4]};
  background-color: ${colors.white};
  border: 1px solid ${({ $error }) => ($error ? colors.error.main : colors.gray[300])};
  border-radius: ${borderRadius.lg};
  font-family: ${typography.fontFamily.suit.join(', ')};
  font-size: ${typography.textStyles.body.b1.fontSize};
  font-weight: ${typography.textStyles.body.b1.fontWeight};
  line-height: ${typography.textStyles.body.b1.lineHeight};
  color: ${colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    border-color: ${({ $error }) => ($error ? colors.error.dark : colors.gray[400])};
  }

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? colors.error.main : colors.primary[500])};
    box-shadow: 0 0 0 3px ${({ $error }) =>
      $error ? `${colors.error.main}20` : `${colors.primary[500]}20`};
  }

  &:disabled {
    background-color: ${colors.gray[100]};
    cursor: not-allowed;
    color: ${colors.text.disabled};
  }

  &[data-placeholder] {
    color: ${colors.text.disabled};
  }
`;

const StyledContent = styled(SelectPrimitive.Content)`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  overflow: hidden;
  z-index: 1000;
  min-width: 200px;
`;

const StyledViewport = styled(SelectPrimitive.Viewport)`
  padding: ${spacing[2]};
`;

const StyledItem = styled(SelectPrimitive.Item)<{ $isNew?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing[2]};
  padding: ${spacing[3]} ${spacing[4]};
  border-radius: ${borderRadius.md};
  font-family: ${typography.fontFamily.suit.join(', ')};
  font-size: ${typography.textStyles.body.b1.fontSize};
  font-weight: ${typography.textStyles.body.b1.fontWeight};
  line-height: ${typography.textStyles.body.b1.lineHeight};
  color: ${colors.text.primary};
  cursor: pointer;
  outline: none;
  user-select: none;
  transition: all 0.2s ease-in-out;

  &[data-highlighted] {
    background-color: ${colors.primary[50]};
    color: ${colors.primary[600]};
  }

  &[data-disabled] {
    color: ${colors.text.disabled};
    cursor: not-allowed;
  }

  ${({ $isNew }) =>
    $isNew &&
    `
    color: ${colors.primary[500]};
    font-weight: ${typography.textStyles.body.b1.fontWeight + 100};
  `}
`;

const NewBadge = styled.span`
  padding: 2px 8px;
  background-color: ${colors.primary[100]};
  color: ${colors.primary[700]};
  border-radius: ${borderRadius.full};
  font-size: ${typography.textStyles.caption.c.fontSize};
  font-weight: ${typography.textStyles.caption.c.fontWeight};
`;

export const Select = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  label,
  helperText,
  error = false,
  errorMessage,
  disabled = false,
  fullWidth = true,
}: SelectProps) => {
  const displayError = error && errorMessage;

  return (
    <SelectWrapper $fullWidth={fullWidth}>
      {label && (
        <Text variant="caption" color={colors.text.secondary}>
          {label}
        </Text>
      )}

      <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
        <StyledTrigger $error={error}>
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <Icon name="expand_more" size="sm" />
          </SelectPrimitive.Icon>
        </StyledTrigger>

        <SelectPrimitive.Portal>
          <StyledContent position="popper" sideOffset={4}>
            <StyledViewport>
              {options.map((option) => (
                <StyledItem key={option.value} value={option.value} $isNew={option.isNew}>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  {option.isNew && <NewBadge>NEW</NewBadge>}
                  <SelectPrimitive.ItemIndicator>
                    <Icon name="check" size="xs" />
                  </SelectPrimitive.ItemIndicator>
                </StyledItem>
              ))}
            </StyledViewport>
          </StyledContent>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {(helperText || displayError) && (
        <Text variant="caption" color={displayError ? colors.error.main : colors.text.secondary}>
          {displayError ? errorMessage : helperText}
        </Text>
      )}
    </SelectWrapper>
  );
};
