'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import TextField from '@/components/common/TextField/TextField';
import { tokens } from '@/shared/tokens';

export interface TeamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

const TeamCreateModal = ({ isOpen, onClose, onSubmit }: TeamCreateModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', description: '' });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      nameRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              팀 정보
            </Text>
            <StyledCloseButton onClick={onClose} type="button">
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
            생성할 팀의 정보를 입력해주세요.
          </Text>
        </StyledHeader>

        <StyledDivider />

        <StyledForm onSubmit={handleSubmit}>
          <StyledFormFields>
            <TextField
              ref={nameRef}
              label="팀 이름"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="팀 이름을 작성해주세요"
              required
            />
            <TextField
              label="팀 설명"
              type="text"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="팀 설명을 작성해주세요"
            />
          </StyledFormFields>

          <StyledActions>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              disabled={!formData.name.trim()}
            >
              완료
            </Button>
          </StyledActions>
        </StyledForm>
      </StyledModal>
    </StyledOverlay>
  );
};

export default TeamCreateModal;

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
