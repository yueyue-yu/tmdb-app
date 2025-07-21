'use client';

import { useTranslations } from 'next-intl';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { FilterStatusProps, FilterParams } from '@/app/type/search';

/**
 * 筛选状态显示组件
 * 显示当前筛选条件，支持清除单个或全部筛选
 */
export default function FilterStatus({ 
  filters, 
  onClearFilter, 
  onClearAll, 
  className = '' 
}: FilterStatusProps) {
  const t = useTranslations('Search');

  // 检查是否有筛选条件
  const hasFilters = Object.keys(filters).length > 0;

  if (!hasFilters) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-sm text-base-content/60">
          {t('filters.noFilters')}
        </p>
      </div>
    );
  }

  // 格式化筛选条件显示
  const formatFilterValue = (key: string, value: any): string => {
    switch (key) {
      case 'yearFrom':
        return `${value}年起`;
      case 'yearTo':
        return `${value}年止`;
      case 'ratingFrom':
        return `${value}分以上`;
      case 'ratingTo':
        return `${value}分以下`;
      case 'genres':
        return `${Array.isArray(value) ? value.length : 0}个类型`;

      default:
        return String(value);
    }
  };

  // 获取筛选条件的图标
  const getFilterIcon = (key: string): string => {
    switch (key) {
      case 'yearFrom':
      case 'yearTo':
        return '📅';
      case 'ratingFrom':
      case 'ratingTo':
        return '⭐';
      case 'genres':
        return '🎭';
      case 'sortBy':
        return '🔄';
      default:
        return '🔍';
    }
  };

  // 获取筛选条件的标签
  const getFilterLabel = (key: string): string => {
    switch (key) {
      case 'yearFrom':
      case 'yearTo':
        return t('filters.year');
      case 'ratingFrom':
      case 'ratingTo':
        return t('filters.rating');
      case 'genres':
        return t('filters.genres');
      case 'sortBy':
        return t('filters.sortBy');
      default:
        return key;
    }
  };

  // 处理年份范围的特殊显示
  const getYearRangeDisplay = () => {
    const { yearFrom, yearTo } = filters;
    if (yearFrom && yearTo) {
      return `📅 ${yearFrom}-${yearTo}年`;
    } else if (yearFrom) {
      return `📅 ${yearFrom}年起`;
    } else if (yearTo) {
      return `📅 ${yearTo}年止`;
    }
    return null;
  };

  // 处理评分范围的特殊显示
  const getRatingRangeDisplay = () => {
    const { ratingFrom, ratingTo } = filters;
    if (ratingFrom !== undefined && ratingTo !== undefined) {
      return `⭐ ${ratingFrom}-${ratingTo}分`;
    } else if (ratingFrom !== undefined) {
      return `⭐ ${ratingFrom}分以上`;
    } else if (ratingTo !== undefined) {
      return `⭐ ${ratingTo}分以下`;
    }
    return null;
  };

  // 生成筛选条件标签
  const generateFilterTags = () => {
    const tags = [];

    // 年份范围
    const yearDisplay = getYearRangeDisplay();
    if (yearDisplay) {
      tags.push({
        key: 'year',
        display: yearDisplay,
        onClear: () => {
          onClearFilter('yearFrom');
          onClearFilter('yearTo');
        }
      });
    }

    // 评分范围
    const ratingDisplay = getRatingRangeDisplay();
    if (ratingDisplay) {
      tags.push({
        key: 'rating',
        display: ratingDisplay,
        onClear: () => {
          onClearFilter('ratingFrom');
          onClearFilter('ratingTo');
        }
      });
    }

    // 其他单独的筛选条件
    const validKeys: (keyof FilterParams)[] = [];

    validKeys.forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null &&
          !(Array.isArray(value) && value.length === 0)) {
        tags.push({
          key,
          display: `${getFilterIcon(key)} ${formatFilterValue(key, value)}`,
          onClear: () => onClearFilter(key)
        });
      }
    });

    return tags;
  };

  const filterTags = generateFilterTags();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 筛选条件标题和清除全部按钮 */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-base-content/80">
          当前筛选 ({filterTags.length})
        </h4>
        <button
          onClick={onClearAll}
          className="btn btn-ghost btn-xs text-error"
        >
          {t('filters.clearAll')}
        </button>
      </div>

      {/* 筛选条件标签 */}
      <div className="flex flex-wrap gap-2">
        {filterTags.map((tag) => (
          <div
            key={tag.key}
            className="badge badge-outline gap-2 py-2 px-3"
          >
            <span className="text-xs">{tag.display}</span>
            <button
              onClick={tag.onClear}
              className="btn btn-ghost btn-xs p-0 min-h-0 h-auto hover:text-error"
              title={`清除${getFilterLabel(tag.key)}筛选`}
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* 筛选条件统计 */}
      <div className="text-xs text-base-content/50 text-center">
        {filterTags.length > 1 && (
          <p>已应用 {filterTags.length} 个筛选条件</p>
        )}
      </div>
    </div>
  );
}
