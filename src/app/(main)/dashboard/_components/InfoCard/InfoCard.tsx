'use client';

import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import { CARD_CONFIGS } from './InfoCard.constants';
import {
  CardContainer,
  CardContent,
  IconContainer,
  LabelSection,
  SubInfo,
} from './InfoCard.styles';
import type { InfoCardProps } from './InfoCard.types';

const InfoCard = ({
  category,
  count = 0,
  subCount = 0,
  schoolName,
  hasItem = false,
  className,
}: InfoCardProps) => {
  const config = CARD_CONFIGS[category] as {
    icon: string;
    label: string;
    emptyMessage: string;
    subLabel: (count: number) => string;
  };
  const isSchoolCard = category === 'connected-school';
  const hasSchool = isSchoolCard && hasItem && schoolName;

  return (
    <CardContainer className={className} data-node-id="4452:681">
      <CardContent>
        <LabelSection>
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
        </LabelSection>

        <SubInfo>
          <Icon
            name={isSchoolCard ? (hasItem ? 'check_circle' : 'cancel') : 'file_export'}
            variant="XS"
            color={isSchoolCard && !hasItem ? tokens.colors.error[200] : tokens.colors.neutral[500]}
            decorative
          />
          <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
            {isSchoolCard ? (
              config.subLabel(0)
            ) : (
              <>
                {subCount}
                {config.subLabel(subCount)}
              </>
            )}
          </Text>
        </SubInfo>
      </CardContent>

      <IconContainer>
        <Icon
          name={config.icon}
          variant="LG"
          color={tokens.colors.primary[500]}
          filled
          decorative
        />
      </IconContainer>
    </CardContainer>
  );
};

export default InfoCard;
