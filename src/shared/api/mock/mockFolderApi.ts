import type {
  DirectoryContentResponse,
  DirectoryCreateRequest,
  DirectoryResponse,
  DirectoryUpdateRequest,
  TeamDirectoryContentResponse,
  TeamDirectoryCreateRequest,
  TeamDirectoryResponse,
  TeamDirectoryUpdateRequest,
} from '@/feature/folder/types';
import type { RoadmapResponse, TeamRoadmapResponse } from '@/feature/roadmap/types';
import { delay, MOCK_DELAYS } from './mockConstants';
import { initialMockData } from './mockData';
import { MOCK_ERRORS } from './mockErrors';
import { mockStorage } from './mockStorage';

interface StoredDirectory {
  id: number;
  name: string;
  parentId?: number;
  teamId?: number;
}

function getDirectories(): StoredDirectory[] {
  return mockStorage.getOrDefault('directories', initialMockData.directories);
}

function getRoadmaps(): (RoadmapResponse | TeamRoadmapResponse)[] {
  return mockStorage.getOrDefault('roadmaps', initialMockData.roadmaps);
}

function buildDirectoryTree(
  directories: StoredDirectory[],
  roadmaps: (RoadmapResponse | TeamRoadmapResponse)[],
  parentId?: number,
): DirectoryResponse[] {
  const children = directories.filter((d) => d.parentId === parentId && !d.teamId);

  return children.map((dir) => ({
    id: dir.id,
    name: dir.name,
    parentId: dir.parentId,
    directories: buildDirectoryTree(directories, roadmaps, dir.id),
    roadmaps: roadmaps
      .filter((r) => r.directoryId === dir.id)
      .map((r) => ({ id: r.id, title: r.title, progress: r.progress })),
  }));
}

function buildTeamDirectoryTree(
  directories: StoredDirectory[],
  roadmaps: (RoadmapResponse | TeamRoadmapResponse)[],
  teamId: number,
  parentId?: number,
): TeamDirectoryResponse[] {
  const children = directories.filter((d) => d.parentId === parentId && d.teamId === teamId);

  return children.map((dir) => ({
    id: dir.id,
    name: dir.name,
    parentId: dir.parentId,
    teamId: dir.teamId ?? teamId,
    directories: buildTeamDirectoryTree(directories, roadmaps, teamId, dir.id),
    roadmaps: roadmaps
      .filter((r) => r.directoryId === dir.id)
      .map((r) => ({ id: r.id, title: r.title, progress: r.progress })),
  }));
}

export const mockFolderApi = {
  createDirectory: async (data: DirectoryCreateRequest): Promise<DirectoryResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const directories = getDirectories();
    const _roadmaps = getRoadmaps();

    const newDirectory: StoredDirectory = {
      id: mockStorage.getNextId(),
      name: data.name,
      parentId: data.parentId,
    };

    directories.push(newDirectory);
    mockStorage.set('directories', directories);

    return {
      id: newDirectory.id,
      name: newDirectory.name,
      parentId: newDirectory.parentId,
      directories: [],
      roadmaps: [],
    };
  },

  getDirectories: async (): Promise<DirectoryContentResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const directories = getDirectories();
    const roadmaps = getRoadmaps();

    return {
      directories: buildDirectoryTree(directories, roadmaps, undefined),
    };
  },

  getDirectory: async (directoryId: number): Promise<DirectoryResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const directories = getDirectories();
    const roadmaps = getRoadmaps();
    const directory = directories.find((d) => d.id === directoryId && !d.teamId);

    if (!directory) {
      throw new Error(MOCK_ERRORS.DIRECTORY_NOT_FOUND);
    }

    return {
      id: directory.id,
      name: directory.name,
      parentId: directory.parentId,
      directories: buildDirectoryTree(directories, roadmaps, directory.id),
      roadmaps: roadmaps
        .filter((r) => r.directoryId === directory.id)
        .map((r) => ({ id: r.id, title: r.title, progress: r.progress })),
    };
  },

  updateDirectory: async (
    directoryId: number,
    data: DirectoryUpdateRequest,
  ): Promise<DirectoryResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const directories = getDirectories();
    const roadmaps = getRoadmaps();
    const index = directories.findIndex((d) => d.id === directoryId && !d.teamId);

    if (index === -1) {
      throw new Error(MOCK_ERRORS.DIRECTORY_NOT_FOUND);
    }

    directories[index] = { ...directories[index], ...data };
    mockStorage.set('directories', directories);

    const updated = directories[index];
    return {
      id: updated.id,
      name: updated.name,
      parentId: updated.parentId,
      directories: buildDirectoryTree(directories, roadmaps, updated.id),
      roadmaps: roadmaps
        .filter((r) => r.directoryId === updated.id)
        .map((r) => ({ id: r.id, title: r.title, progress: r.progress })),
    };
  },

  deleteDirectory: async (directoryId: number): Promise<void> => {
    await delay(MOCK_DELAYS.NORMAL);

    const directories = getDirectories();
    const filtered = directories.filter((d) => d.id !== directoryId);
    mockStorage.set('directories', filtered);
  },
};

