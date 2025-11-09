'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/shared/tokens';

export interface TeamJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inviteCode: string) => void;
}

const TeamJoinModal = ({ isOpen, onClose, onSubmit }: TeamJoinModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setInviteCode('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inviteCode);
  };

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              팀 참여하기
            </Text>
            <StyledCloseButton onClick={onClose} type="button">
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
            초대코드를 입력하여 팀에 참여하세요.
          </Text>
        </StyledHeader>

        <StyledDivider />

        <StyledForm onSubmit={handleSubmit}>
          <StyledFormFields>
            <TextField
              ref={inputRef}
              label="초대 코드"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="초대 코드를 입력해주세요"
              required
            />
          </StyledFormFields>

          <StyledActions>
            <Button type="submit" variant="contained" size="medium" disabled={!inviteCode.trim()}>
              참여하기
            </Button>
          </StyledActions>
        </StyledForm>
      </StyledModal>
    </StyledOverlay>
  );
};

export default TeamJoinModal;

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
  width: 560px;
  max-width: 90vw;
  max-height: 90vh;
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

const StyledForm = styled.form`
  padding: ${tokens.spacing.xlarge};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xlarge};
`;

const StyledFormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;
