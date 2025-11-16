'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CreateTeamModal, EmptyTeamState } from '@/feature/team';
import { useApplyToTeam, useCreateTeam } from '@/feature/team/hooks/useTeamQueries';
import { decodeInviteCode } from '@/feature/team/utils/inviteCode';
import { useToast } from '@/shared/hooks/useToast';
import { FormModal } from '@/shared/ui';

const TeamSpaceContent = () => {
  const createTeamMutation = useCreateTeam();
  const applyToTeamMutation = useApplyToTeam();
  const { toast } = useToast();
  const router = useRouter();
  const hasAlerted = useRef(false);

  useEffect(() => {
    if (!hasAlerted.current) {
      alert('현재 백엔드가 미완성입니다.');
      hasAlerted.current = true;
    }
  }, []);

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
