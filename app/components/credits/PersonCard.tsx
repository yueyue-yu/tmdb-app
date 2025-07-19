/**
 * 人员卡片组件
 * 显示演员或制作人员的信息
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { PersonCardProps } from '@/app/type/credits';

// 获取人员头像URL
function getProfileUrl(profilePath: string | null): string {
  if (!profilePath) {
    return '/images/no-profile.jpg'; // 默认头像
  }
  return `https://image.tmdb.org/t/p/w185${profilePath}`;
}

// 获取性别显示文本
function getGenderText(gender: number, t: any): string {
  switch (gender) {
    case 1: return t('female');
    case 2: return t('male');
    default: return '';
  }
}

export default function PersonCard({ person, type, mediaType }: PersonCardProps) {
  const t = useTranslations('Credits');
  const profileUrl = getProfileUrl(person.profile_path);
  const isActor = type === 'cast';

  // 演员显示角色名，制作人员显示职位
  const roleOrJob = isActor
    ? (person as any).character
    : (person as any).job;

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 group">
      <Link href={`/detail/person/${person.id}`} className="block">
        <figure className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={profileUrl}
            alt={person.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
          
          {/* 悬停遮罩 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
        </figure>
        
        <div className="card-body p-3">
          {/* 姓名 */}
          <h3 className="card-title text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {person.name}
          </h3>
          
          {/* 角色/职位 */}
          {roleOrJob && (
            <p className="text-xs text-base-content/70 line-clamp-2 mt-1">
              {isActor ? `${t('playedBy')} ${roleOrJob}` : roleOrJob}
            </p>
          )}
          
          {/* 额外信息 */}
          <div className="flex items-center justify-between mt-2 text-xs text-base-content/50">
            {/* 性别 */}
            {person.gender > 0 && (
              <span>{getGenderText(person.gender, t)}</span>
            )}
            
            {/* 知名度 */}
            {person.popularity > 0 && (
              <span className="text-xs">
                {person.popularity.toFixed(1)}
              </span>
            )}
          </div>
          
          {/* 部门信息（仅制作人员） */}
          {!isActor && (person as any).department && (
            <div className="mt-1">
              <span className="badge badge-outline badge-xs">
                {(person as any).department}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
