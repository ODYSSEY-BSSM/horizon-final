'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import { tokens } from '@/shared/tokens';

interface AddRoadmapCardProps {
  onClick: () => void;
}

export default function AddRoadmapCard({ onClick }: AddRoadmapCardProps) {
  return (
    <StyledCard onClick={onClick}>
      <StyledContent>
        <StyledIconButton>
          <Icon name="add" variant="MD" decorative />
        </StyledIconButton>
        <StyledTextSection>
          <StyledTitle>새 로드맵 추가</StyledTitle>
          <StyledDescription>새로운 로드맵을 시작하세요</StyledDescription>
        </StyledTextSection>
      </StyledContent>
    </StyledCard>
  );
}

const StyledCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 226px;
  background-color: ${tokens.colors.white};
  border: 2px dashed ${tokens.colors.neutral[300]};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${tokens.colors.primary[400]};
    background-color: ${tokens.colors.primary[100]};
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const StyledIconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: ${tokens.colors.neutral[100]};
  border-radius: 8px;
  color: ${tokens.colors.neutral[400]};
`;

const StyledTextSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

const StyledTitle = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[800]};
  margin: 0;
`;

const StyledDescription = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[500]};
  margin: 0;
`;
