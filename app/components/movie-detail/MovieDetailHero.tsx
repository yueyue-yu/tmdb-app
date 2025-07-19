/**
 * 电影详情Hero组件
 * 显示背景图、标题和基本信息
 */

import Image from 'next/image';
import { CalendarIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';
import type { MovieDetailHeroProps } from '@/app/type/movieDetail';
import { getBackdropUrl, getPosterUrl, getYear } from '@/app/lib/movieUtils';
import GenreBadges from './GenreBadges';
import BackButton from '../shared/BackButton';
import { PageType } from '@/app/lib/utils/navigationUtils';

export default async function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  const t = await getTranslations('MovieDetail');
  
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = getYear(movie.release_date);
  const rating = movie.vote_average.toFixed(1);

  return (
    <div className="hero min-h-[70vh] relative overflow-hidden">
      {/* 返回按钮 */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton pageType={PageType.MOVIE_DETAIL} />
      </div>

      {/* 背景图片 */}
      {movie.backdrop_path && (
        <div className="hero-overlay bg-opacity-40">
          <Image
            src={backdropUrl}
            alt={movie.title}
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
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, 256px"
              />
            </div>
          </div>
          
          {/* 电影信息 */}
          <div className="flex-1 text-left space-y-6">
            {/* 标题和年份 */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-2 drop-shadow-2xl [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%)]">
                {movie.title}
              </h1>
              {movie.original_title !== movie.title && (
                <p className="text-xl text-white/90 italic drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_70%)]">
                  {movie.original_title}
                </p>
              )}
              {movie.tagline && (
                <div className="mt-2 p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <p className="text-lg text-white italic drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_70%)]">
                    "{movie.tagline}"
                  </p>
                </div>
              )}
            </div>

            {/* 基本信息 */}
            <div className="flex flex-wrap items-center gap-4">
              {/* 年份 */}
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                <CalendarIcon className="w-5 h-5 text-white drop-shadow-lg" />
                <span className="text-white font-medium drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">{year}</span>
              </div>

              {/* 时长 */}
              {movie.runtime && (
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                  <ClockIcon className="w-5 h-5 text-white drop-shadow-lg" />
                  <span className="text-white font-medium drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">{movie.runtime} {t('minutes')}</span>
                </div>
              )}

              {/* 评分 */}
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                <StarIcon className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
                <span className="font-semibold text-white drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">{rating}</span>
                <span className="text-sm text-white/90 drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">({movie.vote_count.toLocaleString()} {t('votes')})</span>
              </div>
            </div>

            {/* 类型标签 */}
            <GenreBadges genres={movie.genres} />

            {/* 简介 */}
            {movie.overview && (
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold text-white mb-3 drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_70%)]">{t('overview')}</h3>
                <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <p className="text-white leading-relaxed text-lg drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">
                    {movie.overview}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
