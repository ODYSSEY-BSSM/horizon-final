'use client';

import styled from '@emotion/styled';
import { useParams } from 'next/navigation';
import { Button } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import { useTeamSpaceData, TeamFolderRoadmapListSection } from '@/feature/team';

const FolderRoadmapsContent = () => {
  const params = useParams();
  const teamId = params.teamId as string;
  const folderId = params.folderId as string;

  const { teams, folders } = useTeamSpaceData();

  const currentTeam = teams.find((team) => team.id === teamId);
  const currentFolder = folders.find((folder) => folder.id === folderId);

  const handleAddRoadmap = () => {
    // TODO: 로드맵 생성 모달 구현
    const name = prompt('로드맵 이름을 입력하세요:');
    const description = prompt('로드맵 설명을 입력하세요:');

    if (name && description) {
      // TODO: 로드맵 생성 로직 구현
    }
  };

  if (!currentTeam || !currentFolder) {
    return (
      <StyledContainer>
        <StyledErrorMessage>
          {!currentTeam && '팀을 찾을 수 없습니다.'}
          {!currentFolder && '폴더를 찾을 수 없습니다.'}
        </StyledErrorMessage>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>로드맵을 선택해주세요.</StyledTitle>
        <Button
          variant="contained"
          size="medium"
          iconPosition="left"
          iconName="add"
          onClick={handleAddRoadmap}
        >
          새 로드맵
        </Button>
      </StyledHeader>

      <TeamFolderRoadmapListSection folderId={folderId} onAddRoadmapClick={handleAddRoadmap} />
    </StyledContainer>
  );
};

export default FolderRoadmapsContent;

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

const StyledTitle = styled.h2`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[34]};
  letter-spacing: -0.015em;
  color: ${tokens.colors.black};
  margin: 0;
`;

const StyledErrorMessage = styled.div`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  color: ${tokens.colors.error[200]};
  text-align: center;
  padding: 40px;
`;
