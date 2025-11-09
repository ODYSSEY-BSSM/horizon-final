'use client';

import styled from '@emotion/styled';
import EmptyState from './_components/EmptyState';
import { useSchoolConnect } from './_hooks/useSchoolConnect';
import { useSchoolNodeList } from './_hooks/useSchoolNodeList';
import ConnectFailModal from './_modals/ConnectFailModal';
import DisconnectConfirmModal from './_modals/DisconnectConfirmModal';
import SchoolConnectHeader from './_sections/SchoolConnectHeader';
import SchoolInfoSection from './_sections/SchoolInfoSection';
import SchoolNodeListSection from './_sections/SchoolNodeListSection';

const SchoolConnectContent = () => {
  const { state, modals, handleConnect, handleDisconnectClick, handleDisconnect, closeModal } =
    useSchoolConnect();

  const { currentNodes, currentPage, totalPages, goToPage } = useSchoolNodeList(state.nodes);

  return (
    <StyledPageContainer>
      {state.status === 'connected' && state.school ? (
        <>
          <SchoolConnectHeader />
          <SchoolInfoSection school={state.school} onDisconnect={handleDisconnectClick} />
          <SchoolNodeListSection
            nodes={currentNodes}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      ) : (
        <EmptyState onConnect={handleConnect} />
      )}

      {/* Modals */}
      <ConnectFailModal isOpen={modals.connectFail} onClose={() => closeModal('connectFail')} />
      <DisconnectConfirmModal
        isOpen={modals.disconnectConfirm}
        onClose={() => closeModal('disconnectConfirm')}
        onConfirm={handleDisconnect}
      />
    </StyledPageContainer>
  );
};

export default SchoolConnectContent;

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 14px 60px 80px;
  box-sizing: border-box;
`;
