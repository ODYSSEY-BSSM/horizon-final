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
    <Container>
      <Label>{label}</Label>
      <Textarea
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 240px;
`;

const Label = styled.p`
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 64px;
  padding: 5px 8px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.xs};
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 300;
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
    background-color: ${tokens.colors.neutral[50]};
    cursor: not-allowed;
    resize: none;
  }
`;
