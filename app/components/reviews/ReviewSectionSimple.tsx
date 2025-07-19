/**
 * 简化版评论组件
 * 用于详情页面，只显示少量评论
 */

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChatBubbleLeftRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import ReviewCard from './ReviewCard';
import type { ReviewSectionSimpleProps } from '@/app/type/reviews';

export default function ReviewSectionSimple({
  reviews,
  mediaType,
  mediaId,
  showCount = 3,
  totalReviews
}: ReviewSectionSimpleProps) {
  const t = useTranslations('Reviews');
  
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const displayReviews = reviews.slice(0, showCount);
  const reviewsPageUrl = `/detail/${mediaType}/${mediaId}/reviews`;
  const actualTotalReviews = totalReviews || reviews.length;

  return (
    <div className="space-y-6">
      {/* 标题和查看更多按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{t('reviews')}</h2>
          <span className="text-base-content/60">({actualTotalReviews})</span>
        </div>

        {actualTotalReviews > showCount && (
          <Link 
            href={reviewsPageUrl}
            className="btn btn-outline btn-sm gap-2 hover:btn-primary"
          >
            {t('viewAll')}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* 评论列表 */}
      <div className="space-y-4">
        {displayReviews.map((review, index) => (
          <ReviewCard
            key={review.id}
            review={review}
            index={index}
            priority={index < 2}
            className="w-full"
          />
        ))}
      </div>

      {/* 查看更多提示 */}
      {actualTotalReviews > showCount && (
        <div className="text-center pt-4">
          <Link
            href={reviewsPageUrl}
            className="text-primary hover:text-primary-focus transition-colors"
          >
            {t('moreReviews', { count: actualTotalReviews - showCount })}
          </Link>
        </div>
      )}
    </div>
  );
}
