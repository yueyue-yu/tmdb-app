/**
 * 电视剧详情Hero组件
 * 显示背景图、标题和基本信息
 */

import Image from 'next/image';
import { CalendarIcon, TvIcon, StarIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';
import type { TvDetailHeroProps } from '@/app/type/tvDetail';
import { getBackdropUrl, getPosterUrl, getYear } from '@/app/lib/utils/movieUtils';
import GenreBadges from '../movie-detail/GenreBadges';
import BackButton from '../common/BackButton';
import { PageType } from '@/app/lib/utils/navigationUtils';

export default async function TvDetailHero({ tv }: TvDetailHeroProps) {
  const t = await getTranslations('TvDetail');
  
  const backdropUrl = getBackdropUrl(tv.backdrop_path);
  const posterUrl = getPosterUrl(tv.poster_path);
  const firstAirYear = getYear(tv.first_air_date);
  const lastAirYear = tv.last_air_date ? getYear(tv.last_air_date) : null;
  const rating = tv.vote_average.toFixed(1);
  
  // 计算平均每集时长
  const averageRuntime = tv.episode_run_time.length > 0 
    ? Math.round(tv.episode_run_time.reduce((a, b) => a + b, 0) / tv.episode_run_time.length)
    : null;

  return (
    <div className="hero min-h-[70vh] relative overflow-hidden">
      {/* 返回按钮 */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton pageType={PageType.TV_DETAIL} />
      </div>

      {/* 背景图片 */}
      {tv.backdrop_path && (
        <div className="hero-overlay bg-opacity-40">
          <Image
            src={backdropUrl}
            alt={tv.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* 多层渐变遮罩 - 增强文字可读性 */}
      <div className="hero-overlay bg-gradient-to-t from-black via-black/70 to-black/30"></div>
      <div className="hero-overlay bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
      <div className="hero-overlay bg-gradient-to-b from-transparent via-black/20 to-black"></div>
      
      <div className="hero-content text-center text-neutral-content relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* 海报 */}
          <div className="flex-shrink-0">
            <div className="w-64 h-96 relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={posterUrl}
                alt={tv.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, 256px"
              />
            </div>
          </div>
          
          {/* 电视剧信息 */}
          <div className="flex-1 text-left space-y-6">
            {/* 标题和年份 */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-2 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%)]">
                {tv.name}
              </h1>
              {tv.original_name !== tv.name && (
                <p className="text-xl text-white/90 italic drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_70%)]">
                  {tv.original_name}
                </p>
              )}
              {tv.tagline && (
                <div className="mt-2 p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <p className="text-lg text-white italic drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_70%)]">
                    "{tv.tagline}"
                  </p>
                </div>
              )}
            </div>

            {/* 基本信息 */}
            <div className="flex flex-wrap items-center gap-4">
              {/* 播出年份 */}
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                <CalendarIcon className="w-5 h-5 text-white drop-shadow-lg" />
                <span className="text-white font-medium drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">
                  {firstAirYear}
                  {lastAirYear && lastAirYear !== firstAirYear && ` - ${lastAirYear}`}
                  {tv.in_production && !lastAirYear && ' - 至今'}
                </span>
              </div>

              {/* 季数和集数 */}
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                <TvIcon className="w-5 h-5 text-white drop-shadow-lg" />
                <span className="text-white font-medium drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">
                  {tv.number_of_seasons} {t('seasons')} · {tv.number_of_episodes} {t('episodes')}
                </span>
              </div>

              {/* 平均每集时长 */}
              {averageRuntime && (
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                  <span className="text-white font-medium drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">~{averageRuntime} {t('minutesPerEpisode')}</span>
                </div>
              )}

              {/* 评分 */}
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                <StarIcon className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
                <span className="font-semibold text-white drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">{rating}</span>
                <span className="text-sm text-white/90 drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">({tv.vote_count.toLocaleString()} {t('votes')})</span>
              </div>
            </div>

            {/* 类型标签 */}
            <GenreBadges genres={tv.genres} />

            {/* 简介 */}
            {tv.overview && (
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold text-white mb-3 drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_70%)]">{t('overview')}</h3>
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-white leading-relaxed text-lg drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">
                    {tv.overview}
                  </p>
                </div>
              </div>
            )}

            {/* 制作状态 */}
            <div className="flex items-center gap-4">
              <div className={`badge ${tv.in_production ? 'badge-success' : 'badge-info'} badge-lg shadow-lg border border-white/20 backdrop-blur-sm drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]`}>
                {tv.in_production ? t('inProduction') : t('ended')}
              </div>
              {tv.status && (
                <div className="badge badge-outline badge-lg text-white border-white/50 shadow-lg backdrop-blur-sm drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">
                  {tv.status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
