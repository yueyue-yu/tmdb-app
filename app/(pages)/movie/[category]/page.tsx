/**
 * 电影分类页面 - /movie/[category]
 * 支持不同的电影分类展示
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MovieCategoryKeys } from '@/app/type/movie';
import { getMovieCategoryConfig, MOVIE_CATEGORIES } from '@/app/lib/utils/categoryUtils';
import CategorySelector from '@/app/components/movies/CategorySelector';
import PageHeader from '@/app/components/movies/PageHeader';
import MovieGridSkeleton from '@/app/components/movies/MovieGridSkeleton';
import MovieDataContainer from '@/app/components/movies/MovieDataContainer';
import { MediaTypeEnum } from '@/app/type/movie';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  
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
    title: `${titleMap[categoryConfig.labelKey] || '电影'} - ICE•ICE FILM`,
    description: descMap[categoryConfig.descriptionKey] || '浏览热门电影内容',
    openGraph: {
      title: `${titleMap[categoryConfig.labelKey] || '电影'} - ICE•ICE FILM`,
      description: descMap[categoryConfig.descriptionKey] || '浏览热门电影内容',
    },
  };
}

export default async function MovieCategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);

  // 验证分类是否有效
  const categoryKey = category as MovieCategoryKeys;
  if (!MOVIE_CATEGORIES.find(cat => cat.key === categoryKey)) {
    notFound();
  }

  const categoryConfig = getMovieCategoryConfig(categoryKey);

  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类导航 */}
        <CategorySelector mediaType={MediaTypeEnum.Movie} currentCategoryKey={categoryKey} />

        {/* 页面标题 */}
        <PageHeader
          categoryConfig={categoryConfig}
          currentCategory={categoryKey}
        />

        {/* 电影数据容器 */}
        <Suspense
          key={`movie-${categoryKey}-${page}`}
          fallback={<MovieGridSkeleton />}
        >
          <MovieDataContainer
            mediaType={MediaTypeEnum.Movie}
            category={categoryKey}
            page={page}
          />
        </Suspense>
      </div>
  );
}

// 生成静态路径
export function generateStaticParams() {
  return MOVIE_CATEGORIES.map((category) => ({
    category: category.key,
  }));
}
