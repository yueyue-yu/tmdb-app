/**
 * 类型相关的API请求方法
 */

import { apiClient } from './client';
import type { Genre } from './types';

interface GenreResponse {
  genres: Genre[];
}

export const genresApi = {
  /**
   * 获取电影类型列表
   */
  getMovieGenres: (): Promise<GenreResponse> => {
    return apiClient.get('/genre/movie/list');
  },

  /**
   * 获取电视剧类型列表
   */
  getTvGenres: (): Promise<GenreResponse> => {
    return apiClient.get('/genre/tv/list');
  }
};
