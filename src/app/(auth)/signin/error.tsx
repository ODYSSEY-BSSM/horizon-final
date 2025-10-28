'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

export default function SignInError({
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
      <StyledHeaderWrapper>
        <Text variant="H2" color={tokens.colors.primary[500]}>
          HORIZON
        </Text>
        <Text variant="B1" color={tokens.colors.neutral[500]}>
          로그인 중 문제가 발생했습니다
        </Text>
      </StyledHeaderWrapper>

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
          aria-label="로그인 에러 아이콘"
        >
          <path d="M9 12l2 2 4-4" />
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
          <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
          <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3" />
        </svg>
      </StyledErrorIcon>

      {/* 에러 메시지 */}
      <StyledErrorMessageSection>
        <Text variant="H3" color={tokens.colors.neutral[900]}>
          로그인할 수 없습니다
        </Text>
        <Text variant="B2" color={tokens.colors.neutral[600]}>
          {error.message?.includes('401') ||
          error.message?.includes('이메일') ||
          error.message?.includes('비밀번호')
            ? '이메일 또는 비밀번호가 올바르지 않습니다.'
            : error.message || '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.'}
        </Text>
        {process.env.NODE_ENV === 'development' && (
          <StyledDebugDetails>
            <StyledDebugSummary>기술적 세부사항</StyledDebugSummary>
            <StyledDebugPre>{error.stack}</StyledDebugPre>
          </StyledDebugDetails>
        )}
      </StyledErrorMessageSection>

      {/* 액션 버튼들 */}
      <StyledActionSection>
        <StyledRetryButton type="button" onClick={reset}>
          <Text variant="ST" color={tokens.colors.white}>
            다시 로그인
          </Text>
        </StyledRetryButton>

        <StyledSignUpButton type="button" onClick={() => router.push('/signup')}>
          <Text variant="ST" color={tokens.colors.neutral[700]}>
            회원가입하기
          </Text>
        </StyledSignUpButton>

        <StyledHomeButton type="button" onClick={() => router.push('/')}>
          <Text variant="O" color={tokens.colors.neutral[500]}>
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

const StyledHeaderWrapper = styled.div`
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
  gap: 12px;
  align-items: center;
`;

const StyledDebugDetails = styled.details`
  margin-top: 8px;
`;

const StyledDebugSummary = styled.summary`
  cursor: pointer;
  color: ${tokens.colors.neutral[500]};
  font-size: 12px;
`;

const StyledDebugPre = styled.pre`
  font-size: 11px;
  color: ${tokens.colors.neutral[600]};
  background: ${tokens.colors.neutral[100]};
  padding: 8px;
  border-radius: 4px;
  margin-top: 4px;
  text-align: left;
  overflow: auto;
  max-width: 100%;
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

const StyledSignUpButton = styled.button`
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

const StyledHomeButton = styled.button`
  background: none;
  border: none;
  color: ${tokens.colors.neutral[500]};
  cursor: pointer;
  padding: 8px;
  text-decoration: underline;
`;
