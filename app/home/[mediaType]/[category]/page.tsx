/**
 * 动态路由页面 - /home/[mediaType]/[category]
 * 支持电影和电视剧的分类页面
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MediaTypeEnum, MovieCategoryKeys, TvCategoryKeys } from '@/app/type/movie';
import { getMovieCategoryConfig, MOVIE_CATEGORIES, TV_CATEGORIES, getTvCategoryConfig } from '@/app/constant/movieCategories';
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
    return {
      title: `${categoryConfig.label} - TMDB电影`,
      description: categoryConfig.description,
    };
  } else if (mediaType === MediaTypeEnum.TV) {
    const categoryConfig = getTvCategoryConfig(category as TvCategoryKeys);
    return {
      title: `${categoryConfig.label} - TMDB电视剧`,
      description: categoryConfig.description,
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
