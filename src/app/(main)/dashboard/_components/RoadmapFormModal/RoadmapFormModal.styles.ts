import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export const ModalBackdrop = styled.div`
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

export const ModalContainer = styled.div<{ $height?: string }>`
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

export const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  padding: ${tokens.spacing.xxlarge};
  padding-bottom: ${tokens.spacing.large};
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

export const CloseButton = styled.button`
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

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${tokens.colors.neutral[200]};
`;

export const FormContent = styled.div`
  padding: 0 ${tokens.spacing.xxlarge};
  padding-bottom: ${tokens.spacing.large};
  flex: 1;
  overflow: visible;
`;

export const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${tokens.spacing.large};
  padding: ${tokens.spacing.xxlarge};
  padding-top: ${tokens.spacing.large};
`;

export const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  width: 100%;
  position: relative;
  z-index: 1;
  flex: 1;
`;

export const DropdownHeader = styled.button<{ $isOpen: boolean }>`
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

export const DropdownList = styled.div<{ $isOpen: boolean }>`
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

export const DropdownOption = styled.button<{ $highlighted?: boolean }>`
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

export const NewOptionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

export const StyleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
`;

export const ThumbnailPreview = styled.div<{ $color: string }>`
  width: 100%;
  height: 148px;
  border-radius: ${tokens.radius.medium};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const ThumbnailIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${tokens.radius.medium};
`;

export const StyleSelectors = styled.div`
  display: flex;
  gap: ${tokens.spacing.medium};
  width: 100%;
`;

export const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${tokens.spacing.small};
  padding: ${tokens.spacing.medium};
`;

export const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
  padding: ${tokens.spacing.small};
  background-color: ${tokens.colors.white};
  border: ${({ $selected }) =>
    $selected
      ? `2px solid ${tokens.colors.primary[500]}`
      : `1px solid ${tokens.colors.neutral[200]}`};
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${tokens.colors.primary[500]};
  }
`;

export const ColorSwatch = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${tokens.radius.small};
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${tokens.spacing.small};
  padding: ${tokens.spacing.medium};
  max-height: 280px;
  overflow-y: auto;
`;

export const IconOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  background-color: ${tokens.colors.white};
  border: ${({ $selected }) =>
    $selected
      ? `2px solid ${tokens.colors.primary[500]}`
      : `1px solid ${tokens.colors.neutral[200]}`};
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${tokens.colors.primary[500]};
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;
