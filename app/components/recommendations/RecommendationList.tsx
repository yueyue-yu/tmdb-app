/**
 * 推荐列表组件
 * 横向滚动的推荐内容列表
 */

'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import HorizontalScrollContainer, {
  HorizontalScrollSkeleton,
  HorizontalScrollEmpty
} from '@/app/components/common/HorizontalScrollContainer';
import RecommendationCard, {
  RecommendationCardSkeleton,
  EmptyRecommendationCard
} from './RecommendationCard';
import type { RecommendationListProps } from '@/app/type/recommendations';

/**
 * 推荐列表组件
 */
export default function RecommendationList({
  items,
  mediaType,
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = '暂无推荐内容',
  showCount = 10,
  className = ''
}: RecommendationListProps) {

  // 渲染推荐卡片
  const renderRecommendationCard = (item: any, index: number) => (
    <RecommendationCard
      item={item}
      mediaType={mediaType}
      index={index}
      priority={index < 3}
    />
  );

  // 错误状态
  if (error) {
    return (
      <div className={`recommendation-list ${className}`}>
        <div className="text-center py-12">
          <div className="text-error text-lg mb-2">⚠️</div>
          <p className="text-base-content/60 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn btn-outline btn-sm gap-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              重试
            </button>
          )}
        </div>
      </div>
    );
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className={`recommendation-list ${className}`}>
        <HorizontalScrollSkeleton
          count={showCount}
          className={className}
        />
      </div>
    );
  }

  // 空状态
  if (!items || items.length === 0) {
    return (
      <div className={`recommendation-list ${className}`}>
        <HorizontalScrollEmpty
          message={emptyMessage}
          className={className}
        />
      </div>
    );
  }

  const displayItems = items.slice(0, showCount);

  return (
    <div className={`recommendation-list ${className}`}>
      <HorizontalScrollContainer
        items={displayItems}
        renderItem={renderRecommendationCard}
        itemWidth="w-[180px] md:w-[200px]"
        gap="gap-4"
        className=""
        aria-label="推荐内容列表"
      />
    </div>
  );
}

/**
 * 推荐列表统计信息组件
 */
export function RecommendationListStats({ 
  totalCount, 
  showCount,
  className = '' 
}: { 
  totalCount: number;
  showCount: number;
  className?: string;
}) {
  if (totalCount === 0) return null;

  return (
    <div className={`text-sm text-base-content/60 ${className}`}>
      显示 {Math.min(showCount, totalCount)} / {totalCount} 项
    </div>
  );
}
