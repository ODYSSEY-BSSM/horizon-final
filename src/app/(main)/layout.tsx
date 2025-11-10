'use client';

import styled from '@emotion/styled';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Header from '@/shared/layout/Header/Header';
import Sidebar from '@/shared/layout/Sidebar/Sidebar';

const StyledMainLayoutContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const StyledMainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: var(--app-height);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const getSelectedSidebarItem = (path: string) => {
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

const getBreadcrumbs = (path: string): string[] => {
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

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(pathname ?? '');
  }, [pathname]);

  const selectedSidebarItem = useMemo(() => getSelectedSidebarItem(currentPath), [currentPath]);

  const breadcrumbs = useMemo(() => getBreadcrumbs(currentPath), [currentPath]);

  return (
    <StyledMainLayoutContainer>
      <Sidebar selected={selectedSidebarItem} />
      <StyledMainContent>
        <Header breadcrumbs={breadcrumbs} />
        {children}
      </StyledMainContent>
    </StyledMainLayoutContainer>
  );
}
