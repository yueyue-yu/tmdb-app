/**
 * 电影相关的API请求方法 - 使用 Next.js API 路由
 */

import { nextApiClient } from './nextClient';
import type { ApiResponse, Movie, MovieDetails } from './types';

export const moviesApiNext = {
  /**
   * 获取热门电影
   */
  getPopular: (page: number = 1): Promise<ApiResponse<Movie>> => {
    return nextApiClient.get('/movies/popular', { page: page.toString() });
  },

  /**
   * 获取最新上映电影
   */
  getNowPlaying: (page: number = 1): Promise<ApiResponse<Movie>> => {
    return nextApiClient.get('/movies/now-playing', { page: page.toString() });
  },

  /**
   * 获取即将上映电影
   */
  getUpcoming: (page: number = 1): Promise<ApiResponse<Movie>> => {
    return nextApiClient.get('/movies/upcoming', { page: page.toString() });
  },

  /**
   * 获取评分最高电影
   */
  getTopRated: (page: number = 1): Promise<ApiResponse<Movie>> => {
    return nextApiClient.get('/movies/top-rated', { page: page.toString() });
  },

  /**
   * 获取电影详情
   */
  getDetails: (movieId: number): Promise<MovieDetails> => {
    return nextApiClient.get(`/movies/${movieId}`);
  },

  /**
   * 搜索电影
   */
  search: (query: string, page: number = 1): Promise<ApiResponse<Movie>> => {
    return nextApiClient.get('/search/movies', { 
      query, 
      page: page.toString() 
    });
  },
};
