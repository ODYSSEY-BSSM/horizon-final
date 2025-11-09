'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import type { MockRoadmap } from '../_data/mockData';

interface RoadmapListItemProps {
  roadmap: MockRoadmap;
}

const ICON_COLORS = {
  red: { bg: '#FEE2E2', icon: '#DC2626' },
  orange: { bg: '#FFEDD5', icon: '#EA580C' },
  yellow: { bg: '#FEF3C7', icon: '#CA8A04' },
  green: { bg: '#D1FAE5', icon: '#059669' },
  blue: { bg: '#DBEAFE', icon: '#2563EB' },
  purple: { bg: '#E9D5FF', icon: '#9333EA' },
};

const getIconColor = (id: string) => {
  const colors = Object.values(ICON_COLORS);
  const index = parseInt(id, 10) % colors.length;
  return colors[index];
};

const RoadmapListItem = ({ roadmap }: RoadmapListItemProps) => {
  const iconColor = getIconColor(roadmap.id);
  const stages = Math.floor(Math.random() * 20) + 5; // 5-24 stages

  return (
    <StyledContainer>
      <StyledLeftSection>
        <StyledIconBox $bgColor={iconColor.bg}>
          <Icon name="deployed_code" variant="SM" filled color={iconColor.icon} decorative />
        </StyledIconBox>
        <StyledInfoSection>
          <Text variant="ST" color={tokens.colors.neutral[800]}>
            {roadmap.title}
          </Text>
          <StyledMetaData>
            <Text variant="B2" color={tokens.colors.neutral[500]}>
              {roadmap.type === 'my' ? '개인' : '팀'}
            </Text>
            <StyledBullet>•</StyledBullet>
            <Text variant="B2" color={tokens.colors.neutral[500]}>
              {stages}단계
            </Text>
            <StyledBullet>•</StyledBullet>
            <Text variant="B2" color={tokens.colors.neutral[500]}>
              {roadmap.progress === 100 ? '완료' : '진행중'}
            </Text>
          </StyledMetaData>
        </StyledInfoSection>
      </StyledLeftSection>
      <StyledRightSection>
        <StyledProgressSection>
          <Text variant="B1" color={tokens.colors.neutral[800]}>
            {roadmap.progress}%
          </Text>
          <StyledProgressBar>
            <StyledProgressFill $progress={roadmap.progress} />
          </StyledProgressBar>
        </StyledProgressSection>
        <StyledMoreButton>
          <Icon name="more_horiz" variant="SM" color={tokens.colors.neutral[500]} decorative />
        </StyledMoreButton>
      </StyledRightSection>
    </StyledContainer>
  );
};

export default RoadmapListItem;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 16px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  transition: background-color 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;

const StyledLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledIconBox = styled.div<{ $bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: ${tokens.radius.medium};
  flex-shrink: 0;
`;

const StyledInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledMetaData = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: ${tokens.typos.fontWeight.light};
`;

const StyledBullet = styled.span`
  color: ${tokens.colors.neutral[500]};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
`;

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xsmall};
`;

const StyledProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${tokens.spacing.xsmall};
  width: 80px;
`;

const StyledProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${tokens.colors.primary[100]};
  border-radius: 9999px;
  overflow: hidden;
`;

const StyledProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress / 2}%;
  height: 100%;
  background-color: ${tokens.colors.primary[500]};
  border-radius: 9999px;
  transition: width 0.3s ease;
`;

const StyledMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background-color: ${tokens.colors.neutral[200]};
    border-radius: ${tokens.radius.small};
  }
`;
