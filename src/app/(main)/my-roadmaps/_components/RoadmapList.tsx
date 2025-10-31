'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

export interface RoadmapListProps {
  className?: string;
}

const RoadmapList = ({ className }: RoadmapListProps) => {
  return (
    <StyledContainer className={className}>
      <StyledHeader>
        <StyledHeaderContent>
          <StyledTitle as="h2" variant="H3" color={tokens.colors.neutral[800]}>
            로드맵 리스트
          </StyledTitle>
          <StyledViewToggle>
            <StyledToggleItem $active>
              <Icon name="list" variant="MD" color={tokens.colors.black} decorative />
              <Text as="span" variant="B1" color={tokens.colors.neutral[700]}>
                리스트
              </Text>
            </StyledToggleItem>
            <StyledToggleItem>
              <Icon
                name="calendar_view_month"
                variant="MD"
                color={tokens.colors.neutral[500]}
                decorative
              />
              <Text as="span" variant="B1" color={tokens.colors.neutral[500]}>
                썸네일
              </Text>
            </StyledToggleItem>
          </StyledViewToggle>
        </StyledHeaderContent>
      </StyledHeader>

      <StyledFilterTabs>
        <StyledFilterTab $active>
          <Text as="span" variant="B1" color={tokens.colors.primary[500]}>
            전체
          </Text>
        </StyledFilterTab>
        <StyledFilterTab>
          <Text as="span" variant="B1" color={tokens.colors.neutral[500]}>
            내 로드맵
          </Text>
        </StyledFilterTab>
        <StyledFilterTab>
          <Text as="span" variant="B1" color={tokens.colors.neutral[500]}>
            팀 로드맵
          </Text>
        </StyledFilterTab>
        <StyledFilterTab>
          <Text as="span" variant="B1" color={tokens.colors.neutral[500]}>
            학습 완료
          </Text>
        </StyledFilterTab>
        <StyledFilterTab>
          <Text as="span" variant="B1" color={tokens.colors.neutral[500]}>
            학습 진행중
          </Text>
        </StyledFilterTab>
      </StyledFilterTabs>

      <StyledEmptyState>
        <Text as="p" variant="ST" color={tokens.colors.neutral[600]}>
          아직 로드맵이 없습니다.
        </Text>
        <StyledCreateLink as="p" variant="B1" color={tokens.colors.primary[500]}>
          새 로드맵 만들기
        </StyledCreateLink>
      </StyledEmptyState>
    </StyledContainer>
  );
};

export default RoadmapList;

const StyledContainer = styled.div`
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  overflow: hidden;
  background-color: ${tokens.colors.white};
`;

const StyledHeader = styled.div`
  padding: ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
`;

const StyledHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTitle = styled(Text)`
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  letter-spacing: -0.2px;
`;

const StyledViewToggle = styled.div`
  display: flex;
  background-color: ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  padding: ${tokens.spacing.xxsmall};
`;

const StyledToggleItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  padding: ${tokens.spacing.xxsmall} ${tokens.spacing.xsmall};
  border-radius: ${tokens.radius.small};
  background-color: ${({ $active }) => ($active ? tokens.colors.white : 'transparent')};
  cursor: pointer;
`;

const StyledFilterTabs = styled.div`
  display: flex;
  gap: ${tokens.spacing.large};
  padding: 0 ${tokens.spacing.large};
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
`;

const StyledFilterTab = styled.div<{ $active?: boolean }>`
  padding: ${tokens.spacing.small} ${tokens.spacing.xxsmall};
  border-bottom: 2px solid ${({ $active }) => ($active ? tokens.colors.primary[500] : 'transparent')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.xxxlarge} ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
`;

const StyledCreateLink = styled(Text)`
  cursor: pointer;
`;
