'use client';

import styled from '@emotion/styled';
import { Text } from '@/shared/ui';
import { tokens } from '@/shared/tokens';
import type { SchoolNode } from '../_types/schoolConnect.types';

interface SchoolNodeListItemProps {
  node: SchoolNode;
}

const SchoolNodeListItem = ({ node }: SchoolNodeListItemProps) => {
  const isUsed = node.usageCount > 0;

  return (
    <StyledItemContainer>
      <StyledItemLeft>
        <StyledNodeInfo>
          <Text as="h4" variant="ST" color={tokens.colors.neutral[800]}>
            {node.name}
          </Text>
          <Text as="p" variant="B2" color={tokens.colors.neutral[500]}>
            담당교사: {node.teacher}
          </Text>
        </StyledNodeInfo>
      </StyledItemLeft>
      <StyledItemRight>
        {isUsed ? (
          <StyledUsageInfo>
            <Text as="span" variant="B1" color={tokens.colors.neutral[800]}>
              {node.usageCount}개 로드맵에서 사용중
            </Text>
            <Text as="span" variant="ST" color={tokens.colors.primary[500]}>
              보러가기→
            </Text>
          </StyledUsageInfo>
        ) : (
          <Text as="span" variant="B1" color={tokens.colors.neutral[400]}>
            사용되지 않음
          </Text>
        )}
      </StyledItemRight>
    </StyledItemContainer>
  );
};

export default SchoolNodeListItem;

const StyledItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 16px 32px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
`;

const StyledItemLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const StyledNodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const StyledItemRight = styled.div`
  display: flex;
  align-items: center;
`;

const StyledUsageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
