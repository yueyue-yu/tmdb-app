/**
 * 通用横向滚动容器组件
 * 提供横向滚动功能，支持滚动按钮、渐变遮罩、触摸滑动等
 */

'use client';

import { useState, useRef, ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export interface HorizontalScrollItem {
  id: string | number;
  [key: string]: any;
}

export interface HorizontalScrollContainerProps<T extends HorizontalScrollItem> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemWidth?: string; // 单个项目的宽度，如 "w-[180px] md:w-[200px]"
  gap?: string; // 项目间距，如 "gap-4"
  showScrollButtons?: boolean; // 是否显示滚动按钮
  showGradientMask?: boolean; // 是否显示渐变遮罩
  scrollAmount?: number; // 每次滚动的项目数量
  className?: string;
  containerClassName?: string;
  buttonClassName?: string;
  'aria-label'?: string;
}

/**
 * 通用横向滚动容器组件
 */
export default function HorizontalScrollContainer<T extends HorizontalScrollItem>({
  items,
  renderItem,
  itemWidth = "w-[180px] md:w-[200px]",
  gap = "gap-4",
  showScrollButtons = true,
  showGradientMask = true,
  scrollAmount = 3,
  className = "",
  containerClassName = "",
  buttonClassName = "",
  'aria-label': ariaLabel = "横向滚动列表"
}: HorizontalScrollContainerProps<T>) {
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
    
    const cardWidth = 200; // 基础卡片宽度
    const gapWidth = 16; // 间距
    const scrollDistance = (cardWidth + gapWidth) * scrollAmount;
    
    scrollRef.current.scrollBy({
      left: -scrollDistance,
      behavior: 'smooth'
    });
  };

  // 向右滚动
  const scrollRight = () => {
    if (!scrollRef.current) return;
    
    const cardWidth = 200;
    const gapWidth = 16;
    const scrollDistance = (cardWidth + gapWidth) * scrollAmount;
    
    scrollRef.current.scrollBy({
      left: scrollDistance,
      behavior: 'smooth'
    });
  };

  // 如果没有项目，返回空
  if (!items || items.length === 0) {
    return null;
  }

  const hasMultipleItems = items.length > 3;

  return (
    <div className={`horizontal-scroll-container relative ${className}`} role="region" aria-label={ariaLabel}>
      {/* 左滚动按钮 */}
      {showScrollButtons && hasMultipleItems && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border-base-300 shadow-lg ${buttonClassName}`}
          aria-label="向左滚动"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
      )}

      {/* 右滚动按钮 */}
      {showScrollButtons && hasMultipleItems && canScrollRight && (
        <button
          onClick={scrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm bg-base-100/90 hover:bg-base-100 border-base-300 shadow-lg ${buttonClassName}`}
          aria-label="向右滚动"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      )}

      {/* 滚动容器 */}
      <div
        ref={scrollRef}
        className={`flex ${gap} overflow-x-auto scrollbar-hide pb-2 ${containerClassName}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={checkScrollButtons}
        role="list"
      >
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`flex-shrink-0 ${itemWidth}`}
            role="listitem"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* 渐变遮罩 */}
      {showGradientMask && hasMultipleItems && (
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
 * 横向滚动容器的骨架屏组件
 */
export function HorizontalScrollSkeleton({
  count = 5,
  itemWidth = "w-[180px] md:w-[200px]",
  gap = "gap-4",
  className = ""
}: {
  count?: number;
  itemWidth?: string;
  gap?: string;
  className?: string;
}) {
  return (
    <div className={`horizontal-scroll-skeleton ${className}`}>
      <div className={`flex ${gap} overflow-hidden`}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`flex-shrink-0 ${itemWidth}`}
          >
            <div className="animate-pulse">
              <div className="bg-base-300 aspect-[2/3] rounded-lg mb-2"></div>
              <div className="bg-base-300 h-4 rounded mb-1"></div>
              <div className="bg-base-300 h-3 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 空状态组件
 */
export function HorizontalScrollEmpty({
  message = "暂无内容",
  className = ""
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`horizontal-scroll-empty text-center py-8 ${className}`}>
      <div className="text-base-content/60">
        {message}
      </div>
    </div>
  );
}
