/**
 * 横向滑动演员组件
 * 用于详情页面，支持横向滑动浏览演员列表
 */

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { UsersIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import HorizontalScrollContainer from '@/app/components/common/HorizontalScrollContainer';
import PersonCard from './PersonCard';
import type { Cast } from '@/app/type/credits';

interface CastSectionHorizontalProps {
  cast: Cast[];
  mediaType: 'movie' | 'tv';
  mediaId: number;
  showCount?: number;
  className?: string;
}

export default function CastSectionHorizontal({
  cast,
  mediaType,
  mediaId,
  showCount = 12, // 横向滑动可以显示更多演员
  className = ''
}: CastSectionHorizontalProps) {
  const t = useTranslations('Credits');
  
  if (!cast || cast.length === 0) {
    return null;
  }

  const displayCast = cast.slice(0, showCount);
  const castPageUrl = `/detail/${mediaType}/${mediaId}/cast`;

  // 渲染演员卡片
  const renderCastCard = (person: Cast, index: number) => (
    <PersonCard
      person={person}
      type="cast"
      mediaType={mediaType}
      index={index}
      priority={index < 4}
    />
  );

  return (
    <div className={`cast-section-horizontal space-y-6 ${className}`}>
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

      {/* 横向滑动演员列表 */}
      <HorizontalScrollContainer
        items={displayCast}
        renderItem={renderCastCard}
        itemWidth="w-[140px] sm:w-[160px] md:w-[180px]"
        gap="gap-3 sm:gap-4"
        className=""
        aria-label={`${t('cast')} - ${cast.length}人`}
      />
    </div>
  );
}

/**
 * 演员列表骨架屏组件
 */
export function CastSectionHorizontalSkeleton({
  showCount = 8,
  className = ''
}: {
  showCount?: number;
  className?: string;
}) {
  return (
    <div className={`cast-section-horizontal-skeleton space-y-6 ${className}`}>
      {/* 标题骨架 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-base-300 rounded animate-pulse"></div>
          <div className="w-16 h-8 bg-base-300 rounded animate-pulse"></div>
          <div className="w-8 h-6 bg-base-300 rounded animate-pulse"></div>
        </div>
        <div className="w-20 h-8 bg-base-300 rounded animate-pulse"></div>
      </div>

      {/* 演员列表骨架 */}
      <div className="flex gap-3 sm:gap-4 overflow-hidden">
        {Array.from({ length: showCount }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]"
          >
            <div className="animate-pulse">
              <div className="bg-base-300 aspect-[2/3] rounded-lg mb-3"></div>
              <div className="bg-base-300 h-4 rounded mb-2"></div>
              <div className="bg-base-300 h-3 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 查看更多骨架 */}
      <div className="text-center pt-2">
        <div className="w-24 h-4 bg-base-300 rounded animate-pulse mx-auto"></div>
      </div>
    </div>
  );
}

/**
 * 空演员列表组件
 */
export function CastSectionHorizontalEmpty({
  message,
  className = ''
}: {
  message?: string;
  className?: string;
}) {
  const t = useTranslations('Credits');
  const emptyMessage = message || t('noCastInfo');

  return (
    <div className={`cast-section-horizontal-empty space-y-6 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <UsersIcon className="w-6 h-6" />
        <h2 className="text-2xl font-bold">{t('cast')}</h2>
        <span className="text-base-content/60">(0)</span>
      </div>

      {/* 空状态 */}
      <div className="text-center py-12">
        <div className="text-base-content/60">
          {emptyMessage}
        </div>
      </div>
    </div>
  );
}
