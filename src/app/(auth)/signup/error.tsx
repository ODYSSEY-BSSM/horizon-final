'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

export default function SignUpError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <StyledContainer>
      <StyledBrandingSection>
        <Text variant="H2" color={tokens.colors.primary[500]}>
          HORIZON
        </Text>
        <Text variant="B1" color={tokens.colors.neutral[500]}>
          회원가입 중 문제가 발생했습니다
        </Text>
      </StyledBrandingSection>

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
          aria-label="회원가입 에러 아이콘"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      </StyledErrorIcon>

      <StyledErrorMessageSection>
        <Text variant="H3" color={tokens.colors.neutral[900]}>
          회원가입을 완료할 수 없습니다
        </Text>
        <Text variant="B2" color={tokens.colors.neutral[600]}>
          {error.message?.includes('이미') || error.message?.includes('존재')
            ? '이미 사용 중인 이메일 또는 사용자명입니다.'
            : error.message?.includes('인증')
              ? '인증번호가 올바르지 않거나 만료되었습니다.'
              : error.message || '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'}
        </Text>
        {process.env.NODE_ENV === 'development' && (
          <StyledDebugDetails>
            <StyledDebugSummary>기술적 세부사항</StyledDebugSummary>
            <StyledDebugPre>{error.stack}</StyledDebugPre>
          </StyledDebugDetails>
        )}
      </StyledErrorMessageSection>

      <StyledActionSection>
        <StyledRetryButton type="button" onClick={reset}>
          <Text variant="ST" color={tokens.colors.white}>
            다시 시도
          </Text>
        </StyledRetryButton>

        <StyledSignInButton type="button" onClick={() => router.push('/signin')}>
          <Text variant="ST" color={tokens.colors.neutral[700]}>
            로그인하기
          </Text>
        </StyledSignInButton>

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

const StyledSignInButton = styled.button`
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
