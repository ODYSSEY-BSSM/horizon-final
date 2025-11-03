'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import type { Roadmap } from '../_types';
import OverflowMenu from './OverflowMenu';
import ProgressBar from './ProgressBar';
import RoadmapIcon from './RoadmapIcon';

interface RoadmapListItemProps {
  roadmap: Roadmap;
  onClick?: () => void;
  onMenuClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

const RoadmapListItem = ({
  roadmap,
  onClick,
  onMenuClick,
  isSelected = false,
  className,
}: RoadmapListItemProps) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'in-progress':
        return '진행중';
      case 'not-started':
        return '시작 전';
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    return type === 'personal' ? '개인' : '팀';
  };

  return (
    <StyledContainer className={className} onClick={onClick} $isSelected={isSelected}>
      <StyledLeftSection>
        <RoadmapIcon
          icon={roadmap.icon}
          iconColor={roadmap.iconColor}
          iconBgColor={roadmap.iconBgColor}
        />
        <StyledInfo>
          <Text variant="H3" color={tokens.colors.neutral[900]}>
            {roadmap.title}
          </Text>
          <StyledMetadata>
            <Text variant="B2" color={tokens.colors.neutral[600]}>
              {getTypeText(roadmap.metadata.type)}
            </Text>
            <StyledDivider>•</StyledDivider>
            <StyledStepCount>
              <Text variant="B2" color={tokens.colors.neutral[600]}>
                {roadmap.metadata.stepsCount}
              </Text>
              <Text variant="B2" color={tokens.colors.neutral[600]}>
                단계
              </Text>
            </StyledStepCount>
            <StyledDivider>•</StyledDivider>
            <Text variant="B2" color={tokens.colors.neutral[600]}>
              {getStatusText(roadmap.metadata.status)}
            </Text>
          </StyledMetadata>
        </StyledInfo>
      </StyledLeftSection>
      <StyledRightSection>
        <ProgressBar progress={roadmap.progress} />
        <OverflowMenu onClick={onMenuClick} />
      </StyledRightSection>
    </StyledContainer>
  );
};

export default RoadmapListItem;

const StyledContainer = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: ${({ $isSelected }) =>
    $isSelected ? tokens.colors.primary[100] : tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.primary[100]};
  }
`;

const StyledLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledDivider = styled(Text)`
  color: ${tokens.colors.neutral[600]};
  font-size: 14px;
  line-height: 22px;
  font-weight: 300;
`;

const StyledStepCount = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
