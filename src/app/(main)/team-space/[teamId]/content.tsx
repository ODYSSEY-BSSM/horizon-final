'use client';

import styled from '@emotion/styled';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCreateTeamFolder, useTeamRootFolder } from '@/feature/folder/hooks/useFolderQueries';
import type { DirectoryResponse } from '@/feature/folder/types';
import { FolderGrid, InviteTeamModal, TeamDropdown } from '@/feature/team';
import { useTeam, useTeams } from '@/feature/team/hooks/useTeamQueries';
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

  // GET /teams/{id} - 현재 팀 정보만 조회
  const { data: teamData, isLoading, isError } = useTeam(Number(teamId));
  const { data: teams } = useTeams();

  const [activeTab, setActiveTab] = useState<string>('recent');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const currentTeam = teamData
    ? {
        id: teamData.id?.toString() ?? '',
        name: teamData.name ?? '',
        memberCount: teamData.members?.length ?? 0,
        inviteCode: teamData.inviteCode ?? '',
      }
    : null;

  const createFolderMutation = useCreateTeamFolder(Number(teamId));
  const { data: teamRootFolder } = useTeamRootFolder(Number(teamId));

  const teamsList = useMemo(
    () =>
      (teams || []).map((team) => ({
        id: team.id.toString(),
        name: team.name,
        description: '',
        memberCount: 0,
        createdAt: '',
      })),
    [teams],
  );

  const folders: TeamFolder[] = useMemo(() => {
    if (!teamRootFolder?.directories) {
      return [];
    }

    return teamRootFolder.directories.map((directory: DirectoryResponse) => {
      // roadmapCount 필드 우선 사용, 없으면 roadmaps 배열 길이 사용
      const roadmapCount = directory.roadmapCount ?? directory.roadmaps?.length ?? 0;

      return {
        id: (directory.id ?? 0).toString(),
        name: directory.name ?? '',
        teamId: teamId,
        description: '',
        color: 'blue',
        icon: 'folder',
        roadmapCount,
        createdRoadmapCount: roadmapCount,
        progress: 0,
      };
    });
  }, [teamRootFolder, teamId]);

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

  const handleInviteTeam = () => {
    setShowInviteModal(true);
  };

  const inviteCode = useMemo(() => {
    if (currentTeam?.inviteCode) {
      return currentTeam.inviteCode;
    }
    return currentTeam ? generateInviteCode(currentTeam.id) : undefined;
  }, [currentTeam]);

  const handleInviteComplete = () => {
    setShowInviteModal(false);
  };

  if (isLoading) {
    return (
      <StyledPageContainer>
        <StyledLoadingMessage>팀 정보를 불러오는 중...</StyledLoadingMessage>
      </StyledPageContainer>
    );
  }

  if (isError || !currentTeam) {
    return (
      <StyledPageContainer>
        <StyledErrorMessage>팀을 찾을 수 없습니다.</StyledErrorMessage>
      </StyledPageContainer>
    );
  }

  const handleTeamChange = (newTeamId: string) => {
    router.push(`/team-space/${newTeamId}`);
  };

  return (
    <StyledPageContainer>
      <StyledHeader>
        <TeamDropdown
          teams={teamsList}
          selectedTeamId={currentTeam.id}
          onChange={handleTeamChange}
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

      <InviteTeamModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        teamName={currentTeam?.name}
        inviteCode={inviteCode}
        onComplete={handleInviteComplete}
      />
    </StyledPageContainer>
  );
};

export default TeamFoldersContent;

const StyledPageContainer = styled.div`
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
