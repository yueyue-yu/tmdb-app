/**
 * 演员区域组件
 * 显示主要演员信息
 */

import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import PersonCard from './PersonCard';
import type { CastSectionProps } from '@/app/type/credits';

export default async function CastSection({ cast, mediaType }: CastSectionProps) {
  const t = await getTranslations('Credits');
  
  if (!cast || cast.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        {t('noCastInfo')}
      </div>
    );
  }

  // 显示前8位主要演员
  const mainCast = cast.slice(0, 8);
  const hasMoreCast = cast.length > 8;

  return (
    <div className="space-y-4">
      {/* 标题和查看全部链接 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('cast')}</h2>
        {hasMoreCast && (
          <Link 
            href={`/credits/${mediaType}/cast`}
            className="flex items-center gap-1 text-primary hover:text-primary-focus transition-colors"
          >
            <span className="text-sm">{t('viewAll')} ({cast.length})</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* 演员网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {mainCast.map((actor) => (
          <PersonCard
            key={actor.cast_id}
            person={actor}
            type="cast"
            mediaType={mediaType}
          />
        ))}
      </div>

      {/* 查看全部按钮（移动端） */}
      {hasMoreCast && (
        <div className="text-center mt-6 lg:hidden">
          <Link 
            href={`/credits/${mediaType}/cast`}
            className="btn btn-outline btn-sm"
          >
            {t('viewAllCast')} ({cast.length})
          </Link>
        </div>
      )}
    </div>
  );
}
