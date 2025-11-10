import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Icon, Text } from '@/shared/ui';

interface MyRoadmapsHeaderProps {
  onAddFolder: () => void;
}

const MyRoadmapsHeader = ({ onAddFolder }: MyRoadmapsHeaderProps) => {
  return (
    <StyledHeader>
      <Text as="h1" variant="H2" color={tokens.colors.black}>
        폴더를 선택해주세요.
      </Text>
      <StyledCreateButton onClick={onAddFolder}>
        <Icon name="add" variant="SM" color={tokens.colors.white} decorative />
        <Text as="span" variant="B1" color={tokens.colors.white}>
          새 폴더
        </Text>
      </StyledCreateButton>
    </StyledHeader>
  );
};

export default MyRoadmapsHeader;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0;
`;

const StyledCreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xsmall};
  padding: ${tokens.spacing.small} 20px ${tokens.spacing.small} ${tokens.spacing.small};
  height: 40px;
  background-color: ${tokens.colors.primary[500]};
  border: none;
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  box-sizing: border-box;

  &:hover {
    background-color: ${tokens.colors.primary[600]};
  }

  &:active {
    background-color: ${tokens.colors.primary[700]};
  }
`;
