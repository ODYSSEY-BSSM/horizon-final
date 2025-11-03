'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';

interface RoadmapIconProps {
  icon: string;
  iconColor: string;
  iconBgColor: string;
  size?: number;
  className?: string;
}

const RoadmapIcon = ({ icon, iconColor, iconBgColor, size = 40, className }: RoadmapIconProps) => {
  return (
    <StyledIconContainer
      className={className}
      style={{
        backgroundColor: iconBgColor,
        width: size,
        height: size,
      }}
    >
      <Icon icon={icon} size={20} color={iconColor} />
    </StyledIconContainer>
  );
};

export default RoadmapIcon;

const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
`;
