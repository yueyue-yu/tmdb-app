/**
 * 横向滑动季数组件
 * 用于电视剧详情页面，支持横向滑动浏览季数信息
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { TvIcon, CalendarIcon, FilmIcon, StarIcon } from '@heroicons/react/24/outline';
import HorizontalScrollContainer from '@/app/components/common/HorizontalScrollContainer';
import { getPosterUrl } from '@/app/lib/movieUtils';
import type { Season } from '@/app/lib/api/types';

interface SeasonsHorizontalProps {
  seasons: Season[];
  tvId: number;
  tvTitle: string;
  className?: string;
}

export default function SeasonsHorizontal({
  seasons,
  tvId,
  tvTitle,
  className = ''
}: SeasonsHorizontalProps) {
  const t = useTranslations('TvDetail');

  if (!seasons || seasons.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        暂无季度信息
      </div>
    );
  }

  // 过滤掉特殊季度（如第0季）并按季度号排序
  const regularSeasons = seasons
    .filter(season => season.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number);

  if (regularSeasons.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        暂无常规季度信息
      </div>
    );
  }

  // 显示所有常规季数
  const displaySeasons = regularSeasons;

  // 处理季数卡片点击
  const handleSeasonClick = (season: Season) => {
    // 跳转到 TMDB 的季数页面
    const tmdbSeasonUrl = `https://www.themoviedb.org/tv/${tvId}/season/${season.season_number}`;
    window.open(tmdbSeasonUrl, '_blank');
  };

  // 渲染季数卡片
  const renderSeasonCard = (season: Season, index: number) => (
    <div
      className="group cursor-pointer"
      onClick={() => handleSeasonClick(season)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSeasonClick(season);
        }
      }}
      aria-label={`查看 ${season.name} 详情`}
    >
      <div className="card bg-base-200 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full border border-base-300 hover:border-primary/30">
        {/* 季数海报 */}
        <figure className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={getPosterUrl(season.poster_path)}
            alt={season.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={index < 4}
          />

          {/* 季数标识 */}
          <div className="absolute top-3 left-3 bg-primary/95 text-primary-content px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
            第 {season.season_number} 季
          </div>

          {/* 悬停遮罩 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
        </figure>

        {/* 季数信息 */}
        <div className="card-body p-4 flex-1">
          <h3 className="card-title text-base line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {season.name}
          </h3>

          {/* 季度统计信息 */}
          <div className="space-y-2.5 text-sm">
            {/* 播出日期 */}
            {season.air_date && (
              <div className="flex items-center gap-2 text-base-content/70">
                <CalendarIcon className="w-4 h-4 flex-shrink-0 text-primary/70" />
                <span className="font-medium">{new Date(season.air_date).getFullYear()}</span>
              </div>
            )}

            {/* 集数 */}
            <div className="flex items-center gap-2 text-base-content/70">
              <FilmIcon className="w-4 h-4 flex-shrink-0 text-primary/70" />
              <span className="font-medium">{season.episode_count} 集</span>
            </div>

            {/* 评分 */}
            {season.vote_average > 0 && (
              <div className="flex items-center gap-2 text-base-content/70">
                <StarIcon className="w-4 h-4 flex-shrink-0 text-yellow-500" />
                <span className="font-medium">{season.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* 简介 */}
          {season.overview && (
            <p className="text-xs text-base-content/60 line-clamp-3 mt-3 leading-relaxed">
              {season.overview}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`seasons-horizontal space-y-6 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <TvIcon className="w-6 h-6" />
        <h2 className="text-2xl font-bold">{t('seasons')}</h2>
        <span className="text-base-content/60">({regularSeasons.length})</span>
      </div>

      {/* 横向滑动季数列表 */}
      <HorizontalScrollContainer
        items={displaySeasons}
        renderItem={renderSeasonCard}
        itemWidth="w-[220px] sm:w-[240px] md:w-[260px]"
        gap="gap-4 sm:gap-5"
        className=""
        scrollAmount={2}
        aria-label={`${t('seasons')} - ${regularSeasons.length}季`}
      />
    </div>
  );
}

/**
 * 季数列表骨架屏组件
 */
export function SeasonsHorizontalSkeleton({
  showCount = 6,
  className = ''
}: {
  showCount?: number;
  className?: string;
}) {
  return (
    <div className={`seasons-horizontal-skeleton space-y-6 ${className}`}>
      {/* 标题骨架 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-base-300 rounded animate-pulse"></div>
          <div className="w-16 h-8 bg-base-300 rounded animate-pulse"></div>
          <div className="w-8 h-6 bg-base-300 rounded animate-pulse"></div>
        </div>
        <div className="w-20 h-8 bg-base-300 rounded animate-pulse"></div>
      </div>

      {/* 季数列表骨架 */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: showCount }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px]"
          >
            <div className="animate-pulse">
              <div className="bg-base-300 aspect-[2/3] rounded-lg mb-3"></div>
              <div className="bg-base-300 h-4 rounded mb-2"></div>
              <div className="bg-base-300 h-3 rounded w-3/4 mb-1"></div>
              <div className="bg-base-300 h-3 rounded w-1/2"></div>
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
 * 空季数列表组件
 */
export function SeasonsHorizontalEmpty({
  message,
  className = ''
}: {
  message?: string;
  className?: string;
}) {
  const t = useTranslations('TvDetail');
  const emptyMessage = message || '暂无季度信息';

  return (
    <div className={`seasons-horizontal-empty space-y-6 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <TvIcon className="w-6 h-6" />
        <h2 className="text-2xl font-bold">{t('seasons')}</h2>
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
