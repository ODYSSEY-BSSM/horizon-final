'use client';

import styled from '@emotion/styled';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header/Header';
import Sidebar from '@/components/layout/Sidebar/Sidebar';

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

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine the selected sidebar item based on the current path
  const getSelectedSidebarItem = () => {
    if (pathname?.includes('/my-roadmaps')) {
      return 'my-roadmaps';
    }
    if (pathname?.includes('/team-space')) {
      return 'team-space';
    }
    if (pathname?.includes('/school-connect')) {
      return 'school-connect';
    }
    if (pathname?.includes('/dashboard')) {
      return 'dashboard';
    }
    return 'dashboard'; // default
  };

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = () => {
    if (pathname?.includes('/my-roadmaps')) {
      // Check if it's a folder detail page
      const match = pathname?.match(/\/my-roadmaps\/([^/]+)/);
      if (match) {
        const folderId = match[1];
        return ['My Roadmaps', `Folder${folderId}`];
      }
      return ['My Roadmaps'];
    }
    if (pathname?.includes('/team-space')) {
      return ['Team Space'];
    }
    if (pathname?.includes('/school-connect')) {
      return ['School Connect'];
    }
    if (pathname?.includes('/dashboard')) {
      return ['Dashboard'];
    }
    return ['Dashboard']; // default
  };

  return (
    <StyledMainLayoutContainer>
      <Sidebar selected={getSelectedSidebarItem()} />
      <StyledMainContent>
        <Header breadcrumbs={getBreadcrumbs()} />
        {children}
      </StyledMainContent>
    </StyledMainLayoutContainer>
  );
}
