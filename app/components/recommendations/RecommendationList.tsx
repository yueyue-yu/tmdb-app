/**
 * 推荐列表组件
 * 横向滚动的推荐内容列表
 */

'use client';

import { useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 检查滚动状态
  const checkScrollButtons = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // 向左滚动
  const scrollLeft = () => {
    if (!scrollRef.current) return;
    
    const cardWidth = 200; // 卡片宽度
    const gap = 16; // 间距
    const scrollAmount = (cardWidth + gap) * 3; // 一次滚动3个卡片
    
    scrollRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  };

  // 向右滚动
  const scrollRight = () => {
    if (!scrollRef.current) return;
    
    const cardWidth = 200;
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * 3;
    
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

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
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: showCount }).map((_, index) => (
            <RecommendationCardSkeleton 
              key={index}
              className="w-[180px] md:w-[200px]"
            />
          ))}
        </div>
      </div>
    );
  }

  // 空状态
  if (!items || items.length === 0) {
    return (
      <div className={`recommendation-list ${className}`}>
        <div className="flex justify-center">
          <EmptyRecommendationCard 
            message={emptyMessage}
            className="w-[180px] md:w-[200px]"
          />
        </div>
      </div>
    );
  }

  const displayItems = items.slice(0, showCount);
  const hasMultipleItems = displayItems.length > 3;

  return (
    <div className={`recommendation-list relative ${className}`}>
      {/* 左滚动按钮 */}
      {hasMultipleItems && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border-base-300 shadow-lg"
          aria-label="向左滚动"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
      )}

      {/* 右滚动按钮 */}
      {hasMultipleItems && canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border-base-300 shadow-lg"
          aria-label="向右滚动"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      )}

      {/* 滚动容器 */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={checkScrollButtons}
      >
        {displayItems.map((item, index) => (
          <RecommendationCard
            key={`${item.id}-${index}`}
            item={item}
            mediaType={mediaType}
            index={index}
            priority={index < 3}
            className="w-[180px] md:w-[200px]"
          />
        ))}
      </div>

      {/* 渐变遮罩 */}
      {hasMultipleItems && (
        <>
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-base-100 to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-base-100 to-transparent pointer-events-none" />
          )}
        </>
      )}
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
