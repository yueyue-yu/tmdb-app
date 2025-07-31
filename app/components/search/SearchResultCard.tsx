'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  CalendarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import type { Movie, TvShow as TVShow, Person } from '@/app/lib/api/types';

interface SearchResultCardProps {
  item: Movie | TVShow | Person;
  index: number;
}

/**
 * 移动端优先的搜索结果卡片组件
 * 现代化设计，触摸友好
 */
export default function SearchResultCard({ item }: SearchResultCardProps) {
  const t = useTranslations('Search');

  // 获取媒体类型
  const getMediaType = () => {
    if ('media_type' in item) {
      return item.media_type;
    }
    if ('first_air_date' in item) return 'tv';
    if ('release_date' in item) return 'movie';
    if ('known_for_department' in item) return 'person';
    return 'unknown';
  };

  // 获取项目信息
  const getItemInfo = () => {
    const mediaType = getMediaType();

    if (mediaType === 'person') {
      const person = item as Person;
      return {
        title: person.name,
        subtitle: person.known_for_department,
        year: null,
        rating: person.popularity,
        overview: (person as any).known_for?.map((k: any) => k.title || k.name).join(', ') || '',
        posterPath: person.profile_path,
        detailUrl: `/person/${person.id}`,
        mediaType: t('searchTypes.person'),
        mediaIcon: '👤'
      };
    }

    if (mediaType === 'tv' || ('first_air_date' in item && !('release_date' in item))) {
      const tvData = item as any;
      return {
        title: tvData.title || tvData.name,
        subtitle: (tvData.original_title || tvData.original_name) !== (tvData.title || tvData.name) 
          ? (tvData.original_title || tvData.original_name) : '',
        year: tvData.first_air_date ? new Date(tvData.first_air_date).getFullYear() : null,
        rating: tvData.vote_average,
        overview: tvData.overview,
        posterPath: tvData.poster_path,
        detailUrl: `/detail/tv/${tvData.id}`,
        mediaType: t('searchTypes.tv'),
        mediaIcon: '📺'
      };
    }

    // 默认为电影
    const movie = item as Movie;
    return {
      title: movie.title,
      subtitle: movie.original_title !== movie.title ? movie.original_title : '',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      rating: movie.vote_average,
      overview: movie.overview,
      posterPath: movie.poster_path,
      detailUrl: `/detail/movie/${movie.id}`,
      mediaType: t('searchTypes.movie'),
      mediaIcon: '🎬'
    };
  };

  const info = getItemInfo();

  // 获取海报URL
  const getPosterUrl = () => {
    if (!info.posterPath) {
      return '/images/default-backdrop.svg';
    }
    return `https://image.tmdb.org/t/p/w300${info.posterPath}`;
  };

  // 渲染星级评分
  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 2); // 10分制转5星制
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <StarSolidIcon 
            key={i} 
            className={`w-3 h-3 ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Link href={info.detailUrl} className="block">
      <div className="bg-base-100 rounded-2xl shadow-sm hover:shadow-lg border border-base-200 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
        {/* 海报区域 */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
          <Image
            src={getPosterUrl()}
            alt={info.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* 播放按钮 - 悬停显示 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayIcon className="w-6 h-6 text-white ml-0.5" />
            </div>
          </div>

          {/* 评分徽章 - 百分比高度 */}
          {info.rating && info.rating > 0 && (
            <div className="absolute top-[3%] right-[3%] bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center gap-1 px-2 h-[8%] min-h-[24px] max-h-[32px] text-xs">
              <StarSolidIcon className="w-3 h-3 text-yellow-400 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">{info.rating.toFixed(1)}</span>
            </div>
          )}

          {/* 媒体类型标签 - 百分比高度 */}
          <div className="absolute top-[3%] left-[3%] bg-primary/90 backdrop-blur-sm text-primary-content rounded-full flex items-center gap-1 px-2 h-[8%] min-h-[24px] max-h-[32px] text-xs">
            <span className="flex-shrink-0">{info.mediaIcon}</span>
            <span className="font-medium whitespace-nowrap">{info.mediaType}</span>
          </div>
        </div>

        {/* 信息区域 */}
        <div className="p-4 space-y-3">
          {/* 标题 */}
          <div>
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {info.title}
            </h3>
            {info.subtitle && (
              <p className="text-sm text-base-content/60 line-clamp-1 mt-1">
                {info.subtitle}
              </p>
            )}
          </div>

          {/* 元信息 */}
          <div className="flex items-center justify-between text-sm text-base-content/70">
            {/* 年份 */}
            {info.year && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{info.year}</span>
              </div>
            )}

            {/* 评分星级 */}
            {info.rating && info.rating > 0 && (
              <div className="flex items-center gap-2">
                {renderStars(info.rating)}
                <span className="text-xs font-medium">{info.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* 简介 */}
          <p className="text-sm text-base-content/80 line-clamp-2 leading-relaxed">
            {info.overview || t('noOverview')}
          </p>
        </div>
      </div>
    </Link>
  );
}
