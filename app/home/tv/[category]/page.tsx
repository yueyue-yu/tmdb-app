/**
 * 动态路由页面 - /home/tv/[category]
 * 使用服务端组件 + Streaming SSR
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { TvCategory } from '@/app/lib/api/tvActions';
import { TV_CATEGORIES, getTvCategoryConfig } from '@/app/constant/tvCategories';
import TvCategorySelector from '@/app/components/tv/TvCategorySelector';
import TvPageHeader from '@/app/components/tv/TvPageHeader';
import TvGridSkeleton from '@/app/components/tv/TvGridSkeleton';
import TvDataContainer from '@/app/components/tv/TvDataContainer';

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
  return TV_CATEGORIES.map((category) => ({
    category: category.key,
  }));
}

// 生成页面元数据
export function generateMetadata({ params }: PageProps) {
  const categoryConfig = getTvCategoryConfig(params.category as TvCategory);
  
  return {
    title: `${categoryConfig.label} - TMDB电视剧`,
    description: categoryConfig.description,
  };
}

export default async function TvCategoryPage({ params, searchParams }: PageProps) {
  const category = params.category as TvCategory;
  const page = parseInt(searchParams.page || '1', 10);

  // 验证分类是否有效
  if (!TV_CATEGORIES.find(cat => cat.key === category)) {
    notFound();
  }

  const categoryConfig = getTvCategoryConfig(category);

  return (
    <div className="container mx-auto px-4">
      {/* 页面标题 */}
      <TvPageHeader category={category} />
      
      {/* 分类选择器 */}
      <TvCategorySelector />
      
      {/* 电视剧数据容器 - 使用 Suspense 包装以支持流式加载 */}
      <Suspense 
        key={`${category}-${page}`} 
        fallback={<TvGridSkeleton />}
      >
        <TvDataContainer category={category} page={page} />
      </Suspense>
    </div>
  );
}
