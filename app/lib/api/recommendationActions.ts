/**
 * 推荐和相似内容API操作
 */

'use server';

import { getApiClient } from './client';
import type { ApiResponse, Movie } from './types';
import { MediaTypeEnum } from '@/app/type/movie';
import type { RecommendationApiParams } from '@/app/type/recommendations';

/**
 * 获取电影推荐
 * @param movieId 电影ID
 * @param page 页码，默认为1
 * @returns Promise<Movie[]> 推荐电影列表
 */
export async function fetchMovieRecommendations(
  movieId: number,
  page: number = 1
): Promise<Movie[]> {
  try {
    const client = await getApiClient();
    const response = await client.get<ApiResponse<Movie>>(
      `/movie/${movieId}/recommendations`,
      { page: page.toString() }
    );
    
    return response.results || [];
  } catch (error) {
    console.error('获取电影推荐失败:', error);
    throw new Error('Failed to fetch movie recommendations');
  }
}

/**
 * 获取相似电影
 * @param movieId 电影ID
 * @param page 页码，默认为1
 * @returns Promise<Movie[]> 相似电影列表
 */
export async function fetchMovieSimilar(
  movieId: number,
  page: number = 1
): Promise<Movie[]> {
  try {
    const client = await getApiClient();
    const response = await client.get<ApiResponse<Movie>>(
      `/movie/${movieId}/similar`,
      { page: page.toString() }
    );
    
    return response.results || [];
  } catch (error) {
    console.error('获取相似电影失败:', error);
    throw new Error('Failed to fetch similar movies');
  }
}

/**
 * 获取电视剧推荐
 * @param tvId 电视剧ID
 * @param page 页码，默认为1
 * @returns Promise<Movie[]> 推荐电视剧列表
 */
export async function fetchTvRecommendations(
  tvId: number,
  page: number = 1
): Promise<Movie[]> {
  try {
    const client = await getApiClient();
    const response = await client.get<ApiResponse<Movie>>(
      `/tv/${tvId}/recommendations`,
      { page: page.toString() }
    );
    
    return response.results || [];
  } catch (error) {
    console.error('获取电视剧推荐失败:', error);
    throw new Error('Failed to fetch TV recommendations');
  }
}

/**
 * 获取相似电视剧
 * @param tvId 电视剧ID
 * @param page 页码，默认为1
 * @returns Promise<Movie[]> 相似电视剧列表
 */
export async function fetchTvSimilar(
  tvId: number,
  page: number = 1
): Promise<Movie[]> {
  try {
    const client = await getApiClient();
    const response = await client.get<ApiResponse<Movie>>(
      `/tv/${tvId}/similar`,
      { page: page.toString() }
    );
    
    return response.results || [];
  } catch (error) {
    console.error('获取相似电视剧失败:', error);
    throw new Error('Failed to fetch similar TV shows');
  }
}

/**
 * 通用推荐获取函数
 * @param params 推荐API参数
 * @returns Promise<Movie[]> 推荐内容列表
 */
export async function fetchRecommendations(
  params: RecommendationApiParams & { type: 'recommendations' | 'similar' }
): Promise<Movie[]> {
  const { mediaId, mediaType, type, page = 1 } = params;
  
  try {
    if (mediaType === MediaTypeEnum.Movie) {
      if (type === 'recommendations') {
        return await fetchMovieRecommendations(mediaId, page);
      } else {
        return await fetchMovieSimilar(mediaId, page);
      }
    } else {
      if (type === 'recommendations') {
        return await fetchTvRecommendations(mediaId, page);
      } else {
        return await fetchTvSimilar(mediaId, page);
      }
    }
  } catch (error) {
    console.error('获取推荐内容失败:', error);
    throw error;
  }
}

/**
 * 批量获取推荐和相似内容
 * @param mediaId 媒体ID
 * @param mediaType 媒体类型
 * @returns Promise<{recommendations: Movie[], similar: Movie[]}> 推荐和相似内容
 */
export async function fetchAllRecommendations(
  mediaId: number,
  mediaType: MediaTypeEnum
): Promise<{ recommendations: Movie[]; similar: Movie[] }> {
  try {
    const [recommendations, similar] = await Promise.allSettled([
      fetchRecommendations({ mediaId, mediaType, type: 'recommendations' }),
      fetchRecommendations({ mediaId, mediaType, type: 'similar' })
    ]);

    return {
      recommendations: recommendations.status === 'fulfilled' ? recommendations.value : [],
      similar: similar.status === 'fulfilled' ? similar.value : []
    };
  } catch (error) {
    console.error('批量获取推荐内容失败:', error);
    throw new Error('Failed to fetch all recommendations');
  }
}

/**
 * 获取推荐内容统计信息
 * @param mediaId 媒体ID
 * @param mediaType 媒体类型
 * @returns Promise<{recommendationCount: number, similarCount: number}> 统计信息
 */
export async function fetchRecommendationStats(
  mediaId: number,
  mediaType: MediaTypeEnum
): Promise<{ recommendationCount: number; similarCount: number }> {
  try {
    const { recommendations, similar } = await fetchAllRecommendations(mediaId, mediaType);
    
    return {
      recommendationCount: recommendations.length,
      similarCount: similar.length
    };
  } catch (error) {
    console.error('获取推荐统计失败:', error);
    return {
      recommendationCount: 0,
      similarCount: 0
    };
  }
}
