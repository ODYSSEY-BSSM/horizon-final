import { type KeyboardEvent, useState } from 'react';
import { useRootFolder, useTeamRootFolder } from '@/feature/folder/hooks/useFolderQueries';
import { useRoadmapFormStore } from '@/feature/roadmap/stores/roadmapFormStore';

export const useFolderStep = () => {
  const { formData, updateField, nextStep, previousStep, isStepValid } = useRoadmapFormStore();

  const isTeamRoadmap = formData.category === 'team';
  const teamId = formData.teamId ? Number(formData.teamId) : 0;

  const { data: personalRootContent, isLoading: isPersonalLoading } = useRootFolder();

  const { data: teamRootContent, isLoading: isTeamLoading } = useTeamRootFolder(teamId);

  const rootContent = isTeamRoadmap ? teamRootContent : personalRootContent;
  const isLoading = isTeamRoadmap ? isTeamLoading : isPersonalLoading;

  const [isOpen, setIsOpen] = useState(false);
  const [newFolderMode, setNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const folderId = formData.folderId;
  const folderName = formData.folderName;

  const directories = rootContent?.directories || [];
  const FOLDER_OPTIONS = directories.map((dir) => ({
    id: String(dir.id),
    label: dir.name,
    value: String(dir.id),
  }));

  const selectedFolder = folderId ? FOLDER_OPTIONS.find((option) => option.id === folderId) : null;

  const handleFolderSelect = (selectedFolderId: string) => {
    updateField('folderId', selectedFolderId);
    updateField('folderName', undefined);
    setIsOpen(false);
    setNewFolderMode(false);
    setNewFolderName('');
  };

  const handleNewFolderClick = () => {
    setNewFolderMode(true);
    setIsOpen(false);
  };

  const handleNewFolderSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newFolderName.trim()) {
      updateField('folderId', undefined);
      updateField('folderName', newFolderName.trim());
      setNewFolderMode(false);
      setNewFolderName('');
    } else if (e.key === 'Escape') {
      setNewFolderMode(false);
      setNewFolderName('');
    }
  };

  const handleNewFolderBlur = () => {
    if (newFolderName.trim()) {
      updateField('folderId', undefined);
      updateField('folderName', newFolderName.trim());
    }
    setNewFolderMode(false);
    setNewFolderName('');
  };

  const getDisplayText = () => {
    if (folderName) {
      return folderName;
    }
    if (selectedFolder) {
      return selectedFolder.label;
    }
    return '폴더를 선택해주세요';
  };

  const hasSelection = !!(folderId || folderName);

  const handleNext = () => {
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const isValid = isStepValid();

  return {
    isValid,
    onNext: handleNext,
    onPrevious: handlePrevious,

    isOpen,
    setIsOpen,

    newFolderMode,
    newFolderName,
    setNewFolderName,

    selectedFolder,
    hasSelection,
    isLoading,
    FOLDER_OPTIONS,

    handleFolderSelect,
    handleNewFolderClick,
    handleNewFolderSubmit,
    handleNewFolderBlur,
    getDisplayText,
  };
};
