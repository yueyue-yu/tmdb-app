/**
 * 推荐区域服务端组件
 * 处理翻译和数据传递
 */

import { getTranslations } from 'next-intl/server';
import RecommendationSectionClient from './RecommendationSectionClient';
import type { RecommendationSectionProps } from '@/app/type/recommendations';

/**
 * 推荐区域组件
 */
export default async function RecommendationSection({
  mediaId,
  mediaType,
  mediaTitle
}: Omit<RecommendationSectionProps, 'translations'>) {
  const t = await getTranslations('recommendations');

  const translations = {
    recommendations: t('recommendations'),
    similar: t('similar'),
    recommendedFor: t('recommendedFor'),
    similarTo: t('similarTo'),
    noRecommendations: t('noRecommendations'),
    noSimilar: t('noSimilar'),
    loadingError: t('loadingError'),
    retryLater: t('retryLater'),
    showMore: t('showMore'),
    showLess: t('showLess')
  };

  return (
    <RecommendationSectionClient
      mediaId={mediaId}
      mediaType={mediaType}
      mediaTitle={mediaTitle}
      translations={translations}
    />
  );
}
