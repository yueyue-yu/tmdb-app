'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { FilterSidebarProps } from '@/app/type/search';

// 导入筛选器子组件
import MediaTypeFilter from './MediaTypeFilter';
import YearFilter from './YearFilter';
import RatingFilter from './RatingFilter';
import GenreFilter from './GenreFilter';
import FilterStatus from './FilterStatus';

/**
 * 筛选侧边栏组件
 * 支持年份、评分、类型、排序等筛选功能
 */
export default function FilterSidebar({ 
  searchParams, 
  onFiltersChange, 
  className = '' 
}: FilterSidebarProps) {
  const t = useTranslations('Search');
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(searchParams.filters || {});

  // 处理筛选器变化
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = {
      ...localFilters,
      [key]: value
    };

    // 清理空值
    Object.keys(newFilters).forEach(k => {
      const filterValue = (newFilters as any)[k];
      if (filterValue === undefined || filterValue === null ||
          (Array.isArray(filterValue) && filterValue.length === 0)) {
        delete (newFilters as any)[k];
      }
    });

    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // 清除单个筛选条件
  const handleClearFilter = (filterKey: string) => {
    const newFilters = { ...localFilters };
    delete (newFilters as any)[filterKey];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // 清除所有筛选条件
  const handleClearAll = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  // 检查是否有筛选条件
  const hasFilters = Object.keys(localFilters).length > 0;

  return (
    <>
      {/* 移动端筛选按钮 */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-outline btn-sm gap-2"
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          {t('filters.title')}
          {hasFilters && (
            <span className="badge badge-primary badge-xs">
              {Object.keys(localFilters).length}
            </span>
          )}
        </button>
      </div>

      {/* 桌面端侧边栏 */}
      <div className={`hidden lg:block w-80 ${className}`}>
        <FilterSidebarContent
          searchParams={searchParams}
          localFilters={localFilters}
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilter}
          onClearAll={handleClearAll}
          hasFilters={hasFilters}
        />
      </div>

      {/* 移动端抽屉 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 抽屉内容 */}
          <div className="fixed right-0 top-0 h-full w-80 bg-base-100 shadow-xl overflow-y-auto">
            <div className="p-4">
              {/* 抽屉头部 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  {t('filters.title')}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              <FilterSidebarContent
                searchParams={searchParams}
                localFilters={localFilters}
                onFilterChange={handleFilterChange}
                onClearFilter={handleClearFilter}
                onClearAll={handleClearAll}
                hasFilters={hasFilters}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * 筛选侧边栏内容组件
 */
interface FilterSidebarContentProps {
  searchParams: any;
  localFilters: any;
  onFilterChange: (key: string, value: any) => void;
  onClearFilter: (filterKey: string) => void;
  onClearAll: () => void;
  hasFilters: boolean;
}

function FilterSidebarContent({
  searchParams,
  localFilters,
  onFilterChange,
  onClearFilter,
  onClearAll,
  hasFilters
}: FilterSidebarContentProps) {
  const t = useTranslations('Search');

  return (
    <div className="space-y-8">
      {/* 筛选状态 */}
      <FilterStatus
        filters={localFilters}
        onClearFilter={onClearFilter}
        onClearAll={onClearAll}
      />

      {/* 媒体类型选择 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-base-content">
          搜索类型
        </h3>
        <MediaTypeFilter
          value={searchParams.type}
          onChange={(type) => onFilterChange('type', type)}
        />
      </div>



      {/* 年份筛选 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-base-content">
          年份
        </h3>
        <YearFilter
          yearFrom={localFilters.yearFrom}
          yearTo={localFilters.yearTo}
          onChange={(yearFrom, yearTo) => {
            onFilterChange('yearFrom', yearFrom);
            onFilterChange('yearTo', yearTo);
          }}
        />
      </div>

      {/* 评分筛选 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-base-content">
          评分
        </h3>
        <RatingFilter
          ratingFrom={localFilters.ratingFrom}
          ratingTo={localFilters.ratingTo}
          onChange={(ratingFrom, ratingTo) => {
            onFilterChange('ratingFrom', ratingFrom);
            onFilterChange('ratingTo', ratingTo);
          }}
        />
      </div>

      {/* 类型筛选 - 仅在电影和电视剧搜索时显示 */}
      {(searchParams.type === 'movie' || searchParams.type === 'tv' || searchParams.type === 'all') && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-base-content">
            类型
          </h3>
          <GenreFilter
            selectedGenres={localFilters.genres || []}
            onChange={(genres) => onFilterChange('genres', genres)}
            mediaType={searchParams.type === 'tv' ? 'tv' : 'movie'}
          />
        </div>
      )}
    </div>
  );
}
