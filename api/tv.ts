/**
 * 电视剧相关的API请求方法
 */

import { apiClient } from './client';
import type { ApiResponse, TvShow } from './types';

export const tvApi = {
  /**
   * 获取热门电视剧
   */
  getPopular: (page: number = 1): Promise<ApiResponse<TvShow>> => {
    return apiClient.get('/tv/popular', { page: page.toString() });
  },

  /**
   * 获取正在播出的电视剧
   */
  getOnTheAir: (page: number = 1): Promise<ApiResponse<TvShow>> => {
    return apiClient.get('/tv/on_the_air', { page: page.toString() });
  },

  /**
   * 获取今日播出的电视剧
   */
  getAiringToday: (page: number = 1): Promise<ApiResponse<TvShow>> => {
    return apiClient.get('/tv/airing_today', { page: page.toString() });
  },

  /**
   * 获取评分最高电视剧
   */
  getTopRated: (page: number = 1): Promise<ApiResponse<TvShow>> => {
    return apiClient.get('/tv/top_rated', { page: page.toString() });
  },

  /**
   * 搜索电视剧
   */
  search: (query: string, page: number = 1): Promise<ApiResponse<TvShow>> => {
    return apiClient.get('/search/tv', { 
      query, 
      page: page.toString() 
    });
  },

  /**
   * 根据类型获取电视剧
   */
  getByGenre: (genreId: number, page: number = 1): Promise<ApiResponse<TvShow>> => {
    return apiClient.get('/discover/tv', { 
      with_genres: genreId.toString(),
      page: page.toString() 
    });
  }
};
