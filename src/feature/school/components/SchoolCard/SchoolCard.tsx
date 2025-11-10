'use client';

import styled from '@emotion/styled';
import Image from 'next/image';
import { Button } from '@/shared/ui';
import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import type { SchoolInfo } from '@/feature/school';

interface SchoolCardProps {
  school: SchoolInfo;
  onDisconnect: () => void;
}

const SchoolCard = ({ school, onDisconnect }: SchoolCardProps) => {
  return (
    <StyledCardContainer>
      <StyledCardContent>
        <StyledSchoolImageWrapper>
          <Image src={school.logoUrl} alt={school.name} width={100} height={100} />
        </StyledSchoolImageWrapper>
        <StyledSchoolInfo>
          <Text as="h3" variant="H3" color={tokens.colors.neutral[900]}>
            {school.name}
          </Text>
          <Text as="p" variant="ST" color={tokens.colors.neutral[900]}>
            학교 노드: {school.nodeCount}개
          </Text>
        </StyledSchoolInfo>
      </StyledCardContent>
      <StyledButton variant="contained" size="medium" onClick={onDisconnect}>
        연동 해제하기
      </StyledButton>
    </StyledCardContainer>
  );
};

export default SchoolCard;

const StyledCardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 40px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
`;

const StyledCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledSchoolImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: ${tokens.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSchoolInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 260px;
`;

const StyledButton = styled(Button)`
  background-color: ${tokens.colors.error[200]};

  &:hover {
    background-color: ${tokens.colors.error[100]};
  }
`;
