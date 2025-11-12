/**
 * Mock Roadmap/Node/Problem API (Swagger 완벽 일치)
 */

import { mockStorage } from './mockStorage';
import { initialMockData } from './mockData';
import type {
  RoadmapCreateRequest,
  RoadmapResponse,
  RoadmapUpdateRequest,
  RoadmapCountResponse,
  TeamRoadmapCreateRequest,
  TeamRoadmapResponse,
  NodeCreateRequest,
  NodeResponse,
  NodeUpdateRequest,
  NodeListResponse,
  EducationNodeConvertRequest,
  ProblemCreateRequest,
  ProblemResponse,
  ProblemSolveRequest,
} from '@/feature/roadmap/types';

function getRoadmaps(): RoadmapResponse[] {
  return mockStorage.get<RoadmapResponse[]>('roadmaps') || initialMockData.roadmaps;
}

function getNodes(): NodeResponse[] {
  return mockStorage.get<NodeResponse[]>('nodes') || initialMockData.nodes;
}

function getProblems(): ProblemResponse[] {
  return mockStorage.get<ProblemResponse[]>('problems') || initialMockData.problems;
}

function getProblemAnswers(): Map<number, string> {
  const stored = mockStorage.get<[number, string][]>('problemAnswers');
  return stored ? new Map(stored) : initialMockData.problemAnswers;
}

export const mockRoadmapApi = {
  createRoadmap: async (data: RoadmapCreateRequest): Promise<RoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const roadmaps = getRoadmaps();
    const newRoadmap: RoadmapResponse = {
      id: mockStorage.getNextId(),
      title: data.title,
      description: data.description,
      categories: data.categories,
      lastModifiedAt: new Date().toISOString().split('T')[0],
      lastAccessedAt: new Date().toISOString(),
      isFavorite: false,
      color: data.color,
      icon: data.icon,
      progress: 0,
      directoryId: data.directoryId,
    };

    roadmaps.push(newRoadmap);
    mockStorage.set('roadmaps', roadmaps);
    return newRoadmap;
  },

  getRoadmaps: async (): Promise<RoadmapResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getRoadmaps();
  },

  getRoadmap: async (roadmapId: number): Promise<RoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const roadmaps = getRoadmaps();
    const roadmap = roadmaps.find((r) => r.id === roadmapId);
    if (!roadmap) throw new Error('로드맵을 찾을 수 없습니다.');
    return roadmap;
  },

  updateRoadmap: async (
    roadmapId: number,
    data: RoadmapUpdateRequest,
  ): Promise<RoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const roadmaps = getRoadmaps();
    const index = roadmaps.findIndex((r) => r.id === roadmapId);
    if (index === -1) throw new Error('로드맵을 찾을 수 없습니다.');

    roadmaps[index] = { ...roadmaps[index], ...data };
    mockStorage.set('roadmaps', roadmaps);
    return roadmaps[index];
  },

  deleteRoadmap: async (roadmapId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const roadmaps = getRoadmaps();
    const filtered = roadmaps.filter((r) => r.id !== roadmapId);
    mockStorage.set('roadmaps', filtered);
  },

  toggleFavorite: async (roadmapId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const roadmaps = getRoadmaps();
    const roadmap = roadmaps.find((r) => r.id === roadmapId);
    if (roadmap) {
      roadmap.isFavorite = !roadmap.isFavorite;
      mockStorage.set('roadmaps', roadmaps);
    }
  },

  getLastAccessed: async (): Promise<RoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const roadmaps = getRoadmaps();
    const sorted = [...roadmaps].sort(
      (a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime(),
    );
    if (sorted.length === 0) throw new Error('로드맵이 없습니다.');
    return sorted[0];
  },

  getRoadmapCount: async (): Promise<RoadmapCountResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { count: getRoadmaps().length };
  },

  createTeamRoadmap: async (
    teamId: number,
    data: TeamRoadmapCreateRequest,
  ): Promise<TeamRoadmapResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const roadmaps = getRoadmaps();
    const newRoadmap: any = {
      id: mockStorage.getNextId(),
      title: data.title,
      description: data.description,
      categories: data.categories,
      lastModifiedAt: new Date().toISOString().split('T')[0],
      lastAccessedAt: new Date().toISOString(),
      color: data.color,
      icon: data.icon,
      progress: 0,
      directoryId: data.directoryId,
      teamId,
      teamName: '팀',
    };
    roadmaps.push(newRoadmap);
    mockStorage.set('roadmaps', roadmaps);
    return newRoadmap;
  },

  getTeamRoadmaps: async (teamId: number): Promise<TeamRoadmapResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getRoadmaps().filter((r: any) => r.teamId === teamId) as any;
  },
};

