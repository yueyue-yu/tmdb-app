/**
 * 统一搜索相关的 Server Actions
 */

'use server';

import { searchMovies } from './movieActions';
import { searchTvShowsAsMovies } from './tvActions';
import { peopleApi } from './people';
import { getApiClient } from './client';
import type { ApiResponse, Movie, Person } from './types';
import { SearchTypeEnum, SortOption } from '@/app/type/search';
import type { SearchParams, MultiSearchResponse, FilterParams } from '@/app/type/search';

/**
 * 将筛选参数转换为API参数
 * @param filters 筛选参数
 * @param mediaType 媒体类型
 * @returns API查询参数
 */
function convertFiltersToApiParams(filters: FilterParams, mediaType: 'movie' | 'tv'): Record<string, string> {
  const params: Record<string, string> = {};

  // 年份筛选
  if (filters.yearFrom || filters.yearTo) {
    if (mediaType === 'movie') {
      if (filters.yearFrom) params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`;
      if (filters.yearTo) params['primary_release_date.lte'] = `${filters.yearTo}-12-31`;
    } else {
      if (filters.yearFrom) params['first_air_date.gte'] = `${filters.yearFrom}-01-01`;
      if (filters.yearTo) params['first_air_date.lte'] = `${filters.yearTo}-12-31`;
    }
  }

  // 评分筛选
  if (filters.ratingFrom !== undefined) {
    params['vote_average.gte'] = filters.ratingFrom.toString();
  }
  if (filters.ratingTo !== undefined) {
    params['vote_average.lte'] = filters.ratingTo.toString();
  }

  // 类型筛选
  if (filters.genres && filters.genres.length > 0) {
    params['with_genres'] = filters.genres.join(',');
  }

  // 排序
  if (filters.sortBy && filters.sortBy !== SortOption.RELEVANCE) {
    params['sort_by'] = filters.sortBy;
  }

  return params;
}

/**
 * 使用discover API搜索电影（支持筛选）
 * @param query 搜索关键词
 * @param filters 筛选参数
 * @param page 页码
 * @returns 电影搜索结果
 */
async function discoverMovies(
  query: string,
  filters: FilterParams,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  try {
    const apiClient = await getApiClient();

    // 如果有筛选条件，使用discover API，否则使用search API
    if (hasFilters(filters)) {
      const apiParams = convertFiltersToApiParams(filters, 'movie');

      // 如果有搜索关键词，添加到参数中（注意：discover API不直接支持关键词搜索）
      // 这里我们使用discover API的筛选功能
      const response = await apiClient.get<ApiResponse<Movie>>('/discover/movie', {
        ...apiParams,
        page: page.toString()
      });

      return response;
    } else {
      // 没有筛选条件时，使用普通搜索
      return searchMovies(query, page);
    }
  } catch (error) {
    console.error('Discover电影失败:', error);
    throw new Error(`Discover电影失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 使用discover API搜索电视剧（支持筛选）
 * @param query 搜索关键词
 * @param filters 筛选参数
 * @param page 页码
 * @returns 电视剧搜索结果
 */
async function discoverTvShows(
  query: string,
  filters: FilterParams,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  try {
    const apiClient = await getApiClient();

    // 如果有筛选条件，使用discover API，否则使用search API
    if (hasFilters(filters)) {
      const apiParams = convertFiltersToApiParams(filters, 'tv');

      const response = await apiClient.get<ApiResponse<Movie>>('/discover/tv', {
        ...apiParams,
        page: page.toString()
      });

      return response;
    } else {
      // 没有筛选条件时，使用普通搜索
      return searchTvShowsAsMovies(query, page);
    }
  } catch (error) {
    console.error('Discover电视剧失败:', error);
    throw new Error(`Discover电视剧失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 检查是否有有效的筛选条件
 * @param filters 筛选参数
 * @returns 是否有筛选条件
 */
function hasFilters(filters: FilterParams): boolean {
  return !!(
    filters.yearFrom ||
    filters.yearTo ||
    filters.ratingFrom !== undefined ||
    filters.ratingTo !== undefined ||
    (filters.genres && filters.genres.length > 0) ||
    (filters.sortBy && filters.sortBy !== SortOption.RELEVANCE)
  );
}

/**
 * 统一搜索函数 - Server Action
 * @param params 搜索参数
 * @returns 搜索结果
 */
export async function unifiedSearch(
  params: SearchParams
): Promise<ApiResponse<Movie> | ApiResponse<Person> | MultiSearchResponse> {
  const { query, type, page = 1, filters = {} } = params;

  try {
    if (!query.trim() && !hasFilters(filters)) {
      throw new Error('搜索关键词或筛选条件不能为空');
    }

    const trimmedQuery = query.trim();

    switch (type) {
      case SearchTypeEnum.MOVIE:
        return await discoverMovies(trimmedQuery, filters, page);

      case SearchTypeEnum.TV:
        return await discoverTvShows(trimmedQuery, filters, page);

      case SearchTypeEnum.PERSON:
        // 演员搜索不支持筛选，只使用关键词搜索
        if (!trimmedQuery) {
          throw new Error('演员搜索需要关键词');
        }
        return await peopleApi.search(trimmedQuery, page);

      case SearchTypeEnum.ALL:
        // 综合搜索：并行获取所有类型的结果
        if (!trimmedQuery) {
          throw new Error('综合搜索需要关键词');
        }
        const [moviesResponse, tvResponse, peopleResponse] = await Promise.allSettled([
          discoverMovies(trimmedQuery, filters, page),
          discoverTvShows(trimmedQuery, filters, page),
          peopleApi.search(trimmedQuery, page)
        ]);

        // 处理结果，即使某些请求失败也要返回成功的结果
        const movies: ApiResponse<Movie> = moviesResponse.status === 'fulfilled' 
          ? moviesResponse.value 
          : { results: [], page: 1, total_pages: 0, total_results: 0 };

        const tvShows: ApiResponse<Movie> = tvResponse.status === 'fulfilled' 
          ? tvResponse.value 
          : { results: [], page: 1, total_pages: 0, total_results: 0 };

        const people: ApiResponse<Person> = peopleResponse.status === 'fulfilled' 
          ? peopleResponse.value 
          : { results: [], page: 1, total_pages: 0, total_results: 0 };

        const totalResults = movies.total_results + tvShows.total_results + people.total_results;

        return {
          movies,
          tvShows,
          people,
          totalResults
        } as MultiSearchResponse;

      default:
        throw new Error(`不支持的搜索类型: ${type}`);
    }
  } catch (error) {
    console.error(`搜索失败 (类型: ${type}, 关键词: ${query}):`, error);
    throw new Error(`搜索失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 搜索电影 - Server Action
 * @param query 搜索关键词
 * @param page 页码
 * @returns 电影搜索结果
 */
export async function searchMoviesAction(
  query: string,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  return unifiedSearch({
    query,
    type: SearchTypeEnum.MOVIE,
    page
  }) as Promise<ApiResponse<Movie>>;
}

/**
 * 搜索电视剧 - Server Action
 * @param query 搜索关键词
 * @param page 页码
 * @returns 电视剧搜索结果
 */
export async function searchTvAction(
  query: string,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  return unifiedSearch({
    query,
    type: SearchTypeEnum.TV,
    page
  }) as Promise<ApiResponse<Movie>>;
}

/**
 * 搜索演员 - Server Action
 * @param query 搜索关键词
 * @param page 页码
 * @returns 演员搜索结果
 */
export async function searchPeopleAction(
  query: string,
  page: number = 1
): Promise<ApiResponse<Person>> {
  return unifiedSearch({
    query,
    type: SearchTypeEnum.PERSON,
    page
  }) as Promise<ApiResponse<Person>>;
}

/**
 * 综合搜索 - Server Action
 * @param query 搜索关键词
 * @param page 页码
 * @returns 综合搜索结果
 */
export async function multiSearch(
  query: string,
  page: number = 1
): Promise<MultiSearchResponse> {
  return unifiedSearch({
    query,
    type: SearchTypeEnum.ALL,
    page
  }) as Promise<MultiSearchResponse>;
}
