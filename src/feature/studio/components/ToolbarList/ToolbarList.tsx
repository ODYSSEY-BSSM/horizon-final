'use client';

import styled from '@emotion/styled';
import { useState } from 'react';
import { tokens } from '@/shared/tokens';

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
    <Container $maxHeight={maxHeight}>
      <ItemsWrapper>
        {options.map((option, index) => (
          <ListItem
            key={option.value}
            $isHovered={hoveredIndex === index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleSelect(option.value)}
          >
            <ItemIcon className="material-symbols-rounded">{option.icon}</ItemIcon>
            <ItemText>{option.text}</ItemText>
          </ListItem>
        ))}
      </ItemsWrapper>
    </Container>
  );
};

const Container = styled.div<{ $maxHeight: number }>`
  width: 200px;
  max-height: ${(props) => props.$maxHeight}px;
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.sm};
  overflow: hidden;
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  max-height: inherit;
  overflow: clip;
`;

const ListItem = styled.div<{ $isHovered: boolean }>`
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

const ItemIcon = styled.span`
  font-family: 'Material Symbols Rounded', sans-serif;
  font-size: 20px;
  line-height: 1;
  color: ${tokens.colors.neutral[900]};
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  flex-shrink: 0;
`;

const ItemText = styled.p`
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  flex-shrink: 0;
`;
