'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import type { ColorOption, IconOption } from '@/feature/roadmap';
import { useDeleteRoadmap } from '@/feature/roadmap/hooks/useRoadmapQueries';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';
import { tokens } from '@/shared/tokens';
import { gradients } from '@/shared/tokens/gradient/gradient';
import type { RoadmapColor, RoadmapItem } from '@/shared/types';
import type { DropdownMenuItem } from '@/shared/ui';
import { Dropdown, Icon, Modal, Text } from '@/shared/ui';

export interface RoadmapCardProps {
  item: RoadmapItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

const RoadmapCard = ({ item, onClick, className }: RoadmapCardProps) => {
  const { openEditModal } = useRoadmapFormStore();
  const deleteMutation = useDeleteRoadmap();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleEdit = () => {
    const roadmapUuid = Number.parseInt(item.id, 10);
    openEditModal(roadmapUuid, {
      name: item.title,
      description: '',
      folderId: undefined,
      folderName: undefined,
      color: item.color.toLowerCase() as ColorOption,
      icon: item.icon.toLowerCase() as IconOption,
      category: item.category === 'personal' ? 'personal' : 'team',
    });
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 로드맵을 삭제하시겠습니까?')) {
      const roadmapUuid = Number.parseInt(item.id, 10);
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

  const handleCardClick = () => {
    onClick?.(item.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <>
      <StyledCardContainer
        className={className}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${item.title} 로드맵 상세보기`}
      >
        <StyledThumbnail $color={item.color}>
          <StyledThumbnailIcon>
            <Icon name={item.icon} variant="LG" color={tokens.colors.white} filled decorative />
          </StyledThumbnailIcon>
          <StyledProgressBadge status={item.status}>
            <StyledBadgeText as="span" variant="C" color={tokens.colors.white}>
              {item.status === 'in-progress' ? '진행중' : '완료'}
            </StyledBadgeText>
          </StyledProgressBadge>
        </StyledThumbnail>

        <StyledContent>
          <StyledContentHeader>
            <StyledTitleSection>
              <Text as="h3" variant="ST" color={tokens.colors.neutral[800]} ellipsis>
                {item.title}
              </Text>
            </StyledTitleSection>

            <StyledDropdownWrapper onClick={(e) => e.stopPropagation()}>
              <Dropdown
                trigger={
                  <StyledOverflowButton aria-label="더보기">
                    <Icon
                      name="more_horiz"
                      variant="SM"
                      color={tokens.colors.neutral[500]}
                      decorative
                    />
                  </StyledOverflowButton>
                }
                items={dropdownItems}
                align="right"
              />
            </StyledDropdownWrapper>
          </StyledContentHeader>

          <StyledCategoryInfo>
            <StyledCategoryIcon
              name="map"
              variant="XS"
              color={tokens.colors.neutral[500]}
              decorative
            />
            <StyledCategoryText as="span" variant="C" color={tokens.colors.neutral[500]}>
              {item.category === 'personal' ? '개인 로드맵' : '팀 로드맵'}
            </StyledCategoryText>
          </StyledCategoryInfo>
        </StyledContent>
      </StyledCardContainer>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={item.title}
        width="small"
      >
        <StyledDetailContent>
          <StyledDetailSection>
            <Text variant="B1" color={tokens.colors.neutral[600]}>
              설명
            </Text>
            <Text variant="B1" color={tokens.colors.neutral[800]}>
              설명이 없습니다.
            </Text>
          </StyledDetailSection>
        </StyledDetailContent>
      </Modal>
    </>
  );
};

export default RoadmapCard;

export const StyledCardContainer = styled.div`
  width: 246px;
  height: 246px;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  overflow: visible;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${tokens.shadow[0]};
  position: relative;
  z-index: 1;

  &:hover {
    border-color: ${tokens.colors.primary[500]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
  }
`;

export const StyledThumbnail = styled.div<{ $color: RoadmapColor }>`
  width: 100%;
  height: 148px;
  background: ${({ $color }) => gradients.roadmap[$color]};
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: ${tokens.spacing.medium};
  box-sizing: border-box;
  border-radius: ${tokens.radius.medium} ${tokens.radius.medium} 0 0;
  overflow: hidden;
`;

export const StyledThumbnailIcon = styled.div`
  width: 32px;
  height: 32px;
  color: ${tokens.colors.white};
`;

const StyledBadgeText = styled(Text)`
  font-size: 11px;
  line-height: 18px;
  letter-spacing: 0.55px;
  font-weight: 500;
`;

export const StyledProgressBadge = styled.div<{ status: RoadmapItem['status'] }>`
  position: absolute;
  top: ${tokens.spacing.small};
  right: ${tokens.spacing.small};
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  display: inline-flex;
  padding: 2px 8px;
  backdrop-filter: blur(4px);
`;

export const StyledContent = styled.div`
  width: 100%;
  height: 98px;
  background-color: ${tokens.colors.white};
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
  overflow: visible;
  border-radius: 0 0 ${tokens.radius.medium} ${tokens.radius.medium};
`;

export const StyledContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 10;
`;

export const StyledTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  flex: 1;
  min-width: 0;
`;

export const StyledOverflowButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: -${tokens.spacing.xsmall} -${tokens.spacing.xsmall} 0 0;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
    border-radius: ${tokens.radius.small};
  }
`;

const StyledCategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
`;

const StyledCategoryIcon = styled(Icon)`
  font-size: 16px;
`;

const StyledCategoryText = styled(Text)`
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.12px;
  font-weight: 200;
`;

const StyledDropdownWrapper = styled.div`
  position: relative;
  z-index: 1000;
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
