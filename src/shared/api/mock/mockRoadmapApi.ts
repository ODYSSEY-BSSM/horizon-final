/**
 * Mock Roadmap, Node, Problem API
 */

import { mockDatabase } from './mockDatabase';
import { mockStorage } from './mockStorage';
import type {
  RoadmapCountResponse,
  RoadmapCreateRequest,
  RoadmapResponse,
  RoadmapUpdateRequest,
  TeamRoadmapCreateRequest,
  TeamRoadmapResponse,
  NodeCreateRequest,
  NodeListResponse,
  NodeResponse,
  NodeUpdateRequest,
  EducationNodeConvertRequest,
  ProblemCreateRequest,
  ProblemResponse,
  ProblemSolveRequest,
} from '@/feature/roadmap/types';

export const mockRoadmapApi = {
  // ===================================
  // Personal Roadmap API
  // ===================================

  // 개인 로드맵 생성
  createRoadmap: async (data: RoadmapCreateRequest): Promise<RoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const uuid = mockStorage.getNextId('Roadmap');
    const now = new Date().toISOString();

    const newRoadmap = {
      uuid,
      name: data.name,
      color: data.color,
      icon: data.icon,
      isFavorite: false,
      directoryUuid: data.directoryUuid,
      userUuid: currentUser.uuid,
      createdAt: now,
      updatedAt: now,
      lastAccessedAt: now,
    };

    mockDatabase.addRoadmap(newRoadmap);

    return newRoadmap;
  },

  // 개인 로드맵 전체 조회
  getRoadmaps: async (): Promise<RoadmapResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    return mockDatabase.getRoadmaps(currentUser.uuid);
  },

  // 개인 로드맵 단일 조회
  getRoadmap: async (roadmapId: number): Promise<RoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const roadmap = mockDatabase.getRoadmap(roadmapId);
    if (!roadmap) {
      throw new Error('로드맵을 찾을 수 없습니다.');
    }

    // lastAccessedAt 업데이트
    mockDatabase.updateRoadmap(roadmapId, {
      lastAccessedAt: new Date().toISOString(),
    });

    return roadmap;
  },

  // 개인 로드맵 수정
  updateRoadmap: async (
    roadmapId: number,
    data: RoadmapUpdateRequest,
  ): Promise<RoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const updated = mockDatabase.updateRoadmap(roadmapId, data);
    if (!updated) {
      throw new Error('로드맵을 찾을 수 없습니다.');
    }

    return updated;
  },

  // 개인 로드맵 삭제
  deleteRoadmap: async (roadmapId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const success = mockDatabase.deleteRoadmap(roadmapId);
    if (!success) {
      throw new Error('로드맵을 찾을 수 없습니다.');
    }
  },

  // 즐겨찾기 토글
  toggleFavorite: async (roadmapId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const roadmap = mockDatabase.getRoadmap(roadmapId);
    if (!roadmap) {
      throw new Error('로드맵을 찾을 수 없습니다.');
    }

    mockDatabase.updateRoadmap(roadmapId, {
      isFavorite: !roadmap.isFavorite,
    });
  },

  // 마지막 접속 조회
  getLastAccessed: async (): Promise<RoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const roadmaps = mockDatabase.getRoadmaps(currentUser.uuid);
    const sorted = roadmaps
      .filter((r) => r.lastAccessedAt)
      .sort(
        (a, b) =>
          new Date(b.lastAccessedAt!).getTime() - new Date(a.lastAccessedAt!).getTime(),
      );

    if (sorted.length === 0) {
      throw new Error('최근 접속한 로드맵이 없습니다.');
    }

    return sorted[0];
  },

  // 개인 로드맵 개수 조회
  getRoadmapCount: async (): Promise<RoadmapCountResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const roadmaps = mockDatabase.getRoadmaps(currentUser.uuid);
    return { count: roadmaps.length };
  },

  // ===================================
  // Team Roadmap API
  // ===================================

  // 팀 로드맵 생성
  createTeamRoadmap: async (
    teamId: number,
    data: TeamRoadmapCreateRequest,
  ): Promise<TeamRoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const uuid = mockStorage.getNextId('Roadmap');
    const now = new Date().toISOString();

    const newRoadmap = {
      uuid,
      name: data.name,
      color: data.color,
      icon: data.icon,
      directoryUuid: data.directoryUuid,
      teamId,
      createdAt: now,
      updatedAt: now,
    };

    mockDatabase.addTeamRoadmap(newRoadmap);

    return newRoadmap;
  },

  // 팀 로드맵 전체 조회
  getTeamRoadmaps: async (teamId: number): Promise<TeamRoadmapResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    return mockDatabase.getTeamRoadmaps(teamId);
  },
};

