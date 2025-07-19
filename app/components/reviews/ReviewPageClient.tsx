/**
 * 评论页面客户端组件
 * 显示完整的评论信息
 */

'use client';

import { useState, useReducer } from 'react';
import { ArrowLeftIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import ReviewCard from './ReviewCard';
import type { ReviewPageClientProps, ReviewState, ReviewAction, ReviewSortOption } from '@/app/type/reviews';

/**
 * 评论状态管理
 */
function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload, isLoading: false, error: null };
    case 'SET_PAGE_INFO':
      return { 
        ...state, 
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalResults: action.payload.totalResults
      };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'RESET':
      return {
        reviews: [],
        isLoading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        sortBy: 'newest' as ReviewSortOption
      };
    default:
      return state;
  }
}

/**
 * 获取海报URL
 */
function getPosterUrl(path: string | null | undefined): string {
  if (!path) return '/images/no-poster.jpg';
  return `https://image.tmdb.org/t/p/w342${path}`;
}

/**
 * 排序评论
 */
function sortReviews(reviews: any[], sortBy: ReviewSortOption) {
  const sorted = [...reviews];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    case 'highest_rated':
      return sorted.sort((a, b) => (b.author_details.rating || 0) - (a.author_details.rating || 0));
    case 'lowest_rated':
      return sorted.sort((a, b) => (a.author_details.rating || 0) - (b.author_details.rating || 0));
    default:
      return sorted;
  }
}

export default function ReviewPageClient({
  reviews: initialReviews,
  mediaType,
  mediaTitle,
  mediaId,
  posterPath,
  totalResults,
  totalPages,
  currentPage,
  translations
}: ReviewPageClientProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<ReviewSortOption>('newest' as ReviewSortOption);
  
  const handleBack = () => {
    router.back();
  };

  // 排序评论
  const sortedReviews = sortReviews(initialReviews, sortBy);

  if (!initialReviews || initialReviews.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={handleBack}
          className="btn btn-ghost gap-2 mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {translations.backToDetail}
        </button>

        <div className="text-center text-base-content/60 py-12">
          <h1 className="text-3xl font-bold mb-4">{translations.reviews}</h1>
          <p>{translations.noReviews}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        className="btn btn-ghost gap-2 mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        {translations.backToDetail}
      </button>

      {/* 页面标题和海报 */}
      <div className="flex items-start gap-6 mb-8">
        {/* 海报 */}
        {posterPath && (
          <div className="flex-shrink-0">
            <img
              src={getPosterUrl(posterPath)}
              alt={mediaTitle}
              className="w-24 h-36 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        
        {/* 标题信息 */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{translations.reviewsFor}</h1>
          <p className="text-base-content/70 text-lg mb-4">
            {mediaTitle}
          </p>
          
          {/* 快速统计 */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-semibold text-primary">{totalResults}</span>
              <span className="text-base-content/60 ml-1">{translations.totalReviews}</span>
            </div>
            {totalPages > 1 && (
              <div>
                <span className="font-semibold text-secondary">{currentPage}</span>
                <span className="text-base-content/60 ml-1">{translations.page}</span>
                <span className="text-base-content/60 mx-1">{translations.of}</span>
                <span className="font-semibold text-secondary">{totalPages}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 排序和筛选 */}
      <div className="flex items-center justify-between mb-6 p-4 bg-base-200 rounded-lg">
        <div className="flex items-center gap-4">
          <FunnelIcon className="w-5 h-5 text-base-content/60" />
          <span className="font-medium">{translations.sortBy}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ReviewSortOption)}
            className="select select-sm select-bordered"
          >
            <option value="newest">{translations.newest}</option>
            <option value="oldest">{translations.oldest}</option>
            <option value="highest_rated">{translations.highestRated}</option>
            <option value="lowest_rated">{translations.lowestRated}</option>
          </select>
        </div>
        
        <div className="text-sm text-base-content/60">
          {translations.totalReviews}: {totalResults}
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {sortedReviews.map((review, index) => (
          <ReviewCard
            key={review.id}
            review={review}
            index={index}
            priority={index < 3}
            showFullContent={true}
          />
        ))}
      </div>

      {/* 分页信息 */}
      {totalPages > 1 && (
        <div className="mt-12 p-6 bg-base-200 rounded-lg text-center">
          <p className="text-base-content/70">
            {translations.page} {currentPage} {translations.of} {totalPages}
          </p>
          <p className="text-sm text-base-content/60 mt-2">
            {translations.totalReviews}: {totalResults}
          </p>
        </div>
      )}
    </div>
  );
}
