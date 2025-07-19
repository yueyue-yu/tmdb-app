/**
 * 视频区域组件
 * 在详情页面显示视频内容
 */

import { getTranslations } from 'next-intl/server';
import VideoSectionClient from './VideoSectionClient';
import type { VideoSectionProps } from '@/app/type/video';

export default async function VideoSection({ mediaId, mediaType, mediaTitle }: VideoSectionProps) {
  const t = await getTranslations('Video');
  
  return (
    <VideoSectionClient 
      mediaId={mediaId}
      mediaType={mediaType}
      mediaTitle={mediaTitle}
      translations={{
        videos: t('videos'),
        mainTrailer: t('mainTrailer'),
        all: t('all'),
        trailers: t('trailers'),
        clips: t('clips'),
        behindTheScenes: t('behindTheScenes'),
        featurettes: t('featurettes'),
        showMore: t('showMore'),
        showLess: t('showLess'),
        official: t('official'),
        loadingError: t('loadingError'),
        retryLater: t('retryLater')
      }}
    />
  );
}
