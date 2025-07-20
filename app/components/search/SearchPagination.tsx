/**
 * 搜索分页组件
 * 专门用于搜索结果的分页导航
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import type { SearchPaginationProps } from '@/app/type/search';

export default function SearchPagination({
  searchParams,
  currentPage,
  totalPages,
  hasMore,
  className = ''
}: SearchPaginationProps) {
  const [, startTransition] = useTransition();
  const [navigatingToPage, setNavigatingToPage] = useState<number | null>(null);
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const t = useTranslations('Search');
  
  const hasPrevious = currentPage > 1;
  const { query, type } = searchParams;

  // 导航到指定页面
  const navigateToPage = (page: number) => {
    const params = new URLSearchParams({
      q: query,
      type: type,
      page: page.toString()
    });

    setNavigatingToPage(page);
    
    startTransition(() => {
      router.push(`/home/search?${params.toString()}`);
    });
  };

  // 如果正在导航，显示加载状态
  if (navigatingToPage !== null) {
    return (
      <div className={`flex flex-col items-center gap-6 mt-12 ${className}`}>
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/60 mt-2">
            正在加载第 {navigatingToPage} 页...
          </p>
        </div>
      </div>
    );
  }

  // 如果没有上一页也没有下一页，显示结束提示
  if (!hasPrevious && !hasMore && currentPage === 1) {
    return (
      <div className={`text-center mt-12 ${className}`}>
        <div className="card bg-base-100 shadow-md max-w-md mx-auto">
          <div className="card-body text-center">
            <h3 className="card-title justify-center text-base-content/80">
              搜索完成
            </h3>
            <p className="text-base-content/60">
              已显示所有搜索结果
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-6 mt-12 ${className}`}>
      {/* 分页信息 */}
      <div className="text-center">
        <p className="text-base-content/60">
          第 <span className="font-bold text-primary">{currentPage}</span> 页
          {totalPages > 0 && (
            <span> / 共 <span className="font-bold">{totalPages}</span> 页</span>
          )}
        </p>
        <p className="text-sm text-base-content/50 mt-1">
          搜索关键词: "<span className="font-medium">{query}</span>"
        </p>
      </div>

      {/* 分页按钮 */}
      <div className="flex gap-4">
        {/* 上一页按钮 */}
        <button
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={!hasPrevious}
          className="btn btn-outline gap-2 min-w-32"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          上一页
        </button>

        {/* 下一页按钮 */}
        <button
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={!hasMore}
          className="btn btn-primary gap-2 min-w-32"
        >
          下一页
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 快捷导航 */}
      {(hasPrevious || hasMore) && (
        <div className="flex gap-2 text-sm">
          {/* 首页 */}
          {currentPage > 2 && (
            <button
              onClick={() => navigateToPage(1)}
              className="btn btn-ghost btn-xs"
            >
              首页
            </button>
          )}
          
          {/* 省略号 */}
          {currentPage > 3 && (
            <span className="self-center text-base-content/40">...</span>
          )}
          
          {/* 上一页数字 */}
          {currentPage > 1 && (
            <button
              onClick={() => navigateToPage(currentPage - 1)}
              className="btn btn-ghost btn-xs"
            >
              {currentPage - 1}
            </button>
          )}
          
          {/* 当前页 */}
          <span className="btn btn-xs btn-primary">
            {currentPage}
          </span>
          
          {/* 下一页数字 */}
          {hasMore && currentPage < totalPages && (
            <button
              onClick={() => navigateToPage(currentPage + 1)}
              className="btn btn-ghost btn-xs"
            >
              {currentPage + 1}
            </button>
          )}
          
          {/* 省略号 */}
          {hasMore && currentPage < totalPages - 2 && (
            <span className="self-center text-base-content/40">...</span>
          )}

          {/* 末页 */}
          {hasMore && currentPage < totalPages - 1 && totalPages > 0 && (
            <button
              onClick={() => navigateToPage(totalPages)}
              className="btn btn-ghost btn-xs"
            >
              末页
            </button>
          )}
        </div>
      )}

      {/* 页面跳转 */}
      {totalPages > 5 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-base-content/60">跳转到:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder="页码"
            className="input input-bordered input-xs w-16"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt((e.target as HTMLInputElement).value);
                if (page >= 1 && page <= totalPages && page !== currentPage) {
                  navigateToPage(page);
                }
              }
            }}
          />
          <span className="text-base-content/60">页</span>
        </div>
      )}
    </div>
  );
}
