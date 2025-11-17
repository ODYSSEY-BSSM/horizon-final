'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export interface EditorTextfieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const EditorTextfield = ({
  label = 'Label',
  value = '',
  placeholder = 'Text',
  onChange,
  onFocus,
  onBlur,
}: EditorTextfieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <StyledContainer>
      <StyledLabel>{label}</StyledLabel>
      <StyledTextarea
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 240px;
`;

const StyledLabel = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.light};
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 64px;
  padding: 5px 8px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.extraSmall};
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.light};
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  resize: vertical;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${tokens.colors.neutral[500]};
  }

  &:hover {
    border-color: ${tokens.colors.neutral[400]};
  }

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
  }

  &:disabled {
    background-color: ${tokens.colors.neutral[100]};
    cursor: not-allowed;
    resize: none;
  }
`;
