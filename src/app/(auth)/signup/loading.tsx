import styled from '@emotion/styled';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

export default function SignUpLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[200]}
      highlightColor={tokens.colors.neutral[100]}
    >
      <StyledContainer>
        {/* 헤더 섹션 */}
        <StyledHeaderSection>
          <Skeleton circle width={24} height={24} />
          <Skeleton height={24} width={120} />
        </StyledHeaderSection>

        {/* 브랜딩 */}
        <StyledBrandingSection>
          <Text variant="H2" color={tokens.colors.primary[500]}>
            HORIZON
          </Text>
          <Skeleton height={20} width={180} />
        </StyledBrandingSection>

        {/* 스텝별 폼 - 동적 구조 */}
        <StyledFormSection>
          {/* 입력 필드들 */}
          <StyledFieldContainer>
            <StyledLabelSkeleton>
              <Skeleton height={16} width={80} />
            </StyledLabelSkeleton>
            <Skeleton height={48} />
          </StyledFieldContainer>

          {/* 추가 필드 또는 설명 */}
          <StyledDescriptionContainer>
            <StyledDescriptionSkeleton>
              <Skeleton height={14} width={250} />
            </StyledDescriptionSkeleton>
            <Skeleton height={14} width={200} />
          </StyledDescriptionContainer>

          {/* 액션 버튼들 */}
          <StyledActionSection>
            <Skeleton height={48} />
            <Skeleton height={40} />
          </StyledActionSection>
        </StyledFormSection>

        {/* 하단 링크 */}
        <StyledFooterLink>
          <Skeleton height={16} width={160} />
        </StyledFooterLink>
      </StyledContainer>
    </SkeletonTheme>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 400px;
`;

const StyledHeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const StyledBrandingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const StyledFormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledFieldContainer = styled.div``;

const StyledLabelSkeleton = styled.div`
  margin-bottom: 8px;
`;

const StyledDescriptionContainer = styled.div``;

const StyledDescriptionSkeleton = styled.div`
  margin-bottom: 4px;
`;

const StyledActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const StyledFooterLink = styled.div`
  text-align: center;
`;
