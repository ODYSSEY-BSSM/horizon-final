'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreateTeamModal, EmptyTeamState, useTeamSpaceData } from '@/feature/team';
import type { Team } from '@/feature/team/types/team';
import { useToast } from '@/shared/hooks/useToast';
import { FormModal } from '@/shared/ui';

const TeamSpaceContent = () => {
  const { teams, addTeam, joinTeam } = useTeamSpaceData();
  const { toast } = useToast();
  const [modals, setModals] = useState({
    teamCreate: false,
    teamJoin: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (teams.length > 0) {
      router.replace(`/team-space/${teams[0].id}`);
    }
  }, [teams, router]);

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
    const newTeam = await addTeam({ name, description: '' });
    return newTeam;
  };

  const handleTeamCreateComplete = (team: Team) => {
    router.push(`/team-space/${team.id}`);
  };

  const handleOpenJoinModal = () => {
    openModal('teamJoin');
  };

  const handleJoinTeam = async (data: { inviteCode: string }) => {
    if (!data.inviteCode) {
      toast({ description: '초대 코드를 입력해주세요.' });
      return;
    }

    const result = await joinTeam(data.inviteCode, {
      onError: (message) => {
        toast({ description: message });
      },
    });

    if (!result.success) {
      toast({ description: '유효하지 않은 초대 코드입니다.' });
    } else {
      closeModal('teamJoin');
    }
  };

  return (
    <StyledPageContainer>
      <EmptyTeamState onCreateTeam={handleCreateTeam} onJoinTeam={handleOpenJoinModal} />

      <CreateTeamModal
        isOpen={modals.teamCreate}
        onClose={() => closeModal('teamCreate')}
        onCreate={handleTeamCreate}
        onComplete={handleTeamCreateComplete}
      />
      <FormModal
        isOpen={modals.teamJoin}
        onClose={() => closeModal('teamJoin')}
        onSubmit={handleJoinTeam}
        title="팀 참여하기"
        description="초대코드를 입력하여 팀에 참여하세요."
        fields={[
          {
            name: 'inviteCode',
            label: '초대 코드',
            placeholder: '초대 코드를 입력해주세요',
            required: true,
          },
        ]}
        submitText="참여하기"
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
  min-height: calc(100vh - 84px);
`;
