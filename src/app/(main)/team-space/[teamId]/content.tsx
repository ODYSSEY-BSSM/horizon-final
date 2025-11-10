'use client';

import styled from '@emotion/styled';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, FormModal } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import { FolderGrid, TeamDropdown, useTeamSpaceData } from '@/feature/team';

const TeamFoldersContent = () => {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;

  const { teams, getTeamFolders, addFolder } = useTeamSpaceData();
  const [activeTab, setActiveTab] = useState<string>('recent');
  const [showFolderModal, setShowFolderModal] = useState(false);

  const currentTeam = teams.find((team) => team.id === teamId);
  const folders = getTeamFolders(teamId);

  const handleTeamChange = (newTeamId: string) => {
    router.push(`/team-space/${newTeamId}`);
  };

  const handleAddFolder = () => {
    setShowFolderModal(true);
  };

  const handleFolderCreate = (data: { name: string; description: string }) => {
    addFolder({ teamId, ...data });
    setShowFolderModal(false);
  };

  const handleInviteTeam = () => {
    alert('팀 초대 기능은 준비중입니다');
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
        <TeamDropdown teams={teams} selectedTeamId={teamId} onChange={handleTeamChange} />
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
          { name: 'name', label: '폴더 이름', placeholder: '폴더 이름을 작성해주세요', required: true },
          { name: 'description', label: '폴더 설명', placeholder: '폴더 설명을 작성해주세요' },
        ]}
        submitText="생성"
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
