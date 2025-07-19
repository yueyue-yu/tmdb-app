/**
 * API模块统一导出
 */

export { apiClient } from './client';
export { peopleApi } from './people';
export { genresApi } from './genres';





// 🆕 新的 Server Actions
export {
  fetchMovies,
  searchMovies,
  fetchMoviesByGenre,
  fetchSimilarMovies,
  fetchRecommendedMovies,
} from './movieActions';

export {
  fetchTvShows,
  searchTvShows,
  fetchTvShowsByGenre,
  fetchSimilarTvShows,
  fetchRecommendedTvShows,
} from './tvActions';

// 🆕 统一的媒体详情 Server Actions
export {
  fetchMediaDetails,
  fetchMovieDetails,
  fetchTvDetails,
} from './mediaDetailsActions';

export type {
  ApiResponse,
  Movie,
  MovieDetails,
  TvShow,
  TvDetails,
  MediaDetails,
  Season,
  Network,
  Person,
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  ApiError
} from './types';

/**
 * 图片URL工具函数
 */
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * 获取完整的backdrop图片URL
 */
export const getBackdropUrl = (path: string | null): string => {
  return getImageUrl(path, 'w1280');
};

/**
 * 获取完整的poster图片URL
 */
export const getPosterUrl = (path: string | null): string => {
  return getImageUrl(path, 'w500');
};

/**
 * 获取完整的profile图片URL
 */
export const getProfileUrl = (path: string | null): string => {
  return getImageUrl(path, 'w185');
};
