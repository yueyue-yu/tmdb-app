/**
 * 动态路由页面 - /home/movies/[category]
 * 使用服务端组件 + Streaming SSR
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { MovieCategory } from '@/app/lib/api/movieActions';
import { MOVIE_CATEGORIES, getCategoryConfig } from '@/app/constant/movieCategories';
import CategorySelector from '@/app/components/movies/CategorySelector';
import PageHeader from '@/app/components/movies/PageHeader';
import MovieGridSkeleton from '@/app/components/movies/MovieGridSkeleton';
import MovieDataContainer from '@/app/components/movies/MovieDataContainer';

interface PageProps {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
  };
}

// 生成静态路径
export function generateStaticParams() {
  return MOVIE_CATEGORIES.map((category) => ({
    category: category.key,
  }));
}

// 生成页面元数据
export function generateMetadata({ params }: PageProps) {
  const categoryConfig = getCategoryConfig(params.category as MovieCategory);
  
  return {
    title: `${categoryConfig.label} - TMDB电影`,
    description: categoryConfig.description,
  };
}

export default async function MovieCategoryPage({ params, searchParams }: PageProps) {
  const category = params.category as MovieCategory;
  const page = parseInt(searchParams.page || '1', 10);

  // 验证分类是否有效
  if (!MOVIE_CATEGORIES.find(cat => cat.key === category)) {
    notFound();
  }

  const categoryConfig = getCategoryConfig(category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 分类导航 - 客户端组件 */}
      <CategorySelector currentCategory={category} />
      
      {/* 页面标题 */}
      <PageHeader 
        categoryConfig={categoryConfig} 
        currentCategory={category}
      />
      
      {/* 为分页数据添加 Suspense 边界 */}
      <Suspense 
        key={`${category}-${page}`} 
        fallback={<MovieGridSkeleton />}
      >
        <MovieDataContainer 
          category={category} 
          page={page} 
        />
      </Suspense>
    </div>
  );
}
