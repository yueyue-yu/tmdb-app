/**
 * 电视剧分类页面 - /tv/[category]
 * 支持不同的电视剧分类展示
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TvCategoryKeys } from '@/app/type/movie';
import { getTvCategoryConfig, TV_CATEGORIES } from '@/app/lib/categoryUtils';
import CategorySelector from '@/app/components/movies/CategorySelector';
import PageHeader from '@/app/components/movies/PageHeader';
import MovieGridSkeleton from '@/app/components/movies/MovieGridSkeleton';
import MovieDataContainer from '@/app/components/movies/MovieDataContainer';
import CommonLayout from '@/app/components/layout/CommonLayout';
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
  
  const categoryConfig = getTvCategoryConfig(category as TvCategoryKeys);
  
  // 使用翻译键的简化版本作为临时标题
  const titleMap: Record<string, string> = {
    'popularTvShows': '热门电视剧',
    'topRatedTvShows': '高分电视剧',
    'onTheAirTvShows': '正在播出',
    'airingTodayTvShows': '今日播出'
  };
  
  const descMap: Record<string, string> = {
    'popularTvShowsDesc': '当前最受欢迎的电视剧',
    'topRatedTvShowsDesc': '评分最高的经典剧集',
    'onTheAirTvShowsDesc': '正在播出的热门剧集',
    'airingTodayTvShowsDesc': '今日播出的精彩节目'
  };
  
  return {
    title: `${titleMap[categoryConfig.labelKey] || '电视剧'} - ICE•ICE FILM`,
    description: descMap[categoryConfig.descriptionKey] || '浏览热门电视剧内容',
    openGraph: {
      title: `${titleMap[categoryConfig.labelKey] || '电视剧'} - ICE•ICE FILM`,
      description: descMap[categoryConfig.descriptionKey] || '浏览热门电视剧内容',
    },
  };
}

export default async function TvCategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1', 10);

  // 验证分类是否有效
  const categoryKey = category as TvCategoryKeys;
  if (!TV_CATEGORIES.find(cat => cat.key === categoryKey)) {
    notFound();
  }

  const categoryConfig = getTvCategoryConfig(categoryKey);

  return (
    <CommonLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类导航 */}
        <CategorySelector mediaType={MediaTypeEnum.TV} currentCategoryKey={categoryKey} />

        {/* 页面标题 */}
        <PageHeader
          categoryConfig={categoryConfig}
          currentCategory={categoryKey}
        />

        {/* 电视剧数据容器 */}
        <Suspense
          key={`tv-${categoryKey}-${page}`}
          fallback={<MovieGridSkeleton />}
        >
          <MovieDataContainer
            mediaType={MediaTypeEnum.TV}
            category={categoryKey}
            page={page}
          />
        </Suspense>
      </div>
    </CommonLayout>
  );
}

// 生成静态路径
export function generateStaticParams() {
  return TV_CATEGORIES.map((category) => ({
    category: category.key,
  }));
}
