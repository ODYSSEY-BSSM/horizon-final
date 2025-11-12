'use client';

import styled from '@emotion/styled';
import {
  EmptyState,
  SchoolConnectHeader,
  SchoolInfoSection,
  SchoolNodeListSection,
  useSchoolConnect,
  useSchoolNodeList,
} from '@/feature/school';
import { ConfirmModal } from '@/shared/ui';

const SchoolConnectContent = () => {
  const { state, modals, handleConnect, handleDisconnectClick, handleDisconnect, closeModal } =
    useSchoolConnect();

  const { currentNodes, currentPage, totalPages, goToPage } = useSchoolNodeList(state.nodes);

  // Wrapper to handle school code input (TODO: should collect from user input)
  const handleConnectWrapper = () => {
    const schoolCode = prompt('학교 코드를 입력하세요:');
    if (schoolCode) {
      handleConnect(schoolCode);
    }
  };

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
        <EmptyState onConnect={handleConnectWrapper} />
      )}

      <ConfirmModal
        isOpen={modals.connectFail}
        onClose={() => closeModal('connectFail')}
        title="연결에 실패했습니다."
        description="본인의 학교가 지원되는지 확인한 후, 학교에서 지급한 구글 계정으로 회원가입해주세요."
        variant="alert"
      />
      <ConfirmModal
        isOpen={modals.disconnectConfirm}
        onClose={() => closeModal('disconnectConfirm')}
        onConfirm={handleDisconnect}
        title="연동을 해제하시겠습니까?"
        description="연동을 해제해도 기존에 사용한 학교 노드와 내용은 유지됩니다."
        variant="confirm"
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
