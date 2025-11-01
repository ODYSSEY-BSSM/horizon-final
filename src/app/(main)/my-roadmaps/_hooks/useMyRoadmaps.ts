import { useCallback, useState } from 'react';

type ModalState = {
  folderCreate: boolean;
  roadmapCreate: boolean;
  styleSetting: boolean;
};

export const useMyRoadmaps = () => {
  const [modals, setModals] = useState<ModalState>({
    folderCreate: false,
    roadmapCreate: false,
    styleSetting: false,
  });

  const openModal = useCallback((modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  }, []);

  const closeModal = useCallback((modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  }, []);

  const handleAddFolder = useCallback(() => {
    openModal('folderCreate');
  }, [openModal]);

  const handleFolderSubmit = useCallback(
    (_data: { name: string; description: string }) => {
      closeModal('folderCreate');
      // TODO: API 연동 시 폴더 생성 로직 구현
    },
    [closeModal],
  );

  const handleRoadmapSubmit = useCallback(
    (_data: { title: string; description: string }) => {
      closeModal('roadmapCreate');
      // Open style setting modal for next step
      openModal('styleSetting');
    },
    [closeModal, openModal],
  );

  const handleStyleSubmit = useCallback(
    (_data: { color: string; icon: string }) => {
      closeModal('styleSetting');
      // TODO: API 연동 시 로드맵 생성 완료 로직 구현
    },
    [closeModal],
  );

  return {
    modals,
    openModal,
    closeModal,
    handleAddFolder,
    handleFolderSubmit,
    handleRoadmapSubmit,
    handleStyleSubmit,
  };
};
