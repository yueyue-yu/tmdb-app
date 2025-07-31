/**
 * 电影Cast页面
 * 显示完整的演职人员信息
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { fetchMovieDetails } from '@/app/lib/api/mediaDetailsActions';
import { fetchMovieCredits } from '@/app/lib/api/creditsActions';
import CastPage from '@/app/components/credits/CastPage';
import type { MovieCastPageProps } from '@/app/type/movieDetail';

export default async function MovieCastPage({ params }: MovieCastPageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    notFound();
  }

  try {
    // 并行获取电影详情和演职人员信息
    const [movie, credits] = await Promise.all([
      fetchMovieDetails(movieId),
      fetchMovieCredits(movieId)
    ]);

    if (!movie) {
      notFound();
    }

    // 生成页面元数据
    const t = await getTranslations('Credits');
    
    return (
      <>
        {/* 页面标题 */}
        <title>{`${movie.title} - ${t('castAndCrew')} - TMDB`}</title>
        <meta name="description" content={`${movie.title}的完整演职人员信息，包括演员和制作团队。`} />
        
        {/* Cast页面组件 */}
        <CastPage
          credits={credits}
          mediaType="movie"
          mediaTitle={movie.title}
          mediaId={movieId}
          posterPath={movie.poster_path || undefined}
        />
      </>
    );
  } catch (error) {
    console.error('获取电影Cast信息失败:', error);
    notFound();
  }
}

// 生成静态元数据
export async function generateMetadata({ params }: MovieCastPageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    return {
      title: 'Movie Not Found - TMDB',
      description: 'The requested movie could not be found.'
    };
  }

  try {
    const movie = await fetchMovieDetails(movieId);
    const t = await getTranslations('Credits');
    
    if (!movie) {
      return {
        title: 'Movie Not Found - TMDB',
        description: 'The requested movie could not be found.'
      };
    }

    return {
      title: `${movie.title} - ${t('castAndCrew')} - TMDB`,
      description: `${movie.title}的完整演职人员信息，包括演员和制作团队。`,
      openGraph: {
        title: `${movie.title} - ${t('castAndCrew')}`,
        description: `${movie.title}的完整演职人员信息`,
        images: movie.poster_path ? [
          {
            url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            width: 500,
            height: 750,
            alt: movie.title
          }
        ] : []
      }
    };
  } catch (error) {
    console.error('生成电影Cast页面元数据失败:', error);
    return {
      title: 'Movie Cast - TMDB',
      description: 'Movie cast and crew information.'
    };
  }
}
