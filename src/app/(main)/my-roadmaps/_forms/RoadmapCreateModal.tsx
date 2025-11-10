'use client';

import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/shared/ui';
import { Icon } from '@/shared/ui';
import { Text } from '@/shared/ui';
import { TextField } from '@/shared/ui';
import { tokens } from '@/shared/tokens';

export interface RoadmapCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void | Promise<void>;
}

const RoadmapCreateModal = ({ isOpen, onClose, onSubmit }: RoadmapCreateModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: '', description: '' });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      titleRef.current?.focus();
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
              로드맵 정보
            </Text>
            <StyledCloseButton onClick={onClose} type="button">
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
            로드맵 정보를 작성해주세요.
          </Text>
        </StyledHeader>

        <StyledDivider />

        <StyledForm onSubmit={handleSubmit}>
          <StyledFormFields>
            <TextField
              ref={titleRef}
              label="이름"
              type="text"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="이름을 입력해주세요"
              required
            />
            <TextField
              label="설명"
              type="text"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="설명을 입력해주세요"
            />
          </StyledFormFields>

          <StyledActions>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              disabled={!formData.title.trim()}
            >
              다음
            </Button>
          </StyledActions>
        </StyledForm>
      </StyledModal>
    </StyledOverlay>
  );
};

export default RoadmapCreateModal;

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
