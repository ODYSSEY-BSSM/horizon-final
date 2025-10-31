'use client';

import { type KeyboardEvent, useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import type { FormStepProps } from '@/lib/types/modal';
import { tokens } from '@/shared/tokens';
import { FOLDER_OPTIONS } from '../RoadmapFormModal.constants';
import {
  DropdownContainer,
  DropdownHeader,
  DropdownList,
  DropdownOption,
  NewOptionIcon,
} from '../RoadmapFormModal.styles';

const FolderStep: React.FC<FormStepProps> = ({ data, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFolderMode, setNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const selectedFolder = data.folderId
    ? FOLDER_OPTIONS.find((option) => option.id === data.folderId)
    : null;

  const handleFolderSelect = (folderId: string) => {
    onUpdate({ folderId, folderName: undefined });
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
      onUpdate({
        folderId: undefined,
        folderName: newFolderName.trim(),
      });
      setNewFolderMode(false);
      setNewFolderName('');
    } else if (e.key === 'Escape') {
      setNewFolderMode(false);
      setNewFolderName('');
    }
  };

  const getDisplayText = () => {
    if (data.folderName) {
      return data.folderName;
    }
    if (selectedFolder) {
      return selectedFolder.label;
    }
    return '폴더를 선택해주세요';
  };

  const hasSelection = !!(data.folderId || data.folderName);

  return (
    <DropdownContainer>
      <Text as="label" variant="B1" color={tokens.colors.neutral[500]}>
        폴더
      </Text>

      {newFolderMode ? (
        <TextField
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onKeyDown={handleNewFolderSubmit}
          onBlur={() => {
            if (newFolderName.trim()) {
              onUpdate({
                folderId: undefined,
                folderName: newFolderName.trim(),
              });
            }
            setNewFolderMode(false);
            setNewFolderName('');
          }}
          placeholder="새 폴더 이름을 입력하세요"
          // autoFocus is needed for immediate user input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      ) : (
        <div style={{ position: 'relative' }}>
          <DropdownHeader
            $isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="폴더 선택"
            aria-expanded={isOpen}
          >
            <Text
              as="span"
              variant="B1"
              color={hasSelection ? tokens.colors.neutral[800] : tokens.colors.neutral[400]}
            >
              {getDisplayText()}
            </Text>
            <Icon
              name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
              variant="SM"
              color={tokens.colors.neutral[400]}
              decorative
            />
          </DropdownHeader>

          <DropdownList $isOpen={isOpen}>
            <DropdownOption onClick={handleNewFolderClick}>
              <NewOptionIcon>
                <Icon name="add" variant="SM" color={tokens.colors.neutral[600]} decorative />
              </NewOptionIcon>
              <Text as="span" variant="B1" color={tokens.colors.neutral[600]}>
                새 폴더
              </Text>
            </DropdownOption>

            {FOLDER_OPTIONS.map((option) => (
              <DropdownOption
                key={option.id}
                onClick={() => handleFolderSelect(option.id)}
                $highlighted={data.folderId === option.id}
              >
                <Text as="span" variant="B1" color={tokens.colors.neutral[600]}>
                  {option.label}
                </Text>
              </DropdownOption>
            ))}
          </DropdownList>
        </div>
      )}
    </DropdownContainer>
  );
};

export default FolderStep;
