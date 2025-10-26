import styled from '@emotion/styled';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { useRef } from 'react';
import { tokens } from '@/core/tokens';

const OTP_LENGTH = 6;

interface VerificationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const VerificationInput = ({ value, onChange, error }: VerificationInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value: inputValue } = e.target;
    if (!/^[0-9]$/.test(inputValue) && inputValue !== '') {
      return;
    }

    const newOtp = value.split('');
    newOtp[index] = inputValue;
    const newOtpString = newOtp.join('').slice(0, OTP_LENGTH);
    onChange(newOtpString);

    if (inputValue !== '' && index < OTP_LENGTH - 1) {
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

  return (
    <StyledContainer>
      <StyledOtpWrapper>
        {[...Array(OTP_LENGTH)].map((_, index) => {
          const isFilled = !!value[index];
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
              isError={!!error}
              isFilled={isFilled}
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
  isFilled: boolean;
}

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
  border: 1px solid
    ${({ isError, isFilled }) => {
      if (isError) {
        return tokens.colors.error[200];
      }
      if (isFilled) {
        return tokens.colors.primary[500];
      }
      return tokens.colors.neutral[400];
    }};
  border-radius: 8px;
  text-align: center;
  background-color: ${tokens.colors.white};
  color: ${tokens.colors.black};
  outline: none;
  transition: all 0.15s ease;
  font-family: SUIT Variable, system-ui, -apple-system, sans-serif;

  &:focus {
    border: 2px solid ${tokens.colors.primary[500]};
    text-decoration: underline;
    text-decoration-style: solid;
    text-underline-position: from-font;
  }

  &:hover:not(:focus) {
    border-color: ${({ isError, isFilled }) => {
      if (isError) {
        return tokens.colors.error[200];
      }
      if (isFilled) {
        return tokens.colors.primary[500];
      }
      return tokens.colors.neutral[500];
    }};
  }

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
  color: ${tokens.colors.error[200]};
  text-align: center;
  width: 100%;
`;
