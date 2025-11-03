import { useState } from 'react';
import { DEFAULT_VIEW_MODE } from '../_constants/viewModes.constants';
import type { ViewMode } from '../_types';

export const useViewMode = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);

  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return {
    viewMode,
    setViewMode: toggleViewMode,
  };
};
