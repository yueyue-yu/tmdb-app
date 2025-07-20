'use client';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import type { FilterParams } from '@/app/type/search';

interface FilterButtonProps {
  onClick: () => void;
  filters?: FilterParams;
  className?: string;
}

/**
 * 筛选器按钮组件
 * 显示筛选器状态并触发抽屉打开
 */
export default function FilterButton({
  onClick,
  filters,
  className = ''
}: FilterButtonProps) {

  // 计算活跃筛选器数量
  const getActiveFiltersCount = () => {
    if (!filters) return 0;
    
    let count = 0;
    if (filters.yearFrom || filters.yearTo) count++;
    if (filters.ratingFrom || filters.ratingTo) count++;
    if (filters.genres && filters.genres.length > 0) count++;
    if (filters.sortBy && filters.sortBy !== 'popularity.desc') count++;
    
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <button
      onClick={onClick}
      className={`btn btn-outline gap-2 relative ${className}`}
      aria-label="打开筛选器"
    >
      <AdjustmentsHorizontalIcon className="w-5 h-5" />
      <span>筛选</span>
      
      {/* 活跃筛选器计数徽章 */}
      {activeCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {activeCount}
        </div>
      )}
    </button>
  );
}
