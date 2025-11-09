'use client';

import styled from '@emotion/styled';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

import RoadmapCreateModal from '../_forms/RoadmapCreateModal';
import StyleSettingModal from '../_forms/StyleSettingModal';
import RoadmapListSection from './_sections/RoadmapListSection';

type ModalState = {
  roadmapCreate: boolean;
  styleSetting: boolean;
};

const FolderDetailContent = () => {
  const params = useParams();
  const folderId = params?.folderId as string;

  const [modals, setModals] = useState<ModalState>({
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
      <StyledTitleRow>
        <Text as="h1" variant="H2" color={tokens.colors.black}>
          로드맵을 선택해주세요.
        </Text>
        <Button
          size="medium"
          variant="contained"
          iconPosition="left"
          iconName="add"
          onClick={handleAddRoadmap}
        >
          새 로드맵
        </Button>
      </StyledTitleRow>

      <RoadmapListSection folderId={folderId} onAddRoadmapClick={handleAddRoadmap} />

      {/* Modals */}
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

export default FolderDetailContent;

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 16px 60px 80px;
  box-sizing: border-box;
`;

const StyledTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
