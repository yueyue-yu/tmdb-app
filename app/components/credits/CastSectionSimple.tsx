/**
 * 简化版演员组件
 * 用于详情页面，只显示一行演员
 */

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { UsersIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import PersonCard from './PersonCard';
import type { CastSectionProps } from '@/app/type/credits';

interface CastSectionSimpleProps {
  cast: any[];
  mediaType: 'movie' | 'tv';
  mediaId: number;
  showCount?: number;
}

export default function CastSectionSimple({
  cast,
  mediaType,
  mediaId,
  showCount = 8
}: CastSectionSimpleProps) {
  const t = useTranslations('Credits');
  if (!cast || cast.length === 0) {
    return null;
  }

  const displayCast = cast.slice(0, showCount);
  const castPageUrl = `/detail/${mediaType}/${mediaId}/cast`;

  return (
    <div className="space-y-6">
      {/* 标题和查看更多按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UsersIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{t('cast')}</h2>
          <span className="text-base-content/60">({cast.length})</span>
        </div>
        
        {cast.length > showCount && (
          <Link
            href={castPageUrl}
            className="btn btn-outline btn-sm gap-2 hover:btn-primary"
          >
            {t('viewAll')}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* 演员列表 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {displayCast.map((person, index) => (
          <PersonCard
            key={person.id}
            person={person}
            type="cast"
            mediaType={mediaType}
            index={index}
            priority={index < 4}
            className="w-full"
          />
        ))}
      </div>

      {/* 查看更多提示 */}
      {cast.length > showCount && (
        <div className="text-center pt-4">
          <Link
            href={castPageUrl}
            className="text-primary hover:text-primary-focus transition-colors"
          >
            {t('moreActors', { count: cast.length - showCount })}
          </Link>
        </div>
      )}
    </div>
  );
}
