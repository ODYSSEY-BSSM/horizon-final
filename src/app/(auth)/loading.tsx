'use client';

import styled from '@emotion/styled';
import { ClipLoader } from 'react-spinners';
import { tokens } from '@/shared/tokens';
import { Text } from '@/shared/ui';

export default function AuthLoading() {
  return (
    <StyledContainer>
      {/* 브랜딩 */}
      <StyledBrandingSection>
        <Text variant="H2" color={tokens.colors.primary[500]}>
          HORIZON
        </Text>
        <Text variant="B1" color={tokens.colors.neutral[500]}>
          잠시만 기다려주세요...
        </Text>
      </StyledBrandingSection>

      {/* React Spinners */}
      <ClipLoader
        color={tokens.colors.primary[500]}
        size={40}
        loading={true}
        cssOverride={{
          display: 'block',
        }}
      />

      {/* 설명 텍스트 */}
      <Text variant="O" color={tokens.colors.neutral[400]}>
        페이지를 준비하고 있습니다
      </Text>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 400px;
`;

const StyledBrandingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
