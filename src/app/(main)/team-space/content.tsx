'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreateTeamModal, EmptyTeamState, useTeams } from '@/feature/team';
import { useApplyToTeam, useCreateTeam } from '@/feature/team/hooks/useTeamQueries';
import { decodeInviteCode } from '@/feature/team/utils/inviteCode';
import { useToast } from '@/shared/hooks/useToast';
import { tokens } from '@/shared/tokens';
import { FormModal } from '@/shared/ui';

const TeamSpaceContent = () => {
  const { data: teams, isLoading, isError } = useTeams();
  const createTeamMutation = useCreateTeam();
  const applyToTeamMutation = useApplyToTeam();
  const { toast } = useToast();
  const router = useRouter();

  const [modals, setModals] = useState({
    teamCreate: false,
    teamJoin: false,
  });

  const openModal = (modal: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  };

  const handleCreateTeam = () => {
    openModal('teamCreate');
  };

  const handleTeamCreate = async ({ name }: { name: string }) => {
    const team = await createTeamMutation.mutateAsync({ name });
    closeModal('teamCreate');
    // 팀 생성 즉시 해당 팀 페이지로 이동
    router.push(`/team-space/${team.id}`);
    return team;
  };

  const handleOpenJoinModal = () => {
    openModal('teamJoin');
  };

  const hasTeams = teams && teams.length > 0;
  const firstTeamId = teams?.[0]?.id;

  // 팀이 있으면 첫 번째 팀으로 자동 리다이렉트
  useEffect(() => {
    if (firstTeamId) {
      router.push(`/team-space/${firstTeamId}`);
    }
  }, [firstTeamId, router]);

  const handleJoinTeam = async (data: { inviteCode: string }) => {
    if (!data.inviteCode) {
      toast({ description: '초대 코드를 입력해주세요.' });
      return;
    }

    try {
      await applyToTeamMutation.mutateAsync({ inviteCode: data.inviteCode });
      closeModal('teamJoin');

      // inviteCode에서 팀 ID 추출하여 해당 팀 페이지로 이동
      const teamIdStr = decodeInviteCode(data.inviteCode);
      if (teamIdStr) {
        const teamId = parseInt(teamIdStr, 10);
        if (!Number.isNaN(teamId)) {
          router.push(`/team-space/${teamId}`);
          return;
        }
      }

      toast({ description: '팀 가입에 성공했습니다.' });
    } catch (_error) {
      toast({ description: '유효하지 않은 초대 코드입니다.' });
    }
  };

  if (isLoading) {
    return (
      <StyledPageContainer>
        <StyledLoadingMessage>팀 목록을 불러오는 중...</StyledLoadingMessage>
      </StyledPageContainer>
    );
  }

  if (isError) {
    return (
      <StyledPageContainer>
        <StyledErrorMessage>팀 목록을 불러오는데 실패했습니다.</StyledErrorMessage>
      </StyledPageContainer>
    );
  }

  // 팀이 있을 때는 리다이렉트 중이므로 아무것도 렌더링하지 않음
  if (hasTeams) {
    return null;
  }

  return (
    <StyledPageContainer>
      <EmptyTeamState onCreateTeam={handleCreateTeam} onJoinTeam={handleOpenJoinModal} />

      <CreateTeamModal
        isOpen={modals.teamCreate}
        onClose={() => closeModal('teamCreate')}
        onCreate={handleTeamCreate}
      />
      <FormModal
        isOpen={modals.teamJoin}
        onClose={() => closeModal('teamJoin')}
        onSubmit={handleJoinTeam}
        title="팀 참가"
        description="참가할 팀 초대코드를 입력해 주세요."
        fields={[
          {
            name: 'inviteCode',
            label: '초대 코드',
            placeholder: '초대 코드를 입력해주세요',
            required: true,
          },
        ]}
        submitText="참가"
      />
    </StyledPageContainer>
  );
};

export default TeamSpaceContent;

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 16px 60px 80px;
  box-sizing: border-box;
  position: relative;
  height: calc(100vh - 72px);
`;

const StyledLoadingMessage = styled.div`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  color: ${tokens.colors.neutral[600]};
  text-align: center;
  padding: 40px;
`;

const StyledErrorMessage = styled.div`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  color: ${tokens.colors.error[200]};
  text-align: center;
  padding: 40px;
`;
