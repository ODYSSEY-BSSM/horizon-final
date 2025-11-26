'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useDeleteFolder } from '@/feature/folder/hooks/useFolderQueries';
import { tokens } from '@/shared/tokens';
import type { DropdownMenuItem } from '@/shared/ui';
import { Dropdown, Icon, Modal, Text, TextField, UnderlineButton } from '@/shared/ui';

export interface Folder {
  id: number;
  name: string;
  description: string;
  progress: number;
  roadmapCount: number;
  completedCount: number;
  lastRoadmap: string;
}

interface FolderCardProps {
  folder: Folder;
  /**
   * Optional custom base path for navigation
   * Defaults to '/my-roadmaps' for personal folders
   * Use '/team-space/{teamId}' for team folders
   */
  basePath?: string;
}

const FolderCard = ({ folder, basePath = '/my-roadmaps' }: FolderCardProps) => {
  const router = useRouter();
  const deleteMutation = useDeleteFolder();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [editDescription, setEditDescription] = useState(folder.description);

  const handleCardClick = () => {
    router.push(`${basePath}/${folder.id}`);
  };

  const handleContinueClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`${basePath}/${folder.id}`);
  };

  const handleDetailView = useCallback(() => {
    setIsDetailModalOpen(true);
  }, []);

  const handleEdit = useCallback(() => {
    setEditName(folder.name);
    setEditDescription(folder.description);
    setIsEditModalOpen(true);
  }, [folder.name, folder.description]);

  const handleDelete = useCallback(() => {
    if (window.confirm(`"${folder.name}" 폴더를 삭제하시겠습니까?`)) {
      deleteMutation.mutate(folder.id);
    }
  }, [folder.name, folder.id, deleteMutation]);

  const dropdownItems: DropdownMenuItem[] = useMemo(
    () => [
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
    ],
    [handleDetailView, handleEdit, handleDelete],
  );

  return (
    <>
      <StyledFolderItem onClick={handleCardClick}>
        <StyledFolderHeader>
          <StyledFolderIcon>
            <Icon name="folder" variant="SM" color={tokens.colors.neutral[800]} filled decorative />
          </StyledFolderIcon>
          <StyledFolderInfo>
            <Text as="h3" variant="ST" color={tokens.colors.neutral[800]}>
              {folder.name}
            </Text>
            <Text as="p" variant="B2" color={tokens.colors.neutral[500]}>
              {folder.description}
            </Text>
          </StyledFolderInfo>
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
        </StyledFolderHeader>

        <StyledProgressSection>
          <StyledProgressHeader>
            <Text as="span" variant="C" color={tokens.colors.neutral[500]}>
              진행률
            </Text>
            <Text as="span" variant="C" color={tokens.colors.primary[500]}>
              {folder.progress}%
            </Text>
          </StyledProgressHeader>
          <StyledProgressBar>
            <StyledProgressFill $progress={folder.progress} />
          </StyledProgressBar>
        </StyledProgressSection>

        <StyledDetailsContainer>
          <StyledFolderStats>
            <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
              로드맵:{' '}
            </Text>
            <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
              {folder.roadmapCount}개
            </Text>
            <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
              {' • '}
            </Text>
            <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
              완료:{' '}
            </Text>
            <Text as="span" variant="B2" color={tokens.colors.neutral[800]}>
              {folder.completedCount}개
            </Text>
          </StyledFolderStats>
          <StyledLastRoadmap>
            <StyledLastRoadmapInfo>
              <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
                마지막 로드맵:{' '}
              </Text>
              <StyledRoadmapName as="span" variant="B2" color={tokens.colors.neutral[800]}>
                {folder.lastRoadmap || '-'}
              </StyledRoadmapName>
            </StyledLastRoadmapInfo>
            <UnderlineButton onClick={handleContinueClick}>계속하기</UnderlineButton>
          </StyledLastRoadmap>
        </StyledDetailsContainer>
      </StyledFolderItem>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={folder.name}
        width="small"
      >
        <StyledDetailContent>
          <StyledDetailSection>
            <Text variant="B1" color={tokens.colors.neutral[600]}>
              설명
            </Text>
            <Text variant="B1" color={tokens.colors.neutral[800]}>
              {folder.description || '설명이 없습니다.'}
            </Text>
          </StyledDetailSection>
          <StyledDetailSection>
            <Text variant="B1" color={tokens.colors.neutral[600]}>
              로드맵 통계
            </Text>
            <StyledStats>
              <Text variant="B2" color={tokens.colors.neutral[800]}>
                전체: {folder.roadmapCount}개
              </Text>
              <Text variant="B2" color={tokens.colors.neutral[800]}>
                완료: {folder.completedCount}개
              </Text>
              <Text variant="B2" color={tokens.colors.neutral[800]}>
                진행률: {folder.progress}%
              </Text>
            </StyledStats>
          </StyledDetailSection>
        </StyledDetailContent>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="폴더 수정"
        width="small"
      >
        <StyledEditContent>
          <TextField
            label="폴더 이름"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            width="100%"
          />
          <TextField
            label="설명"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            width="100%"
            placeholder="폴더 설명을 입력하세요"
          />
          <Text variant="C" color={tokens.colors.neutral[500]}>
            폴더 수정 기능은 곧 지원될 예정입니다.
          </Text>
        </StyledEditContent>
      </Modal>
    </>
  );
};

export default FolderCard;

const StyledFolderItem = styled.div`
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  padding: ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
  width: 336px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${tokens.colors.primary[300]};
    box-shadow: 0 2px 8px rgba(74, 129, 240, 0.1);
  }
`;

const StyledFolderHeader = styled.div`
  display: flex;
  gap: ${tokens.spacing.small};
  align-items: center;
  position: relative;
`;

const StyledFolderIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StyledFolderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
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
  width: ${({ $progress }) => Math.min(100, Math.max(0, $progress))}%;
  height: 100%;
  background-color: ${tokens.colors.primary[500]};
  transition: width 0.3s ease;
`;

const StyledDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  width: 100%;
`;

const StyledFolderStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  flex-wrap: wrap;
`;

const StyledLastRoadmap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledLastRoadmapInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  overflow: hidden;
  flex: 1;
`;

const StyledRoadmapName = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 144px;
`;

const StyledDropdownWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
`;

const StyledOverflowButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
    border-radius: ${tokens.radius.small};
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

const StyledStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledEditContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
`;
