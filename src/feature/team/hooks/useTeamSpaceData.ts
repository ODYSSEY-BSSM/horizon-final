import { useState } from 'react';
import type { Roadmap, Team, TeamFolder } from '@/feature/team/types/team';
import { mockRoadmaps } from '../data/mockRoadmaps';
import { mockTeamFolders } from '../data/mockTeamFolders';
import { mockTeams } from '../data/mockTeams';

export const useTeamSpaceData = () => {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [folders, setFolders] = useState<TeamFolder[]>(mockTeamFolders);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(mockRoadmaps);

  const getTeamFolders = (teamId: string | null, filterTab?: string): TeamFolder[] => {
    if (!teamId) {
      return [];
    }

    const teamFolders = folders.filter((folder) => folder.teamId === teamId);

    // 필터 탭에 따라 정렬
    const sortedFolders = [...teamFolders].sort((a, b) => {
      switch (filterTab) {
        case 'progress':
          return b.progress - a.progress;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return b.id.localeCompare(a.id); // ID 기준 역순 (최신순)
      }
    });

    return sortedFolders;
  };

  const addTeam = (teamData: { name: string; description: string }) => {
    const newTeam: Team = {
      id: `team-${String(teams.length + 1).padStart(3, '0')}`,
      name: teamData.name,
      description: teamData.description,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };
    setTeams((prev) => [...prev, newTeam]);
    return newTeam;
  };

  const joinTeam = (inviteCode: string) => {
    // 실제로는 API로 초대코드 검증 후 팀에 참여
    // 목업에서는 기존 팀 중 하나를 반환
    const team = teams.find((t) => t.id === inviteCode);
    if (team) {
      return { success: true, team };
    }
    return { success: false, team: null };
  };

  const addFolder = (folderData: { teamId: string; name: string; description: string }) => {
    const newFolder: TeamFolder = {
      id: `folder-${String(folders.length + 1).padStart(3, '0')}`,
      teamId: folderData.teamId,
      name: folderData.name,
      description: folderData.description,
      progress: 0,
      roadmapCount: 0,
      createdRoadmapCount: 0,
      lastRoadmapName: undefined,
    };
    setFolders((prev) => [...prev, newFolder]);
    return newFolder;
  };

  const updateFolder = (folderId: string, folderData: { name: string; description: string }) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, name: folderData.name, description: folderData.description }
          : folder,
      ),
    );
  };

  const deleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
  };

  const getFolderRoadmaps = (folderId: string): Roadmap[] => {
    return roadmaps.filter((roadmap) => roadmap.folderId === folderId);
  };

  const addRoadmap = (roadmapData: { folderId: string; name: string; description: string }) => {
    const newRoadmap: Roadmap = {
      id: `roadmap-${String(roadmaps.length + 1).padStart(3, '0')}`,
      folderId: roadmapData.folderId,
      name: roadmapData.name,
      description: roadmapData.description,
      progress: 0,
      totalSteps: 0,
      completedSteps: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRoadmaps((prev) => [...prev, newRoadmap]);
    return newRoadmap;
  };

  return {
    teams,
    folders,
    roadmaps,
    getTeamFolders,
    getFolderRoadmaps,
    addTeam,
    joinTeam,
    addFolder,
    updateFolder,
    deleteFolder,
    addRoadmap,
  };
};
