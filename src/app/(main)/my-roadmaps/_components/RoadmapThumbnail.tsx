'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import { tokens } from '@/shared/tokens';

export interface RoadmapThumbnailProps {
  className?: string;
}

const RoadmapThumbnail = ({ className }: RoadmapThumbnailProps) => {
  return (
    <StyledThumbnailContainer className={className}>
      <StyledIconContainer>
        <Icon name="language" variant="LG" color={tokens.colors.white} filled decorative />
      </StyledIconContainer>
    </StyledThumbnailContainer>
  );
};

export default RoadmapThumbnail;

const StyledThumbnailContainer = styled.div`
  width: 480px;
  height: 148px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border-radius: ${tokens.radius.medium};
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: ${tokens.spacing.medium};
  box-sizing: border-box;
`;

const StyledIconContainer = styled.div`
  width: 32px;
  height: 32px;
  color: ${tokens.colors.white};
`;
