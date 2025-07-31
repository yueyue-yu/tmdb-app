/**
 * 电影详情页面相关类型定义
 */

import type { MovieDetails, MediaDetails } from '@/app/lib/api/types';

/**
 * 电影详情页面属性
 */
export interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 电影Cast页面属性
 */
export interface MovieCastPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 电影画廊页面属性
 */
export interface MovieGalleryPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 电影详情Hero组件属性
 */
export interface MovieDetailHeroProps {
  movie: MovieDetails;
}

/**
 * 电影详情卡片组件属性
 */
export interface MovieDetailCardProps {
  movie: MovieDetails;
}

/**
 * 电影详情信息组件属性
 */
export interface MovieDetailInfoProps {
  movie: MovieDetails;
}

/**
 * 电影详情操作组件属性
 */
export interface MovieDetailActionsProps {
  movieId: number;
  title: string;
}

/**
 * 类型标签组件属性
 */
export interface GenreBadgesProps {
  genres: Array<{
    id: number;
    name: string;
  }>;
}

/**
 * 制作公司组件属性
 */
export interface ProductionCompaniesProps {
  companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
}

/**
 * 统计信息组件属性
 */
export interface MovieStatsProps {
  runtime: number | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  budget?: number;
  revenue?: number;
}
