'use client';

import styled from '@emotion/styled';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { DirectoryResponse } from '@/feature/folder/types';
import { useCreateTeamFolder, useTeamRootFolder } from '@/feature/folder/hooks/useFolderQueries';
import {
  CreateTeamModal,
  FolderGrid,
  InviteTeamModal,
  TeamDropdown,
  useTeamSpaceData,
} from '@/feature/team';
import type { TeamFolder } from '@/feature/team/types/team';
import { generateInviteCode } from '@/feature/team/utils/inviteCode';
import { tokens } from '@/shared/tokens';
import { Button, FormModal } from '@/shared/ui';

const TeamFoldersContent = () => {
  const params = useParams();
  const router = useRouter();

  if (!params?.teamId || Array.isArray(params.teamId)) {
    notFound();
  }

  const teamId = params.teamId;

  const { teams, addTeam } = useTeamSpaceData();
  const [activeTab, setActiveTab] = useState<string>('recent');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

  const currentTeam = teams.find((team) => team.id === teamId);
  const _teamName = currentTeam?.name || '';

  const createFolderMutation = useCreateTeamFolder(Number(teamId));
  const { data: teamRootFolder } = useTeamRootFolder(Number(teamId));

  const folders: TeamFolder[] = useMemo(() => {
    if (!teamRootFolder?.directories) {
      return [];
    }

    // 디렉토리 매핑 (Swagger 구조 사용)
    return teamRootFolder.directories.map((directory: DirectoryResponse) => ({
      id: directory.id.toString(),
      name: directory.name,
      teamId: teamId,
      description: '',
      color: 'blue', // 기본값
      icon: 'folder', // 기본값
      roadmapCount: directory.roadmaps?.length || 0,
      createdRoadmapCount: directory.roadmaps?.length || 0,
      progress: 0,
    }));
  }, [teamRootFolder, teamId]);

  const handleTeamChange = (newTeamId: string) => {
    router.push(`/team-space/${newTeamId}`);
  };

  const handleAddFolder = () => {
    setShowFolderModal(true);
  };

  const handleFolderCreate = (data: { name: string; description: string }) => {
    createFolderMutation.mutate(
      {
        name: data.name,
      },
      {
        onSuccess: () => {
          setShowFolderModal(false);
        },
      },
    );
  };

  const handleCreateTeam = () => {
    setShowCreateTeamModal(true);
  };

  const handleTeamCreate = async ({ name }: { name: string }) => {
    const newTeam = await addTeam({ name, description: '' });
    router.push(`/team-space/${newTeam.id}`);
    return newTeam;
  };

  const handleInviteTeam = () => {
    setShowInviteModal(true);
  };

  const inviteCode = useMemo(() => {
    // API에서 받은 초대 코드 우선 사용
    if (currentTeam?.inviteCode) {
      return currentTeam.inviteCode;
    }
    // Fallback: 로컬에서 생성
    return currentTeam ? generateInviteCode(currentTeam.id) : undefined;
  }, [currentTeam]);

  const handleInviteComplete = () => {
    setShowInviteModal(false);
  };

  if (!currentTeam) {
    return (
      <StyledContainer>
        <StyledErrorMessage>팀을 찾을 수 없습니다.</StyledErrorMessage>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <TeamDropdown
          teams={teams}
          selectedTeamId={teamId}
          onChange={handleTeamChange}
          onCreateTeam={handleCreateTeam}
        />
        <StyledButtonGroup>
          <Button
            variant="contained"
            size="medium"
            iconPosition="left"
            iconName="add"
            onClick={handleAddFolder}
          >
            새 폴더
          </Button>
          <Button variant="outlined" size="medium" onClick={handleInviteTeam}>
            팀 초대
          </Button>
        </StyledButtonGroup>
      </StyledHeader>

      <FolderGrid
        folders={folders}
        teamId={teamId}
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onAddFolder={handleAddFolder}
      />

      <FormModal
        isOpen={showFolderModal}
        mode="create"
        onClose={() => setShowFolderModal(false)}
        onSubmit={handleFolderCreate}
        title="폴더 생성"
        description="생성할 폴더의 정보를 입력해주세요."
        fields={[
          {
            name: 'name',
            label: '폴더 이름',
            placeholder: '폴더 이름을 작성해주세요',
            required: true,
          },
          { name: 'description', label: '폴더 설명', placeholder: '폴더 설명을 작성해주세요' },
        ]}
        submitText="생성"
      />

      <CreateTeamModal
        isOpen={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        onCreate={handleTeamCreate}
      />

      <InviteTeamModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        teamName={currentTeam?.name}
        inviteCode={inviteCode}
        onComplete={handleInviteComplete}
      />
    </StyledContainer>
  );
};

export default TeamFoldersContent;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 16px 60px 80px;
  box-sizing: border-box;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const StyledErrorMessage = styled.div`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  color: ${tokens.colors.error[200]};
  text-align: center;
  padding: 40px;
`;
