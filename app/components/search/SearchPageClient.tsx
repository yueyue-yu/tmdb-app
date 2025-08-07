'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import SimpleFilter from './SimpleFilter';
import type { SearchTypeEnum, FilterParams } from '@/app/type/search';

interface SearchPageClientProps {
  query: string;
  type: SearchTypeEnum;
  filters: FilterParams;
  children: React.ReactNode;
}

/**
 * 搜索页面客户端组件
 * 处理筛选器状态管理和URL同步
 */
export default function SearchPageClient({
  query,
  type,
  filters,
  children
}: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Search');

  // 筛选器抽屉状态
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);



  // 处理筛选器变化
  const handleFiltersChange = useCallback((newFilters: FilterParams & { type?: SearchTypeEnum }) => {
    const params = new URLSearchParams(searchParams);

    // 保留基本搜索参数
    if (query) params.set('q', query);

    // 设置媒体类型（如果有变化）
    const newType = newFilters.type || type;
    params.set('type', newType);

    // 清除旧的筛选参数
    params.delete('yearFrom');
    params.delete('yearTo');
    params.delete('ratingFrom');
    params.delete('ratingTo');


    // 设置新的筛选参数（排除type，因为已经处理过了）
    const { type: _, ...filterParams } = newFilters;

    if (filterParams.yearFrom) {
      params.set('yearFrom', filterParams.yearFrom.toString());
    }
    if (filterParams.yearTo) {
      params.set('yearTo', filterParams.yearTo.toString());
    }
    if (filterParams.ratingFrom !== undefined) {
      params.set('ratingFrom', filterParams.ratingFrom.toString());
    }
    if (filterParams.ratingTo !== undefined) {
      params.set('ratingTo', filterParams.ratingTo.toString());
    }


    // 导航到新的URL
    router.push(`/search?${params.toString()}`);
  }, [query, type, searchParams, router]);

  return (
    <>
      {/* 主要内容区域 - 移动端优化 */}
      <div className="w-full">
        {/* 顶部工具栏 - 紧凑设计 */}
        <div className="flex items-center justify-between mb-4">
          {/* 简化筛选器 */}
          <SimpleFilter
            searchParams={{ query, type, filters }}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* 无限滚动内容 */}
        {children}
      </div>
    </>
  );
}
