export const getSelectedSidebarItem = (path: string) => {
  if (path.startsWith('/my-roadmaps')) {
    return 'my-roadmaps';
  }
  if (path.startsWith('/team-space')) {
    return 'team-space';
  }
  if (path.startsWith('/school-connect')) {
    return 'school-connect';
  }
  return 'dashboard';
};

export const getBreadcrumbs = (path: string): string[] => {
  if (path.startsWith('/my-roadmaps')) {
    const match = path.match(/\/my-roadmaps\/([^/]+)/);
    if (match) {
      const folderId = match[1];
      // Future: Replace folderId with actual folder name from API
      // Requires async breadcrumb fetching or global folder state
      return ['My Roadmaps', folderId];
    }
    return ['My Roadmaps'];
  }
  if (path.startsWith('/team-space')) {
    return ['Team Space'];
  }
  if (path.startsWith('/school-connect')) {
    return ['School Connect'];
  }
  return ['Dashboard'];
};
