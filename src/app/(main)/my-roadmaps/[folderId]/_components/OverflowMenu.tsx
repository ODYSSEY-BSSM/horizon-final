'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import { tokens } from '@/shared/tokens';

interface OverflowMenuProps {
  onClick?: () => void;
  className?: string;
}

const OverflowMenu = ({ onClick, className }: OverflowMenuProps) => {
  return (
    <StyledButton className={className} onClick={onClick} type="button">
      <Icon icon="more_horiz" size={20} color={tokens.colors.neutral[600]} />
    </StyledButton>
  );
};

export default OverflowMenu;

const StyledButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;
