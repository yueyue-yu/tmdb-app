/**
 * 电影画廊页面
 * 显示完整的图片画廊
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { fetchMovieDetails } from '@/app/lib/api/mediaDetailsActions';
import { fetchMediaImages } from '@/app/lib/api/imageActions';
import GalleryPage from '@/app/components/gallery/GalleryPage';
import type { MovieGalleryPageProps } from '@/app/type/movieDetail';

export default async function MovieGalleryPage({ params }: MovieGalleryPageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    notFound();
  }

  try {
    // 并行获取电影详情和图片信息
    const [movie, images] = await Promise.all([
      fetchMovieDetails(movieId),
      fetchMediaImages(movieId, 'movie')
    ]);

    if (!movie) {
      notFound();
    }

    // 生成页面元数据
    const t = await getTranslations('Gallery');
    
    return (
      <>
        {/* 页面标题 */}
        <title>{`${movie.title} - ${t('images')} - TMDB`}</title>
        <meta name="description" content={`${movie.title}的完整图片画廊，包括海报、背景图、剧照等。`} />
        
        {/* 画廊页面组件 */}
        <GalleryPage
          images={images}
          mediaType="movie"
          mediaTitle={movie.title}
          mediaId={movieId}
          posterPath={movie.poster_path || undefined}
        />
      </>
    );
  } catch (error) {
    console.error('获取电影画廊信息失败:', error);
    notFound();
  }
}
