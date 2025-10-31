'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import FolderList from './_components/FolderList';
import RoadmapList from './_components/RoadmapList';
import RoadmapThumbnail from './_components/RoadmapThumbnail';
import FolderCreateModal from './_forms/FolderCreateModal';
import RoadmapCreateModal from './_forms/RoadmapCreateModal';
import StyleSettingModal from './_forms/StyleSettingModal';

type ViewMode = 'roadmap' | 'folder';

type ModalState = {
  folderCreate: boolean;
  roadmapCreate: boolean;
  styleSetting: boolean;
};

const MyRoadmapsContent = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('roadmap');
  const [modals, setModals] = useState<ModalState>({
    folderCreate: false,
    roadmapCreate: false,
    styleSetting: false,
  });

  const openModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  };

  const handleAddRoadmap = () => {
    openModal('roadmapCreate');
  };

  const handleAddFolder = () => {
    openModal('folderCreate');
  };

  const handleStyleSetting = () => {
    openModal('styleSetting');
  };

  const handleFolderSubmit = (_data: { name: string; description: string }) => {
    closeModal('folderCreate');
  };

  const handleRoadmapSubmit = (_data: { title: string; description: string }) => {
    closeModal('roadmapCreate');
    // Open style setting modal for next step
    openModal('styleSetting');
  };

  const handleStyleSubmit = (_data: { color: string; icon: string }) => {
    closeModal('styleSetting');
  };

  return (
    <StyledPageContainer>
      <StyledHeader>
        <StyledHeaderContent>
          <StyledTitleSection>
            <Text as="h1" variant="H3" color={tokens.colors.neutral[800]}>
              {viewMode === 'roadmap' ? '로드맵을 선택해주세요.' : '폴더를 선택해주세요.'}
            </Text>
          </StyledTitleSection>

          <StyledActions>
            {viewMode === 'roadmap' ? (
              <StyledCreateButton onClick={handleAddRoadmap}>
                <Icon name="add" variant="SM" color={tokens.colors.white} decorative />
                <Text as="span" variant="B1" color={tokens.colors.white}>
                  새 로드맵
                </Text>
              </StyledCreateButton>
            ) : (
              <StyledCreateButton onClick={handleAddFolder}>
                <Icon name="add" variant="SM" color={tokens.colors.white} decorative />
                <Text as="span" variant="B1" color={tokens.colors.white}>
                  새 폴더
                </Text>
              </StyledCreateButton>
            )}
          </StyledActions>
        </StyledHeaderContent>
      </StyledHeader>

      <StyledContentContainer>
        <StyledMainSection>
          {viewMode === 'roadmap' ? <RoadmapList /> : <FolderList />}
        </StyledMainSection>

        <StyledSidebar>
          <StyledViewToggle>
            <StyledToggleButton
              $active={viewMode === 'roadmap'}
              onClick={() => setViewMode('roadmap')}
            >
              <Text
                as="span"
                variant="B1"
                color={
                  viewMode === 'roadmap' ? tokens.colors.primary[500] : tokens.colors.neutral[500]
                }
              >
                로드맵 보기
              </Text>
            </StyledToggleButton>
            <StyledToggleButton
              $active={viewMode === 'folder'}
              onClick={() => setViewMode('folder')}
            >
              <Text
                as="span"
                variant="B1"
                color={
                  viewMode === 'folder' ? tokens.colors.primary[500] : tokens.colors.neutral[500]
                }
              >
                폴더 보기
              </Text>
            </StyledToggleButton>
          </StyledViewToggle>

          <StyledThumbnailPreview>
            <StyledPreviewHeader>
              <Text as="h3" variant="B1" color={tokens.colors.neutral[600]}>
                미리보기
              </Text>
              <StyledStyleButton onClick={handleStyleSetting}>
                <Icon name="palette" variant="XS" color={tokens.colors.primary[500]} decorative />
              </StyledStyleButton>
            </StyledPreviewHeader>
            <RoadmapThumbnail />
          </StyledThumbnailPreview>
        </StyledSidebar>
      </StyledContentContainer>

      {/* Modals */}
      <FolderCreateModal
        isOpen={modals.folderCreate}
        onClose={() => closeModal('folderCreate')}
        onSubmit={handleFolderSubmit}
      />

      <RoadmapCreateModal
        isOpen={modals.roadmapCreate}
        onClose={() => closeModal('roadmapCreate')}
        onSubmit={handleRoadmapSubmit}
      />

      <StyleSettingModal
        isOpen={modals.styleSetting}
        onClose={() => closeModal('styleSetting')}
        onSubmit={handleStyleSubmit}
      />
    </StyledPageContainer>
  );
};

export default MyRoadmapsContent;

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  padding: 0 60px 80px;
  box-sizing: border-box;
  min-height: 100vh;
`;

const StyledHeader = styled.div`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: ${tokens.spacing.large} 0;
`;

const StyledHeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${tokens.spacing.small};
`;

const StyledCreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xsmall};
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${tokens.colors.primary[500]};
  border: none;
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.primary[600]};
  }
`;

const StyledContentContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.xxlarge};
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
`;

const StyledMainSection = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledSidebar = styled.aside`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const StyledViewToggle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
  padding: ${tokens.spacing.medium};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
`;

const StyledToggleButton = styled.button<{ $active: boolean }>`
  padding: ${tokens.spacing.small};
  border: none;
  background: ${({ $active }) => ($active ? tokens.colors.primary[100] : 'transparent')};
  border-radius: ${tokens.radius.small};
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $active }) => ($active ? tokens.colors.primary[100] : tokens.colors.neutral[100])};
  }
`;

const StyledThumbnailPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.medium};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
`;

const StyledPreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledStyleButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${tokens.radius.small};
  
  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;
