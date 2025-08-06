'use client';

import SearchResultCardSkeleton from './SearchResultCardSkeleton';

/**
 * 搜索结果骨架屏
 * 显示一个骨架网格，用于初始加载状态
 */
export default function SearchResultsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SearchResultCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}
