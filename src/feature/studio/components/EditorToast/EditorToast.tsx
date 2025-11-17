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
    <Container $type={type}>
      <Content $hasDescription={hasDescription}>
        <Icon className="material-symbols-rounded" $type={type}>
          {isSuccess ? 'check_circle' : 'cancel'}
        </Icon>
        <TextSection>
          <TitleRow>
            <Title>{title}</Title>
            <CloseButton onClick={onClose} aria-label="닫기">
              <span className="material-symbols-rounded">close</span>
            </CloseButton>
          </TitleRow>
          {hasDescription && <Description>{description}</Description>}
        </TextSection>
      </Content>
    </Container>
  );
};

const Container = styled.div<{ $type: ToastType }>`
  width: 320px;
  padding: 12px 20px;
  background-color: ${tokens.colors.white};
  border-left: 3px solid
    ${(props) => (props.$type === 'success' ? tokens.colors.primary : '#ff0000')};
  border-radius: ${tokens.radius.xs};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div<{ $hasDescription: boolean }>`
  display: flex;
  gap: 12px;
  align-items: ${(props) => (props.$hasDescription ? 'flex-start' : 'center')};
  width: 100%;
`;

const Icon = styled.span<{ $type: ToastType }>`
  font-size: 32px;
  color: ${(props) => (props.$type === 'success' ? tokens.colors.primary : '#ff0000')};
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 40;
  flex-shrink: 0;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};
  flex: 1;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${tokens.spacing.sm};
`;

const Title = styled.p`
  font-family: ${tokens.typography.fontFamily.suit};
  font-size: 18px;
  font-weight: ${tokens.typography.fontWeight.semiBold};
  line-height: 26px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const Description = styled.p`
  font-family: ${tokens.typography.fontFamily.suit};
  font-size: 16px;
  font-weight: ${tokens.typography.fontWeight.regular};
  line-height: 24px;
  color: ${tokens.colors.neutral[600]};
  margin: 0;
  width: 100%;
`;

const CloseButton = styled.button`
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
