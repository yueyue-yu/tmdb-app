/**
 * 电视剧详情页面
 * 路由: /detail/tv/[id]
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchTvDetails } from '@/app/lib/api/mediaDetailsActions';
import { fetchTvCredits } from '@/app/lib/api/creditsActions';
import {
  TvDetailHero,
  TvDetailInfo,
  TvDetailActions
} from '@/app/components/tv-detail';
import { CreditsSection } from '@/app/components/credits';
import { VideoSection } from '@/app/components/video';
import type { TvDetailPageProps } from '@/app/type/tvDetail';

// 生成页面元数据
export async function generateMetadata({ params }: TvDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const tvId = parseInt(id);
    
    if (isNaN(tvId)) {
      return {
        title: '电视剧未找到 - TMDB',
        description: '请求的电视剧不存在',
      };
    }

    const tv = await fetchTvDetails(tvId);
    
    const firstAirYear = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : '';
    const lastAirYear = tv.last_air_date ? new Date(tv.last_air_date).getFullYear() : '';
    const yearRange = lastAirYear && lastAirYear !== firstAirYear 
      ? `${firstAirYear}-${lastAirYear}` 
      : firstAirYear;
    
    return {
      title: `${tv.name} (${yearRange}) - TMDB`,
      description: tv.overview || `查看电视剧《${tv.name}》的详细信息、季度、演员阵容、评分等。`,
      keywords: [
        tv.name,
        tv.original_name,
        ...tv.genres.map(g => g.name),
        '电视剧',
        'TMDB',
        '剧评',
        '电视剧详情',
        ...tv.networks.map(n => n.name)
      ].join(', '),
      openGraph: {
        title: tv.name,
        description: tv.overview || `电视剧《${tv.name}》详情页面`,
        images: tv.poster_path ? [
          {
            url: `https://image.tmdb.org/t/p/w500${tv.poster_path}`,
            width: 500,
            height: 750,
            alt: tv.name,
          }
        ] : [],
        type: 'video.tv_show',
      },
      twitter: {
        card: 'summary_large_image',
        title: tv.name,
        description: tv.overview || `电视剧《${tv.name}》详情页面`,
        images: tv.poster_path ? [
          `https://image.tmdb.org/t/p/w500${tv.poster_path}`
        ] : [],
      },
    };
  } catch (error) {
    return {
      title: '电视剧未找到 - TMDB',
      description: '请求的电视剧不存在',
    };
  }
}

// 详情页面加载骨架屏
function TvDetailSkeleton() {
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

export default async function TvDetailPage({ params }: TvDetailPageProps) {
  const { id } = await params;
  const tvId = parseInt(id);

  // 验证ID是否为有效数字
  if (isNaN(tvId) || tvId <= 0) {
    notFound();
  }

  try {
    // 并行获取电视剧详情和演职人员数据
    const [tv, credits] = await Promise.all([
      fetchTvDetails(tvId),
      fetchTvCredits(tvId)
    ]);

    return (
      <>
        {/* Hero 区域 */}
        <TvDetailHero tv={tv} />

        {/* 详情信息 */}
        <TvDetailInfo tv={tv} />

        {/* 视频区域 */}
        <VideoSection
          mediaId={tv.id}
          mediaType="tv"
          mediaTitle={tv.name}
        />

        {/* 演职人员信息 */}
        <CreditsSection
          credits={credits}
          mediaType="tv"
          mediaTitle={tv.name}
        />

        {/* 操作按钮 */}
        <TvDetailActions tvId={tv.id} title={tv.name} />

        {/* 底部间距（为固定的操作栏留空间） */}
        <div className="h-20 lg:h-0"></div>
      </>
    );
  } catch (error) {
    console.error('获取电视剧详情失败:', error);
    notFound();
  }
}

// 可选：设置重新验证时间，实现 ISR
export const revalidate = 3600; // 1小时重新验证一次
