'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { useSchoolConnect } from '@/feature/school';
import { tokens } from '@/shared/tokens';
import { Button, ConfirmModal, Text, TextField } from '@/shared/ui';

const SchoolConnectContent = () => {
  const { isConnecting, connectFailModal, handleConnect, closeConnectFailModal } =
    useSchoolConnect();

  const [schoolCode, setSchoolCode] = useState('');

  const handleSubmit = () => {
    if (schoolCode.trim()) {
      handleConnect(schoolCode.trim());
    }
  };

  return (
    <StyledPageContainer>
      <StyledHeader>
        <Text as="h1" variant="H1" color={tokens.colors.neutral[900]}>
          학교 연동
        </Text>
        <Text as="p" variant="B1" color={tokens.colors.neutral[600]}>
          학교 코드를 입력하여 학교와 연동하세요.
        </Text>
      </StyledHeader>

      <StyledForm>
        <TextField
          label="학교 코드"
          placeholder="학교 코드를 입력하세요 (예: BSSM)"
          value={schoolCode}
          onChange={(e) => setSchoolCode(e.target.value)}
          disabled={isConnecting}
        />
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={isConnecting || !schoolCode.trim()}
        >
          {isConnecting ? '연동 중...' : '학교 연동하기'}
        </Button>
      </StyledForm>

      <ConfirmModal
        isOpen={connectFailModal}
        onClose={closeConnectFailModal}
        title="연결에 실패했습니다."
        description="본인의 학교가 지원되는지 확인한 후, 학교에서 지급한 구글 계정으로 회원가입해주세요."
        variant="alert"
      />
    </StyledPageContainer>
  );
};

export default SchoolConnectContent;

const StyledPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 60px;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
