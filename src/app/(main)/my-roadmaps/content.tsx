'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

import FolderList from './_components/FolderList';
import FolderCreateModal from './_forms/FolderCreateModal';
import RoadmapCreateModal from './_forms/RoadmapCreateModal';
import StyleSettingModal from './_forms/StyleSettingModal';

type ModalState = {
  folderCreate: boolean;
  roadmapCreate: boolean;
  styleSetting: boolean;
};

const MyRoadmapsContent = () => {
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

  const handleAddFolder = () => {
    openModal('folderCreate');
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
      <StyledMainSection>
        <StyledHeader>
          <Text as="h1" variant="H2" color={tokens.colors.black}>
            폴더를 선택해주세요.
          </Text>
          <StyledCreateButton onClick={handleAddFolder}>
            <Icon name="add" variant="SM" color={tokens.colors.white} decorative />
            <Text as="span" variant="B1" color={tokens.colors.white}>
              새 폴더
            </Text>
          </StyledCreateButton>
        </StyledHeader>

        <FolderList onAddFolderClick={handleAddFolder} />
      </StyledMainSection>

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
  padding: 16px 60px 80px;
  box-sizing: border-box;
  min-height: 100vh;
`;

const StyledMainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  max-width: 1080px;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${tokens.spacing.large} 0;
`;

const StyledCreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xsmall};
  padding: ${tokens.spacing.small} 20px ${tokens.spacing.small} ${tokens.spacing.small};
  height: 40px;
  background-color: ${tokens.colors.primary[500]};
  border: none;
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  box-sizing: border-box;

  &:hover {
    background-color: ${tokens.colors.primary[600]};
  }

  &:active {
    background-color: ${tokens.colors.primary[700]};
  }
`;
