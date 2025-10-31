'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

export interface FolderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

const FolderCreateModal = ({ isOpen, onClose, onSubmit }: FolderCreateModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H3" color={tokens.colors.neutral[800]}>
              폴더 생성
            </Text>
            <StyledCloseButton onClick={onClose}>
              <Icon name="close" variant="MD" color={tokens.colors.neutral[600]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <StyledHeaderContent>
            <Text as="h3" variant="H3" color={tokens.colors.neutral[800]}>
              폴더 정보
            </Text>
            <Text as="p" variant="B2" color={tokens.colors.neutral[600]}>
              추가할 폴더의 정보를 입력해주세요.
            </Text>
          </StyledHeaderContent>
        </StyledHeader>

        <StyledForm onSubmit={handleSubmit}>
          <StyledFormFields>
            <StyledTextField>
              <StyledLabel>
                <Text as="label" variant="B1" color={tokens.colors.neutral[700]}>
                  폴더 이름
                </Text>
              </StyledLabel>
              <StyledInput
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="폴더 이름을 입력하세요"
                required
              />
            </StyledTextField>

            <StyledTextField>
              <StyledLabel>
                <Text as="label" variant="B1" color={tokens.colors.neutral[700]}>
                  설명
                </Text>
              </StyledLabel>
              <StyledTextArea
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="폴더 설명을 입력하세요"
                rows={3}
              />
            </StyledTextField>
          </StyledFormFields>

          <StyledActions>
            <StyledSubmitButton type="submit">
              <Text as="span" variant="B1" color={tokens.colors.white}>
                생성하기
              </Text>
            </StyledSubmitButton>
          </StyledActions>
        </StyledForm>
      </StyledModal>
    </StyledOverlay>
  );
};

export default FolderCreateModal;

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
  overflow: auto;
`;

const StyledHeader = styled.div`
  padding: ${tokens.spacing.xlarge};
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
`;

const StyledHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.large};
`;

const StyledCloseButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledForm = styled.form`
  padding: ${tokens.spacing.xlarge};
`;

const StyledFormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
  margin-bottom: ${tokens.spacing.xlarge};
`;

const StyledTextField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledLabel = styled.div`
  margin-bottom: ${tokens.spacing.xxsmall};
`;

const StyledInput = styled.input`
  padding: ${tokens.spacing.medium};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  font-size: 14px;
  line-height: 20px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary[500]};
  }

  &::placeholder {
    color: ${tokens.colors.neutral[400]};
  }
`;

const StyledTextArea = styled.textarea`
  padding: ${tokens.spacing.medium};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  font-size: 14px;
  line-height: 20px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary[500]};
  }

  &::placeholder {
    color: ${tokens.colors.neutral[400]};
  }
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${tokens.spacing.medium};
`;

const StyledSubmitButton = styled.button`
  padding: ${tokens.spacing.medium} ${tokens.spacing.large};
  background-color: ${tokens.colors.primary[500]};
  border: none;
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.primary[600]};
  }
`;
