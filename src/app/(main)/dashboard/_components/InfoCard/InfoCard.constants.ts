// using literal keys and `as const` to keep strong types without generics

export const CARD_CONFIGS = {
  'my-roadmaps': {
    icon: 'map',
    label: '내 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => `${count}개 로드맵 진행중`,
  },
  'team-roadmaps': {
    icon: 'group',
    label: '팀 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => `${count}개 팀 참여중`,
  },
  'connected-school': {
    icon: 'school',
    label: '연결된 학교',
    emptyMessage: '연결되지 않았습니다.',
    subLabel: () => '연결된 학교가 없습니다',
  },
} as const;
