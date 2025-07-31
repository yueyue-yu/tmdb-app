/**
 * 电影详情页面
 * 路由: /detail/movie/[id]
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchMovieDetails } from '@/app/lib/api/mediaDetailsActions';
import { fetchMovieCredits } from '@/app/lib/api/creditsActions';
import { fetchAllReviews } from '@/app/lib/api/reviewActions';
import {
  MovieDetailHero,
  MovieDetailInfo
} from '@/app/components/movie-detail';
import CastSectionHorizontal from '@/app/components/credits/CastSectionHorizontal';
import ReviewSectionSimple from '@/app/components/reviews/ReviewSectionSimple';
import { VideoSection } from '@/app/components/video';
import { ImageSection } from '@/app/components/gallery';
import RecommendationSection from '@/app/components/recommendations/RecommendationSection';
import type { MovieDetailPageProps } from '@/app/type/movieDetail';
import { MediaTypeEnum } from '@/app/type/movie';

// 生成页面元数据
export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const movieId = parseInt(id);
    
    if (isNaN(movieId)) {
      return {
        title: '电影未找到 - TMDB',
        description: '请求的电影不存在',
      };
    }

    const movie = await fetchMovieDetails(movieId);
    
    return {
      title: `${movie.title} (${new Date(movie.release_date).getFullYear()}) - TMDB`,
      description: movie.overview || `查看电影《${movie.title}》的详细信息、演员阵容、评分等。`,
      keywords: [
        movie.title,
        movie.original_title,
        ...movie.genres.map(g => g.name),
        '电影',
        'TMDB',
        '影评',
        '电影详情'
      ].join(', '),
      openGraph: {
        title: movie.title,
        description: movie.overview || `电影《${movie.title}》详情页面`,
        images: movie.poster_path ? [
          {
            url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            width: 500,
            height: 750,
            alt: movie.title,
          }
        ] : [],
        type: 'video.movie',
        releaseDate: movie.release_date,
      },
      twitter: {
        card: 'summary_large_image',
        title: movie.title,
        description: movie.overview || `电影《${movie.title}》详情页面`,
        images: movie.poster_path ? [
          `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        ] : [],
      },
    };
  } catch (error) {
    return {
      title: '电影未找到 - TMDB',
      description: '请求的电影不存在',
    };
  }
}

// 详情页面加载骨架屏
function MovieDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero 骨架屏 */}
      <div className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-64 h-96 bg-base-300 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-12 bg-base-300 rounded w-96"></div>
              <div className="h-6 bg-base-300 rounded w-64"></div>
              <div className="h-4 bg-base-300 rounded w-80"></div>
              <div className="h-4 bg-base-300 rounded w-72"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 详情信息骨架屏 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-base-200 rounded-lg"></div>
          <div className="h-96 bg-base-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  // 验证ID是否为有效数字
  if (isNaN(movieId) || movieId <= 0) {
    notFound();
  }

  try {
    // 并行获取电影详情、演职人员数据和评论
    const [movie, credits, reviewsResponse] = await Promise.all([
      fetchMovieDetails(movieId),
      fetchMovieCredits(movieId),
      fetchAllReviews(movieId, MediaTypeEnum.Movie, 1).catch(error => {
        console.error('获取评论失败:', error);
        return { results: [], total_results: 0, total_pages: 0, page: 1, id: movieId };
      })
    ]);

    const reviews = reviewsResponse.results;

    return (
      <>
        {/* Hero 区域 */}
        <MovieDetailHero movie={movie} />

        {/* 详情信息 */}
        <MovieDetailInfo movie={movie} />

        {/* 视频区域 */}
        <VideoSection
          mediaId={movie.id}
          mediaType="movie"
          mediaTitle={movie.title}
        />

        {/* 图片画廊 */}
        <ImageSection
          mediaId={movie.id}
          mediaType="movie"
          mediaTitle={movie.title}
        />

        {/* 演员信息 */}
        {credits.cast && credits.cast.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <CastSectionHorizontal
              cast={credits.cast}
              mediaType="movie"
              mediaId={movie.id}
            />
          </div>
        )}

        {/* 评论区域 */}
        {reviews && reviews.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <ReviewSectionSimple
              reviews={reviews}
              mediaType="movie"
              mediaId={movie.id}
              totalReviews={reviewsResponse.total_results}
            />
          </div>
        )}

        {/* 推荐和相似内容 */}
        <RecommendationSection
          mediaId={movie.id}
          mediaType={MediaTypeEnum.Movie}
          mediaTitle={movie.title}
        />
      </>
    );
  } catch (error) {
    console.error('获取电影详情失败:', error);
    notFound();
  }
}

// 可选：设置重新验证时间，实现 ISR
export const revalidate = 3600; // 1小时重新验证一次
