'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

interface UnderlineButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * UnderlineButton - 텍스트 언더라인 스타일 버튼
 * 주로 링크처럼 보이는 액션에 사용
 * 예: "새 로드맵 만들기", "계속하기" 등
 */
const UnderlineButton = ({
  children,
  onClick,
  className,
  disabled = false,
}: UnderlineButtonProps) => {
  return (
    <StyledButton onClick={onClick} className={className} disabled={disabled} type="button">
      {children}
    </StyledButton>
  );
};

export default UnderlineButton;

const StyledButton = styled.button`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.primary[500]};
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.radius.small};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
