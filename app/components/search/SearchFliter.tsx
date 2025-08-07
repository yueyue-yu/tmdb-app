'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  AdjustmentsHorizontalIcon, 
  XMarkIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';
import type { SearchTypeEnum, FilterParams } from '@/app/type/search';

interface SimpleFilterProps {
  searchParams: {
    query: string;
    type: SearchTypeEnum;
    filters: FilterParams;
  };
  onFiltersChange: (filters: FilterParams) => void;
}

/**
 * 简化的筛选组件 - 使用 DaisyUI Drawer
 * 移动端从底部弹出，桌面端从侧边弹出
 */
export default function SearchFilter({ searchParams, onFiltersChange }: SimpleFilterProps) {
  const [localFilters, setLocalFilters] = useState(searchParams.filters || {});
  const t = useTranslations('Search');

  // 检查是否有筛选条件
  const hasFilters = Object.keys(localFilters).length > 0;

  // 处理筛选器变化
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = {
      ...localFilters,
      [key]: value
    };

    // 清理空值
    Object.keys(newFilters).forEach(k => {
      const filterValue = (newFilters as any)[k];
      if (filterValue === undefined || filterValue === null || filterValue === '') {
        delete (newFilters as any)[k];
      }
    });

    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // 清除所有筛选
  const handleClearAll = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  // 搜索类型选项
  const searchTypes = [
    { value: 'all', label: t('searchTypes.all'), icon: '🔍' },
    { value: 'movie', label: t('searchTypes.movie'), icon: '🎬' },
    { value: 'tv', label: t('searchTypes.tv'), icon: '📺' },
    { value: 'person', label: t('searchTypes.person'), icon: '👤' }
  ];

  return (
    <div className="drawer drawer-end">
      {/* 隐藏的复选框控制 drawer 状态 */}
      <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* 主要内容区域 */}
      <div className="drawer-content">
        {/* 筛选按钮 */}
        <label
          htmlFor="filter-drawer"
          className="btn btn-outline btn-sm gap-2 relative drawer-button"
        >
          <FunnelIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{t('filters.filter')}</span>
          {hasFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
          )}
        </label>
      </div>

      {/* 侧边栏 */}
      <div className="drawer-side z-50">
        {/* 遮罩层 */}
        <label htmlFor="filter-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
        {/* 筛选抽屉内容 - 响应式位置 */}
        <div className="
          bg-base-100 text-base-content
          fixed bottom-0 left-0 right-0 
          rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto
          md:static md:min-h-full md:w-80 md:rounded-none md:max-h-none
        ">
          <div className="p-4">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                {t('filters.filterSearch')}
              </h2>
              <label
                htmlFor="filter-drawer"
                className="btn btn-ghost btn-sm btn-circle"
              >
                <XMarkIcon className="w-4 h-4" />
              </label>
            </div>

            {/* 筛选内容 */}
            <div className="space-y-6">
              {/* 搜索类型 */}
              <div>
                <h3 className="font-medium mb-3">{t('filters.searchType')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {searchTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleFilterChange('type', type.value)}
                      className={`btn btn-sm justify-start gap-2 ${
                        searchParams.type === type.value
                          ? 'btn-primary'
                          : 'btn-outline'
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 年份筛选 */}
              <div>
                <h3 className="font-medium mb-3">{t('filters.yearRange')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label label-text text-xs">{t('filters.yearFrom')}</label>
                    <input
                      type="number"
                      placeholder="1990"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={localFilters.yearFrom || ''}
                      onChange={(e) => handleFilterChange('yearFrom', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input input-bordered input-sm w-full"
                    />
                  </div>
                  <div>
                    <label className="label label-text text-xs">{t('filters.yearTo')}</label>
                    <input
                      type="number"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={localFilters.yearTo || ''}
                      onChange={(e) => handleFilterChange('yearTo', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input input-bordered input-sm w-full"
                    />
                  </div>
                </div>
              </div>

              {/* 评分筛选 */}
              <div>
                <h3 className="font-medium mb-3">{t('filters.ratingRange')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label label-text text-xs">{t('filters.ratingFrom')}</label>
                    <select
                      value={localFilters.ratingFrom || ''}
                      onChange={(e) => handleFilterChange('ratingFrom', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="select select-bordered select-sm w-full"
                    >
                      <option value="">{t('filters.any')}</option>
                      <option value="6">6.0+</option>
                      <option value="7">7.0+</option>
                      <option value="8">8.0+</option>
                      <option value="9">9.0+</option>
                    </select>
                  </div>
                  <div>
                    <label className="label label-text text-xs">{t('filters.ratingTo')}</label>
                    <select
                      value={localFilters.ratingTo || ''}
                      onChange={(e) => handleFilterChange('ratingTo', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="select select-bordered select-sm w-full"
                    >
                      <option value="">{t('filters.any')}</option>
                      <option value="7">{t('filters.below', { value: 7 })}</option>
                      <option value="8">{t('filters.below', { value: 8 })}</option>
                      <option value="9">{t('filters.below', { value: 9 })}</option>
                      <option value="10">{t('filters.below', { value: 10 })}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部操作 */}
            <div className="flex gap-3 mt-8 pt-4 border-t border-base-200">
              <button
                onClick={handleClearAll}
                className="btn btn-outline btn-sm flex-1"
                disabled={!hasFilters}
              >
                {t('filters.clearFilter')}
              </button>
              <label
                htmlFor="filter-drawer"
                className="btn btn-primary btn-sm flex-1"
              >
                {t('filters.applyFilters')}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
