'use client';

import { ReactNode } from 'react';
import { useInfiniteScroll, LoadMoreFunction, InfiniteScrollConfig } from '@/app/lib/hooks/useInfiniteScroll';
import LoadingTrigger from './LoadingTrigger';
import BackToTop from './BackToTop';

interface InfiniteScrollContainerProps<T> {
  loadMore: LoadMoreFunction<T>;
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderError?: (error: string, retry: () => void) => ReactNode;
  config?: InfiniteScrollConfig;
  className?: string;
  itemClassName?: string;
  showBackToTop?: boolean;
  backToTopThreshold?: number;
}

/**
 * 无限滚动容器组件
 * 提供完整的无限滚动功能，包括加载状态、错误处理、回到顶部等
 */
export default function InfiniteScrollContainer<T>({
  loadMore,
  renderItem,
  renderEmpty,
  renderError,
  config,
  className = '',
  itemClassName = '',
  showBackToTop = true,
  backToTopThreshold = 300
}: InfiniteScrollContainerProps<T>) {
  const {
    items,
    loading,
    hasMore,
    error,
    retry,
    setTriggerRef
  } = useInfiniteScroll(loadMore, config);

  // 初始加载状态
  if (loading && items.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* 骨架屏加载状态 */}
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex gap-4">
              <div className="w-24 h-36 bg-base-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-base-300 rounded w-3/4"></div>
                <div className="h-3 bg-base-300 rounded w-1/2"></div>
                <div className="h-3 bg-base-300 rounded w-full"></div>
                <div className="h-3 bg-base-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 初始错误状态
  if (error && items.length === 0) {
    if (renderError) {
      return <div className={className}>{renderError(error, retry)}</div>;
    }

    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="space-y-4">
          <div className="text-6xl">😕</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">加载失败</h3>
            <p className="text-base-content/60 mb-4">{error}</p>
            <button onClick={retry} className="btn btn-primary">
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 空数据状态
  if (items.length === 0 && !loading) {
    if (renderEmpty) {
      return <div className={className}>{renderEmpty()}</div>;
    }

    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="space-y-4">
          <div className="text-6xl">🔍</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">暂无数据</h3>
            <p className="text-base-content/60">没有找到相关内容</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 数据列表 - 支持外部布局类名 */}
      <div className={className}>
        {items.map((item, index) => {
          // 生成唯一的key，优先使用item的id，否则使用index
          const uniqueKey = (item as any)?.id ? `item-${(item as any).id}-${index}` : `index-${index}`;
          return (
            <div key={uniqueKey} className={itemClassName}>
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>

      {/* 加载触发器 */}
      <LoadingTrigger
        loading={loading}
        hasMore={hasMore}
        error={error}
        onRetry={retry}
        setTriggerRef={setTriggerRef}
        className="mt-8"
      />

      {/* 回到顶部按钮 */}
      {showBackToTop && (
        <BackToTop threshold={backToTopThreshold} />
      )}
    </div>
  );
}
