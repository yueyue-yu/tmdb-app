'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EyeIcon, CalendarIcon, StarIcon } from '@heroicons/react/24/outline';
import type { Movie, TvShow as TVShow, Person } from '@/app/lib/api/types';

interface SearchResultListItemProps {
  item: Movie | TVShow | Person;
  index: number;
}

/**
 * 搜索结果列表项组件
 * 左边显示海报，右边显示详细信息
 */
export default function SearchResultListItem({ item, index }: SearchResultListItemProps) {
  const t = useTranslations('Search');

  // 获取基本信息
  const getItemInfo = () => {
    // 检查是否有media_type字段
    const mediaType = (item as any).media_type;

    // 临时调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log('SearchResultListItem debug:', {
        id: (item as any).id,
        title: (item as any).title,
        name: (item as any).name,
        mediaType,
        hasFirstAirDate: 'first_air_date' in item,
        hasReleaseDate: 'release_date' in item,
        item
      });
    }

    // 优先使用media_type判断，然后使用特有字段判断
    if (mediaType === 'tv' || ('first_air_date' in item && !('release_date' in item))) {
      // 处理电视剧数据（包括转换后的数据）
      const tvData = item as any;
      return {
        title: tvData.title || tvData.name,
        subtitle: (tvData.original_title || tvData.original_name) !== (tvData.title || tvData.name) ? (tvData.original_title || tvData.original_name) : '',
        year: tvData.first_air_date ? new Date(tvData.first_air_date).getFullYear() : null,
        rating: tvData.vote_average,
        overview: tvData.overview,
        posterPath: tvData.poster_path,
        backdropPath: tvData.backdrop_path,
        popularity: tvData.popularity,
        voteCount: tvData.vote_count,
        detailUrl: `/detail/tv/${tvData.id}`,
        mediaType: t('searchTypes.tv')
      };
    } else if (mediaType === 'movie' || ('title' in item && 'release_date' in item)) {
      const movie = item as Movie;
      return {
        title: movie.title,
        subtitle: movie.original_title !== movie.title ? movie.original_title : '',
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        rating: movie.vote_average,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        popularity: movie.popularity,
        voteCount: movie.vote_count,
        detailUrl: `/detail/movie/${movie.id}`,
        mediaType: t('searchTypes.movie')
      };
    } else if (mediaType === 'person' || 'known_for_department' in item) {
      const person = item as Person;
      return {
        title: person.name,
        subtitle: '',
        year: null,
        rating: null,
        overview: `${person.known_for_department} • ${t('knownFor')} ${(person as any).known_for?.map((work: any) => work.title || work.name).join(', ') || t('noOverview')}`,
        posterPath: person.profile_path,
        backdropPath: null,
        popularity: person.popularity,
        voteCount: null,
        detailUrl: `/detail/person/${person.id}`,
        mediaType: t('searchTypes.person')
      };
    }
    
    return {
      title: t('unknown') || 'Unknown',
      subtitle: '',
      year: null,
      rating: null,
      overview: '',
      posterPath: null,
      backdropPath: null,
      popularity: 0,
      voteCount: null,
      detailUrl: '#',
      mediaType: t('unknown') || 'Unknown'
    };
  };

  const info = getItemInfo();

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // 获取海报URL
  const getPosterUrl = () => {
    if (!info.posterPath) {
      return '/images/default-backdrop.svg';
    }
    return `https://image.tmdb.org/t/p/w300${info.posterPath}`;
  };

  return (
    <div className="flex gap-4 p-4 bg-base-100 rounded-lg border border-base-200 hover:shadow-md transition-shadow">
      {/* 左侧海报 */}
      <div className="flex-shrink-0">
        <Link href={info.detailUrl} className="block">
          <div className="relative w-24 h-36 rounded-lg overflow-hidden bg-base-200">
            <Image
              src={getPosterUrl()}
              alt={info.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="96px"
            />
            
            {/* 评分徽章 */}
            {info.rating && info.rating > 0 && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                <StarIcon className="w-3 h-3 text-yellow-400" />
                <span>{info.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* 右侧信息 */}
      <div className="flex-1 min-w-0">
        {/* 标题和副标题 */}
        <div className="mb-2">
          <Link href={info.detailUrl} className="hover:text-primary transition-colors">
            <h3 className="text-lg font-semibold line-clamp-1">{info.title}</h3>
          </Link>
          {info.subtitle && (
            <p className="text-sm text-base-content/60 line-clamp-1">{info.subtitle}</p>
          )}
        </div>

        {/* 元信息 */}
        <div className="flex items-center gap-4 mb-3 text-sm text-base-content/70">
          {/* 媒体类型 */}
          <span className="badge badge-outline badge-sm">{info.mediaType}</span>
          
          {/* 年份 */}
          {info.year && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{info.year}</span>
            </div>
          )}
          
          {/* 观看数 */}
          {info.voteCount && info.voteCount > 0 && (
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>{formatNumber(info.voteCount)}</span>
            </div>
          )}
        </div>

        {/* 简介 */}
        <p className="text-sm text-base-content/80 line-clamp-2 mb-3">
          {info.overview || t('noOverview')}
        </p>

        {/* 底部标记 */}
        <div className="flex items-center">
          {/* 热度指示器 */}
          {info.popularity > 50 && (
            <span className="badge badge-primary badge-sm">HOT</span>
          )}
        </div>
      </div>
    </div>
  );
}
