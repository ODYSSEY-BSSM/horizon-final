'use client';

import styled from '@emotion/styled';
import { useState } from 'react';

import FolderCreateModal from './_forms/FolderCreateModal';
import FolderSection from './_sections/FolderSection';
import MyRoadmapsHeader from './_sections/MyRoadmapsHeader';

type ModalState = {
  folderCreate: boolean;
};

const MyRoadmapsContent = () => {
  const [modals, setModals] = useState<ModalState>({
    folderCreate: false,
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
