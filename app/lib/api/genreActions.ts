/**
 * 类型相关的 Server Actions
 */

'use server';

import { getApiClient } from './client';
import type { Genre } from './types';

/**
 * 获取电影类型列表
 * @returns 电影类型列表
 */
export async function fetchMovieGenres(): Promise<Genre[]> {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get('/genre/movie/list') as { genres: Genre[] };
    return response.genres;
  } catch (error) {
    console.error('获取电影类型失败:', error);
    throw new Error('获取电影类型失败');
  }
}

/**
 * 获取电视剧类型列表
 * @returns 电视剧类型列表
 */
export async function fetchTvGenres(): Promise<Genre[]> {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get('/genre/tv/list') as { genres: Genre[] };
    return response.genres;
  } catch (error) {
    console.error('获取电视剧类型失败:', error);
    throw new Error('获取电视剧类型失败');
  }
}

/**
 * 获取指定媒体类型的类型列表
 * @param mediaType 媒体类型
 * @returns 类型列表
 */
export async function fetchGenres(mediaType: 'movie' | 'tv'): Promise<Genre[]> {
  if (mediaType === 'movie') {
    return fetchMovieGenres();
  } else {
    return fetchTvGenres();
  }
}
