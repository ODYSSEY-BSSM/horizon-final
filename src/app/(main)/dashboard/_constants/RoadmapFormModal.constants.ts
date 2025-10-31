import type { ColorOption, DropdownOption, IconOption } from '@/lib/types/modal';

export const FORM_STEPS = {
  CATEGORY: 1,
  FOLDER: 2,
  TEAM: 3,
  INFO: 4,
  STYLE: 5,
} as const;

export const TOTAL_STEPS = Object.keys(FORM_STEPS).length;

export const STEP_TITLES = {
  [FORM_STEPS.CATEGORY]: '카테고리 선택',
  [FORM_STEPS.FOLDER]: '폴더 선택',
  [FORM_STEPS.TEAM]: '팀 선택',
  [FORM_STEPS.INFO]: '로드맵 정보',
  [FORM_STEPS.STYLE]: '로드맵 스타일',
} as const;

export const STEP_DESCRIPTIONS = {
  [FORM_STEPS.CATEGORY]: '로드맵 카테고리를 선택해주세요.',
  [FORM_STEPS.FOLDER]: '로드맵을 추가할 폴더를 선택해주세요.',
  [FORM_STEPS.TEAM]: '로드맵을 추가할 팀을 선택해주세요.',
  [FORM_STEPS.INFO]: '로드맵 정보를 작성해주세요.',
  [FORM_STEPS.STYLE]: '로드맵 스타일을 지정해주세요.',
} as const;

// Mock data - replace with real API data
export const FOLDER_OPTIONS: DropdownOption[] = [
  { id: 'folder1', label: '폴더1', value: 'folder1' },
  { id: 'folder2', label: '폴더2', value: 'folder2' },
  { id: 'folder3', label: '폴더3', value: 'folder3' },
  { id: 'folder4', label: '폴더4', value: 'folder4' },
  { id: 'folder5', label: '폴더5', value: 'folder5' },
  { id: 'folder6', label: '폴더6', value: 'folder6' },
];

export const TEAM_OPTIONS: DropdownOption[] = [
  { id: 'team1', label: '개발팀', value: 'team1' },
  { id: 'team2', label: '디자인팀', value: 'team2' },
  { id: 'team3', label: '기획팀', value: 'team3' },
  { id: 'team4', label: '마케팅팀', value: 'team4' },
];

export const COLOR_OPTIONS: ColorOption[] = [
  { id: 'red', label: 'Red', value: 'red', color: '#dc2626' },
  { id: 'orange', label: 'Orange', value: 'orange', color: '#ea580c' },
  { id: 'yellow', label: 'Yellow', value: 'yellow', color: '#e6c200' },
  { id: 'green', label: 'Green', value: 'green', color: '#16a34a' },
  { id: 'blue', label: 'Blue', value: 'blue', color: '#2666dc' },
  { id: 'purple', label: 'Purple', value: 'purple', color: '#a826dc' },
];

export const ICON_OPTIONS: IconOption[] = [
  { id: 'language', label: 'Language', value: 'language', icon: 'language' },
  { id: 'code', label: 'Code', value: 'code', icon: 'code' },
  { id: 'shield', label: 'Shield', value: 'shield', icon: 'shield' },
  { id: 'database', label: 'Database', value: 'database', icon: 'database' },
  { id: 'host', label: 'Host', value: 'host', icon: 'host' },
  { id: 'html', label: 'HTML', value: 'html', icon: 'html' },
  { id: 'css', label: 'CSS', value: 'css', icon: 'css' },
  { id: 'javascript', label: 'JavaScript', value: 'javascript', icon: 'javascript' },
  { id: 'public', label: 'Public', value: 'public', icon: 'public' },
  { id: 'function', label: 'Function', value: 'function', icon: 'function' },
  { id: 'school', label: 'School', value: 'school', icon: 'school' },
  { id: 'extension', label: 'Extension', value: 'extension', icon: 'extension' },
  { id: 'asterisk', label: 'Asterisk', value: 'asterisk', icon: 'asterisk' },
  { id: 'deployed_code', label: 'Deployed Code', value: 'deployed_code', icon: 'deployed_code' },
  { id: 'psychiatry', label: 'Psychiatry', value: 'psychiatry', icon: 'psychiatry' },
  {
    id: 'network_intelligence',
    label: 'Network Intelligence',
    value: 'network_intelligence',
    icon: 'network_intelligence',
  },
  {
    id: 'network_intel_node',
    label: 'Network Intel Node',
    value: 'network_intel_node',
    icon: 'network_intel_node',
  },
];
