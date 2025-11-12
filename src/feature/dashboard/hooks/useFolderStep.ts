import { useQuery } from '@tanstack/react-query';
import { type KeyboardEvent, useState } from 'react';
import { folderApi } from '@/feature/folder/api/folderApi';
import { useFolderStepForm } from './useRoadmapForm';

export const useFolderStep = () => {
  const form = useFolderStepForm();
  const {
    watch,
    setValue,
    onNext,
    formState: { isValid },
  } = form;

  // 개인 디렉토리 목록 조회
  const { data: rootContent, isLoading } = useQuery({
    queryKey: ['directories'],
    queryFn: folderApi.getDirectories,
    staleTime: 1000 * 60 * 5, // 5분
  });

  const [isOpen, setIsOpen] = useState(false);
  const [newFolderMode, setNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const folderId = watch('folderId');
  const folderName = watch('folderName');

  // API 데이터를 드롭다운 옵션 형식으로 변환 (Swagger 구조 사용)
  const directories = rootContent?.directories || [];
  const FOLDER_OPTIONS = directories.map((dir) => ({
    id: String(dir.id),
    label: dir.name,
    value: String(dir.id),
  }));

  const selectedFolder = folderId ? FOLDER_OPTIONS.find((option) => option.id === folderId) : null;

  const handleFolderSelect = (selectedFolderId: string) => {
    setValue('folderId', selectedFolderId, { shouldValidate: true });
    setValue('folderName', '', { shouldValidate: true });
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
      setValue('folderId', undefined, { shouldValidate: true });
      setValue('folderName', newFolderName.trim(), { shouldValidate: true });
      setNewFolderMode(false);
      setNewFolderName('');
    } else if (e.key === 'Escape') {
      setNewFolderMode(false);
      setNewFolderName('');
    }
  };

  const handleNewFolderBlur = () => {
    if (newFolderName.trim()) {
      setValue('folderId', undefined, { shouldValidate: true });
      setValue('folderName', newFolderName.trim(), { shouldValidate: true });
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
    isLoading,
    FOLDER_OPTIONS,

    // Handlers
    handleFolderSelect,
    handleNewFolderClick,
    handleNewFolderSubmit,
    handleNewFolderBlur,
    getDisplayText,
  };
};
