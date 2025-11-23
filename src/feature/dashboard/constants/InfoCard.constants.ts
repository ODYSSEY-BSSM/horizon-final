export const CARD_CONFIGS = {
  'my-roadmap-count': {
    icon: 'map',
    label: '내 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => (count > 0 ? `${count}개 로드맵 진행중` : '진행중인 로드맵 없음'),
  },
  'my-roadmap-in-progress': {
    icon: 'map',
    label: '내 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => (count > 0 ? `${count}개 로드맵 진행중` : '진행중인 로드맵 없음'),
  },
  'team-roadmap-count': {
    icon: 'group',
    label: '팀 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => (count > 0 ? `${count}개 팀 참여중` : '참여중인 팀 없음'),
  },
  'team-roadmap-in-progress': {
    icon: 'group',
    label: '팀 로드맵',
    emptyMessage: '0',
    subLabel: (count: number) => (count > 0 ? `${count}개 팀 참여중` : '참여중인 팀 없음'),
  },
  'connected-school': {
    icon: 'school',
    label: '연결된 학교',
    subLabel: (hasItem: boolean) => (hasItem ? '학교 연결됨' : '연결된 학교가 없습니다'),
    emptyMessage: '연결되지 않았습니다.',
  },
} as const;
