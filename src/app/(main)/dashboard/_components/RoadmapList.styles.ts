import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

// Main Container
export const ListContainer = styled.div`
  width: 1080px;
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  overflow: hidden;
  box-shadow: ${tokens.shadow[0]};
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

// Thumbnail Grid Container
export const ThumbnailGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 246px);
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
`;
