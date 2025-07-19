/**
 * 视频相关API操作
 * 获取电影和电视剧的视频数据（预告片、花絮等）
 */

'use server';

import {
  Video,
  VideoResponse
} from '@/app/type/video';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * 获取电影视频
 * @param movieId 电影ID
 * @param language 语言代码，默认为中文
 * @returns 视频数据
 */
export async function fetchMovieVideos(
  movieId: number, 
  language: string = 'zh-CN'
): Promise<Video[]> {
  try {
    const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=${language}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 } // 1小时缓存
    });

    if (!response.ok) {
      throw new Error(`获取电影视频失败: ${response.status}`);
    }

    const data: VideoResponse = await response.json();
    
    // 如果中文没有视频，尝试获取英文视频
    if (data.results.length === 0 && language !== 'en-US') {
      return fetchMovieVideos(movieId, 'en-US');
    }

    return data.results;
  } catch (error) {
    console.error('获取电影视频失败:', error);
    throw error;
  }
}

/**
 * 获取电视剧视频
 * @param tvId 电视剧ID
 * @param language 语言代码，默认为中文
 * @returns 视频数据
 */
export async function fetchTvVideos(
  tvId: number, 
  language: string = 'zh-CN'
): Promise<Video[]> {
  try {
    const url = `${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}&language=${language}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 } // 1小时缓存
    });

    if (!response.ok) {
      throw new Error(`获取电视剧视频失败: ${response.status}`);
    }

    const data: VideoResponse = await response.json();
    
    // 如果中文没有视频，尝试获取英文视频
    if (data.results.length === 0 && language !== 'en-US') {
      return fetchTvVideos(tvId, 'en-US');
    }

    return data.results;
  } catch (error) {
    console.error('获取电视剧视频失败:', error);
    throw error;
  }
}

/**
 * 获取电视剧季度视频
 * @param tvId 电视剧ID
 * @param seasonNumber 季度号
 * @param language 语言代码
 * @returns 视频数据
 */
export async function fetchTvSeasonVideos(
  tvId: number, 
  seasonNumber: number,
  language: string = 'zh-CN'
): Promise<Video[]> {
  try {
    const url = `${BASE_URL}/tv/${tvId}/season/${seasonNumber}/videos?api_key=${API_KEY}&language=${language}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`获取季度视频失败: ${response.status}`);
    }

    const data: VideoResponse = await response.json();
    
    if (data.results.length === 0 && language !== 'en-US') {
      return fetchTvSeasonVideos(tvId, seasonNumber, 'en-US');
    }

    return data.results;
  } catch (error) {
    console.error('获取季度视频失败:', error);
    throw error;
  }
}









/**
 * 获取媒体的所有视频（电影或电视剧）
 * @param mediaId 媒体ID
 * @param mediaType 媒体类型
 * @param language 语言代码
 * @returns 视频数据
 */
export async function fetchMediaVideos(
  mediaId: number,
  mediaType: 'movie' | 'tv',
  language: string = 'zh-CN'
): Promise<Video[]> {
  if (mediaType === 'movie') {
    return fetchMovieVideos(mediaId, language);
  } else {
    return fetchTvVideos(mediaId, language);
  }
}
