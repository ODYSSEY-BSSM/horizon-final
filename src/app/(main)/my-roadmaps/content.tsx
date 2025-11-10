'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { FolderSection, MyRoadmapsHeader } from '@/feature/roadmap';
import { FormModal } from '@/shared/ui';

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

      <FormModal
        isOpen={modals.folderCreate}
        onClose={() => closeModal('folderCreate')}
        onSubmit={handleFolderSubmit}
        title="폴더 정보"
        description="추가할 폴더의 정보를 입력해주세요."
        fields={[
          { name: 'name', label: '이름', placeholder: '폴더 이름을 작성해주세요', required: true },
          { name: 'description', label: '설명', placeholder: '폴더 설명을 작성해주세요' },
        ]}
        submitText="완료"
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
