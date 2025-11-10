'use client';

import styled from '@emotion/styled';
import type { IconOption } from '@/feature/roadmap';
import { tokens } from '@/shared/tokens';
import type { RoadmapColor } from '@/shared/types/roadmap';
import { Icon } from '@/shared/ui';

interface RoadmapThumbnailProps {
  color: RoadmapColor;
  icon: IconOption;
}

const RoadmapThumbnail = ({ color, icon }: RoadmapThumbnailProps) => {
  return (
    <StyledThumbnail $gradient={tokens.gradients.roadmap[color]}>
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
`;

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
