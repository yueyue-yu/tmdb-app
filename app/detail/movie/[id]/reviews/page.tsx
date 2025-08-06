/**
 * 电影评论页面
 * 显示完整的评论信息
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { fetchMovieDetails } from '@/app/lib/api/mediaDetailsActions';
import { fetchAllReviews } from '@/app/lib/api/reviewActions';
import { MediaTypeEnum } from '@/app/type/movie';
import ReviewPage from '@/app/components/reviews/ReviewPage';
import type { MovieCastPageProps } from '@/app/type/movieDetail';

interface MovieReviewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function MovieReviewPage({ params, searchParams }: MovieReviewPageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const movieId = parseInt(id);
  const currentPage = parseInt(page || '1');

  if (isNaN(movieId) || isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  try {
    // 并行获取电影详情和评论信息
    const [movie, reviewsResponse] = await Promise.all([
      fetchMovieDetails(movieId),
      fetchAllReviews(movieId, MediaTypeEnum.Movie, currentPage)
    ]);

    if (!movie) {
      notFound();
    }

    // 生成页面元数据
    const t = await getTranslations('Reviews');
    
    return (
      <>
        {/* 页面标题 */}
        <title>{`${movie.title} - ${t('reviews')} - TMDB`}</title>
        <meta name="description" content={`${movie.title}的用户评论和评分，了解观众对这部电影的真实看法。`} />
        
        {/* 评论页面组件 */}
        <ReviewPage
          reviews={reviewsResponse.results}
          mediaType="movie"
          mediaTitle={movie.title}
          mediaId={movieId}
          posterPath={movie.poster_path || undefined}
          totalResults={reviewsResponse.total_results}
          totalPages={reviewsResponse.total_pages}
          currentPage={currentPage}
        />
      </>
    );
  } catch (error) {
    console.error('获取电影评论信息失败:', error);
    notFound();
  }
}

// 生成静态元数据
export async function generateMetadata({ params }: MovieReviewPageProps) {
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
    const t = await getTranslations('Reviews');
    
    if (!movie) {
      return {
        title: 'Movie Not Found - TMDB',
        description: 'The requested movie could not be found.'
      };
    }

    return {
      title: `${movie.title} - ${t('reviews')} - TMDB`,
      description: `${movie.title}的用户评论和评分，了解观众对这部电影的真实看法。`,
      openGraph: {
        title: `${movie.title} - ${t('reviews')}`,
        description: `${movie.title}的用户评论`,
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
    console.error('生成电影评论页面元数据失败:', error);
    return {
      title: 'Movie Reviews - TMDB',
      description: 'Movie reviews and ratings.'
    };
  }
}
