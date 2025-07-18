/**
 * 分页导航组件
 * 客户端组件，支持上一页/下一页的路由切换
 */

'use client';

import { useState, useTransition } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { MediaTypeEnum } from '@/app/type/movie';

interface PaginationProps {
  mediaType: MediaTypeEnum;
  category: string;
  currentPage: number;
  hasMore: boolean;
  totalMovies: number;
}

export default function Pagination({
  mediaType,
  category,
  currentPage,
  hasMore,
  totalMovies
}: PaginationProps) {
  const [, startTransition] = useTransition();
  const [navigatingToPage, setNavigatingToPage] = useState<number | null>(null);
  const hasPrevious = currentPage > 1;
  const t = useTranslations('Movies');

  // 导航到指定页面
  const navigateToPage = (page: number) => {
    const url = page === 1 
      ? `/home/${mediaType}/${category}`
      : `/home/${mediaType}/${category}?page=${page}`;

    setNavigatingToPage(page);
    
    startTransition(() => {
      // 使用 window.location.href 强制硬导航，触发 loading.tsx
      window.location.href = url;
    });
  };

  // 如果正在导航，显示加载状态
  if (navigatingToPage !== null) {
    return (
      <div className="flex flex-col items-center gap-6 mt-12">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/60 mt-2">
            {t('loadingPage')} {navigatingToPage} 页...
          </p>
        </div>
      </div>
    );
  }

  // 如果没有上一页也没有下一页，显示结束提示
  if (!hasPrevious && !hasMore && totalMovies > 0) {
    return (
      <div className="text-center mt-12">
        <div className="card bg-base-100 shadow-md max-w-md mx-auto">
          <div className="card-body text-center">
            <h3 className="card-title justify-center text-base-content/80">
              {t('reachedEnd')}
            </h3>
            <p className="text-base-content/60">
              {t('totalFound')} <span className="font-bold text-primary">{totalMovies}</span> {t('totalMovies')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-12">
      {/* 分页信息 */}
      <div className="text-center">
        <p className="text-base-content/60">
          {t('page')} <span className="font-bold text-primary">{currentPage}</span> 页
          {totalMovies > 0 && (
            <span> · {t('thisPage')} <span className="font-bold">{totalMovies}</span> {t('totalMovies')}</span>
          )}
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
          {t('previousPage')}
        </button>

        {/* 下一页按钮 */}
        <button
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={!hasMore}
          className="btn btn-primary gap-2 min-w-32"
        >
          {t('nextPage')}
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 快捷导航 */}
      {(hasPrevious || hasMore) && (
        <div className="flex gap-2 text-sm">
          {currentPage > 2 && (
            <button
              onClick={() => navigateToPage(1)}
              className="btn btn-ghost btn-xs"
            >
              {t('firstPage')}
            </button>
          )}
          
          {currentPage > 3 && (
            <span className="self-center text-base-content/40">...</span>
          )}
          
          {currentPage > 1 && (
            <button
              onClick={() => navigateToPage(currentPage - 1)}
              className="btn btn-ghost btn-xs"
            >
              {currentPage - 1}
            </button>
          )}
          
          <span className="btn btn-xs btn-primary">
            {currentPage}
          </span>
          
          {hasMore && (
            <button
              onClick={() => navigateToPage(currentPage + 1)}
              className="btn btn-ghost btn-xs"
            >
              {currentPage + 1}
            </button>
          )}
          
          {hasMore && (
            <span className="self-center text-base-content/40">...</span>
          )}
        </div>
      )}
    </div>
  );
}
