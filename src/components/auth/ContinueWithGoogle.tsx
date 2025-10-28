'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

interface ContinueWithGoogleProps {
  onClick?: () => void;
  className?: string;
}

const ContinueWithGoogle = ({ onClick, className }: ContinueWithGoogleProps) => {
  return (
    <StyledButton onClick={onClick} className={className} aria-label="구글 계정으로 계속하기">
      <GoogleIcon />
      <Text variant="B2" color={tokens.colors.black}>
        구글로 계속하기
      </Text>
    </StyledButton>
  );
};

export default ContinueWithGoogle;

const StyledButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.black};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.5 8.18187C16.5 7.6146 16.4481 7.06914 16.3516 6.5455H8.66326V9.64005H13.0566C12.8673 10.6401 12.2922 11.4873 11.4276 12.0546V14.0619H14.0659C15.6095 12.6691 16.5 10.6182 16.5 8.18187Z"
      fill="#4285F4"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.66327 16C10.8674 16 12.7152 15.2837 14.0659 14.0619L11.4276 12.0546C10.6967 12.5346 9.76161 12.8182 8.66327 12.8182C6.53711 12.8182 4.73748 11.4109 4.09555 9.52H1.36828V11.5927C2.71151 14.2073 5.47218 16 8.66327 16Z"
      fill="#34A853"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.09555 9.52C3.93229 9.04 3.83952 8.52732 3.83952 8.00005C3.83952 7.47277 3.93228 6.96005 4.09555 6.48004V4.40732H1.36828C0.815399 5.48732 0.5 6.70914 0.5 8.00005C0.5 9.29096 0.815403 10.5127 1.36828 11.5927L4.09555 9.52Z"
      fill="#FBBC05"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.66327 3.18182C9.86179 3.18182 10.9379 3.58546 11.7839 4.37818L14.1252 2.08364C12.7115 0.792728 10.8636 0 8.66327 0C5.47218 0 2.7115 1.79277 1.36828 4.40732L4.09555 6.48004C4.73748 4.58913 6.53711 3.18182 8.66327 3.18182Z"
      fill="#EA4335"
    />
  </svg>
);
