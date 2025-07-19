/**
 * 人员详情相关的 Server Actions
 * 提供人员详情、作品等信息的统一接口
 */

'use server';

import { getApiClient } from './client';
import type { 
  PersonDetails, 
  PersonMovieCredits, 
  PersonTvCredits 
} from './types';

/**
 * 获取人员详情信息
 * @param personId 人员ID
 * @returns 人员详情信息
 */
export async function fetchPersonDetails(personId: number): Promise<PersonDetails> {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<PersonDetails>(`/person/${personId}`);
    return response;
  } catch (error) {
    console.error(`获取人员详情失败 (ID: ${personId}):`, error);
    throw new Error(`获取人员详情失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取人员电影作品
 * @param personId 人员ID
 * @returns 人员电影作品信息
 */
export async function fetchPersonMovieCredits(personId: number): Promise<PersonMovieCredits> {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<PersonMovieCredits>(`/person/${personId}/movie_credits`);
    return response;
  } catch (error) {
    console.error(`获取人员电影作品失败 (ID: ${personId}):`, error);
    throw new Error(`获取人员电影作品失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取人员电视剧作品
 * @param personId 人员ID
 * @returns 人员电视剧作品信息
 */
export async function fetchPersonTvCredits(personId: number): Promise<PersonTvCredits> {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get<PersonTvCredits>(`/person/${personId}/tv_credits`);
    return response;
  } catch (error) {
    console.error(`获取人员电视剧作品失败 (ID: ${personId}):`, error);
    throw new Error(`获取人员电视剧作品失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取人员完整信息（详情+作品）
 * @param personId 人员ID
 * @returns 人员完整信息
 */
export async function fetchPersonFullDetails(personId: number) {
  try {
    // 并行获取人员详情、电影作品、电视剧作品
    const [person, movieCredits, tvCredits] = await Promise.all([
      fetchPersonDetails(personId),
      fetchPersonMovieCredits(personId),
      fetchPersonTvCredits(personId)
    ]);

    return {
      person,
      movieCredits,
      tvCredits
    };
  } catch (error) {
    console.error(`获取人员完整信息失败 (ID: ${personId}):`, error);
    throw new Error(`获取人员完整信息失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}
