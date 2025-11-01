'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

interface AddFolderCardProps {
  onClick: () => void;
  key: string;
}

const AddFolderCard = ({ onClick }: AddFolderCardProps) => {
  return (
    <StyledAddFolderCard onClick={onClick}>
      <StyledAddFolderContent>
        <StyledAddIcon>
          <Icon name="add" variant="MD" color={tokens.colors.neutral[400]} decorative />
        </StyledAddIcon>
        <StyledAddFolderText>
          <Text as="p" variant="B1" color={tokens.colors.neutral[800]}>
            새 폴더 생성
          </Text>
          <Text as="p" variant="B2" color={tokens.colors.neutral[500]}>
            새 로드맵들을 위한 폴더를 생성하세요
          </Text>
        </StyledAddFolderText>
      </StyledAddFolderContent>
    </StyledAddFolderCard>
  );
};

export default AddFolderCard;

const StyledAddFolderCard = styled.div`
  border: 2px dashed ${tokens.colors.neutral[300]};
  border-radius: ${tokens.radius.medium};
  background-color: ${tokens.colors.white};
  height: 226px;
  width: 333px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;

  &:hover {
    border-color: ${tokens.colors.neutral[400]};
    background-color: ${tokens.colors.neutral[100]};
  }
`;

const StyledAddFolderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.medium};
`;

const StyledAddIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StyledAddFolderText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.xsmall};
  text-align: center;
`;
