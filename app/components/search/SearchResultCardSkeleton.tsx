'use client';

/**
 * 搜索结果卡片骨架屏
 * 用于在搜索结果加载时提供视觉占位
 */
export default function SearchResultCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-md animate-pulse">
      <div className="aspect-[2/3] bg-base-300"></div>
      <div className="card-body p-4">
        <div className="h-6 bg-base-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-base-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}
