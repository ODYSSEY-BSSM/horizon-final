'use client';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { tokens } from '@/shared/tokens';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'success' | 'failed';
  duration?: number;
  position?: 'top' | 'bottom';
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'success',
  duration = 3000,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose(id);
      }, 300); // 애니메이션 시간과 동일
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) {
      return;
    }
    const offset = clientX - startXRef.current;
    // 오른쪽으로만 드래그 가능
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) {
      return;
    }
    setIsDragging(false);

    // 100px 이상 드래그하면 닫기
    if (dragOffset > 100) {
      handleClose();
    } else {
      setDragOffset(0);
    }
  };

  const iconName = variant === 'success' ? 'check_circle' : 'cancel';

  return (
    <StyledToastContainer
      $variant={variant}
      $isExiting={isExiting}
      $dragOffset={dragOffset}
      $isDragging={isDragging}
      role="alert"
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      <StyledTimerBar
        $variant={variant}
        $duration={duration}
        $isExiting={isExiting}
        $isDragging={isDragging}
      />
      <StyledContent>
        <StyledIcon $variant={variant}>{iconName}</StyledIcon>
        <StyledTextWrapper>
          <StyledTitleWrapper>
            {title && <StyledTitle>{title}</StyledTitle>}
            <StyledCloseButton type="button" onClick={handleClose} aria-label="Close">
              close
            </StyledCloseButton>
          </StyledTitleWrapper>
          {description && <StyledDescription>{description}</StyledDescription>}
        </StyledTextWrapper>
      </StyledContent>
    </StyledToastContainer>
  );
};

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const timerProgress = keyframes`
  from {
    height: 100%;
  }
  to {
    height: 0%;
  }
`;

const StyledToastContainer = styled.div<{
  $variant: 'success' | 'failed';
  $isExiting: boolean;
  $dragOffset: number;
  $isDragging: boolean;
}>`
  pointer-events: auto;
  width: 320px;
  background-color: ${tokens.colors.white};
  border-radius: ${tokens.radius.small};
  padding: 12px 20px;
  box-sizing: border-box;
  animation: ${({ $isExiting }) => ($isExiting ? slideOut : slideIn)} 0.3s ease-out;
  transform: translateX(${({ $dragOffset }) => $dragOffset}px);
  opacity: ${({ $dragOffset }) => 1 - $dragOffset / 300};
  transition: ${({ $isDragging }) => ($isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out')};
  cursor: grab;
  user-select: none;
  position: relative;
  overflow: hidden;

  &:active {
    cursor: grabbing;
  }
`;

const StyledTimerBar = styled.div<{
  $variant: 'success' | 'failed';
  $duration: number;
  $isExiting: boolean;
  $isDragging: boolean;
}>`
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background-color: ${({ $variant }) =>
    $variant === 'success' ? tokens.colors.primary[500] : tokens.colors.error[200]};
  animation: ${timerProgress} ${({ $duration }) => $duration}ms linear;
  animation-play-state: ${({ $isDragging }) => ($isDragging ? 'paused' : 'running')};
  animation-fill-mode: forwards;
  border-top-left-radius: ${tokens.radius.small};
  border-bottom-left-radius: ${tokens.radius.small};
`;

const StyledContent = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
`;

const StyledIcon = styled.span<{ $variant: 'success' | 'failed' }>`
  font-family: 'Material Symbols Rounded', sans-serif;
  font-size: 32px;
  font-weight: 500;
  line-height: 1;
  color: ${({ $variant }) =>
    $variant === 'success' ? tokens.colors.primary[500] : tokens.colors.error[200]};
  font-variation-settings: 'FILL' 1, 'GRAD' 0, 'opsz' 40;
  flex-shrink: 0;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const StyledTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: ${tokens.colors.neutral[900]};
`;

const StyledTitle = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: 26px;
  color: ${tokens.colors.neutral[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin: 0;
`;

const StyledDescription = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: 24px;
  color: ${tokens.colors.neutral[600]};
  width: 100%;
  margin: 0;
`;

const StyledCloseButton = styled.button`
  font-family: 'Material Symbols Rounded', sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1;
  font-variation-settings: 'FILL' 0, 'GRAD' 0, 'opsz' 24;
  border: none;
  background: none;
  color: ${tokens.colors.neutral[900]};
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    opacity: 0.7;
  }
`;
