import type { MenuItem } from '@/lib/types/dashboard';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    icon: 'home',
    label: '대시보드',
  },
  {
    id: 'my-roadmaps',
    icon: 'Home_storage',
    label: '개인 로드맵',
  },
  {
    id: 'team-space',
    icon: 'group',
    label: '팀 스페이스',
  },
  {
    id: 'school-connect',
    icon: 'school',
    label: '학교 연동',
    checked: true,
  },
];

export const SIDEBAR_WIDTH = '240px';
