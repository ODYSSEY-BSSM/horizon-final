'use client';

import styled from '@emotion/styled';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

const SchoolConnectHeader = () => {
  return (
    <StyledHeader>
      <Text as="h2" variant="H2" color={tokens.colors.black}>
        학교에 연동되어있습니다.
      </Text>
    </StyledHeader>
  );
};

export default SchoolConnectHeader;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${tokens.spacing.medium} 0;
`;