export const mockTeamFolderApi = {
  createTeamDirectory: async (
    teamId: number,
    data: TeamDirectoryCreateRequest,
  ): Promise<TeamDirectoryResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const directories = getDirectories();
    const _roadmaps = getRoadmaps();

    const newDirectory: StoredDirectory = {
      id: mockStorage.getNextId(),
      name: data.name,
      parentId: data.parentId,
      teamId,
    };

    directories.push(newDirectory);
    mockStorage.set('directories', directories);

    return {
      id: newDirectory.id,
      name: newDirectory.name,
      parentId: newDirectory.parentId,
      teamId,
      directories: [],
      roadmaps: [],
    };
  },

  getTeamDirectories: async (teamId: number): Promise<TeamDirectoryContentResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const directories = getDirectories();
    const roadmaps = getRoadmaps();

    return {
      directories: buildTeamDirectoryTree(directories, roadmaps, teamId, undefined),
    };
  },

  getTeamDirectory: async (teamId: number, directoryId: number): Promise<TeamDirectoryResponse> => {
    await delay(MOCK_DELAYS.FAST);

    const directories = getDirectories();
    const roadmaps = getRoadmaps();
    const directory = directories.find((d) => d.id === directoryId && d.teamId === teamId);

    if (!directory) {
      throw new Error(MOCK_ERRORS.TEAM_DIRECTORY_NOT_FOUND);
    }

    return {
      id: directory.id,
      name: directory.name,
      parentId: directory.parentId,
      teamId: directory.teamId ?? teamId,
      directories: buildTeamDirectoryTree(directories, roadmaps, teamId, directory.id),
      roadmaps: roadmaps
        .filter((r) => r.directoryId === directory.id)
        .map((r) => ({ id: r.id, title: r.title, progress: r.progress })),
    };
  },

  updateTeamDirectory: async (
    teamId: number,
    directoryId: number,
    data: TeamDirectoryUpdateRequest,
  ): Promise<TeamDirectoryResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const directories = getDirectories();
    const roadmaps = getRoadmaps();
    const index = directories.findIndex((d) => d.id === directoryId && d.teamId === teamId);

    if (index === -1) {
      throw new Error(MOCK_ERRORS.TEAM_DIRECTORY_NOT_FOUND);
    }

    directories[index] = { ...directories[index], ...data };
    mockStorage.set('directories', directories);

    const updated = directories[index];
    return {
      id: updated.id,
      name: updated.name,
      parentId: updated.parentId,
      teamId: updated.teamId ?? teamId,
      directories: buildTeamDirectoryTree(directories, roadmaps, teamId, updated.id),
      roadmaps: roadmaps
        .filter((r) => r.directoryId === updated.id)
        .map((r) => ({ id: r.id, title: r.title, progress: r.progress })),
    };
  },

  deleteTeamDirectory: async (teamId: number, directoryId: number): Promise<void> => {
    await delay(MOCK_DELAYS.NORMAL);

    const directories = getDirectories();
    const filtered = directories.filter((d) => !(d.id === directoryId && d.teamId === teamId));
    mockStorage.set('directories', filtered);
  },
};
