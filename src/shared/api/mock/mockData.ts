/**
 * Mock Data (Swagger API 완벽 일치)
 */

import type { NodeType, ProblemStatus, Subject, UserRole } from '@/shared/api/types';
import type {
  RoadmapResponse,
  TeamRoadmapResponse,
  NodeResponse,
  ProblemResponse,
} from '@/feature/roadmap/types';
import type { DirectoryResponse } from '@/feature/folder/types';
import type { TeamResponse } from '@/feature/team/types';
import type { MockUser, MockSchool } from './mockTypes';

// Re-export types for backward compatibility
export type { MockUser, MockSchool } from './mockTypes';

// Swagger API 초기 데이터
export const initialMockData = {
  users: [
    {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      username: '테스트유저',
      role: 'USER' as UserRole,
      teamIds: [1],
    },
    {
      id: 2,
      email: 'admin@example.com',
      password: 'admin123',
      username: '관리자',
      role: 'ADMIN' as UserRole,
      teamIds: [],
    },
  ] as MockUser[],

  directories: [
    {
      id: 1,
      name: '프로젝트',
      directories: [
        {
          id: 2,
          name: '웹 개발',
          parentId: 1,
          directories: [],
          roadmaps: [
            { id: 1, title: 'React 마스터하기' },
            { id: 2, title: 'Next.js 완전정복' },
          ],
        },
      ],
      roadmaps: [],
    },
  ] as DirectoryResponse[],

  roadmaps: [
    {
      id: 1,
      title: 'React 마스터하기',
      description: 'React를 깊이 있게 학습하는 로드맵',
      categories: ['프론트엔드', 'JavaScript', 'React'],
      lastModifiedAt: new Date().toISOString().split('T')[0],
      lastAccessedAt: new Date().toISOString(),
      isFavorite: true,
      color: 'BLUE',
      icon: 'REACT',
      progress: 50,
      directoryId: 2,
    },
    {
      id: 2,
      title: 'Next.js 완전정복',
      description: 'Next.js로 풀스택 개발하기',
      categories: ['프론트엔드', 'React', 'Next.js'],
      lastModifiedAt: new Date().toISOString().split('T')[0],
      lastAccessedAt: new Date().toISOString(),
      isFavorite: false,
      color: 'GREEN',
      icon: 'NODE',
      progress: 30,
      directoryId: 2,
    },
  ] as RoadmapResponse[],

  nodes: [
    {
      id: 1,
      title: 'React 기초',
      description: 'React의 기본 개념 학습',
      height: 150,
      width: 200,
      type: 'TOP' as NodeType,
      x: 100,
      y: 100,
      color: 'BLUE',
      roadmapId: 1,
      childNode: [
        {
          id: 2,
          title: 'Hooks 이해하기',
          description: 'useState, useEffect 등',
          height: 120,
          width: 180,
          type: 'MIDDLE' as NodeType,
          x: 100,
          y: 300,
          color: 'GREEN',
          roadmapId: 1,
          parentNodeId: 1,
          childNode: [],
          progress: 60,
          isEducation: false,
        },
      ],
      progress: 70,
      isEducation: false,
    },
  ] as NodeResponse[],

  problems: [
    {
      id: 1,
      title: 'useState 실습',
      status: 'RESOLVED' as ProblemStatus,
    },
    {
      id: 2,
      title: 'useEffect 실습',
      status: 'UNRESOLVED' as ProblemStatus,
    },
  ] as ProblemResponse[],

  // 문제의 정답 저장 (별도 관리)
  problemAnswers: new Map<number, string>([
    [1, 'Counter 앱 완성'],
    [2, 'API 데이터 표시'],
  ]),

  teams: [
    {
      id: 1,
      name: '개발 스터디',
      leaderId: 1,
      inviteCode: 'STUDY2024',
      memberIds: [1],
    },
  ],

  teamDirectories: [] as DirectoryResponse[],

  teamRoadmaps: [] as TeamRoadmapResponse[],

  schools: [
    {
      id: 1,
      name: '부산소프트웨어마이스터고등학교',
      code: 'BSSM',
    },
  ] as MockSchool[],

  educationNodes: [
    {
      id: 1,
      name: '자료구조',
      description: '기본 자료구조 학습',
      subject: 'DATA_STRUCTURES' as Subject,
      teacher: '김선생',
      grade: 1,
      semester: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
