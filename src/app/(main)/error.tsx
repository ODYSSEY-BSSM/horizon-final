'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <StyledMainLayoutContainer>
      <StyledSidebarPlaceholder>
        <StyledSidebarContent>
          <Text variant="H3" color={tokens.colors.primary[500]}>
            HORIZON
          </Text>
        </StyledSidebarContent>
      </StyledSidebarPlaceholder>

      <StyledErrorContentArea>
        <StyledErrorContainer>
          <StyledBrandingSection>
            <Text variant="H2" color={tokens.colors.primary[500]}>
              HORIZON
            </Text>
            <Text variant="B1" color={tokens.colors.neutral[500]}>
              메인 페이지를 불러오는 중 문제가 발생했습니다
            </Text>
          </StyledBrandingSection>

          <StyledErrorIconContainer>
            <Icon name="error_outline" variant="XL" color={tokens.colors.error[200]} decorative />
          </StyledErrorIconContainer>

          <StyledErrorMessageSection>
            <Text variant="H3" color={tokens.colors.neutral[900]}>
              페이지에 접근할 수 없습니다
            </Text>
            <Text variant="B2" color={tokens.colors.neutral[600]}>
              {error.message?.includes('네트워크') || error.message?.includes('network')
                ? '네트워크 연결을 확인해주세요.'
                : error.message?.includes('권한') || error.message?.includes('auth')
                  ? '로그인이 만료되었습니다. 다시 로그인해주세요.'
                  : error.message?.includes('서버') || error.message?.includes('server')
                    ? '서버에 일시적인 문제가 발생했습니다.'
                    : error.message || '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
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
              <Icon name="refresh" variant="SM" color={tokens.colors.white} decorative />
              <Text variant="ST" color={tokens.colors.white}>
                다시 시도
              </Text>
            </StyledRetryButton>

            <StyledSignInButton type="button" onClick={() => router.push('/signin')}>
              <Icon name="login" variant="SM" color={tokens.colors.neutral[700]} decorative />
              <Text variant="ST" color={tokens.colors.neutral[700]}>
                다시 로그인
              </Text>
            </StyledSignInButton>

            <StyledHomeButton type="button" onClick={() => router.push('/')}>
              <Text variant="O" color={tokens.colors.neutral[500]}>
                홈으로 돌아가기
              </Text>
            </StyledHomeButton>
          </StyledActionSection>
        </StyledErrorContainer>
      </StyledErrorContentArea>
    </StyledMainLayoutContainer>
  );
}

const StyledMainLayoutContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const StyledSidebarPlaceholder = styled.div`
  width: 280px;
  background-color: ${tokens.colors.white};
  border-right: 1px solid ${tokens.colors.neutral[200]};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: ${tokens.spacing.large};
`;

const StyledSidebarContent = styled.div`
  padding-top: ${tokens.spacing.large};
`;

const StyledErrorContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${tokens.colors.white};
  padding: 0 60px 80px;
  box-sizing: border-box;
`;

const StyledErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 480px;
  text-align: center;
`;

const StyledBrandingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StyledErrorIconContainer = styled.div`
  width: 80px;
  height: 80px;
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
  max-width: 100%;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

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
  transition: color 0.2s ease;

  &:hover,
  &:focus {
    color: ${tokens.colors.neutral[700]};
  }
`;
