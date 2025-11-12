'use client';

import styled from '@emotion/styled';
import { useEffect, useId, useMemo, useState } from 'react';
import { tokens } from '@/shared/tokens';
import { Button, Icon, Text, TextField } from '@/shared/ui';
import {
  StyledCloseButton,
  StyledDivider,
  StyledModalContainer,
  StyledOverlay as BaseStyledOverlay,
} from '@/shared/ui/Modal/Modal.styles';

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName?: string;
  inviteCode?: string;
  onCopy?: (code: string) => void;
  onComplete?: () => void;
}

const DEFAULT_INVITE_CODE = '1Q2W3E4R';

export const InviteTeamModal = ({
  isOpen,
  onClose,
  teamName,
  inviteCode,
  onCopy,
  onComplete,
}: InviteTeamModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const resolvedInviteCode = useMemo(() => {
    if (inviteCode && inviteCode.trim().length > 0) {
      return inviteCode.trim();
    }

    if (!teamName) {
      return DEFAULT_INVITE_CODE;
    }

    const normalized = teamName.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
    if (normalized.length >= 8) {
      return normalized.slice(0, 8);
    }

    return (normalized + DEFAULT_INVITE_CODE).slice(0, 8);
  }, [inviteCode, teamName]);

  useEffect(() => {
    if (!isOpen) {
      setCopyState('idle');
    }
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedInviteCode);
      setCopyState('copied');
      onCopy?.(resolvedInviteCode);
    } catch {
      setCopyState('idle');
    }
  };

  const handleComplete = () => {
    onComplete?.();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <StyledOverlay role="presentation" onClick={onClose}>
      <StyledModal
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
        $width="480px"
      >
        <StyledHeader>
          <StyledHeaderTop>
            <Text id={titleId} as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              팀 초대
            </Text>
            <StyledCloseButton type="button" aria-label="닫기" onClick={onClose}>
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text id={descriptionId} as="p" variant="B1" color={tokens.colors.neutral[600]}>
            초대 코드는 유지되며, 이후에 초대할 수 있습니다.
          </Text>
        </StyledHeader>
        <StyledDivider />
        <StyledContent>
          <StyledCodeSection>
            <StyledTextField label="참가 코드" value={resolvedInviteCode} readOnly width="100%" />
            <StyledCopyButton
              size="large"
              type="button"
              onClick={handleCopy}
              aria-label="초대 코드 복사하기"
            >
              {copyState === 'copied' ? '복사 완료' : '복사하기'}
            </StyledCopyButton>
          </StyledCodeSection>
          <StyledActions>
            <StyledCompleteButton size="medium" type="button" onClick={handleComplete}>
              완료
            </StyledCompleteButton>
          </StyledActions>
        </StyledContent>
      </StyledModal>
    </StyledOverlay>
  );
};

const StyledOverlay = styled(BaseStyledOverlay)`
  padding: ${tokens.spacing.large};
`;

const StyledModal = styled(StyledModalContainer)`
  border: 1px solid ${tokens.colors.neutral[200]};
  box-shadow: ${tokens.shadow[0]};
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: ${tokens.spacing.xxlarge} ${tokens.spacing.xxlarge} 0;
`;

const StyledHeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: ${tokens.spacing.xxlarge};
`;

const StyledCodeSection = styled.div`
  display: flex;
  gap: ${tokens.spacing.small};
  align-items: flex-end;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
`;

const StyledActionButton = styled(Button)`
  && {
    border-radius: ${tokens.radius.medium};
    font-weight: ${tokens.typos.fontWeight.semibold};
  }
`;

const StyledCopyButton = styled(StyledActionButton)`
  && {
    min-width: 104px;
    height: 48px;
    padding: 0 ${tokens.spacing.large};
  }
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const StyledCompleteButton = styled(StyledActionButton)`
  && {
    min-width: 80px;
    height: 40px;
    padding: 0 ${tokens.spacing.medium};
  }
`;
