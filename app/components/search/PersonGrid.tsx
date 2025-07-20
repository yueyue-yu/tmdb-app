/**
 * 人员网格组件
 * 用于搜索结果中展示人员信息
 */

import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Person } from '@/app/lib/api/types';

interface PersonGridProps {
  people: Person[];
}

// 获取人员头像URL
function getProfileUrl(profilePath: string | null): string {
  if (!profilePath) {
    return '/images/default-avatar.svg'; // 默认头像
  }
  return `https://image.tmdb.org/t/p/w185${profilePath}`;
}

// 获取知名度等级
function getPopularityLevel(popularity: number): 'high' | 'medium' | 'low' {
  if (popularity >= 20) return 'high';
  if (popularity >= 10) return 'medium';
  return 'low';
}

// 获取知名度徽章样式
function getPopularityBadgeClass(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'low': return 'badge-neutral';
  }
}

/**
 * 人员卡片组件
 */
interface PersonCardProps {
  person: Person;
  index: number;
}

async function PersonCard({ person, index }: PersonCardProps) {
  const t = await getTranslations('Search');
  const profileUrl = getProfileUrl(person.profile_path);
  const popularityLevel = getPopularityLevel(person.popularity);
  const popularityBadgeClass = getPopularityBadgeClass(popularityLevel);
  const priority = index < 8; // 前8个图片优先加载

  return (
    <div className="group relative">
      <div className="card card-compact bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 border border-base-300 hover:border-primary/50">
        
        {/* 头像区域 */}
        <figure className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
          <Image
            src={profileUrl}
            alt={person.name}
            fill
            priority={priority}
            className="object-cover transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* 知名度徽章 */}
          {person.popularity > 5 && (
            <div className="absolute top-2 left-2">
              <div className={`badge ${popularityBadgeClass} badge-sm gap-1`}>
                ⭐ {person.popularity.toFixed(1)}
              </div>
            </div>
          )}

          {/* 部门徽章 */}
          {person.known_for_department && (
            <div className="absolute top-2 right-2">
              <div className="badge badge-outline badge-sm">
                {person.known_for_department}
              </div>
            </div>
          )}

          {/* 查看详情按钮 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              href={`/detail/person/${person.id}`}
              className="btn btn-primary btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {t('viewDetails')}
            </Link>
          </div>
        </figure>

        {/* 信息区域 */}
        <div className="card-body p-4 space-y-3">
          {/* 姓名 */}
          <Link href={`/detail/person/${person.id}`}>
            <h2 className="card-title text-base leading-tight hover:text-primary transition-colors duration-200 line-clamp-2 cursor-pointer">
              {person.name}
            </h2>
          </Link>

          {/* 知名作品 */}
          {(person as any).known_for && (person as any).known_for.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-base-content/60 font-medium">{t('knownFor')}</p>
              <div className="flex flex-wrap gap-1">
                {(person as any).known_for.slice(0, 2).map((work: any, idx: number) => (
                  <span
                    key={work.id}
                    className="badge badge-outline badge-xs"
                    title={work.title || work.name}
                  >
                    {(work.title || work.name)?.slice(0, 10)}
                    {(work.title || work.name)?.length > 10 ? '...' : ''}
                  </span>
                ))}
                {(person as any).known_for.length > 2 && (
                  <span className="badge badge-ghost badge-xs">
                    +{(person as any).known_for.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 统计信息 */}
          <div className="flex items-center justify-between text-xs text-base-content/50">
            <span>{t('popularity')} {person.popularity.toFixed(1)}</span>
            {person.known_for_department && (
              <span>{person.known_for_department}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 人员网格主组件
 */
export default async function PersonGrid({ people }: PersonGridProps) {
  const t = await getTranslations('Search');
  
  if (!people || people.length === 0) {
    return (
      <div className="text-center mt-20">
        <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="card-title justify-center text-xl">{t('noPeopleFound')}</h3>
            <p className="text-base-content/60 mb-6">
              {t('noPeopleFoundDesc')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {people.map((person, index) => (
        <PersonCard
          key={`person-${person.id}`}
          person={person}
          index={index}
        />
      ))}
    </div>
  );
}
