/**
 * Mock Data - 초기 데이터 정의
 */

import type {
  Color,
  Icon,
  NodeType,
  ProblemStatus,
  Subject,
  UserRole,
  ApplyStatus,
} from '@/shared/api/types';

export interface MockUser {
  uuid: number;
  email: string;
  password: string;
  username: string;
  role: UserRole;
  teams: number[];
  schoolUuid?: number;
  isConnectedSchool?: boolean;
  createdAt: string;
}

export interface MockDirectory {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  parentUuid?: number;
  childUuids: number[];
  roadmapUuids: number[];
  createdAt: string;
  updatedAt: string;
}

export interface MockTeamDirectory {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  teamId: number;
  parentUuid?: number;
  childUuids: number[];
  roadmapUuids: number[];
  createdAt: string;
  updatedAt: string;
}

export interface MockRoadmap {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  isFavorite: boolean;
  directoryUuid?: number;
  userUuid: number;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
}

export interface MockTeamRoadmap {
  uuid: number;
  name: string;
  color: Color;
  icon: Icon;
  directoryUuid?: number;
  teamId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockNode {
  uuid: number;
  name: string;
  description?: string;
  color: Color;
  icon: Icon;
  type: NodeType;
  parentUuid?: number;
  childUuids: number[];
  roadmapUuid: number;
  educationUuid?: number;
  subject?: Subject;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockProblem {
  uuid: number;
  title: string;
  description: string;
  link?: string;
  status: ProblemStatus;
  nodeUuid: number;
  createdAt: string;
  updatedAt: string;
  solvedAt?: string;
}

export interface MockTeam {
  uuid: number;
  name: string;
  description?: string;
  inviteCode: string;
  memberUuids: number[];
  createdAt: string;
  updatedAt: string;
}

export interface MockTeamMember {
  userUuid: number;
  teamUuid: number;
  joinedAt: string;
}

export interface MockTeamApply {
  uuid: number;
  teamUuid: number;
  userUuid: number;
  status: ApplyStatus;
  appliedAt: string;
  processedAt?: string;
}

export interface MockSchool {
  uuid: number;
  name: string;
  code: string;
  logoUrl?: string;
}

export interface MockEducationNode {
  uuid: number;
  name: string;
  description?: string;
  subject: Subject;
  teacher?: string;
  grade?: number;
  semester?: number;
  schoolUuid: number;
  createdAt: string;
  updatedAt: string;
}

// 초기 데이터
export const initialMockData = {
  users: [
    {
      uuid: 1,
      email: 'test@example.com',
      password: 'password123',
      username: '테스트 사용자',
      role: 'USER' as UserRole,
      teams: [],
      createdAt: new Date().toISOString(),
    },
    {
      uuid: 2,
      email: 'admin@example.com',
      password: 'admin123',
      username: '관리자',
      role: 'ADMIN' as UserRole,
      teams: [],
      createdAt: new Date().toISOString(),
    },
  ] as MockUser[],

  directories: [
    {
      uuid: 1,
      name: '프로젝트',
      color: 'BLUE' as Color,
      icon: 'FOLDER' as Icon,
      childUuids: [2, 3],
      roadmapUuids: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uuid: 2,
      name: '웹 개발',
      color: 'GREEN' as Color,
      icon: 'CODE' as Icon,
      parentUuid: 1,
      childUuids: [],
      roadmapUuids: [1, 2],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uuid: 3,
      name: 'AI/ML',
      color: 'PURPLE' as Color,
      icon: 'DATABASE' as Icon,
      parentUuid: 1,
      childUuids: [],
      roadmapUuids: [3],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as MockDirectory[],

  roadmaps: [
    {
      uuid: 1,
      name: 'React 마스터하기',
      color: 'BLUE' as Color,
      icon: 'CODE' as Icon,
      isFavorite: true,
      directoryUuid: 2,
      userUuid: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    },
    {
      uuid: 2,
      name: 'Next.js 완전정복',
      color: 'GREEN' as Color,
      icon: 'BOOK' as Icon,
      isFavorite: false,
      directoryUuid: 2,
      userUuid: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uuid: 3,
      name: '머신러닝 기초',
      color: 'PURPLE' as Color,
      icon: 'DATABASE' as Icon,
      isFavorite: true,
      directoryUuid: 3,
      userUuid: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as MockRoadmap[],

  nodes: [
    {
      uuid: 1,
      name: 'React 기초',
      description: 'React의 기본 개념 학습',
      color: 'BLUE' as Color,
      icon: 'BOOK' as Icon,
      type: 'TOP' as NodeType,
      childUuids: [2, 3],
      roadmapUuid: 1,
      isResolved: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uuid: 2,
      name: 'Hooks 이해하기',
      description: 'useState, useEffect 등',
      color: 'GREEN' as Color,
      icon: 'CODE' as Icon,
      type: 'MIDDLE' as NodeType,
      parentUuid: 1,
      childUuids: [4],
      roadmapUuid: 1,
      isResolved: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uuid: 3,
      name: 'Component 설계',
      description: '재사용 가능한 컴포넌트 만들기',
      color: 'ORANGE' as Color,
      icon: 'STAR' as Icon,
      type: 'MIDDLE' as NodeType,
      parentUuid: 1,
      childUuids: [],
      roadmapUuid: 1,
      isResolved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uuid: 4,
      name: 'Custom Hooks',
      description: '나만의 Hook 만들기',
      color: 'PINK' as Color,
      icon: 'HEART' as Icon,
      type: 'BOTTOM' as NodeType,
      parentUuid: 2,
      childUuids: [],
      roadmapUuid: 1,
      isResolved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as MockNode[],

  problems: [
    {
      uuid: 1,
      title: 'useState 실습',
      description: 'Counter 앱 만들기',
      link: 'https://example.com/problem1',
      status: 'RESOLVED' as ProblemStatus,
      nodeUuid: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      solvedAt: new Date().toISOString(),
    },
    {
      uuid: 2,
      title: 'useEffect 실습',
      description: 'API 호출 및 데이터 표시',
      status: 'UNRESOLVED' as ProblemStatus,
      nodeUuid: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as MockProblem[],

  teams: [
    {
      uuid: 1,
      name: '개발 스터디',
      description: '함께 성장하는 개발자들',
      inviteCode: 'STUDY2024',
      memberUuids: [1],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as MockTeam[],

  teamMembers: [
    {
      userUuid: 1,
      teamUuid: 1,
      joinedAt: new Date().toISOString(),
    },
  ] as MockTeamMember[],

  teamApplies: [] as MockTeamApply[],

  teamDirectories: [] as MockTeamDirectory[],

  teamRoadmaps: [] as MockTeamRoadmap[],

  schools: [
    {
      uuid: 1,
      name: '부산소프트웨어마이스터고등학교',
      code: 'BSSM',
      logoUrl: undefined,
    },
  ] as MockSchool[],

  educationNodes: [
    {
      uuid: 1,
      name: '자료구조',
      description: '기본 자료구조 학습',
      subject: 'DATA_STRUCTURES' as Subject,
      teacher: '김선생',
      grade: 1,
      semester: 1,
      schoolUuid: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uuid: 2,
      name: '알고리즘',
      description: '기본 알고리즘 학습',
      subject: 'ALGORITHMS' as Subject,
      teacher: '이선생',
      grade: 1,
      semester: 2,
      schoolUuid: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as MockEducationNode[],
};
