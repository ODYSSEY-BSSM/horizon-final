'use client';

import styled from '@emotion/styled';
import Sidebar from '@/components/layout/Sidebar/Sidebar';

const MainLayoutContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: var(--app-height);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayoutContainer>
      <Sidebar selected="dashboard" />
      <MainContent>{children}</MainContent>
    </MainLayoutContainer>
  );
}
