'use client';

import { useTranslations } from 'next-intl';
import type { SearchTypeSelectorProps, SearchTypeEnum } from '@/app/type/search';

export default function SearchTypeSelector({ 
  currentType, 
  onTypeChange, 
  className = '' 
}: SearchTypeSelectorProps) {
  const t = useTranslations('Search');

  const searchTypes = [
    {
      value: 'all' as SearchTypeEnum,
      label: t('searchTypes.all'),
      icon: '🔍',
      description: t('searchTypeDescriptions.all')
    },
    {
      value: 'movie' as SearchTypeEnum,
      label: t('searchTypes.movie'),
      icon: '🎬',
      description: t('searchTypeDescriptions.movie')
    },
    {
      value: 'tv' as SearchTypeEnum,
      label: t('searchTypes.tv'),
      icon: '📺',
      description: t('searchTypeDescriptions.tv')
    },
    {
      value: 'person' as SearchTypeEnum,
      label: t('searchTypes.person'),
      icon: '👤',
      description: t('searchTypeDescriptions.person')
    }
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* 桌面端：标签页样式 */}
      <div className="hidden md:block">
        <div className="tabs tabs-boxed bg-base-100/50 backdrop-blur-sm justify-center">
          {searchTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onTypeChange(type.value)}
              className={`tab gap-2 ${currentType === type.value ? 'tab-active' : ''}`}
            >
              <span className="text-lg">{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 移动端：下拉选择器 */}
      <div className="md:hidden">
        <select 
          value={currentType}
          onChange={(e) => onTypeChange(e.target.value as SearchTypeEnum)}
          className="select select-bordered w-full"
        >
          {searchTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* 类型说明 */}
      <div className="mt-4 text-center">
        <p className="text-sm text-base-content/60">
          {searchTypes.find(type => type.value === currentType)?.description}
        </p>
      </div>
    </div>
  );
}
