/**
 * 演职人员相关的 Server Actions
 * 提供电影和电视剧演职人员的统一接口
 */

'use server';

import { getApiClient } from './client';
import type { Credits } from '@/app/type/credits';

/**
 * 获取电影演职人员信息
 * @param movieId 电影ID
 * @returns 电影演职人员信息
 */
async function fetchMovieCreditsRaw(movieId: number): Promise<Credits> {
  const apiClient = await getApiClient();
  return apiClient.get<Credits>(`/movie/${movieId}/credits`);
}

/**
 * 获取电视剧演职人员信息
 * @param tvId 电视剧ID
 * @returns 电视剧演职人员信息
 */
async function fetchTvCreditsRaw(tvId: number): Promise<Credits> {
  const apiClient = await getApiClient();
  return apiClient.get<Credits>(`/tv/${tvId}/credits`);
}

/**
 * 统一的媒体演职人员获取函数 - Server Action
 * @param mediaType 媒体类型 ('movie' | 'tv')
 * @param id 媒体ID
 * @returns 演职人员信息
 */
export async function fetchMediaCredits(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<Credits> {
  try {
    if (mediaType === 'movie') {
      return await fetchMovieCreditsRaw(id);
    } else {
      return await fetchTvCreditsRaw(id);
    }
  } catch (error) {
    console.error(`获取${mediaType}演职人员失败 (ID: ${id}):`, error);
    throw new Error(`获取${mediaType === 'movie' ? '电影' : '电视剧'}演职人员失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取电影演职人员（保持向后兼容）
 * @param movieId 电影ID
 * @returns 电影演职人员信息
 */
export async function fetchMovieCredits(movieId: number): Promise<Credits> {
  try {
    return await fetchMovieCreditsRaw(movieId);
  } catch (error) {
    console.error('获取电影演职人员失败:', error);
    throw new Error(`获取电影演职人员失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取电视剧演职人员（保持向后兼容）
 * @param tvId 电视剧ID
 * @returns 电视剧演职人员信息
 */
export async function fetchTvCredits(tvId: number): Promise<Credits> {
  try {
    return await fetchTvCreditsRaw(tvId);
  } catch (error) {
    console.error(`获取电视剧演职人员失败 (ID: ${tvId}):`, error);
    throw new Error(`获取电视剧演职人员失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}


