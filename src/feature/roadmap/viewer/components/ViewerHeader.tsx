'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { tokens } from '@/shared/tokens';
import { Button, Icon } from '@/shared/ui';

interface ViewerHeaderProps {
  roadmapTitle: string;
  onEditClick?: () => void;
  showEditButton?: boolean;
}

export const ViewerHeader = ({
  roadmapTitle,
  onEditClick,
  showEditButton = true,
}: ViewerHeaderProps) => {
  return (
    <StyledHeader>
      <StyledLeftSection>
        <Link href="/dashboard">
          <StyledLogo>
            <Icon name="map" size={40} color={tokens.colors.primary[500]} filled />
          </StyledLogo>
        </Link>
        <StyledTitleSection>
          <StyledHeaderTitle>Roadmap Viewer</StyledHeaderTitle>
          <StyledDivider />
          <StyledRoadmapTitle>{roadmapTitle}</StyledRoadmapTitle>
        </StyledTitleSection>
      </StyledLeftSection>
      {showEditButton && (
        <Button
          size="medium"
          variant="contained"
          iconName="edit"
          iconPosition="left"
          onClick={onEditClick}
        >
          수정하기
        </Button>
      )}
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: ${tokens.spacing.medium} ${tokens.spacing.large};
  background-color: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
`;

const StyledLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
`;

const StyledLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
`;

const StyledHeaderTitle = styled.h1`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[20]};
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: ${tokens.typos.lineHeight[28]};
  letter-spacing: ${tokens.typos.letterSpacing['-1']};
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const StyledDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: ${tokens.colors.neutral[500]};
`;

const StyledRoadmapTitle = styled.h2`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[20]};
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: ${tokens.typos.lineHeight[28]};
  letter-spacing: ${tokens.typos.letterSpacing['-1']};
  color: ${tokens.colors.neutral[500]};
  margin: 0;
`;
