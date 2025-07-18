/**
 * 动态路由页面 - /home/[mediaType]/[category]
 * 支持电影和电视剧的分类页面
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MediaTypeEnum, MovieCategoryKeys, TvCategoryKeys } from '@/app/type/movie';
import { getMovieCategoryConfig, getTvCategoryConfig, MOVIE_CATEGORIES, TV_CATEGORIES } from '@/app/lib/categoryUtils';
import CategorySelector from '@/app/components/movies/CategorySelector';
import PageHeader from '@/app/components/movies/PageHeader';
import MovieGridSkeleton from '@/app/components/movies/MovieGridSkeleton';
import MovieDataContainer from '@/app/components/movies/MovieDataContainer';

interface PageProps {
  params: Promise<{
    mediaType: string;
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// 生成静态路径
export function generateStaticParams() {
  const paths = [];

  // 为电影生成路径
  for (const category of MOVIE_CATEGORIES) {
    paths.push({
      mediaType: MediaTypeEnum.Movie,
      category: category.key,
    });
  }

  // 为电视剧生成路径
  for (const category of TV_CATEGORIES) {
    paths.push({
      mediaType: MediaTypeEnum.TV,
      category: category.key,
    });
  }

  return paths;
}

// 可选：设置重新验证时间，实现 ISR (Incremental Static Regeneration)
export const revalidate = 1800; // 半小时重新验证一次

// 生成页面元数据
export async function generateMetadata({ params }: PageProps) {
  const { mediaType, category } = await params;

  // 根据媒体类型获取配置
  if (mediaType === MediaTypeEnum.Movie) {
    const categoryConfig = getMovieCategoryConfig(category as MovieCategoryKeys);
    // 使用翻译键的简化版本作为临时标题
    const titleMap: Record<string, string> = {
      'popularMovies': '热门电影',
      'topRatedMovies': '高分电影',
      'nowPlayingMovies': '正在上映',
      'upcomingMovies': '即将上映'
    };
    const descMap: Record<string, string> = {
      'popularMoviesDesc': '当前最受欢迎的电影',
      'topRatedMoviesDesc': '评分最高的经典佳作',
      'nowPlayingMoviesDesc': '影院正在热映的新片',
      'upcomingMoviesDesc': '即将与观众见面的新电影'
    };
    return {
      title: `${titleMap[categoryConfig.labelKey] || '电影'} - TMDB电影`,
      description: descMap[categoryConfig.descriptionKey] || '浏览热门电影内容',
    };
  } else if (mediaType === MediaTypeEnum.TV) {
    const categoryConfig = getTvCategoryConfig(category as TvCategoryKeys);
    const titleMap: Record<string, string> = {
      'popularTVShows': '热门电视剧',
      'topRatedTVShows': '高分电视剧',
      'onTheAirTVShows': '正在播出',
      'airingTodayTVShows': '今日播出'
    };
    const descMap: Record<string, string> = {
      'popularTVShowsDesc': '当前最受欢迎的电视剧',
      'topRatedTVShowsDesc': '评分最高的电视剧',
      'onTheAirTVShowsDesc': '目前正在播出的电视剧',
      'airingTodayTVShowsDesc': '今天播出的电视剧'
    };
    return {
      title: `${titleMap[categoryConfig.labelKey] || '电视剧'} - TMDB电视剧`,
      description: descMap[categoryConfig.descriptionKey] || '浏览热门电视剧内容',
    };
  }

  return {
    title: 'TMDB影视',
    description: '浏览热门影视内容',
  };
}

export default async function MediaCategoryPage({ params, searchParams }: PageProps) {
  const { mediaType, category } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);

  // 验证媒体类型是否有效
  const isValidMediaType = Object.values(MediaTypeEnum).includes(mediaType as MediaTypeEnum);
  if (!isValidMediaType) {
    notFound();
  }

  const mediaTypeEnum = mediaType as MediaTypeEnum;

  // 验证分类是否有效
  if (mediaTypeEnum === MediaTypeEnum.Movie) {
    const categoryKey = category as MovieCategoryKeys;
    if (!MOVIE_CATEGORIES.find(cat => cat.key === categoryKey)) {
      notFound();
    }

    const categoryConfig = getMovieCategoryConfig(categoryKey);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类导航 - 客户端组件 */}
        <CategorySelector mediaType={mediaTypeEnum} currentCategoryKey={categoryKey} />

        {/* 页面标题 */}
        <PageHeader
          categoryConfig={categoryConfig}
          currentCategory={categoryKey}
        />

        {/* 为分页数据添加 Suspense 边界 */}
        <Suspense
          key={`${mediaTypeEnum}-${categoryKey}-${page}`}
          fallback={<MovieGridSkeleton />}
        >
          <MovieDataContainer
            mediaType={mediaTypeEnum}
            category={categoryKey}
            page={page}
          />
        </Suspense>
      </div>
    );
  } else if (mediaTypeEnum === MediaTypeEnum.TV) {
    const categoryKey = category as TvCategoryKeys;
    if (!TV_CATEGORIES.find(cat => cat.key === categoryKey)) {
      notFound();
    }

    const categoryConfig = getTvCategoryConfig(categoryKey);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类导航 - 客户端组件 */}
        <CategorySelector mediaType={mediaTypeEnum} currentCategoryKey={categoryKey} />

        {/* 页面标题 */}
        <PageHeader
          categoryConfig={categoryConfig}
          currentCategory={categoryKey}
        />

        {/* 为分页数据添加 Suspense 边界 */}
        <Suspense
          key={`${mediaTypeEnum}-${categoryKey}-${page}`}
          fallback={<MovieGridSkeleton />}
        >
          <MovieDataContainer
            mediaType={mediaTypeEnum}
            category={categoryKey}
            page={page}
          />
        </Suspense>
      </div>
    );
  }

  notFound();
}
