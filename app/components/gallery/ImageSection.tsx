/**
 * 图片区域组件
 * 在详情页面显示图片画廊
 */

import { getTranslations } from 'next-intl/server';
import ImageSectionClient from './ImageSectionClient';
import type { ImageSectionProps } from '@/app/type/image';

export default async function ImageSection({ mediaId, mediaType, mediaTitle }: ImageSectionProps) {
  const t = await getTranslations('Gallery');
  
  return (
    <ImageSectionClient 
      mediaId={mediaId}
      mediaType={mediaType}
      mediaTitle={mediaTitle}
      translations={{
        images: t('images'),
        all: t('all'),
        backdrops: t('backdrops'),
        posters: t('posters'),
        stills: t('stills'),
        logos: t('logos'),
        showMore: t('showMore'),
        showLess: t('showLess'),
        sortBy: t('sortBy'),
        sortByVote: t('sortByVote'),
        sortBySize: t('sortBySize'),
        sortByQuality: t('sortByQuality'),
        filterByLanguage: t('filterByLanguage'),
        allLanguages: t('allLanguages'),
        noImages: t('noImages'),
        loadingError: t('loadingError'),
        retryLater: t('retryLater')
      }}
    />
  );
}
