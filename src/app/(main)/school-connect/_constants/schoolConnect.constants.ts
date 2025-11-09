import type { SchoolInfo, SchoolNode } from '../_types/schoolConnect.types';

export const ITEMS_PER_PAGE = 5;

export const MOCK_SCHOOL_INFO: SchoolInfo = {
  id: 'school-1',
  name: '부산소프트웨어마이스터고등학교',
  logoUrl: '/logo.svg', // 임시로 로고 사용
  nodeCount: 80,
};

export const MOCK_SCHOOL_NODES: SchoolNode[] = [
  {
    id: 'node-1',
    name: '프론트엔드 기초',
    teacher: '홍길동',
    usageCount: 1,
  },
  {
    id: 'node-2',
    name: '프론트엔드 중급',
    teacher: '홍길동',
    usageCount: 1,
  },
  {
    id: 'node-3',
    name: '백엔드 기초',
    teacher: '홍길동',
    usageCount: 0,
  },
  {
    id: 'node-4',
    name: 'FastAPI',
    teacher: '홍길동',
    usageCount: 1,
  },
  {
    id: 'node-5',
    name: 'Java',
    teacher: '홍길동',
    usageCount: 0,
  },
  {
    id: 'node-6',
    name: '알고리즘 심화',
    teacher: '홍길동',
    usageCount: 0,
  },
  {
    id: 'node-7',
    name: '디자인',
    teacher: '홍길동',
    usageCount: 0,
  },
  {
    id: 'node-8',
    name: '커피는 마시는 담배다',
    teacher: '홍길동',
    usageCount: 0,
  },
  {
    id: 'node-9',
    name: 'AWS',
    teacher: '홍길동',
    usageCount: 0,
  },
  {
    id: 'node-10',
    name: '앱 프로그래밍',
    teacher: '홍길동',
    usageCount: 0,
  },
];
