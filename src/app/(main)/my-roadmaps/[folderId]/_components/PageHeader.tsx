'use client';

import styled from '@emotion/styled';
import Button from '@/components/common/Button/Button';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';

interface PageHeaderProps {
  title?: string;
  onAddClick?: () => void;
  className?: string;
}

const PageHeader = ({
  title = '로드맵을 선택해주세요.',
  onAddClick,
  className,
}: PageHeaderProps) => {
  return (
    <StyledContainer className={className}>
      <Text variant="H1" color={tokens.colors.black}>
        {title}
      </Text>
      {onAddClick && (
        <Button
          variant="contained"
          size="medium"
          onClick={onAddClick}
          iconName="add"
          iconPosition="left"
        >
          새 로드맵
        </Button>
      )}
    </StyledContainer>
  );
};

export default PageHeader;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
`;
