'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export interface EducationNodeCardProps {
  title: string;
  description: string;
  usageCount: number;
  onViewClick?: () => void;
}

export const EducationNodeCard = ({
  title,
  description,
  usageCount,
  onViewClick,
}: EducationNodeCardProps) => {
  const isUsed = usageCount > 0;

  return (
    <StyledCard>
      <StyledLeftSection>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
      </StyledLeftSection>

      <StyledRightSection>
        {isUsed ? (
          <>
            <StyledUsageText>{usageCount}개 로드맵에서 사용중</StyledUsageText>
            <StyledViewLink onClick={onViewClick}>보러가기 &gt;</StyledViewLink>
          </>
        ) : (
          <StyledNotUsedText>사용되지 않음</StyledNotUsedText>
        )}
      </StyledRightSection>
    </StyledCard>
  );
};

const StyledCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 32px;
  background: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: 8px;
`;

const StyledLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledTitle = styled.p`
  margin: 0;
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-weight: ${tokens.typos.fontWeight.semibold};
  font-size: 18px;
  line-height: 26px;
  color: ${tokens.colors.neutral[800]};
`;

const StyledDescription = styled.p`
  margin: 0;
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-weight: ${tokens.typos.fontWeight.light};
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[500]};
`;

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
`;

const StyledUsageText = styled.p`
  margin: 0;
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-weight: ${tokens.typos.fontWeight.regular};
  font-size: 16px;
  line-height: 24px;
  color: ${tokens.colors.neutral[800]};
  white-space: nowrap;
`;

const StyledViewLink = styled.p`
  margin: 0;
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-weight: ${tokens.typos.fontWeight.semibold};
  font-size: 18px;
  line-height: 26px;
  color: ${tokens.colors.primary[500]};
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }
`;

const StyledNotUsedText = styled.p`
  margin: 0;
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-weight: ${tokens.typos.fontWeight.regular};
  font-size: 16px;
  line-height: 24px;
  color: ${tokens.colors.neutral[400]};
  white-space: nowrap;
`;
