/**
 * 向后兼容的 moviesApi 对象
 * 注意：这个文件不使用 'use server'，因为它导出对象而非函数
 */

import { 
  fetchMovies, 
  fetchMovieDetails, 
  searchMovies, 
  fetchMoviesByGenre, 
  fetchSimilarMovies, 
  fetchRecommendedMovies 
} from './movieActions';

/**
 * @deprecated 向后兼容的 moviesApi 对象
 * 建议直接使用 movieActions.ts 中的函数
 */
export const moviesApi = {
  /**
   * @deprecated 请使用 fetchMovies('popular', page) 代替
   */
  getPopular: (page: number = 1) => fetchMovies('popular', page),
  
  /**
   * @deprecated 请使用 fetchMovies('now-playing', page) 代替
   */
  getNowPlaying: (page: number = 1) => fetchMovies('now-playing', page),
  
  /**
   * @deprecated 请使用 fetchMovies('upcoming', page) 代替
   */
  getUpcoming: (page: number = 1) => fetchMovies('upcoming', page),
  
  /**
   * @deprecated 请使用 fetchMovies('top-rated', page) 代替
   */
  getTopRated: (page: number = 1) => fetchMovies('top-rated', page),
  
  /**
   * @deprecated 请使用 fetchMovieDetails(movieId) 代替
   */
  getDetails: (movieId: number) => fetchMovieDetails(movieId),
  
  /**
   * @deprecated 请使用 searchMovies(query, page) 代替
   */
  search: (query: string, page: number = 1) => searchMovies(query, page),
  
  /**
   * @deprecated 请使用 fetchMoviesByGenre(genreId, page) 代替
   */
  getByGenre: (genreId: number, page: number = 1) => fetchMoviesByGenre(genreId, page),
  
  /**
   * @deprecated 请使用 fetchSimilarMovies(movieId, page) 代替
   */
  getSimilar: (movieId: number, page: number = 1) => fetchSimilarMovies(movieId, page),
  
  /**
   * @deprecated 请使用 fetchRecommendedMovies(movieId, page) 代替
   */
  getRecommendations: (movieId: number, page: number = 1) => fetchRecommendedMovies(movieId, page)
};
