'use client';

import styled from '@emotion/styled';
import type { SchoolNode } from '@/feature/school';
import { tokens } from '@/shared/tokens';
import { Text } from '@/shared/ui';

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
            설명: {node.description}
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
  border-radius: 8px;
  position: relative;
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
  white-space: pre;
`;

const StyledItemRight = styled.div`
  display: flex;
  align-items: center;
  white-space: pre;
`;

const StyledUsageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  white-space: pre;
`;
