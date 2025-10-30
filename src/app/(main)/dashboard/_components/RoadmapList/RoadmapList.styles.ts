import styled from '@emotion/styled';
import type { RoadmapColor } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';
import { ROADMAP_COLORS } from './RoadmapList.constants';

export const ListContainer = styled.div`
  width: 1080px;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  overflow: hidden;
`;

// ListHeader Styles
export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
`;

export const HeaderTitle = styled.h2`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[20]};
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: ${tokens.typos.lineHeight[28]};
  letter-spacing: -0.2px;
  color: ${tokens.colors.neutral[800]};
  margin: 0;
  white-space: nowrap;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
`;

export const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  padding: ${tokens.spacing.xxsmall};
  background-color: ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
`;

export const ViewButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: ${tokens.spacing.xxsmall} ${tokens.spacing.small};
  background-color: ${({ $active }) => ($active ? tokens.colors.white : 'transparent')};
  border: none;
  border-radius: ${tokens.spacing.xxsmall};
  cursor: pointer;
  gap: ${tokens.spacing.xxsmall};
  transition: background-color 0.2s ease;
  color: ${({ $active }) => ($active ? tokens.colors.neutral[700] : tokens.colors.neutral[500])};

  &:hover {
    background-color: ${({ $active }) => ($active ? tokens.colors.white : tokens.colors.neutral[100])};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const ViewIcon = styled.span`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 24px;
  line-height: 1;
  font-variation-settings: 'FILL' ${tokens.icons.fill[0]}, 'GRAD' ${tokens.icons.grade[0]};
`;

export const ViewLabel = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[20]};
  width: 47px;
  text-align: center;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.small};
  height: 40px;
  padding: ${tokens.spacing.xsmall} ${tokens.spacing.xlarge} ${tokens.spacing.xsmall} ${tokens.spacing.small};
  background-color: ${tokens.colors.primary[500]};
  color: ${tokens.colors.white};
  border: none;
  border-radius: ${tokens.radius.medium};
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${tokens.colors.primary[600]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[200]};
    outline-offset: 2px;
  }
`;

export const AddIcon = styled.span`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 20px;
  line-height: 1;
  font-variation-settings: 'FILL' ${tokens.icons.fill[0]}, 'GRAD' ${tokens.icons.grade[0]},
    'opsz' ${tokens.icons.opticalSize[24]};
`;

export const AddText = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[20]};
`;

// FilterTap Styles
export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxlarge};
  padding: 0 ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.neutral[100]};
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: ${tokens.spacing.xsmall} ${tokens.spacing.xxsmall};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? tokens.colors.primary[500] : 'transparent')};
  cursor: pointer;
  color: ${({ $active }) => ($active ? tokens.colors.primary[500] : tokens.colors.neutral[500])};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ $active }) => ($active ? tokens.colors.primary[500] : tokens.colors.neutral[700])};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: -2px;
  }
`;

export const FilterLabel = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[20]};
  text-align: center;
  white-space: nowrap;
`;

// RoadmapListItem Styles
export const ItemContainer = styled.div<{ $hover?: boolean }>`
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 ${tokens.spacing.large};
  background-color: ${({ $hover }) => ($hover ? tokens.colors.neutral[100] : tokens.colors.white)};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.medium};
  position: relative;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;

export const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
  flex: 1;
  min-width: 0;
`;

export const LeadingIcon = styled.div<{ $color: RoadmapColor }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ $color }) => ROADMAP_COLORS[$color].background};
  border-radius: ${tokens.radius.medium};
  flex-shrink: 0;
  position: relative;
`;

export const RoadmapIcon = styled.span<{ $color: RoadmapColor }>`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 20px;
  line-height: 1;
  color: ${({ $color }) => ROADMAP_COLORS[$color].icon};
  font-variation-settings: 'FILL' ${tokens.icons.fill[1]}, 'GRAD' ${tokens.icons.grade[0]},
    'opsz' ${tokens.icons.opticalSize[24]};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  min-width: 0;
`;

export const ItemTitle = styled.h3`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[26]};
  color: ${tokens.colors.neutral[800]};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[500]};
`;

export const MetaText = styled.span`
  white-space: nowrap;
`;

export const MetaSeparator = styled.span`
  margin: 0 ${tokens.spacing.xxsmall};
`;

export const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${tokens.spacing.small};
  width: 80px;
`;

export const ProgressText = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[800]};
  text-align: right;
`;

export const ProgressBar = styled.div`
  width: 80px;
  height: 8px;
  background-color: ${tokens.colors.primary[100]};
  border-radius: 9999px;
  position: relative;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 8px;
  width: ${({ $progress }) => `${$progress}%`};
  background-color: ${tokens.colors.primary[500]};
  border-radius: 9999px;
`;

export const OverflowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: ${tokens.spacing.xsmall};
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: ${tokens.radius.small};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const OverflowIcon = styled.span`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 20px;
  line-height: 1;
  color: ${tokens.colors.neutral[500]};
  font-variation-settings: 'FILL' ${tokens.icons.fill[0]}, 'GRAD' ${tokens.icons.grade[0]},
    'opsz' ${tokens.icons.opticalSize[24]};
`;

// List Items Container
export const ListItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.large};
  padding: ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
  max-height: 944px;
`;

// Pagination Styles
export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
`;

export const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  position: relative;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid ${tokens.colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const PageNumberButton = styled(PageButton)`
  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 4px;
    width: 24px;
    height: 24px;
    background-color: ${({ $active }) => ($active ? tokens.colors.primary[200] : 'transparent')};
  border-radius: ${tokens.radius.large};
    z-index: 0;
  }
`;

export const PageIcon = styled.span<{ $disabled?: boolean }>`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 20px;
  line-height: 1;
  color: ${({ $disabled }) => ($disabled ? tokens.colors.neutral[300] : tokens.colors.neutral[700])};
  font-variation-settings: 'FILL' ${tokens.icons.fill[0]}, 'GRAD' ${tokens.icons.grade[0]},
    'opsz' ${tokens.icons.opticalSize[24]};
  position: relative;
  z-index: 1;
`;

export const PageNumber = styled.span`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[20]};
  color: ${tokens.colors.neutral[800]};
  text-align: center;
  position: relative;
  z-index: 1;
`;
