'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Button, Icon, Text } from '@/shared/ui';

export interface TeamFolderDeleteModalProps {
  isOpen: boolean;
  folderName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const TeamFolderDeleteModal = ({
  isOpen,
  folderName,
  onClose,
  onConfirm,
}: TeamFolderDeleteModalProps) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              폴더 삭제
            </Text>
            <StyledCloseButton onClick={onClose} type="button">
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
        </StyledHeader>

        <StyledDivider />

        <StyledContent>
          <Text as="p" variant="B1" color={tokens.colors.neutral[700]}>
            <StyledFolderName>&quot;{folderName}&quot;</StyledFolderName> 폴더를 삭제하시겠습니까?
          </Text>
          <Text as="p" variant="B2" color={tokens.colors.neutral[600]}>
            이 작업은 되돌릴 수 없습니다.
          </Text>

          <StyledActions>
            <Button variant="outlined" size="medium" onClick={onClose}>
              취소
            </Button>
            <Button variant="contained" size="medium" onClick={handleConfirm}>
              삭제
            </Button>
          </StyledActions>
        </StyledContent>
      </StyledModal>
    </StyledOverlay>
  );
};

export default TeamFolderDeleteModal;

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledModal = styled.div`
  background-color: ${tokens.colors.white};
  border-radius: ${tokens.radius.large};
  width: 480px;
  max-width: 90vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.div`
  padding: ${tokens.spacing.xlarge};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const StyledDivider = styled.div`
  height: 1px;
  background-color: ${tokens.colors.neutral[100]};
`;

const StyledContent = styled.div`
  padding: ${tokens.spacing.xlarge};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const StyledFolderName = styled.span`
  font-weight: 600;
  color: ${tokens.colors.primary[500]};
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${tokens.spacing.medium};
  margin-top: ${tokens.spacing.medium};
`;
