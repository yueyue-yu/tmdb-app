'use client';

import { useTranslations } from 'next-intl';
import type { SearchTypeEnum } from '@/app/type/search';

interface MediaTypeFilterProps {
  value: SearchTypeEnum;
  onChange: (type: SearchTypeEnum) => void;
}

/**
 * 媒体类型筛选组件
 * 用于选择搜索的媒体类型：全部、电影、电视剧、演员
 */
export default function MediaTypeFilter({ value, onChange }: MediaTypeFilterProps) {
  const t = useTranslations('Search');

  // 媒体类型选项
  const mediaTypes = [
    { value: 'all', label: t('searchTypes.all'), icon: '🔍', description: t('searchTypeDescriptions.all') },
    { value: 'movie', label: t('searchTypes.movie'), icon: '🎬', description: t('searchTypeDescriptions.movie') },
    { value: 'tv', label: t('searchTypes.tv'), icon: '📺', description: t('searchTypeDescriptions.tv') },
    { value: 'person', label: t('searchTypes.person'), icon: '👤', description: t('searchTypeDescriptions.person') }
  ] as const;

  return (
    <div className="space-y-3">
      {/* 媒体类型按钮网格 */}
      <div className="grid grid-cols-2 gap-3">
        {mediaTypes.map((type) => {
          const isSelected = value === type.value;
          
          return (
            <button
              key={type.value}
              onClick={() => onChange(type.value as SearchTypeEnum)}
              className={`btn btn-sm justify-start gap-2 h-auto py-3 px-3 text-left ${
                isSelected ? 'btn-primary' : 'btn-outline'
              }`}
              title={type.description}
            >
              <div className="flex flex-col items-start gap-1 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-base">{type.icon}</span>
                  <span className="font-medium text-sm">{type.label}</span>
                  {isSelected && (
                    <span className="text-xs ml-auto">✓</span>
                  )}
                </div>
                <span className="text-xs opacity-70 line-clamp-1">
                  {type.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 当前选择提示 */}
      <div className="text-xs text-base-content/60 text-center">
        当前搜索：{mediaTypes.find(type => type.value === value)?.label}
      </div>
    </div>
  );
}
