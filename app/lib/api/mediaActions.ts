/**
 * 统一处理电影和电视剧相关的 Server Actions
 */

'use server';

import { fetchMovies, searchMovies, fetchMoviesByGenre, fetchSimilarMovies, fetchRecommendedMovies } from './movieActions';
import { fetchTvShowsAsMovies, searchTvShowsAsMovies, fetchTvShowsByGenre, fetchSimilarTvShows, fetchRecommendedTvShows } from './tvActions';
import type {ApiResponse, Movie, TvShow} from './types';
import { MovieCategoryKeys, TvCategoryKeys, MediaTypeEnum } from "@/app/type/movie";

export type MediaCategory = MovieCategoryKeys | TvCategoryKeys;

/**
 * 统一的媒体获取函数 - Server Action
 * @param mediaType 媒体类型 ('movie' 或 'tv')
 * @param category 媒体分类
 * @param page 页码
 * @returns 媒体数据
 */
export async function fetchMedia(
  mediaType: MediaTypeEnum,
  category: MediaCategory,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  if (mediaType === MediaTypeEnum.Movie) {
    return fetchMovies(category as MovieCategoryKeys, page);
  } else if (mediaType === MediaTypeEnum.TV) {
    return fetchTvShowsAsMovies(category as TvCategoryKeys, page);
  } else {
    throw new Error(`不支持的媒体类型: ${mediaType}`);
  }
}

/**
 * 统一的媒体搜索函数 - Server Action
 * @param mediaType 媒体类型 ('movie' 或 'tv')
 * @param query 搜索关键词
 * @param page 页码
 * @returns 媒体搜索结果
 */
export async function searchMedia(
  mediaType: MediaTypeEnum,
  query: string,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  if (mediaType === MediaTypeEnum.Movie) {
    return searchMovies(query, page);
  } else if (mediaType === MediaTypeEnum.TV) {
    return searchTvShowsAsMovies(query, page);
  } else {
    throw new Error(`不支持的媒体类型: ${mediaType}`);
  }
}



/**
 * 统一的根据类型获取媒体函数 - Server Action
 * @param mediaType 媒体类型 ('movie' 或 'tv')
 * @param genreId 类型ID
 * @param page 页码
 * @returns 媒体数据
 */
export async function fetchMediaByGenre(
  mediaType: MediaTypeEnum,
  genreId: number,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  if (mediaType === MediaTypeEnum.Movie) {
    return fetchMoviesByGenre(genreId, page);
  } else if (mediaType === MediaTypeEnum.TV) {
    const tvResponse = await fetchTvShowsByGenre(genreId, page);
    return {
      ...tvResponse,
      results: tvResponse.results.map(convertTvShowToMovie),
    };
  } else {
    throw new Error(`不支持的媒体类型: ${mediaType}`);
  }
}

/**
 * 统一的获取相似媒体函数 - Server Action
 * @param mediaType 媒体类型 ('movie' 或 'tv')
 * @param id 媒体ID
 * @param page 页码
 * @returns 相似媒体数据
 */
export async function fetchSimilarMedia(
  mediaType: MediaTypeEnum,
  id: number,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  if (mediaType === MediaTypeEnum.Movie) {
    return fetchSimilarMovies(id, page);
  } else if (mediaType === MediaTypeEnum.TV) {
    const tvResponse = await fetchSimilarTvShows(id, page);
    return {
      ...tvResponse,
      results: tvResponse.results.map(convertTvShowToMovie),
    };
  } else {
    throw new Error(`不支持的媒体类型: ${mediaType}`);
  }
}

/**
 * 统一的获取推荐媒体函数 - Server Action
 * @param mediaType 媒体类型 ('movie' 或 'tv')
 * @param id 媒体ID
 * @param page 页码
 * @returns 推荐媒体数据
 */
export async function fetchRecommendedMedia(
  mediaType: MediaTypeEnum,
  id: number,
  page: number = 1
): Promise<ApiResponse<Movie>> {
  if (mediaType === MediaTypeEnum.Movie) {
    return fetchRecommendedMovies(id, page);
  } else if (mediaType === MediaTypeEnum.TV) {
    const tvResponse = await fetchRecommendedTvShows(id, page);
    return {
      ...tvResponse,
      results: tvResponse.results.map(convertTvShowToMovie),
    };
  } else {
    throw new Error(`不支持的媒体类型: ${mediaType}`);
  }
}

function convertTvShowToMovie(tvShow: TvShow): Movie {
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
    video: false // 电视剧不是视频格式
  };
}
