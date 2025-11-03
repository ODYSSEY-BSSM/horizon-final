'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import type { Roadmap } from '../_types';
import OverflowMenu from './OverflowMenu';

interface RoadmapCardItemProps {
  roadmap: Roadmap;
  onClick?: () => void;
  onMenuClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

const RoadmapCardItem = ({
  roadmap,
  onClick,
  onMenuClick,
  isSelected = false,
  className,
}: RoadmapCardItemProps) => {
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
    return type === 'personal' ? '개인 로드맵' : '팀 로드맵';
  };

  return (
    <StyledContainer className={className} onClick={onClick} $isSelected={isSelected}>
      <StyledThumbnail
        style={{
          background: `linear-gradient(135deg, ${roadmap.iconColor} 0%, ${roadmap.iconBgColor} 100%)`,
        }}
      >
        <StyledThumbnailIcon>
          <Icon icon={roadmap.icon} size={32} color={tokens.colors.white} weight={500} />
        </StyledThumbnailIcon>
        <StyledProgressBadge>
          <Text variant="ST" color={tokens.colors.white}>
            {getStatusText(roadmap.metadata.status)}
          </Text>
        </StyledProgressBadge>
      </StyledThumbnail>
      <StyledContent>
        <StyledContentHeader>
          <StyledTitleSection>
            <Text variant="H3" color={tokens.colors.neutral[900]}>
              {roadmap.title}
            </Text>
            <Text variant="B2" color={tokens.colors.neutral[600]}>
              {roadmap.description}
            </Text>
          </StyledTitleSection>
          <OverflowMenu onClick={onMenuClick} />
        </StyledContentHeader>
        <StyledTypeTag>
          <Icon icon="map" size={16} color={tokens.colors.neutral[600]} weight={300} />
          <Text variant="ST" color={tokens.colors.neutral[600]}>
            {getTypeText(roadmap.metadata.type)}
          </Text>
        </StyledTypeTag>
      </StyledContent>
    </StyledContainer>
  );
};

export default RoadmapCardItem;

const StyledContainer = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  width: 246px;
  background-color: ${tokens.colors.white};
  border: 1px solid
    ${({ $isSelected }) => ($isSelected ? tokens.colors.primary[500] : tokens.colors.neutral[300])};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${tokens.colors.primary[500]};
  }
`;

const StyledThumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 148px;
  display: flex;
  align-items: flex-end;
  padding: 16px;
`;

const StyledThumbnailIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledProgressBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 16px;
  padding: 2px 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  backdrop-filter: blur(4px);
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 16px 16px;
  gap: 8px;
  background-color: ${tokens.colors.white};
`;

const StyledContentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const StyledTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;

  & > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const StyledTypeTag = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
