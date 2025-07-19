/**
 * 统一的媒体详情 Server Actions
 * 提供电影和电视剧详情的统一接口
 */

'use server';

import { getApiClient } from './client';
import type { MovieDetails, TvDetails, MediaDetails } from './types';

/**
 * 将电影详情转换为统一的媒体详情格式
 * @param movieDetails 电影详情
 * @returns 统一的媒体详情
 */
function convertMovieDetailsToMedia(movieDetails: MovieDetails): MediaDetails {
  return {
    id: movieDetails.id,
    title: movieDetails.title,
    overview: movieDetails.overview,
    poster_path: movieDetails.poster_path,
    backdrop_path: movieDetails.backdrop_path,
    release_date: movieDetails.release_date,
    vote_average: movieDetails.vote_average,
    vote_count: movieDetails.vote_count,
    genres: movieDetails.genres,
    runtime: movieDetails.runtime,
    production_companies: movieDetails.production_companies,
    production_countries: movieDetails.production_countries,
    spoken_languages: movieDetails.spoken_languages,
    status: movieDetails.status,
    tagline: movieDetails.tagline,
    homepage: movieDetails.homepage,
    original_language: movieDetails.original_language,
    original_title: movieDetails.original_title,
    popularity: movieDetails.popularity,
    
    // 媒体类型
    media_type: 'movie',
    
    // 电影特有字段
    budget: movieDetails.budget,
    revenue: movieDetails.revenue,
    imdb_id: movieDetails.imdb_id,
    adult: movieDetails.adult,
    video: movieDetails.video,
  };
}

/**
 * 将电视剧详情转换为统一的媒体详情格式
 * @param tvDetails 电视剧详情
 * @returns 统一的媒体详情
 */
function convertTvDetailsToMedia(tvDetails: TvDetails): MediaDetails {
  // 计算平均每集时长
  const averageRuntime = tvDetails.episode_run_time.length > 0 
    ? Math.round(tvDetails.episode_run_time.reduce((a, b) => a + b, 0) / tvDetails.episode_run_time.length)
    : null;

  return {
    id: tvDetails.id,
    title: tvDetails.name,
    overview: tvDetails.overview,
    poster_path: tvDetails.poster_path,
    backdrop_path: tvDetails.backdrop_path,
    release_date: tvDetails.first_air_date,
    vote_average: tvDetails.vote_average,
    vote_count: tvDetails.vote_count,
    genres: tvDetails.genres,
    runtime: averageRuntime,
    production_companies: tvDetails.production_companies,
    production_countries: tvDetails.production_countries,
    spoken_languages: tvDetails.spoken_languages,
    status: tvDetails.status,
    tagline: tvDetails.tagline,
    homepage: tvDetails.homepage,
    original_language: tvDetails.original_language,
    original_title: tvDetails.original_name,
    popularity: tvDetails.popularity,
    
    // 媒体类型
    media_type: 'tv',
    
    // 电视剧特有字段
    number_of_episodes: tvDetails.number_of_episodes,
    number_of_seasons: tvDetails.number_of_seasons,
    seasons: tvDetails.seasons,
    networks: tvDetails.networks,
    in_production: tvDetails.in_production,
    last_air_date: tvDetails.last_air_date,
    type: tvDetails.type,
    episode_run_time: tvDetails.episode_run_time,
    origin_country: tvDetails.origin_country,
  };
}

/**
 * 获取电影详情
 * @param movieId 电影ID
 * @returns 电影详情
 */
async function fetchMovieDetailsRaw(movieId: number): Promise<MovieDetails> {
  const apiClient = await getApiClient();
  return apiClient.get<MovieDetails>(`/movie/${movieId}`);
}

/**
 * 获取电视剧详情
 * @param tvId 电视剧ID
 * @returns 电视剧详情
 */
async function fetchTvDetailsRaw(tvId: number): Promise<TvDetails> {
  const apiClient = await getApiClient();
  return apiClient.get<TvDetails>(`/tv/${tvId}`);
}

/**
 * 统一的媒体详情获取函数 - Server Action
 * @param mediaType 媒体类型 ('movie' | 'tv')
 * @param id 媒体ID
 * @returns 统一格式的媒体详情
 */
export async function fetchMediaDetails(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<MediaDetails> {
  try {
    if (mediaType === 'movie') {
      const movieDetails = await fetchMovieDetailsRaw(id);
      return convertMovieDetailsToMedia(movieDetails);
    } else {
      const tvDetails = await fetchTvDetailsRaw(id);
      return convertTvDetailsToMedia(tvDetails);
    }
  } catch (error) {
    console.error(`获取${mediaType}详情失败 (ID: ${id}):`, error);
    throw new Error(`获取${mediaType === 'movie' ? '电影' : '电视剧'}详情失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取电影详情（保持向后兼容）
 * @param movieId 电影ID
 * @returns 电影详情
 */
export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  try {
    return await fetchMovieDetailsRaw(movieId);
  } catch (error) {
    console.error('获取电影详情失败:', error);
    throw new Error(`获取电影详情失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取电视剧详情（保持向后兼容）
 * @param tvId 电视剧ID
 * @returns 电视剧详情
 */
export async function fetchTvDetails(tvId: number): Promise<TvDetails> {
  try {
    return await fetchTvDetailsRaw(tvId);
  } catch (error) {
    console.error(`获取电视剧详情失败 (ID: ${tvId}):`, error);
    throw new Error(`获取电视剧详情失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}
