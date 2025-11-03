'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { VIEW_MODE_OPTIONS } from '../_constants/viewModes.constants';
import type { ViewMode } from '../_types';

interface ViewToggleProps {
  activeMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

const ViewToggle = ({ activeMode, onModeChange, className }: ViewToggleProps) => {
  return (
    <StyledContainer className={className}>
      {VIEW_MODE_OPTIONS.map((option) => {
        const isActive = option.id === activeMode;
        return (
          <StyledButton
            key={option.id}
            onClick={() => onModeChange(option.id)}
            $isActive={isActive}
            type="button"
          >
            <Icon
              icon={option.icon}
              size={24}
              color={isActive ? tokens.colors.black : tokens.colors.neutral[600]}
            />
            <Text
              variant="B1"
              color={isActive ? tokens.colors.neutral[800] : tokens.colors.neutral[600]}
            >
              {option.label}
            </Text>
          </StyledButton>
        );
      })}
    </StyledContainer>
  );
};

export default ViewToggle;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${tokens.colors.neutral[100]};
  border-radius: 8px;
  padding: 4px;
  gap: 0;
`;

const StyledButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 16px;
  height: 32px;
  background-color: ${({ $isActive }) => ($isActive ? tokens.colors.white : 'transparent')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? tokens.colors.white : tokens.colors.neutral[200]};
  }
`;
