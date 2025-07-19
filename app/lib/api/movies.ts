/**
 * 电影相关的API请求方法
 */

import { apiClient } from './client';
import type { ApiResponse, Movie, MovieDetails } from './types';

export const moviesApi = {
  /**
   * 获取热门电影
   */
  getPopular: (page: number = 1): Promise<ApiResponse<Movie>> => {
    return apiClient.get('/movie/popular', { page: page.toString() });
  },

  /**
   * 获取正在上映电影
   */
  getNowPlaying: (page: number = 1): Promise<ApiResponse<Movie>> => {
    return apiClient.get('/movie/now-playing', { page: page.toString() });
  },

  /**
   * 获取即将上映电影
   */
  getUpcoming: (page: number = 1): Promise<ApiResponse<Movie>> => {
    return apiClient.get('/movie/upcoming', { page: page.toString() });
  },

  /**
   * 获取评分最高电影
   */
  getTopRated: (page: number = 1): Promise<ApiResponse<Movie>> => {
    return apiClient.get('/movie/top_rated', { page: page.toString() });
  },

  /**
   * 获取电影详情
   */
  getDetails: (movieId: number): Promise<MovieDetails> => {
    return apiClient.get(`/movie/${movieId}`);
  },

  /**
   * 搜索电影
   */
  search: (query: string, page: number = 1): Promise<ApiResponse<Movie>> => {
    return apiClient.get('/search/movie', { 
      query, 
      page: page.toString() 
    });
  },

  /**
   * 根据类型获取电影
   */
  getByGenre: (genreId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    return apiClient.get('/discover/movie', { 
      with_genres: genreId.toString(),
      page: page.toString() 
    });
  },

  /**
   * 获取相似电影
   */
  getSimilar: (movieId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    return apiClient.get(`/movie/${movieId}/similar`, { 
      page: page.toString() 
    });
  },

  /**
   * 获取推荐电影
   */
  getRecommendations: (movieId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    return apiClient.get(`/movie/${movieId}/recommendations`, { 
      page: page.toString() 
    });
  }
};