export const mockNodeApi = {
  // ===================================
  // Node API
  // ===================================

  // 노드 생성
  createNode: async (roadmapId: number, data: NodeCreateRequest): Promise<NodeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const uuid = mockStorage.getNextId('Node');
    const now = new Date().toISOString();

    const newNode = {
      uuid,
      name: data.name,
      description: data.description,
      color: data.color,
      icon: data.icon,
      type: data.type,
      parentUuid: data.parentUuid,
      childUuids: [],
      roadmapUuid: roadmapId,
      isResolved: false,
      createdAt: now,
      updatedAt: now,
    };

    mockDatabase.addNode(newNode);

    return newNode;
  },

  // 교육과정 노드 전환
  convertEducationNode: async (
    roadmapId: number,
    nodeId: number,
    data: EducationNodeConvertRequest,
  ): Promise<NodeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const updated = mockDatabase.updateNode(nodeId, {
      educationUuid: data.educationUuid,
      subject: data.subject,
    });

    if (!updated) {
      throw new Error('노드를 찾을 수 없습니다.');
    }

    return updated;
  },

  // 단일 노드 조회
  getNode: async (roadmapId: number, nodeId: number): Promise<NodeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const node = mockDatabase.getNode(nodeId);
    if (!node || node.roadmapUuid !== roadmapId) {
      throw new Error('노드를 찾을 수 없습니다.');
    }

    return node;
  },

  // 노드 전체 조회
  getNodes: async (roadmapId: number): Promise<NodeListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const nodes = mockDatabase.getNodes(roadmapId);
    return { nodes };
  },

  // 노드 수정
  updateNode: async (
    roadmapId: number,
    nodeId: number,
    data: NodeUpdateRequest,
  ): Promise<NodeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const updated = mockDatabase.updateNode(nodeId, data);
    if (!updated || updated.roadmapUuid !== roadmapId) {
      throw new Error('노드를 찾을 수 없습니다.');
    }

    return updated;
  },

  // 노드 삭제
  deleteNode: async (roadmapId: number, nodeId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const node = mockDatabase.getNode(nodeId);
    if (!node || node.roadmapUuid !== roadmapId) {
      throw new Error('노드를 찾을 수 없습니다.');
    }

    const success = mockDatabase.deleteNode(nodeId);
    if (!success) {
      throw new Error('노드 삭제에 실패했습니다.');
    }
  },
};

export const mockProblemApi = {
  // ===================================
  // Problem API
  // ===================================

  // 문제 생성
  createProblem: async (nodeId: number, data: ProblemCreateRequest): Promise<ProblemResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const uuid = mockStorage.getNextId('Problem');
    const now = new Date().toISOString();

    const newProblem = {
      uuid,
      title: data.title,
      description: data.description,
      link: data.link,
      status: 'UNRESOLVED' as const,
      nodeUuid: nodeId,
      createdAt: now,
      updatedAt: now,
    };

    mockDatabase.addProblem(newProblem);

    return newProblem;
  },

  // 문제 풀이
  solveProblem: async (
    nodeId: number,
    problemId: number,
    data: ProblemSolveRequest,
  ): Promise<ProblemResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = mockDatabase.getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const problem = mockDatabase.getProblem(problemId);
    if (!problem || problem.nodeUuid !== nodeId) {
      throw new Error('문제를 찾을 수 없습니다.');
    }

    const updated = mockDatabase.updateProblem(problemId, {
      status: data.status,
      solvedAt: data.status === 'RESOLVED' ? new Date().toISOString() : undefined,
    });

    if (!updated) {
      throw new Error('문제 업데이트에 실패했습니다.');
    }

    return updated;
  },
};
