/**
 * 画廊页面组件
 * 显示完整的图片画廊，包括返回按钮和媒体信息
 */

import { getTranslations } from 'next-intl/server';
import GalleryPageClient from './GalleryPageClient';
import type { GroupedImages } from '@/app/type/image';

interface GalleryPageProps {
  images: GroupedImages;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  mediaId: number;
  posterPath?: string;
}

export default async function GalleryPage({
  images,
  mediaType,
  mediaTitle,
  mediaId,
  posterPath
}: GalleryPageProps) {
  const t = await getTranslations('Gallery');

  const translations = {
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
    retryLater: t('retryLater'),
    backToDetail: '返回详情',
    galleryFor: '图片画廊'
  };

  return (
    <GalleryPageClient
      images={images}
      mediaType={mediaType}
      mediaTitle={mediaTitle}
      mediaId={mediaId}
      posterPath={posterPath}
      translations={translations}
    />
  );
}
