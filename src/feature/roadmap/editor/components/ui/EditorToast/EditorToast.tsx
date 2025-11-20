'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export type ToastType = 'success' | 'failed';

export interface EditorToastProps {
  title: string;
  description?: string;
  type?: ToastType;
  onClose?: () => void;
}

export const EditorToast = ({
  title,
  description,
  type = 'success',
  onClose,
}: EditorToastProps) => {
  const hasDescription = !!description;
  const isSuccess = type === 'success';

  return (
    <StyledContainer $type={type}>
      <StyledContent $hasDescription={hasDescription}>
        <StyledIcon className="material-symbols-rounded" $type={type}>
          {isSuccess ? 'check_circle' : 'cancel'}
        </StyledIcon>
        <StyledTextSection>
          <StyledTitleRow>
            <StyledTitle>{title}</StyledTitle>
            <StyledCloseButton onClick={onClose} aria-label="닫기">
              <span className="material-symbols-rounded">close</span>
            </StyledCloseButton>
          </StyledTitleRow>
          {hasDescription && <StyledDescription>{description}</StyledDescription>}
        </StyledTextSection>
      </StyledContent>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $type: ToastType }>`
  width: 320px;
  padding: 12px 20px;
  background-color: ${tokens.colors.white};
  border-left: 3px solid
    ${(props) => (props.$type === 'success' ? tokens.colors.primary : tokens.colors.error[200])};
  border-radius: ${tokens.radius.extraSmall};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledContent = styled.div<{ $hasDescription: boolean }>`
  display: flex;
  gap: 12px;
  align-items: ${(props) => (props.$hasDescription ? 'flex-start' : 'center')};
  width: 100%;
`;

const StyledIcon = styled.span<{ $type: ToastType }>`
  font-size: 32px;
  color: ${(props) => (props.$type === 'success' ? tokens.colors.primary : tokens.colors.error[200])};
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 40;
  flex-shrink: 0;
`;

const StyledTextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  flex: 1;
  min-width: 0;
`;

const StyledTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${tokens.spacing.small};
`;

const StyledTitle = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-size: 18px;
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: 26px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const StyledDescription = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-size: 16px;
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: 24px;
  color: ${tokens.colors.neutral[600]};
  margin: 0;
  width: 100%;
`;

const StyledCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${tokens.colors.neutral[900]};
  flex-shrink: 0;

  .material-symbols-rounded {
    font-size: 20px;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }

  &:hover {
    opacity: 0.7;
  }
`;
