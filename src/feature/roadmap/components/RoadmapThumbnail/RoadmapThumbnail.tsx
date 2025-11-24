'use client';

import styled from '@emotion/styled';
import type { IconOption } from '@/feature/roadmap';
import { tokens } from '@/shared/tokens';
import type { RoadmapColor, RoadmapStatus } from '@/shared/types/roadmap';
import { Icon, Text } from '@/shared/ui';

interface RoadmapThumbnailProps {
  color: RoadmapColor;
  icon: IconOption;
  status?: RoadmapStatus;
}

const RoadmapThumbnail = ({ color, icon, status }: RoadmapThumbnailProps) => {
  const statusLabel =
    status === 'completed' ? '완료' : status === 'in-progress' ? '진행중' : '시작 전';

  return (
    <StyledThumbnail $gradient={tokens.gradients.roadmap[color]}>
      {status && (
        <StyledStatusBadge>
          <Text variant="O_M_11" color={tokens.colors.white}>
            {statusLabel}
          </Text>
        </StyledStatusBadge>
      )}
      <StyledIconWrapper>
        <Icon name={icon} variant="LG" color={tokens.colors.white} filled decorative />
      </StyledIconWrapper>
    </StyledThumbnail>
  );
};

export default RoadmapThumbnail;

const StyledThumbnail = styled.div<{ $gradient: string }>`
  width: 100%;
  height: 148px;
  background: ${({ $gradient }) => $gradient};
  border-radius: ${tokens.radius.medium};
  display: flex;
  align-items: flex-end;
  padding: ${tokens.spacing.large};
  box-sizing: border-box;
  position: relative;
`;

const StyledStatusBadge = styled.div`
  position: absolute;
  top: ${tokens.spacing.medium};
  right: ${tokens.spacing.medium};
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  padding: 2px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
`;

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
