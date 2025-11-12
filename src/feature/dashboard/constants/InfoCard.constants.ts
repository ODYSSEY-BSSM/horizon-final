export const CARD_CONFIGS = {
  'my-roadmap-count': {
    icon: 'map',
    label: '내 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => `${count}개 로드맵 보유 중`,
  },
  'my-roadmap-in-progress': {
    icon: 'map',
    label: '내 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => `현재 ${count}개 진행 중`,
  },
  'team-roadmap-count': {
    icon: 'group',
    label: '팀 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => `현재 ${count}개 진행 중`,
  },
  'team-roadmap-in-progress': {
    icon: 'group',
    label: '팀 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => `현재 ${count}개 진행 중`,
  },
  'connected-school': {
    icon: 'school',
    label: '학교 연결',
    subLabel: () => '학교 연결됨',
    emptyMessage: '연결된 학교가 없습니다.',
  },
} as const;
