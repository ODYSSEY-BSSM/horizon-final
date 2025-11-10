'use client';

import styled from '@emotion/styled';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import Header from '@/shared/layout/Header/Header';
import Sidebar from '@/shared/layout/Sidebar/Sidebar';
import { getBreadcrumbs, getSelectedSidebarItem } from '@/shared/utils/navigation';

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

  const selectedSidebarItem = useMemo(() => getSelectedSidebarItem(pathname ?? ''), [pathname]);

  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname ?? ''), [pathname]);

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
