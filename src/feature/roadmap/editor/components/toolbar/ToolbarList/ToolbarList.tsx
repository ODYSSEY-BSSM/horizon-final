'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { tokens } from '@/shared/tokens';
import { Icon } from '@/shared/ui';

export interface ToolbarListOption {
  icon: string;
  text: string;
  value: string;
}

export interface ToolbarListProps {
  options: ToolbarListOption[];
  onSelect?: (value: string) => void;
  maxHeight?: number;
}

export const ToolbarList = ({ options, onSelect, maxHeight = 264 }: ToolbarListProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelect = (value: string) => {
    onSelect?.(value);
  };

  return (
    <StyledContainer $maxHeight={maxHeight}>
      <StyledItemsWrapper>
        {options.map((option, index) => (
          <StyledListItem
            key={option.value}
            $isHovered={hoveredIndex === index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleSelect(option.value)}
          >
            <Icon name={option.icon} variant="SM" />
            <StyledItemText>{option.text}</StyledItemText>
          </StyledListItem>
        ))}
      </StyledItemsWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $maxHeight: number }>`
  width: 200px;
  max-height: ${(props) => props.$maxHeight}px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.small};
  overflow: hidden;
`;

const StyledItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  max-height: inherit;
  overflow: clip;
`;

const StyledListItem = styled.div<{ $isHovered: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 10px 12px;
  background-color: ${(props) =>
    props.$isHovered ? tokens.colors.neutral[100] : tokens.colors.white};
  color: ${tokens.colors.neutral[900]};
  cursor: pointer;
  white-space: pre;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;

const StyledItemText = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.regular};
  font-size: 16px;
  line-height: 24px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  flex-shrink: 0;
`;
