'use client';

import styled from '@emotion/styled';
import { useState } from 'react';

import FolderCreateModal from './_forms/FolderCreateModal';
import RoadmapCreateModal from './_forms/RoadmapCreateModal';
import StyleSettingModal from './_forms/StyleSettingModal';
import FolderSection from './_sections/FolderSection';
import MyRoadmapsHeader from './_sections/MyRoadmapsHeader';

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
      <MyRoadmapsHeader onAddFolder={handleAddFolder} />
      <FolderSection onAddFolderClick={handleAddFolder} />

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
  gap: 40px;
  padding: 14px 60px 80px;
  box-sizing: border-box;
`;
