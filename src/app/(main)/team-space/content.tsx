'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EmptyTeamState from './_components/EmptyTeamState';
import TeamCreateModal from './_forms/TeamCreateModal';
import TeamJoinModal from './_forms/TeamJoinModal';
import { useTeamSpaceData } from './_hooks/useTeamSpaceData';

type ModalState = {
  teamCreate: boolean;
  teamJoin: boolean;
};

const TeamSpaceContent = () => {
  const router = useRouter();
  const { teams, addTeam, joinTeam } = useTeamSpaceData();

  const [modals, setModals] = useState<ModalState>({
    teamCreate: false,
    teamJoin: false,
  });

  // 팀이 있으면 첫 번째 팀으로 리다이렉트
  useEffect(() => {
    if (teams.length > 0) {
      router.replace(`/team-space/${teams[0].id}`);
    }
  }, [teams, router]);

  const openModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  };

  const handleCreateTeam = () => {
    openModal('teamCreate');
  };

  const handleTeamCreateSubmit = (data: { name: string; description: string }) => {
    const newTeam = addTeam(data);
    closeModal('teamCreate');
    // 새로 생성한 팀으로 이동
    router.push(`/team-space/${newTeam.id}`);
  };

  const handleJoinTeam = () => {
    openModal('teamJoin');
  };

  const handleTeamJoinSubmit = (inviteCode: string) => {
    const result = joinTeam(inviteCode);
    if (result.success && result.team) {
      closeModal('teamJoin');
      // 참여한 팀으로 이동
      router.push(`/team-space/${result.team.id}`);
    } else {
      alert('유효하지 않은 초대 코드입니다.');
    }
  };

  // 팀이 있으면 리다이렉트되므로 빈 상태만 보여줌
  return (
    <StyledPageContainer>
      <EmptyTeamState onCreateTeam={handleCreateTeam} onJoinTeam={handleJoinTeam} />

      <TeamCreateModal
        isOpen={modals.teamCreate}
        onClose={() => closeModal('teamCreate')}
        onSubmit={handleTeamCreateSubmit}
      />
      <TeamJoinModal
        isOpen={modals.teamJoin}
        onClose={() => closeModal('teamJoin')}
        onSubmit={handleTeamJoinSubmit}
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