export const mockNodeApi = {
  createNode: async (roadmapId: number, data: NodeCreateRequest): Promise<NodeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nodes = getNodes();
    const newNode: NodeResponse = {
      id: mockStorage.getNextId(),
      title: data.title,
      description: data.description,
      height: data.height,
      width: data.width,
      type: data.type,
      x: data.x,
      y: data.y,
      color: data.color,
      roadmapId,
      parentNodeId: data.parentNodeId,
      childNode: [],
      progress: 0,
      isEducation: false,
    };
    nodes.push(newNode);
    mockStorage.set('nodes', nodes);
    return newNode;
  },

  getNodes: async (roadmapId: number): Promise<NodeListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const nodes = getNodes().filter((n) => n.roadmapId === roadmapId);
    return { nodes };
  },

  getNode: async (roadmapId: number, nodeId: number): Promise<NodeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const node = getNodes().find((n) => n.id === nodeId && n.roadmapId === roadmapId);
    if (!node) throw new Error('노드를 찾을 수 없습니다.');
    return node;
  },

  updateNode: async (
    roadmapId: number,
    nodeId: number,
    data: NodeUpdateRequest,
  ): Promise<NodeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nodes = getNodes();
    const index = nodes.findIndex((n) => n.id === nodeId && n.roadmapId === roadmapId);
    if (index === -1) throw new Error('노드를 찾을 수 없습니다.');

    nodes[index] = { ...nodes[index], ...data };
    mockStorage.set('nodes', nodes);
    return nodes[index];
  },

  deleteNode: async (roadmapId: number, nodeId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nodes = getNodes();
    const filtered = nodes.filter((n) => !(n.id === nodeId && n.roadmapId === roadmapId));
    mockStorage.set('nodes', filtered);
  },

  convertEducationNode: async (
    roadmapId: number,
    nodeId: number,
    data: EducationNodeConvertRequest,
  ): Promise<NodeResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nodes = getNodes();
    const index = nodes.findIndex((n) => n.id === nodeId && n.roadmapId === roadmapId);
    if (index === -1) throw new Error('노드를 찾을 수 없습니다.');

    nodes[index] = { ...nodes[index], isEducation: true, subject: data.subject };
    mockStorage.set('nodes', nodes);
    return nodes[index];
  },
};

export const mockProblemApi = {
  createProblem: async (nodeId: number, data: ProblemCreateRequest): Promise<ProblemResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const problems = getProblems();
    const answers = getProblemAnswers();

    const newProblem: ProblemResponse = {
      id: mockStorage.getNextId(),
      title: data.title,
      status: 'UNRESOLVED',
    };

    problems.push(newProblem);
    answers.set(newProblem.id, data.answer);

    mockStorage.set('problems', problems);
    mockStorage.set('problemAnswers', Array.from(answers.entries()));

    return newProblem;
  },

  solveProblem: async (
    nodeId: number,
    problemId: number,
    data: ProblemSolveRequest,
  ): Promise<ProblemResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const problems = getProblems();
    const answers = getProblemAnswers();

    const index = problems.findIndex((p) => p.id === problemId);
    if (index === -1) throw new Error('문제를 찾을 수 없습니다.');

    const correctAnswer = answers.get(problemId);
    const isCorrect = correctAnswer === data.answer;

    problems[index] = {
      ...problems[index],
      status: isCorrect ? 'RESOLVED' : 'UNRESOLVED',
    };

    mockStorage.set('problems', problems);
    return problems[index];
  },
};
