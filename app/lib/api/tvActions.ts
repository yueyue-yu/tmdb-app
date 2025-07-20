/**
 * 电视剧相关的 Server Actions
 */

'use server';

import { getApiClient } from './client';
import type { ApiResponse, TvShow, TvDetails, Movie } from './types';
import {TvCategoryKeys} from "@/app/type/movie";

// 电视剧分类类型


// 电视剧分类映射到API端点
const TV_ENDPOINTS: Record<TvCategoryKeys, string> = {
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
  category: TvCategoryKeys = 'popular',
  page: number = 1
): Promise<ApiResponse<TvShow>> {
  try {
    const endpoint = TV_ENDPOINTS[category];

    if (!endpoint) {
      throw new Error(`不支持的电视剧分类: ${category}`);
    }

    const apiClient = await getApiClient();
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
export async function fetchTvDetails(id: number): Promise<TvDetails> {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<TvDetails>(`/tv/${id}`);
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

    const apiClient = await getApiClient();
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
    const apiClient = await getApiClient();
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
    const apiClient = await getApiClient();
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
    const apiClient = await getApiClient();
    const response = await apiClient.get<ApiResponse<TvShow>>(`/tv/${id}/recommendations`, {
      page: page.toString()
    });

    return response;
  } catch (error) {
    console.error(`获取推荐电视剧失败 (ID: ${id}):`, error);
    throw new Error(`获取推荐电视剧失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 将电视剧数据转换为电影类型
 * @param tvShow 电视剧数据
 * @returns 转换后的电影数据
 */
function convertTvShowToMovie(tvShow: TvShow): Movie & { media_type: 'tv' } {
  return {
    id: tvShow.id,
    title: tvShow.name,
    overview: tvShow.overview,
    poster_path: tvShow.poster_path,
    backdrop_path: tvShow.backdrop_path,
    release_date: tvShow.first_air_date,
    first_air_date: tvShow.first_air_date, // 保留原始字段
    vote_average: tvShow.vote_average,
    vote_count: tvShow.vote_count,
    genre_ids: tvShow.genre_ids,
    adult: false, // 电视剧默认不是成人内容
    original_language: tvShow.original_language,
    original_title: tvShow.original_name,
    popularity: tvShow.popularity,
    video: false, // 电视剧不是视频格式
    media_type: 'tv' as const // 明确标记为电视剧类型
  };
}

/**
 * 获取电视剧数据并转换为电影格式 - Server Action
 * @param category 电视剧分类
 * @param page 页码
 * @returns 转换为电影格式的电视剧数据
 */
export async function fetchTvShowsAsMovies(
  category: TvCategoryKeys = 'popular',
  page: number = 1
): Promise<ApiResponse<Movie>> {
  try {
    // 先获取电视剧数据
    const tvResponse = await fetchTvShows(category, page);
    
    // 转换为电影格式
    const convertedMovies = tvResponse.results.map(convertTvShowToMovie);
    
    return {
      results: convertedMovies,
      page: tvResponse.page,
      total_pages: tvResponse.total_pages,
      total_results: tvResponse.total_results
    };
  } catch (error) {
    console.error(`获取并转换${category}电视剧失败:`, error);
    throw new Error(`获取电视剧数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 搜索电视剧并转换为电影格式 - Server Action
 * @param query 搜索关键词
 * @param page 页码
 * @returns 转换为电影格式的电视剧搜索结果
 */
export async function searchTvShowsAsMovies(
  query: string,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  try {
    // 先搜索电视剧
    const tvResponse = await searchTvShows(query, page);

    // 转换为电影格式
    const convertedMovies = tvResponse.results.map(convertTvShowToMovie);

    // 调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log('searchTvShowsAsMovies debug:', {
        query,
        originalCount: tvResponse.results.length,
        convertedCount: convertedMovies.length,
        firstConverted: convertedMovies[0]
      });
    }

    return {
      results: convertedMovies,
      page: tvResponse.page,
      total_pages: tvResponse.total_pages,
      total_results: tvResponse.total_results
    };
  } catch (error) {
    console.error(`搜索并转换电视剧失败 (关键词: ${query}):`, error);
    throw new Error(`搜索电视剧失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}
