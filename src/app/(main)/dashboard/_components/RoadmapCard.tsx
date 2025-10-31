'use client';

import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/shared/tokens';
import {
  CardContainer,
  CategoryInfo,
  Content,
  ContentHeader,
  OverflowButton,
  ProgressBadge,
  Thumbnail,
  ThumbnailIcon,
  TitleSection,
} from './RoadmapCard.styles';
import type { RoadmapCardProps } from './RoadmapCard.types';

const RoadmapCard = ({ item, className }: RoadmapCardProps) => {
  const handleOverflowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Show overflow menu
  };

  const handleCardClick = () => {
    // TODO: Navigate to roadmap detail
  };

  return (
    <CardContainer className={className} onClick={handleCardClick} data-node-id="4510:4063">
      <Thumbnail $color={item.color} data-node-id="4510:4048">
        <ThumbnailIcon data-node-id="4510:3983">
          <Icon name={item.icon} variant="LG" color={tokens.colors.white} filled decorative />
        </ThumbnailIcon>
        <ProgressBadge data-node-id="4510:4002">
          <Text
            as="span"
            variant="C"
            color={tokens.colors.white}
            style={{
              fontSize: '11px',
              lineHeight: '18px',
              letterSpacing: '0.55px',
              fontWeight: 500,
            }}
          >
            {item.status === 'in-progress' ? '진행중' : '완료'}
          </Text>
        </ProgressBadge>
      </Thumbnail>

      <Content data-node-id="4510:4053">
        <ContentHeader>
          <TitleSection>
            <Text as="h3" variant="ST" color={tokens.colors.neutral[800]} ellipsis>
              {item.title}
            </Text>
            <Text as="p" variant="C" color={tokens.colors.neutral[500]} ellipsis>
              Roadmap Description
            </Text>
          </TitleSection>

          <OverflowButton
            onClick={handleOverflowClick}
            aria-label="더보기"
            data-node-id="4727:5000"
          >
            <Icon name="more_horiz" variant="SM" color={tokens.colors.neutral[500]} decorative />
          </OverflowButton>
        </ContentHeader>

        <CategoryInfo data-node-id="4510:3991">
          <Icon
            name="map"
            variant="XS"
            color={tokens.colors.neutral[500]}
            decorative
            style={{ fontSize: '16px' }}
          />
          <Text
            as="span"
            variant="C"
            color={tokens.colors.neutral[500]}
            style={{
              fontSize: '12px',
              lineHeight: '18px',
              letterSpacing: '0.12px',
              fontWeight: 200,
            }}
          >
            {item.category === 'personal' ? '개인 로드맵' : '팀 로드맵'}
          </Text>
        </CategoryInfo>
      </Content>
    </CardContainer>
  );
};

export default RoadmapCard;
