'use client';

import styled from '@emotion/styled';
import {
  EducationListSection,
  EmptyState,
  SchoolConnectHeader,
  SchoolInfoSection,
  useEducation,
  useEducationPagination,
  useSchoolConnect,
} from '@/feature/school';
import { ConfirmModal } from '@/shared/ui';

const SchoolConnectContent = () => {
  const { state, modals, handleConnect, handleDisconnectClick, handleDisconnect, closeModal } =
    useSchoolConnect();

  const { educations, isLoading } = useEducation();
  const { currentEducations, currentPage, totalPages, goToPage } =
    useEducationPagination(educations);

  const handleViewClick = (educationId: number) => {
    // TODO: Navigate to education detail or roadmap list
    // educationId will be used for navigation
    void educationId;
  };

  return (
    <>
      <StyledPageContainer>
        {state.status === 'connected' && state.school ? (
          <>
            <SchoolConnectHeader />
            <SchoolInfoSection
              school={state.school}
              educationCount={educations.length}
              onDisconnect={handleDisconnectClick}
            />
            {isLoading ? (
              <div>로딩 중...</div>
            ) : educations.length === 0 ? (
              <div>교육 데이터가 없습니다.</div>
            ) : (
              <EducationListSection
                educations={currentEducations}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                onViewClick={handleViewClick}
              />
            )}
          </>
        ) : (
          <EmptyState onConnect={handleConnect} />
        )}
      </StyledPageContainer>

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
    </>
  );
};

export default SchoolConnectContent;

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 14px 60px 80px;
  box-sizing: border-box;
  position: relative;
  height: calc(100vh - 72px);
  overflow: auto;
`;
