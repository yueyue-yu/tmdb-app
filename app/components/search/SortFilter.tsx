'use client';

import { useTranslations } from 'next-intl';
import { SortOption, SearchTypeEnum, SORT_OPTION_I18N_MAP } from '@/app/type/search';

interface SortFilterProps {
  value?: SortOption;
  onChange: (value?: SortOption) => void;
  searchType: SearchTypeEnum;
  className?: string;
}

/**
 * 排序筛选组件
 * 根据搜索类型显示不同的排序选项
 */
export default function SortFilter({ 
  value, 
  onChange, 
  searchType, 
  className = '' 
}: SortFilterProps) {
  const t = useTranslations('Search');

  // 根据搜索类型获取可用的排序选项
  const getSortOptions = () => {
    const baseOptions = [
      SortOption.RELEVANCE,
      SortOption.POPULARITY_DESC,
      SortOption.POPULARITY_ASC,
      SortOption.VOTE_AVERAGE_DESC,
      SortOption.VOTE_AVERAGE_ASC
    ];

    if (searchType === SearchTypeEnum.MOVIE || searchType === SearchTypeEnum.ALL) {
      return [
        ...baseOptions,
        SortOption.RELEASE_DATE_DESC,
        SortOption.RELEASE_DATE_ASC,
        SortOption.TITLE_ASC,
        SortOption.TITLE_DESC
      ];
    }

    if (searchType === SearchTypeEnum.TV) {
      return [
        ...baseOptions,
        SortOption.FIRST_AIR_DATE_DESC,
        SortOption.FIRST_AIR_DATE_ASC,
        SortOption.TITLE_ASC,
        SortOption.TITLE_DESC
      ];
    }

    // 演员搜索只支持相关度和热门度
    if (searchType === SearchTypeEnum.PERSON) {
      return [
        SortOption.RELEVANCE,
        SortOption.POPULARITY_DESC,
        SortOption.POPULARITY_ASC
      ];
    }

    return baseOptions;
  };

  const sortOptions = getSortOptions();

  // 处理排序变化
  const handleSortChange = (newValue: string) => {
    if (newValue === '') {
      onChange(undefined);
    } else {
      onChange(newValue as SortOption);
    }
  };

  // 获取排序选项的图标
  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case SortOption.RELEVANCE:
        return '🎯';
      case SortOption.POPULARITY_DESC:
      case SortOption.POPULARITY_ASC:
        return '🔥';
      case SortOption.VOTE_AVERAGE_DESC:
      case SortOption.VOTE_AVERAGE_ASC:
        return '⭐';
      case SortOption.RELEASE_DATE_DESC:
      case SortOption.RELEASE_DATE_ASC:
      case SortOption.FIRST_AIR_DATE_DESC:
      case SortOption.FIRST_AIR_DATE_ASC:
        return '📅';
      case SortOption.TITLE_ASC:
      case SortOption.TITLE_DESC:
        return '🔤';
      default:
        return '';
    }
  };

  // 获取排序选项的描述
  const getSortDescription = (option: SortOption) => {
    switch (option) {
      case SortOption.RELEVANCE:
        return '按搜索相关度排序';
      case SortOption.POPULARITY_DESC:
        return '按热门度从高到低';
      case SortOption.POPULARITY_ASC:
        return '按热门度从低到高';
      case SortOption.VOTE_AVERAGE_DESC:
        return '按评分从高到低';
      case SortOption.VOTE_AVERAGE_ASC:
        return '按评分从低到高';
      case SortOption.RELEASE_DATE_DESC:
        return '按发布日期从新到旧';
      case SortOption.RELEASE_DATE_ASC:
        return '按发布日期从旧到新';
      case SortOption.FIRST_AIR_DATE_DESC:
        return '按首播日期从新到旧';
      case SortOption.FIRST_AIR_DATE_ASC:
        return '按首播日期从旧到新';
      case SortOption.TITLE_ASC:
        return '按标题A-Z排序';
      case SortOption.TITLE_DESC:
        return '按标题Z-A排序';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 排序选择下拉框 */}
      <select
        value={value || ''}
        onChange={(e) => handleSortChange(e.target.value)}
        className="select select-bordered select-sm w-full"
      >
        <option value="">默认排序</option>
        {sortOptions.map((option) => (
          <option key={option} value={option}>
            {getSortIcon(option)} {t(`sortOptions.${SORT_OPTION_I18N_MAP[option]}`)}
          </option>
        ))}
      </select>

      {/* 当前排序说明 */}
      {value && (
        <div className="text-xs text-base-content/60 bg-base-200 rounded p-2">
          <div className="flex items-center gap-2">
            <span>{getSortIcon(value)}</span>
            <span>{getSortDescription(value)}</span>
          </div>
        </div>
      )}

      {/* 排序选项快捷按钮 */}
      <div className="space-y-3">
        <p className="text-sm text-base-content/80 font-medium">快速排序:</p>
        <div className="grid grid-cols-1 gap-2">
          {[
            SortOption.POPULARITY_DESC,
            SortOption.VOTE_AVERAGE_DESC,
            searchType === SearchTypeEnum.TV ? SortOption.FIRST_AIR_DATE_DESC : SortOption.RELEASE_DATE_DESC,
            SortOption.RELEVANCE
          ].filter(Boolean).map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`btn btn-sm justify-start gap-2 h-10 text-base ${
                value === option ? 'btn-primary' : 'btn-outline'
              }`}
              title={getSortDescription(option!)}
            >
              <span className="text-lg">{getSortIcon(option!)}</span>
              <span className="text-left flex-1 font-medium">
                {t(`sortOptions.${SORT_OPTION_I18N_MAP[option!]}`).split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 清除排序 */}
      {value && (
        <button
          onClick={() => onChange(undefined)}
          className="btn btn-ghost btn-xs w-full"
        >
          {t('filters.clearFilter')}
        </button>
      )}
    </div>
  );
}
