/**
 * 动态路由页面 - /home/movies/[category]
 * 使用服务端组件 + Streaming SSR
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { MovieCategory } from '@/app/lib/api/movieActions';
import { MOVIE_CATEGORIES, getCategoryConfig } from '@/app/constant/movieCategories';
import MoviesContainer from '@/app/components/movies/MoviesContainer';
import MoviesSkeleton from '@/app/components/movies/MoviesSkeleton';
import CategorySelector from '@/app/components/movies/CategorySelector';

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

export default function MovieCategoryPage({ params, searchParams }: PageProps) {
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
      
      {/* 流式加载的电影内容 */}
      <Suspense fallback={<MoviesSkeleton />}>
        <MoviesContainer 
          category={category} 
          page={page}
          categoryConfig={categoryConfig}
        />
      </Suspense>
    </div>
  );
}
