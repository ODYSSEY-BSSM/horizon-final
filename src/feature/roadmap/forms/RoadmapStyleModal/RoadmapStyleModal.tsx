'use client';

import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import type { ColorOption, IconOption } from '@/feature/roadmap';
import { ColorDropdown, IconDropdown, RoadmapThumbnail } from '@/feature/roadmap';
import { tokens } from '@/shared/tokens';
import { Button, Icon, Text } from '@/shared/ui';

export interface RoadmapStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { color: ColorOption; icon: IconOption }) => void;
  onBack: () => void;
}

const RoadmapStyleModal = ({ isOpen, onClose, onSubmit, onBack }: RoadmapStyleModalProps) => {
  const [formData, setFormData] = useState<{ color: ColorOption; icon: IconOption }>({
    color: 'red',
    icon: 'language',
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({ color: 'red', icon: 'language' });
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

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
              로드맵 스타일
            </Text>
            <StyledCloseButton onClick={onClose} type="button">
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
            로드맵 스타일을 지정해주세요.
          </Text>
        </StyledHeader>

        <StyledDivider />

        <StyledForm onSubmit={handleSubmit}>
          <StyledPreviewSection>
            <RoadmapThumbnail color={formData.color} icon={formData.icon} />
          </StyledPreviewSection>

          <StyledDropdownRow>
            <ColorDropdown
              value={formData.color}
              onChange={(color) => setFormData((prev) => ({ ...prev, color }))}
            />
            <IconDropdown
              value={formData.icon}
              onChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
            />
          </StyledDropdownRow>

          <StyledActions>
            <Button type="button" variant="outlined" size="medium" onClick={onBack}>
              이전
            </Button>
            <Button type="submit" variant="contained" size="medium">
              완료
            </Button>
          </StyledActions>
        </StyledForm>
      </StyledModal>
    </StyledOverlay>
  );
};

export default RoadmapStyleModal;

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
  overflow: visible;
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
  gap: ${tokens.spacing.large};
  overflow: visible;
`;

const StyledPreviewSection = styled.div`
  width: 100%;
`;

const StyledDropdownRow = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  width: 100%;
  overflow: visible;
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${tokens.spacing.medium};
`;
