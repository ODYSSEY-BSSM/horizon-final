import type {
  EducationNodeConvertRequest,
  NodeCreateRequest,
  NodeListResponse,
  NodeResponse,
  NodeUpdateRequest,
  ProblemCreateRequest,
  ProblemResponse,
  ProblemSolveRequest,
  RoadmapCountResponse,
  RoadmapCreateRequest,
  RoadmapResponse,
  RoadmapUpdateRequest,
  TeamRoadmapCreateRequest,
  TeamRoadmapResponse,
} from '@/feature/roadmap/types';
import { ProblemStatus } from '@/shared/api/types';
import { delay, MOCK_DELAYS } from './mockConstants';
import { initialMockData } from './mockData';
import { MOCK_ERRORS } from './mockErrors';
import { mockStorage } from './mockStorage';

type StoredRoadmap = RoadmapResponse | TeamRoadmapResponse;

function getRoadmaps(): StoredRoadmap[] {
  return mockStorage.getOrDefault('roadmaps', initialMockData.roadmaps);
}

function isTeamRoadmap(roadmap: StoredRoadmap): roadmap is TeamRoadmapResponse {
  return 'teamId' in roadmap && 'teamName' in roadmap;
}

function getPersonalRoadmaps(): RoadmapResponse[] {
  return getRoadmaps().filter((r): r is RoadmapResponse => !isTeamRoadmap(r));
}

function getNodes(): NodeResponse[] {
  return mockStorage.getOrDefault('nodes', initialMockData.nodes);
}

function getProblems(): ProblemResponse[] {
  return mockStorage.getOrDefault('problems', initialMockData.problems);
}

function getProblemAnswers(): Map<number, string> {
  const stored = mockStorage.get<[number, string][]>('problemAnswers');
  return stored ? new Map(stored) : initialMockData.problemAnswers;
}

