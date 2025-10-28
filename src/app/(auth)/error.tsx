'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <StyledContainer>
      {/* 브랜딩 */}
      <StyledBrandingSection>
        <Text variant="H2" color={tokens.colors.primary[500]}>
          HORIZON
        </Text>
      </StyledBrandingSection>

      {/* 에러 아이콘 */}
      <StyledErrorIcon>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={tokens.colors.error[200]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="에러 아이콘"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </StyledErrorIcon>

      {/* 에러 메시지 */}
      <StyledErrorMessageSection>
        <Text variant="H3" color={tokens.colors.neutral[900]}>
          페이지를 로드할 수 없습니다
        </Text>
        <Text variant="B2" color={tokens.colors.neutral[600]}>
          {error.message || '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
        </Text>
      </StyledErrorMessageSection>

      {/* 액션 버튼들 */}
      <StyledActionSection>
        <StyledRetryButton type="button" onClick={reset}>
          <Text variant="ST" color={tokens.colors.white}>
            다시 시도
          </Text>
        </StyledRetryButton>

        <StyledHomeButton type="button" onClick={() => router.push('/')}>
          <Text variant="ST" color={tokens.colors.neutral[700]}>
            홈으로 돌아가기
          </Text>
        </StyledHomeButton>
      </StyledActionSection>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 400px;
  text-align: center;
`;

const StyledBrandingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StyledErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${tokens.colors.error[100]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledErrorMessageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const StyledActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const StyledRetryButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${tokens.colors.primary[500]};
  color: ${tokens.colors.white};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus {
    background-color: ${tokens.colors.primary[600]};
  }
`;

const StyledHomeButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: transparent;
  color: ${tokens.colors.neutral[700]};
  border: 1px solid ${tokens.colors.neutral[300]};
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus {
    background-color: ${tokens.colors.neutral[100]};
  }
`;
