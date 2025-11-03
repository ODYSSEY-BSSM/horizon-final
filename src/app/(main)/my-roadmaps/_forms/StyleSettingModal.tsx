'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import RoadmapThumbnail from '../_components/RoadmapThumbnail';

export interface StyleSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { color: string; icon: string }) => void;
}

type ColorOption = {
  name: string;
  value: string;
  gradient: string;
};

type IconOption = {
  name: string;
  value: string;
};

const colorOptions: ColorOption[] = [
  { name: 'Red', value: 'red', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' },
  { name: 'Blue', value: 'blue', gradient: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)' },
  { name: 'Green', value: 'green', gradient: 'linear-gradient(135deg, #50c878 0%, #45b049 100%)' },
  {
    name: 'Purple',
    value: 'purple',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
];

const iconOptions: IconOption[] = [
  { name: 'Language', value: 'language' },
  { name: 'Code', value: 'code' },
  { name: 'School', value: 'school' },
  { name: 'Business', value: 'business' },
  { name: 'Science', value: 'science' },
  { name: 'Design', value: 'palette' },
];

const StyleSettingModal = ({ isOpen, onClose, onSubmit }: StyleSettingModalProps) => {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].value);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ color: selectedColor, icon: selectedIcon });
  };

  const handleBack = () => {
    // TODO: Navigate to previous step
  };

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <StyledHeader>
          <StyledHeaderTop>
            <StyledBackButton onClick={handleBack}>
              <Icon
                name="arrow_left_alt"
                variant="MD"
                color={tokens.colors.neutral[600]}
                decorative
              />
            </StyledBackButton>
            <StyledCloseButton onClick={onClose}>
              <Icon name="close" variant="MD" color={tokens.colors.neutral[600]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <StyledHeaderContent>
            <Text as="h3" variant="H3" color={tokens.colors.neutral[800]}>
              로드맵 스타일
            </Text>
            <Text as="p" variant="B2" color={tokens.colors.neutral[600]}>
              로드맵 보기용 스타일을 지정해주세요.
            </Text>
          </StyledHeaderContent>
        </StyledHeader>

        <StyledForm onSubmit={handleSubmit}>
          <StyledPreviewSection>
            <RoadmapThumbnail
              gradient={colorOptions.find((c) => c.value === selectedColor)?.gradient}
              iconName={selectedIcon}
            />
          </StyledPreviewSection>

          <StyledStyleOptions>
            <StyledColorSection>
              <StyledLabel>
                <Text as="label" variant="B1" color={tokens.colors.neutral[700]}>
                  색상
                </Text>
              </StyledLabel>
              <StyledColorGrid>
                {colorOptions.map((color) => (
                  <StyledColorOption
                    key={color.value}
                    $gradient={color.gradient}
                    $selected={selectedColor === color.value}
                    onClick={() => setSelectedColor(color.value)}
                  >
                    {selectedColor === color.value && (
                      <StyledCheckIcon>
                        <Icon name="check" variant="SM" color={tokens.colors.white} decorative />
                      </StyledCheckIcon>
                    )}
                  </StyledColorOption>
                ))}
              </StyledColorGrid>
            </StyledColorSection>

            <StyledIconSection>
              <StyledLabel>
                <Text as="label" variant="B1" color={tokens.colors.neutral[700]}>
                  아이콘
                </Text>
              </StyledLabel>
              <StyledIconGrid>
                {iconOptions.map((iconOption) => (
                  <StyledIconOption
                    key={iconOption.value}
                    $selected={selectedIcon === iconOption.value}
                    onClick={() => setSelectedIcon(iconOption.value)}
                  >
                    <Icon
                      name={iconOption.value as any}
                      variant="MD"
                      color={tokens.colors.neutral[600]}
                      decorative
                    />
                  </StyledIconOption>
                ))}
              </StyledIconGrid>
            </StyledIconSection>
          </StyledStyleOptions>

          <StyledActions>
            <StyledSubmitButton type="submit">
              <Text as="span" variant="B1" color={tokens.colors.white}>
                완료
              </Text>
            </StyledSubmitButton>
          </StyledActions>
        </StyledForm>
      </StyledModal>
    </StyledOverlay>
  );
};

export default StyleSettingModal;

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

const StyledBackButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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

const StyledPreviewSection = styled.div`
  margin-bottom: ${tokens.spacing.large};
`;

const StyledStyleOptions = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  margin-bottom: ${tokens.spacing.xlarge};
`;

const StyledColorSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledIconSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

const StyledLabel = styled.div`
  margin-bottom: ${tokens.spacing.xsmall};
`;

const StyledColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${tokens.spacing.xsmall};
`;

const StyledColorOption = styled.button<{ $gradient: string; $selected: boolean }>`
  width: 100%;
  height: 60px;
  border: 2px solid ${({ $selected }) => ($selected ? tokens.colors.primary[500] : 'transparent')};
  border-radius: ${tokens.radius.medium};
  background: ${({ $gradient }) => $gradient};
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCheckIcon = styled.div`
  width: 20px;
  height: 20px;
`;

const StyledIconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${tokens.spacing.xsmall};
`;

const StyledIconOption = styled.button<{ $selected: boolean }>`
  width: 100%;
  height: 60px;
  border: 2px solid ${({ $selected }) => ($selected ? tokens.colors.primary[500] : tokens.colors.neutral[200])};
  border-radius: ${tokens.radius.medium};
  background: ${tokens.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
