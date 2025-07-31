/**
 * 电影卡片组件相关类型定义
 */

import type { Movie } from '@/app/lib/api/types';
import type { MediaTypeEnum } from '@/app/type/movie';

/**
 * 受欢迎程度等级
 */
export type PopularityLevel = 'hot' | 'trending' | 'normal';

/**
 * 评分徽章样式类型
 */
export type RatingBadgeClass = 'badge-success' | 'badge-warning' | 'badge-orange' | 'badge-error';

/**
 * 电影卡片基础属性
 */
export interface MovieCardProps {
  movie: Movie;
  index: number;
  mediaType?: MediaTypeEnum; // 媒体类型，用于生成正确的详情链接
}

/**
 * 电影海报组件属性
 */
export interface MoviePosterProps {
  movie: Movie;
  posterUrl: string;
  popularityLevel: PopularityLevel;
  ratingBadgeClass: RatingBadgeClass;
  priority?: boolean;
  mediaType?: MediaTypeEnum;
}

/**
 * 电影信息组件属性
 */
export interface MovieInfoProps {
  movie: Movie;
  year: number | null;
  mediaType?: MediaTypeEnum;
}

/**
 * 电影操作组件属性
 */
export interface MovieActionsProps {
  movieId: number;
  mediaType?: MediaTypeEnum;
}



/**
 * 受欢迎程度徽章组件属性
 */
export interface PopularityBadgeProps {
  level: PopularityLevel;
}

/**
 * 评分徽章组件属性
 */
export interface RatingBadgeProps {
  rating: number;
  badgeClass: RatingBadgeClass;
}

/**
 * 播放按钮组件属性
 */
export interface PlayButtonProps {
  movieId: number;
  mediaType?: MediaTypeEnum;
}

/**
 * 更多操作菜单组件属性
 */
export interface MoreActionsProps {
  movieId: number;
}
