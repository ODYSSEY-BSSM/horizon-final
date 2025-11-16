import type { Folder } from '@/feature/roadmap';
import type { TeamFolder } from '../types/team';

/**
 * TeamFolder를 Folder 타입으로 변환
 * FolderCard 컴포넌트에서 사용하기 위한 매퍼
 */
export const mapTeamFolderToFolder = (teamFolder: TeamFolder): Folder => {
  return {
    id: Number(teamFolder.id),
    name: teamFolder.name,
    description: teamFolder.description,
    progress: teamFolder.progress,
    roadmapCount: teamFolder.roadmapCount,
    completedCount: teamFolder.createdRoadmapCount,
    lastRoadmap: teamFolder.lastRoadmapName || '-',
  };
};
