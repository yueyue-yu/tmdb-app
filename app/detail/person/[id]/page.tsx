/**
 * 人员详情页面
 * 路由: /detail/person/[id]
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchPersonFullDetails } from '@/app/lib/api/personDetailsActions';
import {
  PersonDetailHero,
  PersonCredits
} from '@/app/components/person-detail';
import type { PersonDetailPageProps } from '@/app/type/personDetail';

// 生成页面元数据
export async function generateMetadata({ params }: PersonDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const personId = parseInt(id);
    
    if (isNaN(personId)) {
      return {
        title: '人员未找到 - TMDB',
        description: '请求的人员不存在',
      };
    }

    const { person } = await fetchPersonFullDetails(personId);
    
    const birthYear = person.birthday ? new Date(person.birthday).getFullYear() : '';
    const deathYear = person.deathday ? new Date(person.deathday).getFullYear() : '';
    const lifeSpan = birthYear ? 
      (deathYear ? `${birthYear}-${deathYear}` : `${birthYear}-`) : '';
    
    return {
      title: `${person.name}${lifeSpan ? ` (${lifeSpan})` : ''} - TMDB`,
      description: person.biography 
        ? person.biography.substring(0, 160) + '...'
        : `查看${person.name}的详细信息、作品列表、传记等。`,
      keywords: [
        person.name,
        ...person.also_known_as.slice(0, 3),
        person.known_for_department,
        '演员',
        '导演',
        '制作人',
        'TMDB',
        '人员详情',
        person.place_of_birth
      ].filter(Boolean).join(', '),
      openGraph: {
        title: person.name,
        description: person.biography 
          ? person.biography.substring(0, 160) + '...'
          : `${person.name}的详情页面`,
        images: person.profile_path ? [
          {
            url: `https://image.tmdb.org/t/p/w500${person.profile_path}`,
            width: 500,
            height: 750,
            alt: person.name,
          }
        ] : [],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: person.name,
        description: person.biography 
          ? person.biography.substring(0, 160) + '...'
          : `${person.name}的详情页面`,
        images: person.profile_path ? [
          `https://image.tmdb.org/t/p/w500${person.profile_path}`
        ] : [],
      },
    };
  } catch (error) {
    return {
      title: '人员未找到 - TMDB',
      description: '请求的人员不存在',
    };
  }
}

// 详情页面加载骨架屏
function PersonDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero 骨架屏 */}
      <div className="bg-base-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="w-80 h-80 bg-base-300 rounded-lg"></div>
            <div className="flex-1 space-y-4">
              <div className="h-12 bg-base-300 rounded w-96"></div>
              <div className="h-6 bg-base-300 rounded w-64"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-base-300 rounded"></div>
                <div className="h-16 bg-base-300 rounded"></div>
                <div className="h-16 bg-base-300 rounded"></div>
                <div className="h-16 bg-base-300 rounded"></div>
              </div>
              <div className="h-32 bg-base-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 作品骨架屏 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 bg-base-300 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-base-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function PersonDetailPage({ params }: PersonDetailPageProps) {
  const { id } = await params;
  const personId = parseInt(id);

  // 验证ID是否为有效数字
  if (isNaN(personId) || personId <= 0) {
    notFound();
  }

  try {
    // 获取人员完整信息
    const { person, movieCredits, tvCredits } = await fetchPersonFullDetails(personId);

    return (
      <>
        {/* Hero 区域 */}
        <PersonDetailHero person={person} />

        {/* 作品信息 */}
        <PersonCredits 
          movieCredits={movieCredits}
          tvCredits={tvCredits}
          personName={person.name}
        />

        {/* 底部间距 */}
        <div className="h-20 lg:h-0"></div>
      </>
    );
  } catch (error) {
    console.error('获取人员详情失败:', error);
    notFound();
  }
}

// 可选：设置重新验证时间，实现 ISR
export const revalidate = 3600; // 1小时重新验证一次
