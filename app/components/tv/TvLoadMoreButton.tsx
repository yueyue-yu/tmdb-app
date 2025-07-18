'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { TvCategory } from '@/app/lib/api/tvActions';

interface TvLoadMoreButtonProps {
  category: TvCategory;
  currentPage: number;
  totalPages: number;
}

export default function TvLoadMoreButton({ category, currentPage, totalPages }: TvLoadMoreButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      // 使用硬导航触发 loading.tsx
      window.location.href = `/home/tv/${category}?page=${newPage}`;
    });
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="join">
      <button
        className="join-item btn btn-outline"
        disabled={!canGoPrevious || isPending}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeftIcon className="w-4 h-4" />
        上一页
      </button>
      
      <button className="join-item btn btn-active">
        第 {currentPage} 页 / 共 {totalPages} 页
      </button>
      
      <button
        className="join-item btn btn-outline"
        disabled={!canGoNext || isPending}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        下一页
        <ChevronRightIcon className="w-4 h-4" />
      </button>
      
      {isPending && (
        <div className="ml-3 flex items-center gap-2">
          <span className="loading loading-spinner loading-sm"></span>
          <span className="text-sm text-base-content/60">加载中...</span>
        </div>
      )}
    </div>
  );
}
