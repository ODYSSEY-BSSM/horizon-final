import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export const StyledModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const StyledModalContainer = styled.div<{ $height?: string }>`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  position: relative;
  box-shadow: ${tokens.shadow[0]};
  width: 560px;
  height: ${({ $height }) => $height || 'auto'};
  min-height: 366px;
  max-height: 90vh;
  overflow: visible;
`;

export const StyledFormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  padding: ${tokens.spacing.xxlarge};
  padding-bottom: ${tokens.spacing.large};
`;

export const StyledHeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

export const StyledCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${tokens.radius.small};
  }
`;

export const StyledDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${tokens.colors.neutral[200]};
`;

export const StyledFormContent = styled.div`
  padding: 0 ${tokens.spacing.xxlarge};
  padding-bottom: ${tokens.spacing.large};
  flex: 1;
  overflow: visible;
`;

export const StyledFormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${tokens.spacing.large};
  padding: ${tokens.spacing.xxlarge};
  padding-top: ${tokens.spacing.large};
`;

export const StyledDropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  width: 100%;
  position: relative;
  z-index: 1;
  flex: 1;
`;

export const StyledDropdownHeader = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${tokens.colors.white};
  border: ${({ $isOpen }) =>
    $isOpen
      ? `2px solid ${tokens.colors.primary[500]}`
      : `1px solid ${tokens.colors.neutral[300]}`};
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${tokens.colors.primary[500]};
  }

  &:focus-visible {
    outline: none;
    border-color: ${tokens.colors.primary[500]};
  }
`;

export const StyledDropdownList = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  box-shadow: ${tokens.shadow[0]};
  z-index: 1001;
  max-height: 240px;
  overflow-y: auto;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

export const StyledDropdownOption = styled.button<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  width: 100%;
  height: 48px;
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${({ $highlighted }) =>
    $highlighted ? tokens.colors.neutral[100] : tokens.colors.white};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: -2px;
  }
`;

export const StyledNewOptionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

export const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

export const StyledStyleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

export const StyledThumbnailPreview = styled.div<{ $color: string }>`
  width: 100%;
  height: 148px;
  border-radius: ${tokens.radius.medium};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const StyledThumbnailIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${tokens.radius.medium};
`;

export const StyledStyleSelectors = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  width: 100%;
`;

export const StyledColorGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
`;

export const StyledColorOption = styled.button<{ $color: string; $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  height: 48px;
  padding: ${tokens.spacing.small} ${tokens.spacing.small};
  background-color: ${tokens.colors.white};
  border: none;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  ${({ $selected }) =>
    $selected &&
    `
    background-color: ${tokens.colors.primary[100]};
    color: ${tokens.colors.primary[500]};
  `}
`;

export const StyledColorSwatch = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const StyledIconGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  max-height: 264px;
  overflow-y: auto;
`;

export const StyledIconOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  height: 48px;
  padding: ${tokens.spacing.small};
  background-color: ${tokens.colors.white};
  border: none;
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  ${({ $selected }) =>
    $selected &&
    `
    background-color: ${tokens.colors.primary[100]};
    color: ${tokens.colors.primary[500]};
  `}
`;

export const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
`;
