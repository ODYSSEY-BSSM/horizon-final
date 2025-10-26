import styled from '@emotion/styled';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { tokens } from '@/core/tokens';

const OTP_LENGTH = 6;

// Utils: normalize and distribute incoming digits into fixed slots
const toDigits = (s: string) => s.replace(/\D/g, '');
const distributeDigits = (current: string, start: number, incoming: string) => {
  const slots = Array.from({ length: OTP_LENGTH }, (_, i) => current[i] ?? '');
  // Deletion path
  if (incoming === '') {
    slots[start] = '';
    return slots.join('');
  }
  const digits = toDigits(incoming);
  for (let i = 0; i < digits.length && start + i < OTP_LENGTH; i += 1) {
    const digit = digits[i];
    if (digit !== undefined) {
      slots[start + i] = digit;
    }
  }
  return slots.join('');
};

interface VerificationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const VerificationInput = ({ value, onChange, error }: VerificationInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const raw = e.target.value;
    // Multi-char path (paste/auto-fill into a single cell)
    if (raw.length > 1) {
      const next = distributeDigits(value, index, raw);
      onChange(next);
      const nextIndex = Math.min(index + toDigits(raw).length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    // Single-char: allow only digits or empty (deletion)
    if (raw !== '' && !/^[0-9]$/.test(raw)) {
      return;
    }
    const next = distributeDigits(value, index, raw);
    onChange(next);
    if (raw !== '' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && value[index] === undefined && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
    if (/^[0-9]+$/.test(pastedData)) {
      onChange(pastedData);
      const lastFilledIndex = Math.max(0, pastedData.length - 1);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <StyledContainer>
      <StyledOtpWrapper>
        {[...Array(OTP_LENGTH)].map((_, index) => {
          const isFocused = focusedIndex === index;
          return (
            <StyledInput
              key={`otp-${index}`}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="tel"
              maxLength={1}
              value={value[index] ?? ''}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              isError={!!error}
              isFocused={isFocused}
            />
          );
        })}
      </StyledOtpWrapper>

      {error && <StyledErrorText>{error}</StyledErrorText>}
    </StyledContainer>
  );
};

export default VerificationInput;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const StyledOtpWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 400px;
`;

interface StyledInputProps {
  isError: boolean;
  isFocused: boolean;
}

const getBorderStyle = (isError: boolean, isFocused: boolean) => {
  if (isError) {
    return `box-shadow: inset 0 0 0 1px ${tokens.colors.error[200]};`;
  }
  if (isFocused) {
    return `box-shadow: inset 0 0 0 2px ${tokens.colors.primary[500]};`;
  }
  return `box-shadow: inset 0 0 0 1px ${tokens.colors.neutral[400]};`;
};

const StyledInput = styled.input<StyledInputProps>`
  display: flex;
  width: 56px;
  height: 80px;
  padding: 18px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: 700;
  line-height: 44px;
  letter-spacing: -0.8px;
  border: none;
  border-radius: 8px;
  text-align: center;
  background-color: ${tokens.colors.white};
  color: ${tokens.colors.black};
  outline: none;
  transition: all 0.15s ease;
  font-family: SUIT Variable, system-ui, -apple-system, sans-serif;
  text-decoration: ${({ isFocused }) => (isFocused ? 'underline' : 'none')};
  text-decoration-style: solid;
  text-underline-position: from-font;
  ${({ isError, isFocused }) => getBorderStyle(isError, isFocused)}

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const StyledErrorText = styled.div`
  font-family: SUIT Variable, system-ui, -apple-system, sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 22px;
  height: 20px;
  color: ${tokens.colors.error[200]};
  text-align: center;
  width: 100%;
`;
