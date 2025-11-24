'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import type { ColorOption, IconOption } from '@/feature/roadmap';
import { ROADMAP_COLORS } from '@/feature/roadmap/constants';
import { useDeleteRoadmap } from '@/feature/roadmap/hooks/useRoadmapQueries';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';
import { tokens } from '@/shared/tokens';
import type { DropdownMenuItem } from '@/shared/ui';
import { Dropdown, Icon, Modal, Text } from '@/shared/ui';
import type { RoadmapListItemProps } from './RoadmapListItem.types';

const RoadmapListItem = ({ roadmap, onClick, showActions = true }: RoadmapListItemProps) => {
  const colors = ROADMAP_COLORS[roadmap.color] ?? ROADMAP_COLORS.blue;
  const { openEditModal } = useRoadmapFormStore();
  const deleteMutation = useDeleteRoadmap();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRightSectionHovered, setIsRightSectionHovered] = useState(false);

  const handleEdit = () => {
    const roadmapUuid = Number.parseInt(roadmap.id, 10);
    openEditModal(roadmapUuid, {
      name: roadmap.name,
      description: roadmap.description || '',
      folderId: roadmap.folderId,
      folderName: roadmap.folderName,
      color: roadmap.color.toLowerCase() as ColorOption,
      icon: roadmap.icon.toLowerCase() as IconOption,
      category: roadmap.type === 'personal' ? 'personal' : 'team',
    });
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 로드맵을 삭제하시겠습니까?')) {
      const roadmapUuid = Number.parseInt(roadmap.id, 10);
      deleteMutation.mutate(roadmapUuid);
    }
  };

  const handleDetailView = () => {
    setIsDetailModalOpen(true);
  };

  const dropdownItems: DropdownMenuItem[] = [
    {
      label: '자세히 보기',
      onClick: handleDetailView,
      icon: <Icon name="visibility" variant="SM" color={tokens.colors.neutral[600]} decorative />,
    },
    {
      label: '수정',
      onClick: handleEdit,
      icon: <Icon name="edit" variant="SM" color={tokens.colors.neutral[600]} decorative />,
    },
    {
      label: '삭제',
      onClick: handleDelete,
      variant: 'danger',
      icon: <Icon name="delete" variant="SM" color={tokens.colors.error[200]} decorative />,
    },
  ];

  const handleClick = () => {
    onClick?.(roadmap.id);
  };

  return (
    <>
      <StyledContainer onClick={handleClick} $disableHover={isRightSectionHovered}>
        <StyledLeftSection>
          <StyledIconBox $bgColor={colors.bg}>
            <Icon name={roadmap.icon} variant="SM" filled color={colors.icon} decorative />
          </StyledIconBox>
          <StyledInfoSection>
            <Text variant="ST" color={tokens.colors.neutral[800]}>
              {roadmap.name}
            </Text>
            <StyledMetaData>
              <Text variant="B2" color={tokens.colors.neutral[500]}>
                {roadmap.type === 'personal' ? '개인' : '팀'}
              </Text>
              <StyledBullet>•</StyledBullet>
              <Text variant="B2" color={tokens.colors.neutral[500]}>
                {roadmap.totalSteps}단계
              </Text>
              <StyledBullet>•</StyledBullet>
              <Text variant="B2" color={tokens.colors.neutral[500]}>
                {roadmap.status === 'in-progress'
                  ? '진행중'
                  : roadmap.status === 'completed'
                    ? '완료'
                    : '시작 전'}
              </Text>
            </StyledMetaData>
          </StyledInfoSection>
        </StyledLeftSection>
        <StyledRightSection
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsRightSectionHovered(true)}
          onMouseLeave={() => setIsRightSectionHovered(false)}
        >
          <StyledProgressContainer>
            <Text variant="B2" color={tokens.colors.neutral[600]}>
              {roadmap.progress}%
            </Text>
            <StyledProgressBar>
              <StyledProgressFill $progress={roadmap.progress} $color={colors.icon} />
            </StyledProgressBar>
          </StyledProgressContainer>
          {showActions && (
            <Dropdown
              trigger={
                <StyledActionButton aria-label="더보기">
                  <Icon
                    name="more_horiz"
                    variant="SM"
                    color={tokens.colors.neutral[500]}
                    decorative
                  />
                </StyledActionButton>
              }
              items={dropdownItems}
              align="right"
            />
          )}
        </StyledRightSection>
      </StyledContainer>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={roadmap.name}
        width="small"
      >
        <StyledDetailContent>
          <StyledDetailSection>
            <Text variant="B1" color={tokens.colors.neutral[600]}>
              설명
            </Text>
            <Text variant="B1" color={tokens.colors.neutral[800]}>
              {roadmap.description || '설명이 없습니다.'}
            </Text>
          </StyledDetailSection>
        </StyledDetailContent>
      </Modal>
    </>
  );
};

export default RoadmapListItem;

const StyledContainer = styled.div<{ $disableHover?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.spacing.medium} ${tokens.spacing.large};
  background: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ $disableHover }) => ($disableHover ? tokens.colors.white : tokens.colors.neutral[100])};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const StyledLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.medium};
  flex: 1;
  min-width: 0;
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
  gap: ${tokens.spacing.xsmall};
  min-width: 0;
  flex: 1;
`;

const StyledMetaData = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xsmall};
`;

const StyledBullet = styled.span`
  color: ${tokens.colors.neutral[300]};
  font-size: ${tokens.typos.fontSize[12]};
`;

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  position: relative;
  z-index: 10;
`;

const StyledProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${tokens.spacing.small};
  min-width: 80px;
`;

const StyledProgressBar = styled.div`
  width: 80px;
  height: 8px;
  background-color: ${tokens.colors.primary[100]};
  border-radius: 9999px;
  overflow: hidden;
`;

const StyledProgressFill = styled.div<{ $progress: number; $color: string }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background-color: ${({ $color }) => $color};
  border-radius: 9999px;
  transition: width 0.3s ease;
`;

const StyledActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: ${tokens.radius.small};
  cursor: pointer;
  padding: ${tokens.spacing.xsmall};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const StyledDetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const StyledDetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
`;
