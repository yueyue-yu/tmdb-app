/**
 * 动态路由页面 - /home/movies/[category]
 * 使用服务端组件 + Streaming SSR
 */

import {Suspense} from 'react';
import {notFound} from 'next/navigation';
import {getTvCategoryConfig, MOVIE_CATEGORIES, TV_CATEGORIES} from '@/app/constant/movieCategories';
import CategorySelector from '@/app/components/movies/CategorySelector';
import PageHeader from '@/app/components/movies/PageHeader';
import MovieGridSkeleton from '@/app/components/movies/MovieGridSkeleton';
import MovieDataContainer from '@/app/components/movies/MovieDataContainer';
import {MediaTypeEnum, TvCategoryKeys} from "@/app/type/movie";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// 生成静态路径
export function generateStaticParams() {
  return MOVIE_CATEGORIES.map((category) => ({
    category: category.key,
  }));
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const categoryConfig = getTvCategoryConfig(category as TvCategoryKeys);

  return {
    title: `${categoryConfig.label} - TMDB电影`,
    description: categoryConfig.description,
  };
}

export default async function MovieCategoryPage({ params, searchParams }: PageProps) {
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 分类导航 - 客户端组件 */}
      <CategorySelector mediaType={MediaTypeEnum.TV} currentCategoryKey={categoryKey} />
      {/* 页面标题 */}
      <PageHeader 
        categoryConfig={categoryConfig} 
        currentCategory={categoryKey}
      />
      
      {/* 为分页数据添加 Suspense 边界 */}
      <Suspense 
        key={`${categoryKey}-${page}`}
        fallback={<MovieGridSkeleton />}
      >
        <MovieDataContainer 
          category={categoryKey}
          page={page}
        />
      </Suspense>
    </div>
  );
}
