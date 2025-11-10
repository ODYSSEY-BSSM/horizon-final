export const getSelectedSidebarItem = (path: string) => {
  if (path.includes('/my-roadmaps')) {
    return 'my-roadmaps';
  }
  if (path.includes('/team-space')) {
    return 'team-space';
  }
  if (path.includes('/school-connect')) {
    return 'school-connect';
  }
  if (path.includes('/dashboard')) {
    return 'dashboard';
  }
  return 'dashboard';
};

export const getBreadcrumbs = (path: string): string[] => {
  if (path.includes('/my-roadmaps')) {
    const match = path.match(/\/my-roadmaps\/([^/]+)/);
    if (match) {
      const folderId = match[1];
      return ['My Roadmaps', `Folder${folderId}`];
    }
    return ['My Roadmaps'];
  }
  if (path.includes('/team-space')) {
    return ['Team Space'];
  }
  if (path.includes('/school-connect')) {
    return ['School Connect'];
  }
  if (path.includes('/dashboard')) {
    return ['Dashboard'];
  }
  return ['Dashboard'];
};
