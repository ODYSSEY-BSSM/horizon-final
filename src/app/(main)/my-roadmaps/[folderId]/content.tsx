'use client';

import styled from '@emotion/styled';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button, FormModal } from '@/shared/ui';
import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import type { ColorOption, IconOption } from '@/feature/roadmap';
import { RoadmapStyleModal, RoadmapListSection } from '@/feature/roadmap';

type ModalState = {
  roadmapCreate: boolean;
  roadmapStyle: boolean;
};

const FolderDetailContent = () => {
  const params = useParams();
  const folderId = params?.folderId as string;

  const [modals, setModals] = useState<ModalState>({
    roadmapCreate: false,
    roadmapStyle: false,
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
    // Open style modal for next step
    openModal('roadmapStyle');
  };

  const handleStyleSubmit = (_data: { color: ColorOption; icon: IconOption }) => {
    closeModal('roadmapStyle');
    // TODO: Save roadmap with style
  };

  const handleStyleBack = () => {
    closeModal('roadmapStyle');
    openModal('roadmapCreate');
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
      <FormModal
        isOpen={modals.roadmapCreate}
        onClose={() => closeModal('roadmapCreate')}
        onSubmit={handleRoadmapSubmit}
        title="로드맵 정보"
        description="로드맵 정보를 작성해주세요."
        fields={[
          { name: 'title', label: '이름', placeholder: '이름을 입력해주세요', required: true },
          { name: 'description', label: '설명', placeholder: '설명을 입력해주세요' },
        ]}
        submitText="다음"
      />

      <RoadmapStyleModal
        isOpen={modals.roadmapStyle}
        onClose={() => closeModal('roadmapStyle')}
        onSubmit={handleStyleSubmit}
        onBack={handleStyleBack}
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
