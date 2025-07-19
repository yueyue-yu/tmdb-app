/**
 * 评论页面服务端组件
 * 处理翻译和数据传递
 */

import { getTranslations } from 'next-intl/server';
import ReviewPageClient from './ReviewPageClient';
import type { ReviewPageProps } from '@/app/type/reviews';

export default async function ReviewPage({
  reviews,
  mediaType,
  mediaTitle,
  mediaId,
  posterPath,
  totalResults,
  totalPages,
  currentPage
}: ReviewPageProps) {
  const t = await getTranslations('Reviews');

  const translations = {
    reviews: t('reviews'),
    noReviews: t('noReviews'),
    loadingError: t('loadingError'),
    retryLater: t('retryLater'),
    showMore: t('showMore'),
    showLess: t('showLess'),
    backToDetail: t('backToDetail'),
    reviewsFor: t('reviewsFor'),
    totalReviews: t('totalReviews'),
    page: t('page'),
    of: t('of'),
    rating: t('rating'),
    noRating: t('noRating'),
    readMore: t('readMore'),
    readLess: t('readLess'),
    writtenBy: t('writtenBy'),
    on: t('on'),
    sortBy: t('sortBy'),
    newest: t('newest'),
    oldest: t('oldest'),
    highestRated: t('highestRated'),
    lowestRated: t('lowestRated')
  };

  return (
    <ReviewPageClient
      reviews={reviews}
      mediaType={mediaType}
      mediaTitle={mediaTitle}
      mediaId={mediaId}
      posterPath={posterPath}
      totalResults={totalResults}
      totalPages={totalPages}
      currentPage={currentPage}
      translations={translations}
    />
  );
}
