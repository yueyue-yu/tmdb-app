/**
 * 评论卡片组件
 * 显示单个评论的信息
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { formatReviewContent, formatReviewDate, getReviewAuthorAvatar } from '@/app/lib/utils/reviewUtils';
import type { ReviewCardProps } from '@/app/type/reviews';

/**
 * 获取评分星星组件
 */
function RatingStars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  
  const stars = [];
  const fullStars = Math.floor(rating / 2); // TMDB评分是10分制，转换为5星制
  const hasHalfStar = (rating % 2) >= 1;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative w-4 h-4">
          <StarOutlineIcon className="w-4 h-4 text-yellow-400 absolute" />
          <div className="overflow-hidden w-1/2">
            <StarIcon className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
      );
    }
  }
  
  return <div className="flex items-center gap-1">{stars}</div>;
}

export default function ReviewCard({
  review,
  index = 0,
  priority = false,
  className = '',
  showFullContent = false
}: ReviewCardProps) {
  const t = useTranslations('Reviews');
  const [isExpanded, setIsExpanded] = useState(showFullContent);
  
  const avatarUrl = getReviewAuthorAvatar(review.author_details.avatar_path);
  const formattedDate = formatReviewDate(review.created_at);
  const shortContent = formatReviewContent(review.content, 300);
  const needsExpansion = review.content.length > 300;
  
  const displayContent = isExpanded ? review.content : shortContent;
  
  return (
    <div className={`bg-base-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* 评论头部 */}
      <div className="flex items-start gap-4 mb-4">
        {/* 作者头像 */}
        <div className="flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={review.author}
            width={48}
            height={48}
            className="rounded-full object-cover"
            priority={priority}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-avatar.svg';
            }}
          />
        </div>
        
        {/* 作者信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base-content truncate">
              {review.author}
            </h3>
            {review.author_details.rating && (
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                <StarIcon className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {review.author_details.rating}/10
                </span>
              </div>
            )}
          </div>
          
          {/* 评分星星 */}
          {review.author_details.rating && (
            <div className="flex items-center gap-2 mb-2">
              <RatingStars rating={review.author_details.rating} />
              <span className="text-xs text-base-content/60">
                {(review.author_details.rating / 2).toFixed(1)}/5
              </span>
            </div>
          )}
          
          {/* 评论日期 */}
          <p className="text-sm text-base-content/60">
            {t('writtenBy')} {review.author} {t('on')} {formattedDate}
          </p>
        </div>
      </div>
      
      {/* 评论内容 */}
      <div className="prose prose-sm max-w-none">
        <div 
          className="text-base-content/80 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
        
        {/* 展开/收起按钮 */}
        {needsExpansion && !showFullContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-primary hover:text-primary-focus text-sm font-medium transition-colors"
          >
            {isExpanded ? t('readLess') : t('readMore')}
          </button>
        )}
      </div>
      
      {/* 评论底部信息 */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
        <div className="flex items-center gap-4 text-xs text-base-content/60">
          {review.author_details.username && (
            <span>@{review.author_details.username}</span>
          )}
          {review.updated_at !== review.created_at && (
            <span>{t('updated')} {formatReviewDate(review.updated_at)}</span>
          )}
        </div>
        
        {/* 评论链接 */}
        {review.url && (
          <a
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-focus text-xs font-medium transition-colors"
          >
            {t('viewOriginal')}
          </a>
        )}
      </div>
    </div>
  );
}
