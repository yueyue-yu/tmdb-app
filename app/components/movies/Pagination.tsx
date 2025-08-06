/**
 * 分页导航组件
 * 客户端组件，支持上一页/下一页的路由切换
 */

'use client';

import Link from 'next/link';
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
  const hasPrevious = currentPage > 1;
  const t = useTranslations('Movies');

  // Helper to construct the page URL
  const getPageUrl = (page: number) => {
    if (page <= 1) {
      return `/${mediaType}/${category}`;
    }
    return `/${mediaType}/${category}?page=${page}`;
  };

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
      {/* 分页按钮 */}
      <div className="flex gap-4">
        {/* 上一页按钮 */}
        <Link
          href={getPageUrl(currentPage - 1)}
          aria-disabled={!hasPrevious}
          className={`btn btn-outline gap-2 min-w-32 ${!hasPrevious ? 'btn-disabled' : ''}`}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {t('previousPage')}
        </Link>

        {/* 下一页按钮 */}
        <Link
          href={getPageUrl(currentPage + 1)}
          aria-disabled={!hasMore}
          className={`btn btn-primary gap-2 min-w-32 ${!hasMore ? 'btn-disabled' : ''}`}
        >
          {t('nextPage')}
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* 快捷导航 */}
      {(hasPrevious || hasMore) && (
        <div className="flex gap-2 text-sm items-center">
          {currentPage > 2 && (
            <Link
              href={getPageUrl(1)}
              className="btn btn-ghost btn-xs"
            >
              {t('firstPage')}
            </Link>
          )}
          
          {currentPage > 3 && (
            <span className="self-center text-base-content/40">...</span>
          )}
          
          {currentPage > 1 && (
            <Link
              href={getPageUrl(currentPage - 1)}
              className="btn btn-ghost btn-xs"
            >
              {currentPage - 1}
            </Link>
          )}
          
          <span className="btn btn-xs btn-primary pointer-events-none">
            {currentPage}
          </span>
          
          {hasMore && (
            <Link
              href={getPageUrl(currentPage + 1)}
              className="btn btn-ghost btn-xs"
            >
              {currentPage + 1}
            </Link>
          )}
          
          {hasMore && ( // This logic is kept from original for visual consistency
            <span className="self-center text-base-content/40">...</span>
          )}
        </div>
      )}
    </div>
  );
}
