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
 * 简化的筛选组件 - 移动端优先
 * 只保留核心筛选功能
 */
export default function SimpleFilter({ searchParams, onFiltersChange }: SimpleFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      {/* 筛选按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-outline btn-sm gap-2 relative"
      >
        <FunnelIcon className="w-4 h-4" />
        <span className="hidden sm:inline">筛选</span>
        {hasFilters && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
        )}
      </button>

      {/* 筛选抽屉 */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 抽屉内容 */}
          <div className="fixed bottom-0 left-0 right-0 bg-base-100 rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              {/* 抽屉头部 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  筛选搜索
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* 筛选内容 */}
              <div className="space-y-6">
                {/* 搜索类型 */}
                <div>
                  <h3 className="font-medium mb-3">搜索类型</h3>
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
                  <h3 className="font-medium mb-3">年份范围</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label label-text text-xs">从</label>
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
                      <label className="label label-text text-xs">到</label>
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
                  <h3 className="font-medium mb-3">评分范围</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label label-text text-xs">最低评分</label>
                      <select
                        value={localFilters.ratingFrom || ''}
                        onChange={(e) => handleFilterChange('ratingFrom', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="select select-bordered select-sm w-full"
                      >
                        <option value="">不限</option>
                        <option value="6">6.0+</option>
                        <option value="7">7.0+</option>
                        <option value="8">8.0+</option>
                        <option value="9">9.0+</option>
                      </select>
                    </div>
                    <div>
                      <label className="label label-text text-xs">最高评分</label>
                      <select
                        value={localFilters.ratingTo || ''}
                        onChange={(e) => handleFilterChange('ratingTo', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="select select-bordered select-sm w-full"
                      >
                        <option value="">不限</option>
                        <option value="7">7.0以下</option>
                        <option value="8">8.0以下</option>
                        <option value="9">9.0以下</option>
                        <option value="10">10.0以下</option>
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
                  清除筛选
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary btn-sm flex-1"
                >
                  应用筛选
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
