'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EyeIcon } from '@heroicons/react/24/outline';
import type { Person } from '@/app/lib/api/types';

interface PersonCardProps {
  person: Person;
  index: number;
  className?: string;
}

/**
 * 人员卡片组件（用于无限滚动）
 * 显示演员/导演的基本信息和知名作品
 */
export default function PersonCard({ 
  person, 
  index, 
  className = '' 
}: PersonCardProps) {
  const t = useTranslations('Search');
  const [imageError, setImageError] = useState(false);

  // 获取头像URL
  const getProfileUrl = (profilePath: string | null, size: string = 'w185') => {
    if (!profilePath) return '';
    return `https://image.tmdb.org/t/p/${size}${profilePath}`;
  };

  // 获取知名作品名称
  const getKnownForTitles = () => {
    const knownFor = (person as any).known_for;
    if (!knownFor || knownFor.length === 0) return '';

    return knownFor
      .slice(0, 3)
      .map((work: any) => work.title || work.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className={`card card-side bg-base-100 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <figure className="w-24 h-36 flex-shrink-0">
        {person.profile_path && !imageError ? (
          <Image
            src={getProfileUrl(person.profile_path)}
            alt={person.name}
            width={96}
            height={144}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            priority={index < 6}
          />
        ) : (
          <div className="w-full h-full bg-base-200 flex items-center justify-center">
            <div className="text-4xl">👤</div>
          </div>
        )}
      </figure>

      <div className="card-body p-4 flex-1 min-w-0">
        {/* 姓名 */}
        <Link 
          href={`/detail/person/${person.id}`}
          className="card-title text-base hover:text-primary transition-colors line-clamp-1"
        >
          {person.name}
        </Link>

        {/* 职业 */}
        {person.known_for_department && (
          <div className="text-sm text-base-content/60 mb-2">
            {person.known_for_department === 'Acting' ? '演员' : 
             person.known_for_department === 'Directing' ? '导演' : 
             person.known_for_department}
          </div>
        )}

        {/* 知名作品 */}
        {(person as any).known_for && (person as any).known_for.length > 0 && (
          <div className="space-y-1 mb-3">
            <p className="text-xs text-base-content/60 font-medium">
              {t('knownFor')}
            </p>
            <p className="text-sm line-clamp-2">
              {getKnownForTitles()}
            </p>
          </div>
        )}

        {/* 底部信息 */}
        <div className="flex items-center justify-between mt-auto">
          {/* 知名度 */}
          <div className="text-xs text-base-content/50">
            {t('popularity')} {person.popularity.toFixed(1)}
          </div>

          {/* 查看详情按钮 */}
          <Link
            href={`/detail/person/${person.id}`}
            className="btn btn-ghost btn-xs gap-1 hover:btn-primary"
          >
            <EyeIcon className="w-3 h-3" />
            {t('viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
}
