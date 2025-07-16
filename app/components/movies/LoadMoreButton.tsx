/**
 * 加载更多按钮组件
 * 客户端组件，处理分页
 */

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface LoadMoreButtonProps {
  category: string;
  currentPage: number;
  hasMore: boolean;
  totalMovies: number;
}

export default function LoadMoreButton({ 
  category, 
  currentPage, 
  hasMore, 
  totalMovies 
}: LoadMoreButtonProps) {
  if (!hasMore && totalMovies > 0) {
    return (
      <div className="text-center mt-12">
        <div className="card bg-base-100 shadow-md max-w-md mx-auto">
          <div className="card-body text-center">
            <h3 className="card-title justify-center text-base-content/80">
              🎬 已经到底了
            </h3>
            <p className="text-base-content/60">
              共找到 <span className="font-bold text-primary">{totalMovies}</span> 部电影
            </p>
            <div className="card-actions justify-center mt-4">
              <Link 
                href={`/home/movies/${category}`}
                className="btn btn-outline btn-sm gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                返回第一页
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasMore) {
    return null;
  }

  const nextPage = currentPage + 1;
  const nextPageUrl = `/home/movies/${category}?page=${nextPage}`;

  return (
    <div className="text-center mt-12">
      <Link
        href={nextPageUrl}
        className="btn btn-primary btn-wide gap-2"
        prefetch={true}
      >
        <ArrowPathIcon className="w-4 h-4" />
        加载第 {nextPage} 页
      </Link>
    </div>
  );
}
