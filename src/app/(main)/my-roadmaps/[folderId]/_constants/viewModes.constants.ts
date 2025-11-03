import type { ViewMode } from '../_types';

export interface ViewModeOption {
  id: ViewMode;
  label: string;
  icon: string;
}

export const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  { id: 'list', label: '리스트', icon: 'list' },
  { id: 'card', label: '썸네일', icon: 'calendar_view_month' },
];

export const DEFAULT_VIEW_MODE: ViewMode = 'list';