export const mockRoadmapApi = {
  createRoadmap: async (data: RoadmapCreateRequest): Promise<RoadmapResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

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
    await delay(MOCK_DELAYS.FAST);
    return getPersonalRoadmaps();
  },

  getRoadmap: async (roadmapId: number): Promise<RoadmapResponse> => {
    await delay(MOCK_DELAYS.FAST);
    const roadmaps = getPersonalRoadmaps();
    const roadmap = roadmaps.find((r) => r.id === roadmapId);
    if (!roadmap) {
      throw new Error(MOCK_ERRORS.ROADMAP_NOT_FOUND);
    }
    return roadmap;
  },

  updateRoadmap: async (
    roadmapId: number,
    data: RoadmapUpdateRequest,
  ): Promise<RoadmapResponse> => {
    await delay(MOCK_DELAYS.NORMAL);
    const roadmaps = getRoadmaps();
    const index = roadmaps.findIndex((r) => r.id === roadmapId && !isTeamRoadmap(r));

    if (index === -1) {
      throw new Error(MOCK_ERRORS.ROADMAP_NOT_FOUND);
    }

    const updatedRoadmap = { ...(roadmaps[index] as RoadmapResponse), ...data };
    roadmaps[index] = updatedRoadmap;

    mockStorage.set('roadmaps', roadmaps);
    return updatedRoadmap;
  },

  deleteRoadmap: async (roadmapId: number): Promise<void> => {
    await delay(MOCK_DELAYS.NORMAL);
    const roadmaps = getRoadmaps();
    const filtered = roadmaps.filter((r) => isTeamRoadmap(r) || r.id !== roadmapId);
    mockStorage.set('roadmaps', filtered);
  },

  toggleFavorite: async (roadmapId: number): Promise<RoadmapResponse> => {
    await delay(MOCK_DELAYS.FAST);
    const roadmaps = getRoadmaps();
    const roadmap = roadmaps.find((r) => r.id === roadmapId);
    if (!roadmap || isTeamRoadmap(roadmap)) {
      throw new Error(MOCK_ERRORS.ROADMAP_NOT_FOUND);
    }
    roadmap.isFavorite = !roadmap.isFavorite;
    mockStorage.set('roadmaps', roadmaps);
    return roadmap as RoadmapResponse;
  },

  getLastAccessed: async (): Promise<RoadmapResponse> => {
    await delay(MOCK_DELAYS.FAST);
    const roadmaps = getPersonalRoadmaps();
    const sorted = [...roadmaps].sort(
      (a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime(),
    );
    if (sorted.length === 0) {
      throw new Error(MOCK_ERRORS.NO_ROADMAPS);
    }
    return sorted[0];
  },

  getRoadmapCount: async (): Promise<RoadmapCountResponse> => {
    await delay(MOCK_DELAYS.FAST);
    return { count: getPersonalRoadmaps().length };
  },

  createTeamRoadmap: async (
    teamId: number,
    data: TeamRoadmapCreateRequest,
  ): Promise<TeamRoadmapResponse> => {
    await delay(MOCK_DELAYS.NORMAL);
    const roadmaps = getRoadmaps();
    const newRoadmap: TeamRoadmapResponse = {
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
    await delay(MOCK_DELAYS.FAST);
    return getRoadmaps().filter(
      (r): r is TeamRoadmapResponse => isTeamRoadmap(r) && r.teamId === teamId,
    );
  },
};

export const mockNodeApi = {
  createNode: async (roadmapId: number, data: NodeCreateRequest): Promise<NodeResponse> => {
    await delay(MOCK_DELAYS.NORMAL);
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
    await delay(MOCK_DELAYS.FAST);
    const nodes = getNodes().filter((n) => n.roadmapId === roadmapId);
    return { nodes };
  },

  getNode: async (roadmapId: number, nodeId: number): Promise<NodeResponse> => {
    await delay(MOCK_DELAYS.FAST);
    const node = getNodes().find((n) => n.id === nodeId && n.roadmapId === roadmapId);
    if (!node) {
      throw new Error(MOCK_ERRORS.NODE_NOT_FOUND);
    }
    return node;
  },

  updateNode: async (
    roadmapId: number,
    nodeId: number,
    data: NodeUpdateRequest,
  ): Promise<NodeResponse> => {
    await delay(MOCK_DELAYS.NORMAL);
    const nodes = getNodes();
    const index = nodes.findIndex((n) => n.id === nodeId && n.roadmapId === roadmapId);
    if (index === -1) {
      throw new Error(MOCK_ERRORS.NODE_NOT_FOUND);
    }

    nodes[index] = { ...nodes[index], ...data };
    mockStorage.set('nodes', nodes);
    return nodes[index];
  },

  deleteNode: async (roadmapId: number, nodeId: number): Promise<void> => {
    await delay(MOCK_DELAYS.NORMAL);
    const nodes = getNodes();
    const filtered = nodes.filter((n) => !(n.id === nodeId && n.roadmapId === roadmapId));
    mockStorage.set('nodes', filtered);
  },

  convertEducationNode: async (
    roadmapId: number,
    nodeId: number,
    data: EducationNodeConvertRequest,
  ): Promise<NodeResponse> => {
    await delay(MOCK_DELAYS.NORMAL);
    const nodes = getNodes();
    const index = nodes.findIndex((n) => n.id === nodeId && n.roadmapId === roadmapId);
    if (index === -1) {
      throw new Error(MOCK_ERRORS.NODE_NOT_FOUND);
    }

    nodes[index] = { ...nodes[index], isEducation: true, subject: data.subject };
    mockStorage.set('nodes', nodes);
    return nodes[index];
  },
};

export const mockProblemApi = {
  createProblem: async (_nodeId: number, data: ProblemCreateRequest): Promise<ProblemResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const problems = getProblems();
    const answers = getProblemAnswers();

    const newProblem: ProblemResponse = {
      id: mockStorage.getNextId(),
      title: data.title,
      status: ProblemStatus.UNRESOLVED,
    };

    problems.push(newProblem);
    answers.set(newProblem.id, data.answer);

    mockStorage.set('problems', problems);
    mockStorage.set('problemAnswers', Array.from(answers.entries()));

    return newProblem;
  },

  solveProblem: async (
    _nodeId: number,
    problemId: number,
    data: ProblemSolveRequest,
  ): Promise<ProblemResponse> => {
    await delay(MOCK_DELAYS.NORMAL);

    const problems = getProblems();
    const answers = getProblemAnswers();

    const index = problems.findIndex((p) => p.id === problemId);
    if (index === -1) {
      throw new Error(MOCK_ERRORS.PROBLEM_NOT_FOUND);
    }

    const correctAnswer = answers.get(problemId);
    const isCorrect = correctAnswer === data.answer;

    problems[index] = {
      ...problems[index],
      status: isCorrect ? ProblemStatus.RESOLVED : ProblemStatus.UNRESOLVED,
    };

    mockStorage.set('problems', problems);
    return problems[index];
  },
};
