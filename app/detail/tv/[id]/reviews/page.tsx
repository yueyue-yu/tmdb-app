/**
 * 电视剧评论页面
 * 显示完整的评论信息
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { fetchTvDetails } from '@/app/lib/api/mediaDetailsActions';
import { fetchAllReviews } from '@/app/lib/api/reviewActions';
import { MediaTypeEnum } from '@/app/type/movie';
import ReviewPage from '@/app/components/reviews/ReviewPage';
import type { TvCastPageProps } from '@/app/type/tvDetail';

interface TvReviewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function TvReviewPage({ params, searchParams }: TvReviewPageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const tvId = parseInt(id);
  const currentPage = parseInt(page || '1');

  if (isNaN(tvId) || isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  try {
    // 并行获取电视剧详情和评论信息
    const [tv, reviewsResponse] = await Promise.all([
      fetchTvDetails(tvId),
      fetchAllReviews(tvId, MediaTypeEnum.TV, currentPage)
    ]);

    if (!tv) {
      notFound();
    }

    // 生成页面元数据
    const t = await getTranslations('Reviews');
    
    return (
      <>
        {/* 页面标题 */}
        <title>{`${tv.name} - ${t('reviews')} - TMDB`}</title>
        <meta name="description" content={`${tv.name}的用户评论和评分，了解观众对这部电视剧的真实看法。`} />
        
        {/* 评论页面组件 */}
        <ReviewPage
          reviews={reviewsResponse.results}
          mediaType="tv"
          mediaTitle={tv.name}
          mediaId={tvId}
          posterPath={tv.poster_path || undefined}
          totalResults={reviewsResponse.total_results}
          totalPages={reviewsResponse.total_pages}
          currentPage={currentPage}
        />
      </>
    );
  } catch (error) {
    console.error('获取电视剧评论信息失败:', error);
    notFound();
  }
}

// 生成静态元数据
export async function generateMetadata({ params }: TvReviewPageProps) {
  const { id } = await params;
  const tvId = parseInt(id);

  if (isNaN(tvId)) {
    return {
      title: 'TV Show Not Found - TMDB',
      description: 'The requested TV show could not be found.'
    };
  }

  try {
    const tv = await fetchTvDetails(tvId);
    const t = await getTranslations('Reviews');
    
    if (!tv) {
      return {
        title: 'TV Show Not Found - TMDB',
        description: 'The requested TV show could not be found.'
      };
    }

    return {
      title: `${tv.name} - ${t('reviews')} - TMDB`,
      description: `${tv.name}的用户评论和评分，了解观众对这部电视剧的真实看法。`,
      openGraph: {
        title: `${tv.name} - ${t('reviews')}`,
        description: `${tv.name}的用户评论`,
        images: tv.poster_path ? [
          {
            url: `https://image.tmdb.org/t/p/w500${tv.poster_path}`,
            width: 500,
            height: 750,
            alt: tv.name
          }
        ] : []
      }
    };
  } catch (error) {
    console.error('生成电视剧评论页面元数据失败:', error);
    return {
      title: 'TV Reviews - TMDB',
      description: 'TV show reviews and ratings.'
    };
  }
}
