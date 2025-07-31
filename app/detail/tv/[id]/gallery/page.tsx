/**
 * 电视剧画廊页面
 * 显示完整的图片画廊
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { fetchTvDetails } from '@/app/lib/api/mediaDetailsActions';
import { fetchMediaImages } from '@/app/lib/api/imageActions';
import GalleryPage from '@/app/components/gallery/GalleryPage';
import type { TvGalleryPageProps } from '@/app/type/tvDetail';

export default async function TvGalleryPage({ params }: TvGalleryPageProps) {
  const { id } = await params;
  const tvId = parseInt(id);

  if (isNaN(tvId)) {
    notFound();
  }

  try {
    // 并行获取电视剧详情和图片信息
    const [tv, images] = await Promise.all([
      fetchTvDetails(tvId),
      fetchMediaImages(tvId, 'tv')
    ]);

    if (!tv) {
      notFound();
    }

    // 生成页面元数据
    const t = await getTranslations('Gallery');
    
    return (
      <>
        {/* 页面标题 */}
        <title>{`${tv.name} - ${t('images')} - TMDB`}</title>
        <meta name="description" content={`${tv.name}的完整图片画廊，包括海报、背景图、剧照等。`} />
        
        {/* 画廊页面组件 */}
        <GalleryPage
          images={images}
          mediaType="tv"
          mediaTitle={tv.name}
          mediaId={tvId}
          posterPath={tv.poster_path || undefined}
        />
      </>
    );
  } catch (error) {
    console.error('获取电视剧画廊信息失败:', error);
    notFound();
  }
}
