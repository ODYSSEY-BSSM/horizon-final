import styled from '@emotion/styled';
import type { RoadmapColor } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';
import { ROADMAP_GRADIENTS } from './RoadmapCard.constants';

export const CardContainer = styled.div`
  width: 246px;
  height: 246px;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: ${tokens.shadow[0]};

  &:hover {
    border-color: ${tokens.colors.primary[500]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const Thumbnail = styled.div<{ $color: RoadmapColor }>`
  width: 100%;
  height: 148px;
  background: linear-gradient(
    135deg,
    ${(props) => ROADMAP_GRADIENTS[props.$color].start} 0%,
    ${(props) => ROADMAP_GRADIENTS[props.$color].end} 100%
  );
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: ${tokens.spacing.medium};
  box-sizing: border-box;
`;

export const ThumbnailIcon = styled.div`
  width: 32px;
  height: 32px;
  color: ${tokens.colors.white};
`;

export const ProgressBadge = styled.div`
  position: absolute;
  top: ${tokens.spacing.small};
  right: ${tokens.spacing.small};
  padding: ${tokens.spacing.xxsmall} ${tokens.spacing.xsmall};
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${tokens.radius.small};
`;

export const Content = styled.div`
  width: 100%;
  height: 98px;
  background-color: ${tokens.colors.white};
  padding: ${tokens.spacing.small} ${tokens.spacing.medium};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xsmall};
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  flex: 1;
  min-width: 0;
`;

export const OverflowButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: -${tokens.spacing.xsmall} -${tokens.spacing.xsmall} 0 0;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
    border-radius: ${tokens.radius.small};
  }
`;

export const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  margin-top: auto;
`;
