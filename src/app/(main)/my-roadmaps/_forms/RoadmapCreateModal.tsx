'use client';

import styled from '@emotion/styled';
import { useEffect, useId, useRef, useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
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
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const modalTitleId = useId();

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Promise.resolve(onSubmit(formData))
      .then(() => {
        setFormData({ title: '', description: '' });
        onClose();
      })
      .catch(() => {
        // NOTE: 실패 시 별도 에러 처리는 기획상 불필요하여 비워둠
      });
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
      >
        <StyledHeader>
          <StyledHeaderTop>
            <Text as="h2" variant="H3" color={tokens.colors.neutral[800]} id={modalTitleId}>
              로드맵 생성
            </Text>
            <StyledCloseButton onClick={onClose}>
              <Icon name="close" variant="MD" color={tokens.colors.neutral[600]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <StyledHeaderContent>
            <Text as="h3" variant="H3" color={tokens.colors.neutral[800]}>
              로드맵 정보
            </Text>
            <Text as="p" variant="B2" color={tokens.colors.neutral[600]}>
              추가할 로드맵의 정보를 입력해주세요.
            </Text>
          </StyledHeaderContent>
        </StyledHeader>
        <StyledForm onSubmit={handleSubmit}>
          <StyledFormFields>
            <StyledTextField>
              <StyledLabel>
                <Text as="label" variant="B1" color={tokens.colors.neutral[700]}>
                  로드맵 제목
                </Text>
              </StyledLabel>
              <StyledTextArea
                ref={titleRef}
                value={formData.title}
                onChange={handleChange('title')}
                placeholder="로드맵 제목을 입력하세요"
                rows={3}
                required
              />
            </StyledTextField>

            <StyledTextField>
              <StyledLabel>
                <Text as="label" variant="B1" color={tokens.colors.neutral[700]}>
                  설명 (선택)
                </Text>
              </StyledLabel>
              <StyledInput
                type="text"
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="로드맵 설명을 입력하세요"
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
  min-height: 112px;
  
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
