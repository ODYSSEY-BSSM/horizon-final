'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

export interface FolderListProps {
  className?: string;
}

const FolderList = ({ className }: FolderListProps) => {
  return (
    <StyledContainer className={className}>
      <StyledFilterTabs>
        <StyledFilterTab $active>
          <Text as="span" variant="B1" color={tokens.colors.primary[500]}>
            최신순
          </Text>
        </StyledFilterTab>
        <StyledFilterTab>
          <Text as="span" variant="B1" color={tokens.colors.neutral[500]}>
            진행률
          </Text>
        </StyledFilterTab>
        <StyledFilterTab>
          <Text as="span" variant="B1" color={tokens.colors.neutral[500]}>
            이름순
          </Text>
        </StyledFilterTab>
      </StyledFilterTabs>

      <StyledContent>
        <StyledFolderGrid>
          <StyledFolderItem>
            <StyledFolderHeader>
              <StyledFolderIcon>
                <Icon
                  name="folder"
                  variant="SM"
                  color={tokens.colors.neutral[800]}
                  filled
                  decorative
                />
              </StyledFolderIcon>
              <StyledFolderInfo>
                <Text as="h3" variant="ST" color={tokens.colors.neutral[800]}>
                  FolderName
                </Text>
                <Text as="p" variant="B2" color={tokens.colors.neutral[500]}>
                  Write Folder Description
                </Text>
              </StyledFolderInfo>
            </StyledFolderHeader>

            <StyledProgressSection>
              <StyledProgressHeader>
                <Text as="span" variant="C" color={tokens.colors.neutral[500]}>
                  진행률
                </Text>
                <Text as="span" variant="C" color={tokens.colors.primary[500]}>
                  0%
                </Text>
              </StyledProgressHeader>
              <StyledProgressBar>
                <StyledProgressFill $progress={0} />
              </StyledProgressBar>
            </StyledProgressSection>

            <StyledFolderDetails>
              <StyledFolderStats>
                <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
                  로드맵:{' '}
                  <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                    10개
                  </Text>
                  {' • '}
                  완료:{' '}
                  <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                    5개
                  </Text>
                </Text>
              </StyledFolderStats>
              <StyledLastRoadmap>
                <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
                  마지막 로드맵:{' '}
                  <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
                    TestRoadmap01
                  </Text>
                </Text>
                <Text as="span" variant="B1" color={tokens.colors.primary[500]}>
                  계속하기
                </Text>
              </StyledLastRoadmap>
            </StyledFolderDetails>
          </StyledFolderItem>

          <StyledAddFolderCard>
            <StyledAddFolderContent>
              <StyledAddIcon>
                <Icon name="add" variant="MD" color={tokens.colors.neutral[400]} decorative />
              </StyledAddIcon>
              <StyledAddFolderText>
                <Text as="p" variant="B1" color={tokens.colors.neutral[800]}>
                  새 폴더 생성
                </Text>
                <Text as="p" variant="B2" color={tokens.colors.neutral[500]}>
                  새 로드맵들을 위한 폴더를 생성하세요
                </Text>
              </StyledAddFolderText>
            </StyledAddFolderContent>
          </StyledAddFolderCard>
        </StyledFolderGrid>
      </StyledContent>
    </StyledContainer>
  );
};

export default FolderList;

const StyledContainer = styled.div`
  width: 100%;
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  background-color: ${tokens.colors.white};
`;

const StyledFilterTabs = styled.div`
  display: flex;
  gap: ${tokens.spacing.large};
  padding: ${tokens.spacing.small} ${tokens.spacing.large};
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

const StyledContent = styled.div`
  padding: ${tokens.spacing.large};
`;

const StyledFolderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(333px, 1fr));
  gap: ${tokens.spacing.medium};
`;

const StyledFolderItem = styled.div`
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  padding: ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
`;

const StyledFolderHeader = styled.div`
  display: flex;
  gap: ${tokens.spacing.small};
  align-items: center;
`;

const StyledFolderIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledFolderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
`;

const StyledProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
`;

const StyledProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.small};
  overflow: hidden;
`;

const StyledProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background-color: ${tokens.colors.primary[500]};
  transition: width 0.3s ease;
`;

const StyledFolderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
`;

const StyledFolderStats = styled.div`
  display: flex;
  gap: ${tokens.spacing.xxsmall};
`;

const StyledLastRoadmap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledAddFolderCard = styled.div`
  border: 2px dashed ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.medium};
  background-color: ${tokens.colors.white};
  height: 226px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledAddFolderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.medium};
`;

const StyledAddIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAddFolderText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.xsmall};
  text-align: center;
`;
