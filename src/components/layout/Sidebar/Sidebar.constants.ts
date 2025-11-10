import type { MenuItem } from '@/feature/dashboard/types/dashboard';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    icon: 'home',
    label: '대시보드',
    path: '/dashboard',
  },
  {
    id: 'my-roadmaps',
    icon: 'Home_storage',
    label: '개인 로드맵',
    path: '/my-roadmaps',
  },
  {
    id: 'team-space',
    icon: 'group',
    label: '팀 스페이스',
    path: '/team-space',
  },
  {
    id: 'school-connect',
    icon: 'school',
    label: '학교 연동',
    checked: true,
    path: '/school-connect',
  },
];

export const SIDEBAR_WIDTH = '240px';
