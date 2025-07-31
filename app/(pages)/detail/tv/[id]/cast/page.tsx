/**
 * 电视剧Cast页面
 * 显示完整的演职人员信息
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { fetchTvDetails } from '@/app/lib/api/mediaDetailsActions';
import { fetchTvCredits } from '@/app/lib/api/creditsActions';
import CastPage from '@/app/components/credits/CastPage';
import type { TvCastPageProps } from '@/app/type/tvDetail';

export default async function TvCastPage({ params }: TvCastPageProps) {
  const { id } = await params;
  const tvId = parseInt(id);

  if (isNaN(tvId)) {
    notFound();
  }

  try {
    // 并行获取电视剧详情和演职人员信息
    const [tv, credits] = await Promise.all([
      fetchTvDetails(tvId),
      fetchTvCredits(tvId)
    ]);

    if (!tv) {
      notFound();
    }

    // 生成页面元数据
    const t = await getTranslations('Credits');
    
    return (
      <>
        {/* 页面标题 */}
        <title>{`${tv.name} - ${t('castAndCrew')} - TMDB`}</title>
        <meta name="description" content={`${tv.name}的完整演职人员信息，包括演员和制作团队。`} />
        
        {/* Cast页面组件 */}
        <CastPage
          credits={credits}
          mediaType="tv"
          mediaTitle={tv.name}
          mediaId={tvId}
          posterPath={tv.poster_path || undefined}
        />
      </>
    );
  } catch (error) {
    console.error('获取电视剧Cast信息失败:', error);
    notFound();
  }
}

// 生成静态元数据
export async function generateMetadata({ params }: TvCastPageProps) {
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
    const t = await getTranslations('Credits');
    
    if (!tv) {
      return {
        title: 'TV Show Not Found - TMDB',
        description: 'The requested TV show could not be found.'
      };
    }

    return {
      title: `${tv.name} - ${t('castAndCrew')} - TMDB`,
      description: `${tv.name}的完整演职人员信息，包括演员和制作团队。`,
      openGraph: {
        title: `${tv.name} - ${t('castAndCrew')}`,
        description: `${tv.name}的完整演职人员信息`,
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
    console.error('生成电视剧Cast页面元数据失败:', error);
    return {
      title: 'TV Cast - TMDB',
      description: 'TV show cast and crew information.'
    };
  }
}
