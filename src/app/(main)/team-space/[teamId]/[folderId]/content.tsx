'use client';

import styled from '@emotion/styled';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import type { ColorOption, IconOption } from '@/feature/roadmap';
import { RoadmapStyleModal } from '@/feature/roadmap';
import { useCreateTeamRoadmap } from '@/feature/roadmap/hooks/useRoadmapQueries';
import { TeamFolderRoadmapListSection, useTeamSpaceData } from '@/feature/team';
import { tokens } from '@/shared/tokens';
import { Button, FormModal } from '@/shared/ui';

type ModalState = {
  roadmapCreate: boolean;
  roadmapStyle: boolean;
};

const FolderRoadmapsContent = () => {
  const params = useParams();

  if (
    !params?.teamId ||
    Array.isArray(params.teamId) ||
    !params?.folderId ||
    Array.isArray(params.folderId)
  ) {
    notFound();
  }

  const teamId = params.teamId;
  const folderId = params.folderId;

  const { teams } = useTeamSpaceData();

  const currentTeam = teams.find((team) => team.id === teamId);

  const [modals, setModals] = useState<ModalState>({
    roadmapCreate: false,
    roadmapStyle: false,
  });

  const [roadmapData, setRoadmapData] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const createRoadmapMutation = useCreateTeamRoadmap(Number(teamId));

  const openModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  };

  const handleAddRoadmap = () => {
    openModal('roadmapCreate');
  };

  const handleRoadmapSubmit = (data: { title: string; description: string }) => {
    setRoadmapData(data);
    closeModal('roadmapCreate');
    openModal('roadmapStyle');
  };

  const handleStyleSubmit = (data: { color: ColorOption; icon: IconOption }) => {
    if (!roadmapData) return;

    createRoadmapMutation.mutate(
      {
        name: roadmapData.title,
        color: data.color.toUpperCase() as any,
        icon: data.icon.toUpperCase() as any,
        directoryUuid: Number(folderId),
      },
      {
        onSuccess: () => {
          closeModal('roadmapStyle');
          setRoadmapData(null);
        },
      },
    );
  };

  const handleStyleBack = () => {
    closeModal('roadmapStyle');
    openModal('roadmapCreate');
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

      <TeamFolderRoadmapListSection
        teamId={teamId}
        folderId={folderId}
        onAddRoadmapClick={handleAddRoadmap}
      />

      <FormModal
        isOpen={modals.roadmapCreate}
        onClose={() => closeModal('roadmapCreate')}
        onSubmit={handleRoadmapSubmit}
        title="로드맵 정보"
        description="로드맵 정보를 작성해주세요."
        fields={[
          { name: 'title', label: '이름', placeholder: '이름을 입력해주세요', required: true },
          { name: 'description', label: '설명', placeholder: '설명을 입력해주세요' },
        ]}
        submitText="다음"
      />

      <RoadmapStyleModal
        isOpen={modals.roadmapStyle}
        onClose={() => closeModal('roadmapStyle')}
        onSubmit={handleStyleSubmit}
        onBack={handleStyleBack}
      />
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
