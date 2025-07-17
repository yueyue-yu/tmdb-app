/**
 * 电视剧相关的 Server Actions
 */

'use server';

import { apiClient } from './client';
import type { ApiResponse, TvShow } from './types';

// 电视剧分类类型
export type TvCategory = 'popular' | 'top-rated' | 'on-the-air' | 'airing-today';

// 电视剧分类映射到API端点
const TV_ENDPOINTS: Record<TvCategory, string> = {
  'popular': '/tv/popular',
  'top-rated': '/tv/top_rated',
  'on-the-air': '/tv/on_the_air',
  'airing-today': '/tv/airing_today'
};

/**
 * 统一的电视剧获取函数 - Server Action
 * @param category 电视剧分类
 * @param page 页码
 * @returns 电视剧数据
 */
export async function fetchTvShows(
  category: TvCategory = 'popular', 
  page: number = 1
): Promise<ApiResponse<TvShow>> {
  try {
    const endpoint = TV_ENDPOINTS[category];
    
    if (!endpoint) {
      throw new Error(`不支持的电视剧分类: ${category}`);
    }

    const response = await apiClient.get<ApiResponse<TvShow>>(endpoint, { 
      page: page.toString() 
    });

    return response;
  } catch (error) {
    console.error(`获取${category}电视剧失败:`, error);
    throw new Error(`获取电视剧数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取电视剧详情 - Server Action
 * @param id 电视剧ID
 * @returns 电视剧详情
 */
export async function fetchTvDetails(id: number): Promise<TvShow> {
  try {
    const response = await apiClient.get<TvShow>(`/tv/${id}`);
    return response;
  } catch (error) {
    console.error(`获取电视剧详情失败 (ID: ${id}):`, error);
    throw new Error(`获取电视剧详情失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 搜索电视剧 - Server Action
 * @param query 搜索关键词
 * @param page 页码
 * @returns 电视剧搜索结果
 */
export async function searchTvShows(
  query: string, 
  page: number = 1
): Promise<ApiResponse<TvShow>> {
  try {
    if (!query.trim()) {
      throw new Error('搜索关键词不能为空');
    }

    const response = await apiClient.get<ApiResponse<TvShow>>('/search/tv', {
      query: query.trim(),
      page: page.toString()
    });

    return response;
  } catch (error) {
    console.error(`搜索电视剧失败 (关键词: ${query}):`, error);
    throw new Error(`搜索电视剧失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 根据类型获取电视剧 - Server Action
 * @param genreId 类型ID
 * @param page 页码
 * @returns 电视剧数据
 */
export async function fetchTvShowsByGenre(
  genreId: number, 
  page: number = 1
): Promise<ApiResponse<TvShow>> {
  try {
    const response = await apiClient.get<ApiResponse<TvShow>>('/discover/tv', {
      with_genres: genreId.toString(),
      page: page.toString()
    });

    return response;
  } catch (error) {
    console.error(`根据类型获取电视剧失败 (类型ID: ${genreId}):`, error);
    throw new Error(`获取电视剧数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取相似电视剧 - Server Action
 * @param id 电视剧ID
 * @param page 页码
 * @returns 相似电视剧数据
 */
export async function fetchSimilarTvShows(
  id: number, 
  page: number = 1
): Promise<ApiResponse<TvShow>> {
  try {
    const response = await apiClient.get<ApiResponse<TvShow>>(`/tv/${id}/similar`, {
      page: page.toString()
    });

    return response;
  } catch (error) {
    console.error(`获取相似电视剧失败 (ID: ${id}):`, error);
    throw new Error(`获取相似电视剧失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取推荐电视剧 - Server Action
 * @param id 电视剧ID
 * @param page 页码
 * @returns 推荐电视剧数据
 */
export async function fetchRecommendedTvShows(
  id: number, 
  page: number = 1
): Promise<ApiResponse<TvShow>> {
  try {
    const response = await apiClient.get<ApiResponse<TvShow>>(`/tv/${id}/recommendations`, {
      page: page.toString()
    });

    return response;
  } catch (error) {
    console.error(`获取推荐电视剧失败 (ID: ${id}):`, error);
    throw new Error(`获取推荐电视剧失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}
