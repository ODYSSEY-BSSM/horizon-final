'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

function getErrorMessage(error: Error): string {
  const message = error.message || '';

  if (message.includes('네트워크') || message.includes('network')) {
    return '네트워크 연결을 확인해주세요.';
  }
  if (message.includes('권한') || message.includes('auth')) {
    return '로그인이 만료되었습니다. 다시 로그인해주세요.';
  }
  if (message.includes('서버') || message.includes('server')) {
    return '서버에 일시적인 문제가 발생했습니다.';
  }
  if (message.includes('not found') || message.includes('404')) {
    return '폴더를 찾을 수 없습니다.';
  }

  return message || '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

export default function FolderDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <StyledPageContainer>
      <StyledErrorContainer>
        <StyledBrandingSection>
          <Text variant="H2" color={tokens.colors.primary[500]}>
            HORIZON
          </Text>
          <Text variant="B1" color={tokens.colors.neutral[500]}>
            폴더를 불러오는 중 문제가 발생했습니다
          </Text>
        </StyledBrandingSection>

        <StyledErrorIconContainer>
          <Icon name="folder" variant="XL" color={tokens.colors.error[200]} decorative />
        </StyledErrorIconContainer>

        <StyledErrorMessageSection>
          <Text variant="H3" color={tokens.colors.neutral[900]}>
            폴더에 접근할 수 없습니다
          </Text>
          <Text variant="B2" color={tokens.colors.neutral[600]}>
            {getErrorMessage(error)}
          </Text>
          {process.env.NODE_ENV === 'development' && error.stack && (
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

          <StyledBackButton type="button" onClick={() => router.push('/my-roadmaps')}>
            <Icon name="arrow_back" variant="SM" color={tokens.colors.neutral[700]} decorative />
            <Text variant="ST" color={tokens.colors.neutral[700]}>
              내 로드맵으로 돌아가기
            </Text>
          </StyledBackButton>

          <StyledHomeButton type="button" onClick={() => router.push('/')}>
            <Text variant="O" color={tokens.colors.neutral[500]}>
              홈으로 돌아가기
            </Text>
          </StyledHomeButton>
        </StyledActionSection>
      </StyledErrorContainer>
    </StyledPageContainer>
  );
}

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  padding: 0 60px 80px;
  box-sizing: border-box;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
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

const StyledBackButton = styled.button`
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
