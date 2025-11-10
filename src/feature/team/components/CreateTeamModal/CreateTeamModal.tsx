'use client';

import styled from '@emotion/styled';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import type { Team } from '@/feature/team/types/team';
import { generateInviteCode } from '@/feature/team/utils/inviteCode';
import { tokens } from '@/shared/tokens';
import { Button, Icon, Text, TextField } from '@/shared/ui';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: { name: string }) => Team | Promise<Team>;
  onComplete?: (team: Team) => void;
}

type Step = 1 | 2;

export const CreateTeamModal = ({
  isOpen,
  onClose,
  onCreate,
  onComplete,
}: CreateTeamModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const [step, setStep] = useState<Step>(1);
  const [teamName, setTeamName] = useState('');
  const [createdTeam, setCreatedTeam] = useState<Team | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedName = useMemo(() => teamName.trim(), [teamName]);
  const isSubmitDisabled = trimmedName.length === 0;

  const resolvedInviteCode = useMemo(() => {
    if (createdTeam?.id) {
      return generateInviteCode(createdTeam.id);
    }
    if (createdTeam?.name) {
      return generateInviteCode(createdTeam.name);
    }
    return generateInviteCode(trimmedName);
  }, [createdTeam, trimmedName]);

  const resetState = useCallback(() => {
    setTeamName('');
    setStep(1);
    setCreatedTeam(null);
    setCopyState('idle');
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await Promise.resolve(onCreate({ name: trimmedName }));
      setCreatedTeam(result);
      setCopyState('idle');
      setStep(2);
    } catch (_error) {
      // TODO: 에러 토스트 또는 경고 추가
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedInviteCode);
      setCopyState('copied');
    } catch {
      setCopyState('idle');
    }
  };

  const handleComplete = () => {
    if (createdTeam) {
      onComplete?.(createdTeam);
    }
    handleClose();
  };

  if (!isOpen) {
    return null;
  }

  const title = step === 1 ? '팀 생성' : '팀 초대';
  const description =
    step === 1
      ? '생성할 팀 정보를 입력해주세요.'
      : '초대 코드는 유지되며, 이후에 초대할 수 있습니다.';

  return (
    <StyledOverlay role="presentation" onClick={handleClose}>
      <StyledModal
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <StyledHeader>
          <StyledHeaderTop>
            <Text id={titleId} as="h2" variant="H2" color={tokens.colors.neutral[800]}>
              {title}
            </Text>
            <StyledCloseButton type="button" aria-label="닫기" onClick={handleClose}>
              <Icon name="close" variant="LG" color={tokens.colors.neutral[400]} decorative />
            </StyledCloseButton>
          </StyledHeaderTop>
          <Text id={descriptionId} as="p" variant="B1" color={tokens.colors.neutral[600]}>
            {description}
          </Text>
        </StyledHeader>
        <StyledDivider />
        {step === 1 ? (
          <StyledForm onSubmit={handleSubmit}>
            <StyledFields>
              <TextField
                label="이름"
                placeholder="팀 이름을 입력해주세요"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
                width="100%"
              />
            </StyledFields>
            <StyledActions>
              <StyledNextButton
                type="submit"
                size="medium"
                disabled={isSubmitDisabled || isSubmitting}
              >
                {isSubmitting ? '생성 중...' : '다음'}
              </StyledNextButton>
            </StyledActions>
          </StyledForm>
        ) : (
          <StyledInviteContent>
            <StyledCodeSection>
              <StyledInviteTextField
                label="참가 코드"
                value={resolvedInviteCode}
                readOnly
                width="100%"
              />
              <StyledCopyButton
                type="button"
                size="large"
                onClick={handleCopy}
                aria-label="초대 코드 복사하기"
              >
                {copyState === 'copied' ? '복사 완료' : '복사하기'}
              </StyledCopyButton>
            </StyledCodeSection>
            <StyledActions>
              <StyledCompleteButton type="button" size="medium" onClick={handleComplete}>
                완료
              </StyledCompleteButton>
            </StyledActions>
          </StyledInviteContent>
        )}
      </StyledModal>
    </StyledOverlay>
  );
};

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing.large};
  z-index: 1000;
`;

const StyledModal = styled.div`
  width: 480px;
  max-width: 100%;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.large};
  box-shadow: ${tokens.shadow[0]};
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  margin-top: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: ${tokens.spacing.xxlarge};
`;

const StyledFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const StyledActionButton = styled(Button)`
  && {
    border-radius: ${tokens.radius.medium};
    font-weight: ${tokens.typos.fontWeight.semibold};
  }
`;

const StyledNextButton = styled(StyledActionButton)`
  && {
    min-width: 80px;
    height: 40px;
    padding: 0 ${tokens.spacing.medium};
  }
`;

const StyledInviteContent = styled.div`
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

const StyledInviteTextField = styled(TextField)`
  flex: 1;
`;

const StyledCopyButton = styled(StyledActionButton)`
  && {
    min-width: 104px;
    height: 48px;
    padding: 0 ${tokens.spacing.large};
  }
`;

const StyledCompleteButton = styled(StyledActionButton)`
  && {
    min-width: 80px;
    height: 40px;
    padding: 0 ${tokens.spacing.medium};
  }
`;
