import { type KeyboardEvent, useState } from 'react';
import { FOLDER_OPTIONS } from '../_constants/RoadmapFormModal.constants';
import { useFolderStepForm } from './useRoadmapForm';

export const useFolderStep = () => {
  const {
    watch,
    setValue,
    onNext,
    formState: { isValid },
  } = useFolderStepForm();

  const [isOpen, setIsOpen] = useState(false);
  const [newFolderMode, setNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const folderId = watch('folderId');
  const folderName = watch('folderName');

  const selectedFolder = folderId ? FOLDER_OPTIONS.find((option) => option.id === folderId) : null;

  const handleFolderSelect = (selectedFolderId: string) => {
    setValue('folderId', selectedFolderId);
    setValue('folderName', undefined);
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
      setValue('folderId', undefined);
      setValue('folderName', newFolderName.trim());
      setNewFolderMode(false);
      setNewFolderName('');
    } else if (e.key === 'Escape') {
      setNewFolderMode(false);
      setNewFolderName('');
    }
  };

  const handleNewFolderBlur = () => {
    if (newFolderName.trim()) {
      setValue('folderId', undefined);
      setValue('folderName', newFolderName.trim());
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

  return {
    // Form state
    isValid,
    onNext,

    // Dropdown state
    isOpen,
    setIsOpen,

    // New folder state
    newFolderMode,
    newFolderName,
    setNewFolderName,

    // Data
    selectedFolder,
    hasSelection,

    // Handlers
    handleFolderSelect,
    handleNewFolderClick,
    handleNewFolderSubmit,
    handleNewFolderBlur,
    getDisplayText,
  };
};
