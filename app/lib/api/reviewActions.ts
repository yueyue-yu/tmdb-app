/**
 * 评论相关的 Server Actions
 * 提供电影和电视剧评论的统一接口
 */

'use server';

import { getApiClient } from './client';
import { MediaTypeEnum } from '@/app/type/movie';
import type { ReviewsResponse, Review, ReviewApiParams } from '@/app/type/reviews';

/**
 * 获取电影评论
 * @param movieId 电影ID
 * @param params API参数
 * @returns Promise<ReviewsResponse> 评论响应数据
 */
export async function fetchMovieReviews(
  movieId: number,
  params: ReviewApiParams = {}
): Promise<ReviewsResponse> {
  try {
    const client = await getApiClient();
    const response = await client.get<ReviewsResponse>(
      `/movie/${movieId}/reviews`,
      {
        page: (params.page || 1).toString(),
        language: params.language || 'en-US'
      }
    );
    
    return response;
  } catch (error) {
    console.error('获取电影评论失败:', error);
    throw new Error('Failed to fetch movie reviews');
  }
}

/**
 * 获取电视剧评论
 * @param tvId 电视剧ID
 * @param params API参数
 * @returns Promise<ReviewsResponse> 评论响应数据
 */
export async function fetchTvReviews(
  tvId: number,
  params: ReviewApiParams = {}
): Promise<ReviewsResponse> {
  try {
    const client = await getApiClient();
    const response = await client.get<ReviewsResponse>(
      `/tv/${tvId}/reviews`,
      {
        page: (params.page || 1).toString(),
        language: params.language || 'en-US'
      }
    );
    
    return response;
  } catch (error) {
    console.error('获取电视剧评论失败:', error);
    throw new Error('Failed to fetch TV reviews');
  }
}

/**
 * 获取媒体评论（统一接口）
 * @param mediaId 媒体ID
 * @param mediaType 媒体类型
 * @param params API参数
 * @returns Promise<ReviewsResponse> 评论响应数据
 */
export async function fetchMediaReviews(
  mediaId: number,
  mediaType: MediaTypeEnum,
  params: ReviewApiParams = {}
): Promise<ReviewsResponse> {
  switch (mediaType) {
    case MediaTypeEnum.Movie:
      return fetchMovieReviews(mediaId, params);
    case MediaTypeEnum.TV:
      return fetchTvReviews(mediaId, params);
    default:
      throw new Error(`Unsupported media type: ${mediaType}`);
  }
}

/**
 * 获取简化的评论列表（用于详情页面）
 * @param mediaId 媒体ID
 * @param mediaType 媒体类型
 * @param limit 限制数量，默认为5
 * @returns Promise<Review[]> 评论列表
 */
export async function fetchSimpleReviews(
  mediaId: number,
  mediaType: MediaTypeEnum,
  limit: number = 5
): Promise<Review[]> {
  try {
    const response = await fetchMediaReviews(mediaId, mediaType, { page: 1 });
    return response.results.slice(0, limit);
  } catch (error) {
    console.error('获取简化评论失败:', error);
    return [];
  }
}

/**
 * 获取所有评论（用于评论页面）
 * @param mediaId 媒体ID
 * @param mediaType 媒体类型
 * @param page 页码，默认为1
 * @returns Promise<ReviewsResponse> 完整的评论响应数据
 */
export async function fetchAllReviews(
  mediaId: number,
  mediaType: MediaTypeEnum,
  page: number = 1
): Promise<ReviewsResponse> {
  try {
    return await fetchMediaReviews(mediaId, mediaType, { page });
  } catch (error) {
    console.error('获取所有评论失败:', error);
    throw error;
  }
}


