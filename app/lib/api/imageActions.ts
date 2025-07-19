/**
 * 图片相关 Server Actions
 * 处理电影、电视剧和人员的图片数据
 */

'use server';

import { getApiClient } from './client';
import type {
  ImageResponse,
  TmdbImage,
  ProcessedImage,
  GroupedImages
} from '@/app/type/image';
import { ImageType, IMAGE_SIZES } from '@/app/type/image';

/**
 * 获取媒体图片数据
 * @param mediaId 媒体ID
 * @param mediaType 媒体类型 ('movie' | 'tv')
 * @returns 图片数据
 */
export async function fetchMediaImages(
  mediaId: number, 
  mediaType: 'movie' | 'tv'
): Promise<GroupedImages> {
  try {
    const apiClient = await getApiClient();
    const endpoint = `/${mediaType}/${mediaId}/images`;
    
    const response = await apiClient.get<ImageResponse>(endpoint, {
      include_image_language: 'en,zh,null'
    });

    return processImageResponse(response);
  } catch (error) {
    console.error(`获取${mediaType}图片失败:`, error);
    throw new Error(`获取图片数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 获取人员图片数据
 * @param personId 人员ID
 * @returns 图片数据
 */
export async function fetchPersonImages(personId: number): Promise<ProcessedImage[]> {
  try {
    const apiClient = await getApiClient();
    const endpoint = `/person/${personId}/images`;
    
    const response = await apiClient.get<{ id: number; profiles: TmdbImage[] }>(endpoint);

    return response.profiles.map(image => processImage(image, ImageType.POSTER));
  } catch (error) {
    console.error('获取人员图片失败:', error);
    throw new Error(`获取人员图片失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 处理图片响应数据
 * @param response TMDB图片响应
 * @returns 分组后的图片数据
 */
function processImageResponse(response: ImageResponse): GroupedImages {
  return {
    backdrops: response.backdrops.map(image => processImage(image, ImageType.BACKDROP)),
    posters: response.posters.map(image => processImage(image, ImageType.POSTER)),
    stills: (response.stills || []).map(image => processImage(image, ImageType.STILL)),
    logos: response.logos.map(image => processImage(image, ImageType.LOGO))
  };
}

/**
 * 处理单个图片数据
 * @param image TMDB图片数据
 * @param type 图片类型
 * @returns 处理后的图片数据
 */
function processImage(image: TmdbImage, type: ImageType): ProcessedImage {
  const sizeConfig = IMAGE_SIZES[type];
  const baseUrl = 'https://image.tmdb.org/t/p';
  
  return {
    id: `${type.toString()}_${image.file_path}`,
    type,
    aspectRatio: image.aspect_ratio,
    width: image.width,
    height: image.height,
    language: image.iso_639_1,
    voteAverage: image.vote_average,
    voteCount: image.vote_count,
    urls: {
      thumbnail: `${baseUrl}/${sizeConfig.thumbnail}${image.file_path}`,
      medium: `${baseUrl}/${sizeConfig.medium}${image.file_path}`,
      large: `${baseUrl}/${sizeConfig.large}${image.file_path}`,
      original: `${baseUrl}/${sizeConfig.original}${image.file_path}`
    }
  };
}




