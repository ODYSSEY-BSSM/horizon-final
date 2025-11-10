import type { Team } from '@/feature/team/types/team';

export const mockTeams: Team[] = [
  {
    id: 'team-001',
    name: '프론트엔드 스터디',
    description: 'React와 TypeScript를 함께 공부하는 팀입니다.',
    memberCount: 8,
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'team-002',
    name: '알고리즘 마스터',
    description: '코딩테스트 준비를 위한 알고리즘 스터디',
    memberCount: 12,
    createdAt: '2024-02-20T10:30:00Z',
  },
  {
    id: 'team-003',
    name: '풀스택 개발자 모임',
    description: '백엔드부터 프론트엔드까지 전체 스택을 다루는 팀',
    memberCount: 6,
    createdAt: '2024-03-10T14:15:00Z',
  },
  {
    id: 'team-004',
    name: 'AI/ML 연구회',
    description: '머신러닝과 딥러닝을 연구하고 실습하는 팀',
    memberCount: 10,
    createdAt: '2024-04-05T11:20:00Z',
  },
];
