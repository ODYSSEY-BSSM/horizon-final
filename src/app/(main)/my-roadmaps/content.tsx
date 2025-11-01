'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

import FolderCreateModal from './_forms/FolderCreateModal';
import RoadmapCreateModal from './_forms/RoadmapCreateModal';
import StyleSettingModal from './_forms/StyleSettingModal';
import { useMyRoadmaps } from './_hooks/useMyRoadmaps';
import FolderSection from './_sections/FolderSection';
import MyRoadmapsHeader from './_sections/MyRoadmapsHeader';

const MyRoadmapsContent = () => {
  const {
    modals,
    closeModal,
    handleAddFolder,
    handleFolderSubmit,
    handleRoadmapSubmit,
    handleStyleSubmit,
  } = useMyRoadmaps();

  return (
    <StyledPageContainer>
      <StyledContentContainer>
        <MyRoadmapsHeader onAddFolder={handleAddFolder} />

        <FolderSection onAddFolderClick={handleAddFolder} />
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
  padding: 40px 60px 80px;
  box-sizing: border-box;
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxlarge};
  width: 100%;
`;
