/**
 * 分类工具函数 - 国际化版本
 */

import {
  FireIcon,
  TrophyIcon,
  CalendarIcon,
  ClockIcon, 
  SignalIcon, 
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

import { MediaCategoryKeys, MovieCategoryKeys, TvCategoryKeys, MediaTypeEnum } from "@/app/type/movie";

export interface CategoryConfig {
  key: MediaCategoryKeys;
  labelKey: string; // 翻译键
  icon: React.ComponentType<{ className?: string }>;
  descriptionKey: string; // 翻译键
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export const MOVIE_CATEGORIES: CategoryConfig[] = [
  {
    key: 'popular',
    labelKey: 'popularMovies',
    icon: FireIcon,
    descriptionKey: 'popularMoviesDesc',
    color: 'text-red-500',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-orange-500'
  },
  {
    key: 'top-rated',
    labelKey: 'topRatedMovies',
    icon: TrophyIcon,
    descriptionKey: 'topRatedMoviesDesc',
    color: 'text-yellow-500',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-amber-500'
  },
  {
    key: 'now-playing',
    labelKey: 'nowPlayingMovies',
    icon: ClockIcon,
    descriptionKey: 'nowPlayingMoviesDesc',
    color: 'text-green-500',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500'
  },
  {
    key: 'upcoming',
    labelKey: 'upcomingMovies',
    icon: CalendarIcon,
    descriptionKey: 'upcomingMoviesDesc',
    color: 'text-blue-500',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-indigo-500'
  }
];

export const TV_CATEGORIES: CategoryConfig[] = [
  {
    key: 'popular',
    labelKey: 'popularTVShows',
    icon: FireIcon,
    descriptionKey: 'popularTVShowsDesc',
    color: 'text-red-500',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-orange-500'
  },
  {
    key: 'top-rated',
    labelKey: 'topRatedTVShows',
    icon: TrophyIcon,
    descriptionKey: 'topRatedTVShowsDesc',
    color: 'text-yellow-500',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-amber-500'
  },
  {
    key: 'on-the-air',
    labelKey: 'onTheAirTVShows',
    icon: SignalIcon,
    descriptionKey: 'onTheAirTVShowsDesc',
    color: 'text-green-500',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500'
  },
  {
    key: 'airing-today',
    labelKey: 'airingTodayTVShows',
    icon: CalendarDaysIcon,
    descriptionKey: 'airingTodayTVShowsDesc',
    color: 'text-blue-500',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500'
  }
];

// 根据key获取分类配置的工具函数
export function getMovieCategoryConfig(categoryKey: MovieCategoryKeys): CategoryConfig {
  return MOVIE_CATEGORIES.find(cat => cat.key === categoryKey) || MOVIE_CATEGORIES[0];
}

export function getTvCategoryConfig(categoryKey: TvCategoryKeys): CategoryConfig {
  return TV_CATEGORIES.find(cat => cat.key === categoryKey) || TV_CATEGORIES[0];
}

export function getCategoryConfigs(mediaType: MediaTypeEnum): CategoryConfig[] {
  return mediaType === MediaTypeEnum.Movie ? MOVIE_CATEGORIES : TV_CATEGORIES;
}

export const DEFAULT_CATEGORY = 'popular';
