'use client';

import styled from '@emotion/styled';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import type { RoadmapCategory } from '@/lib/types/dashboard';
import { tokens } from '@/shared/tokens';
import { CARD_CONFIGS } from '../_constants/InfoCard.constants';

interface InfoCardProps {
  className?: string;
  category: RoadmapCategory;
  count?: number;
  subCount?: number;
  schoolName?: string;
  hasItem?: boolean;
}

const InfoCard = ({
  category,
  count = 0,
  subCount = 0,
  schoolName,
  hasItem = false,
  className,
}: InfoCardProps) => {
  const config = CARD_CONFIGS[category];
  const isSchoolCard = category === 'connected-school';
  const hasSchool = isSchoolCard && hasItem && schoolName;

  return (
    <StyledCardContainer className={className}>
      <StyledCardContent>
        <StyledLabelSection>
          <Text as="span" variant="B1" color={tokens.colors.neutral[500]}>
            {config.label}
          </Text>
          {isSchoolCard ? (
            <Text
              as="span"
              variant="H2"
              color={tokens.colors.neutral[800]}
              ellipsis
              whiteSpace="nowrap"
              width="100%"
            >
              {hasSchool ? schoolName : config.emptyMessage}
            </Text>
          ) : (
            <Text as="span" variant="H1" color={tokens.colors.neutral[800]}>
              {count}
            </Text>
          )}
        </StyledLabelSection>

        <StyledSubInfo>
          <Icon
            name={isSchoolCard ? (hasItem ? 'check_circle' : 'cancel') : 'file_export'}
            variant="XS"
            color={isSchoolCard && !hasItem ? tokens.colors.error[200] : tokens.colors.neutral[500]}
            decorative
          />
          <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
            {isSchoolCard ? config.subLabel(0) : config.subLabel(subCount)}
          </Text>
        </StyledSubInfo>
      </StyledCardContent>

      <StyledIconContainer>
        <Icon
          name={config.icon}
          variant="LG"
          color={tokens.colors.primary[500]}
          filled
          decorative
        />
      </StyledIconContainer>
    </StyledCardContainer>
  );
};

export default InfoCard;

const StyledCardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 344px;
  height: 136px;
  padding: 0 ${tokens.spacing.xlarge};
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  box-sizing: border-box;
  box-shadow: ${tokens.shadow[0]};
`;

const StyledCardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 92px;
  flex: 1;
  min-width: 0;
`;

const StyledLabelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  min-width: 0;
  max-width: 100%;
`;

const StyledSubInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
`;

const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: ${tokens.colors.primary[100]};
  border-radius: ${tokens.radius.medium};
  flex-shrink: 0;
  position: relative;
`;
