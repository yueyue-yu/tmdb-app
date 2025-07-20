'use client';

import { useTranslations } from 'next-intl';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface LoadingTriggerProps {
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  onRetry: () => void;
  setTriggerRef: (node: HTMLDivElement | null) => void;
  className?: string;
}

/**
 * 无限滚动加载触发器组件
 * 作为Intersection Observer的目标元素
 */
export default function LoadingTrigger({
  loading,
  hasMore,
  error,
  onRetry,
  setTriggerRef,
  className = ''
}: LoadingTriggerProps) {
  const t = useTranslations('Common');

  // 如果没有更多数据且没有错误，不显示触发器
  if (!hasMore && !error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-base-content/60">
          <div className="text-2xl mb-2">🎉</div>
          <p className="text-sm">已加载全部内容</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div 
        ref={setTriggerRef}
        className={`text-center py-8 ${className}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-error">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
          <button
            onClick={onRetry}
            className="btn btn-outline btn-sm gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            重试
          </button>
        </div>
      </div>
    );
  }

  // 加载状态
  if (loading) {
    return (
      <div 
        ref={setTriggerRef}
        className={`text-center py-8 ${className}`}
      >
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-md"></span>
          <p className="text-sm text-base-content/60">正在加载更多内容...</p>
        </div>
      </div>
    );
  }

  // 默认触发器（有更多数据但未加载）
  return (
    <div 
      ref={setTriggerRef}
      className={`text-center py-8 ${className}`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-dashed border-base-content/20 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-base-content/20 rounded-full"></div>
        </div>
        <p className="text-xs text-base-content/40">滚动加载更多</p>
      </div>
    </div>
  );
}
