'use client';

import styled from '@emotion/styled';
import type { ColorOption, IconOption } from '@/feature/roadmap';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';

interface RoadmapThumbnailProps {
  color: ColorOption;
  icon: IconOption;
}

const COLOR_GRADIENTS: Record<ColorOption, string> = {
  red: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  orange: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
  yellow: 'linear-gradient(135deg, #EAB308 0%, #E6C200 100%)',
  green: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
  blue: 'linear-gradient(135deg, #3B82F6 0%, #2666DC 100%)',
  purple: 'linear-gradient(135deg, #A855F7 0%, #A826DC 100%)',
};

const RoadmapThumbnail = ({ color, icon }: RoadmapThumbnailProps) => {
  return (
    <StyledThumbnail $gradient={COLOR_GRADIENTS[color]}>
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
