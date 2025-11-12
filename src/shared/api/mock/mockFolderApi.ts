/**
 * Mock Folder API
 */

import { mockDatabase } from './mockDatabase';
import { mockStorage } from './mockStorage';
import type {
  DirectoryContentResponse,
  DirectoryCreateRequest,
  DirectoryResponse,
  DirectoryUpdateRequest,
  TeamDirectoryCreateRequest,
  TeamDirectoryResponse,
  TeamDirectoryUpdateRequest,
} from '@/feature/folder/types';
import type { DirectoryContentItem } from '@/shared/api/types';

export const mockFolderApi = {
  // ===================================
  // Personal Directory API
  // ===================================

  // 루트 디렉토리 조회
  getRootDirectory: async (): Promise<DirectoryContentResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const directories = mockDatabase.getDirectories();
    const roadmaps = mockDatabase.getRoadmaps(currentUser.uuid);

    // 루트 레벨 아이템만 (parentUuid가 없거나 directoryUuid가 없는 것들)
    const rootDirectories = directories.filter((d) => !d.parentUuid);
    const rootRoadmaps = roadmaps.filter((r) => !r.directoryUuid);

    const items: DirectoryContentItem[] = [
      ...rootDirectories.map(
        (d): DirectoryContentItem => ({
          uuid: d.uuid,
          name: d.name,
          color: d.color,
          icon: d.icon,
          type: 'directory' as const,
          parentUuid: d.parentUuid,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        }),
      ),
      ...rootRoadmaps.map(
        (r): DirectoryContentItem => ({
          uuid: r.uuid,
          name: r.name,
          color: r.color,
          icon: r.icon,
          type: 'roadmap' as const,
          parentUuid: r.directoryUuid,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      ),
    ];

    return { items };
  },

  // 팀 루트 디렉토리 조회
  getTeamRootDirectory: async (teamId: number): Promise<DirectoryContentResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const directories = mockDatabase.getTeamDirectories(teamId);
    const roadmaps = mockDatabase.getTeamRoadmaps(teamId);

    // 루트 레벨 아이템만
    const rootDirectories = directories.filter((d) => !d.parentUuid);
    const rootRoadmaps = roadmaps.filter((r) => !r.directoryUuid);

    const items: DirectoryContentItem[] = [
      ...rootDirectories.map(
        (d): DirectoryContentItem => ({
          uuid: d.uuid,
          name: d.name,
          color: d.color,
          icon: d.icon,
          type: 'directory' as const,
          parentUuid: d.parentUuid,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        }),
      ),
      ...rootRoadmaps.map(
        (r): DirectoryContentItem => ({
          uuid: r.uuid,
          name: r.name,
          color: r.color,
          icon: r.icon,
          type: 'roadmap' as const,
          parentUuid: r.directoryUuid,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      ),
    ];

    return { items };
  },

  // 개인 디렉토리 생성
  createDirectory: async (data: DirectoryCreateRequest): Promise<DirectoryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const uuid = mockStorage.getNextId('Directory');
    const now = new Date().toISOString();

    const newDirectory = {
      uuid,
      name: data.name,
      color: data.color,
      icon: data.icon,
      parentUuid: data.parentUuid,
      childUuids: [],
      roadmapUuids: [],
      createdAt: now,
      updatedAt: now,
    };

    mockDatabase.addDirectory(newDirectory);

    // 부모 디렉토리에 자식 추가
    if (data.parentUuid) {
      const parent = mockDatabase.getDirectory(data.parentUuid);
      if (parent) {
        parent.childUuids.push(uuid);
        mockDatabase.updateDirectory(data.parentUuid, { childUuids: parent.childUuids });
      }
    }

    return newDirectory;
  },

  // 개인 디렉토리 수정
  updateDirectory: async (
    directoryId: number,
    data: DirectoryUpdateRequest,
  ): Promise<DirectoryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const updated = mockDatabase.updateDirectory(directoryId, data);
    if (!updated) {
      throw new Error('디렉토리를 찾을 수 없습니다.');
    }

    return updated;
  },

  // 개인 디렉토리 삭제
  deleteDirectory: async (directoryId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const success = mockDatabase.deleteDirectory(directoryId);
    if (!success) {
      throw new Error('디렉토리를 찾을 수 없습니다.');
    }

    // 부모 디렉토리에서 제거
    const directories = mockDatabase.getDirectories();
    for (const dir of directories) {
      if (dir.childUuids.includes(directoryId)) {
        dir.childUuids = dir.childUuids.filter((id) => id !== directoryId);
        mockDatabase.updateDirectory(dir.uuid, { childUuids: dir.childUuids });
      }
    }
  },

  // ===================================
  // Team Directory API
  // ===================================

  // 팀 디렉토리 생성
  createTeamDirectory: async (
    teamId: number,
    data: TeamDirectoryCreateRequest,
  ): Promise<TeamDirectoryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const uuid = mockStorage.getNextId('Directory');
    const now = new Date().toISOString();

    const newDirectory = {
      uuid,
      name: data.name,
      color: data.color,
      icon: data.icon,
      teamId,
      parentUuid: data.parentUuid,
      childUuids: [],
      roadmapUuids: [],
      createdAt: now,
      updatedAt: now,
    };

    mockDatabase.addTeamDirectory(newDirectory);

    // 부모 디렉토리에 자식 추가
    if (data.parentUuid) {
      const parent = mockDatabase.getTeamDirectory(data.parentUuid);
      if (parent) {
        parent.childUuids.push(uuid);
        mockDatabase.updateTeamDirectory(data.parentUuid, { childUuids: parent.childUuids });
      }
    }

    return newDirectory;
  },

  // 팀 디렉토리 수정
  updateTeamDirectory: async (
    directoryId: number,
    teamId: number,
    data: TeamDirectoryUpdateRequest,
  ): Promise<TeamDirectoryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const updated = mockDatabase.updateTeamDirectory(directoryId, data);
    if (!updated) {
      throw new Error('디렉토리를 찾을 수 없습니다.');
    }

    return updated;
  },

  // 팀 디렉토리 삭제
  deleteTeamDirectory: async (directoryId: number, teamId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const success = mockDatabase.deleteTeamDirectory(directoryId);
    if (!success) {
      throw new Error('디렉토리를 찾을 수 없습니다.');
    }

    // 부모 디렉토리에서 제거
    const directories = mockDatabase.getTeamDirectories(teamId);
    for (const dir of directories) {
      if (dir.childUuids.includes(directoryId)) {
        dir.childUuids = dir.childUuids.filter((id) => id !== directoryId);
        mockDatabase.updateTeamDirectory(dir.uuid, { childUuids: dir.childUuids });
      }
    }
  },
};
