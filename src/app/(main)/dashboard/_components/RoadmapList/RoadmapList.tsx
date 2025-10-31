'use client';

import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import Icon from '@/components/common/Icon/Icon';
import Text from '@/components/common/Text/Text';
import type { RoadmapFormData } from '@/lib/types/modal';
import { tokens } from '@/shared/tokens';
import RoadmapCard from '../RoadmapCard/RoadmapCard';
import RoadmapFormModal from '../RoadmapFormModal';
import { FILTERS, ROADMAP_COLORS } from './RoadmapList.constants';
import { useRoadmapList } from './RoadmapList.hooks';
import {
  FilterButton,
  FilterContainer,
  FilterLabel,
  HeaderActions,
  HeaderContainer,
  HeaderTitle,
  ItemContainer,
  ItemInfo,
  ItemLeft,
  ItemMeta,
  ItemRight,
  ItemTitle,
  LeadingIcon,
  ListContainer,
  ListItemsContainer,
  MetaSeparator,
  MetaText,
  OverflowButton,
  PageButton,
  PageNumber,
  PageNumberButton,
  PaginationContainer,
  ProgressBar,
  ProgressContainer,
  ProgressFill,
  ProgressText,
  ThumbnailGridContainer,
  ViewButton,
  ViewToggle,
} from './RoadmapList.styles';
import type {
  FilterTapProps,
  ListHeaderProps,
  PaginationProps,
  RoadmapListItemProps,
  RoadmapListProps,
} from './RoadmapList.types';

const ListHeader = ({ currentView, onViewChange, onAddRoadmap }: ListHeaderProps) => {
  return (
    <HeaderContainer data-node-id="4502:1437">
      <HeaderTitle>로드맵 리스트</HeaderTitle>
      <HeaderActions>
        <ViewToggle data-node-id="4452:628">
          <ViewButton
            $active={currentView === 'list'}
            onClick={() => onViewChange('list')}
            aria-label="리스트 보기"
          >
            <Icon name="list" variant="MD" decorative />
            <Text as="span" variant="B2" color={tokens.colors.neutral[700]}>
              리스트
            </Text>
          </ViewButton>
          <ViewButton
            $active={currentView === 'thumbnail'}
            onClick={() => onViewChange('thumbnail')}
            aria-label="썸네일 보기"
          >
            <Icon name="calendar_view_month" variant="MD" decorative />
            <Text as="span" variant="B2" color={tokens.colors.neutral[500]}>
              썸네일
            </Text>
          </ViewButton>
        </ViewToggle>
        <Button
          size="medium"
          variant="contained"
          iconPosition="left"
          iconName="add"
          aria-label="새 로드맵"
          onClick={onAddRoadmap}
        >
          새 로드맵
        </Button>
      </HeaderActions>
    </HeaderContainer>
  );
};

const FilterTap = ({ currentFilter, onFilterChange }: FilterTapProps) => {
  return (
    <FilterContainer data-node-id="4502:1436">
      {FILTERS.map((filter) => (
        <FilterButton
          key={filter.id}
          $active={currentFilter === filter.id}
          onClick={() => onFilterChange(filter.id)}
          data-node-id="4452:1171"
        >
          <FilterLabel>{filter.label}</FilterLabel>
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

const RoadmapListItem = ({ item }: RoadmapListItemProps) => {
  return (
    <ItemContainer data-node-id="4502:1387">
      <ItemLeft>
        <LeadingIcon $color={item.color} data-node-id="4488:637">
          <Icon
            name={item.icon}
            variant="SM"
            color={ROADMAP_COLORS[item.color].icon}
            filled
            decorative
          />
        </LeadingIcon>
        <ItemInfo>
          <ItemTitle>{item.title}</ItemTitle>
          <ItemMeta>
            <MetaText>{item.category === 'personal' ? '개인' : '팀'}</MetaText>
            <MetaSeparator>•</MetaSeparator>
            <MetaText>{item.steps}단계</MetaText>
            <MetaSeparator>•</MetaSeparator>
            <MetaText>{item.status === 'in-progress' ? '진행중' : '완료'}</MetaText>
          </ItemMeta>
        </ItemInfo>
      </ItemLeft>
      <ItemRight>
        <ProgressContainer data-node-id="4461:545">
          <ProgressText>{item.progress}%</ProgressText>
          <ProgressBar>
            <ProgressFill $progress={item.progress} />
          </ProgressBar>
        </ProgressContainer>
        <OverflowButton aria-label="더보기" data-node-id="4461:600">
          <Icon name="more_horiz" variant="SM" color={tokens.colors.neutral[500]} decorative />
        </OverflowButton>
      </ItemRight>
    </ItemContainer>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <PaginationContainer data-node-id="4502:1523">
      <PageButton
        $disabled={!canGoPrev}
        onClick={() => canGoPrev && onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
        disabled={!canGoPrev}
        data-node-id="4502:1486"
      >
        <Icon
          name="chevron_left"
          variant="SM"
          color={canGoPrev ? tokens.colors.neutral[700] : tokens.colors.neutral[300]}
          decorative
        />
      </PageButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PageNumberButton
          key={page}
          $active={currentPage === page}
          onClick={() => onPageChange(page)}
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? 'page' : undefined}
          data-node-id="4502:1478"
        >
          <PageNumber>{page}</PageNumber>
        </PageNumberButton>
      ))}

      <PageButton
        $disabled={!canGoNext}
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
        disabled={!canGoNext}
        data-node-id="4502:1490"
      >
        <Icon
          name="chevron_right"
          variant="SM"
          color={canGoNext ? tokens.colors.neutral[700] : tokens.colors.neutral[300]}
          decorative
        />
      </PageButton>
    </PaginationContainer>
  );
};

const RoadmapList = ({
  items = [],
  onAddRoadmap = () => undefined,
  onViewChange,
  onFilterChange,
  className,
}: RoadmapListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    currentView,
    currentFilter,
    currentPage,
    totalPages,
    paginatedItems,
    handleViewChange,
    handleFilterChange,
    handlePageChange,
  } = useRoadmapList(items);

  const handleViewChangeInternal = (view: typeof currentView) => {
    handleViewChange(view);
    onViewChange?.(view);
  };

  const handleFilterChangeInternal = (filter: typeof currentFilter) => {
    handleFilterChange(filter);
    onFilterChange?.(filter);
  };

  const handleAddRoadmapClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (_data: RoadmapFormData) => {
    onAddRoadmap();
    setIsModalOpen(false);
  };

  return (
    <>
      <ListContainer className={className} data-node-id="4510:1924">
        <ListHeader
          currentView={currentView}
          onViewChange={handleViewChangeInternal}
          onAddRoadmap={handleAddRoadmapClick}
        />
        <FilterTap currentFilter={currentFilter} onFilterChange={handleFilterChangeInternal} />

        {currentView === 'list' ? (
          <ListItemsContainer>
            {paginatedItems.map((item) => (
              <RoadmapListItem key={item.id} item={item} />
            ))}
          </ListItemsContainer>
        ) : (
          <ThumbnailGridContainer data-node-id="4510:4092">
            {paginatedItems.map((item) => (
              <RoadmapCard key={item.id} item={item} />
            ))}
          </ThumbnailGridContainer>
        )}

        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </ListContainer>

      <RoadmapFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};

export default RoadmapList;
