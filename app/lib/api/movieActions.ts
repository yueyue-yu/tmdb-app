/**
 * 电影相关的 Server Actions
 */

'use server';

import { apiClient } from './client';
import type { ApiResponse, Movie, MovieDetails } from './types';

// 电影分类类型
export type MovieCategory = 'popular' | 'top-rated' | 'now-playing' | 'upcoming';

// 电影分类映射到API端点
const MOVIE_ENDPOINTS: Record<MovieCategory, string> = {
  'popular': '/movie/popular',
  'top-rated': '/movie/top_rated',
  'now-playing': '/movie/now_playing',
  'upcoming': '/movie/upcoming'
};

/**
 * 统一的电影获取函数 - Server Action
 * @param category 电影分类
 * @param page 页码
 * @returns 电影数据
 */
export async function fetchMovies(
  category: MovieCategory = 'popular', 
  page: number = 1
): Promise<ApiResponse<Movie>> {
  try {
    const endpoint = MOVIE_ENDPOINTS[category];
    
    if (!endpoint) {
      throw new Error(`不支持的电影分类: ${category}`);
    }

    const response = await apiClient.get<ApiResponse<Movie>>(endpoint, { 
      page: page.toString() 
    });

    return response;
  } catch (error) {
    console.error(`获取${category}电影失败:`, error);
    throw new Error(`获取电影数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取电影详情 - Server Action
 * @param movieId 电影ID
 * @returns 电影详情
 */
export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  try {
    const response = await apiClient.get<MovieDetails>(`/movie/${movieId}`);
    return response;
  } catch (error) {
    console.error('获取电影详情失败:', error);
    throw new Error(`获取电影详情失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 搜索电影 - Server Action
 * @param query 搜索关键词
 * @param page 页码
 * @returns 搜索结果
 */
export async function searchMovies(
  query: string, 
  page: number = 1
): Promise<ApiResponse<Movie>> {
  try {
    if (!query.trim()) {
      throw new Error('搜索关键词不能为空');
    }

    const response = await apiClient.get<ApiResponse<Movie>>('/search/movie', { 
      query: query.trim(), 
      page: page.toString() 
    });

    return response;
  } catch (error) {
    console.error('搜索电影失败:', error);
    throw new Error(`搜索电影失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 根据类型获取电影 - Server Action
 * @param genreId 类型ID
 * @param page 页码
 * @returns 电影数据
 */
export async function fetchMoviesByGenre(
  genreId: number, 
  page: number = 1
): Promise<ApiResponse<Movie>> {
  try {
    const response = await apiClient.get<ApiResponse<Movie>>('/discover/movie', { 
      with_genres: genreId.toString(),
      page: page.toString() 
    });

    return response;
  } catch (error) {
    console.error('根据类型获取电影失败:', error);
    throw new Error(`获取电影数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取相似电影 - Server Action
 * @param movieId 电影ID
 * @param page 页码
 * @returns 相似电影数据
 */
export async function fetchSimilarMovies(
  movieId: number, 
  page: number = 1
): Promise<ApiResponse<Movie>> {
  try {
    const response = await apiClient.get<ApiResponse<Movie>>(`/movie/${movieId}/similar`, { 
      page: page.toString() 
    });

    return response;
  } catch (error) {
    console.error('获取相似电影失败:', error);
    throw new Error(`获取相似电影失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取推荐电影 - Server Action
 * @param movieId 电影ID
 * @param page 页码
 * @returns 推荐电影数据
 */
export async function fetchRecommendedMovies(
  movieId: number, 
  page: number = 1
): Promise<ApiResponse<Movie>> {
  try {
    const response = await apiClient.get<ApiResponse<Movie>>(`/movie/${movieId}/recommendations`, { 
      page: page.toString() 
    });

    return response;
  } catch (error) {
    console.error('获取推荐电影失败:', error);
    throw new Error(`获取推荐电影失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 注意: Server Actions 文件不能导出对象，只能导出异步函数
// 向后兼容的函数将在单独的文件中提供
