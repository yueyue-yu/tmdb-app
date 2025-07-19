/**
 * 推荐和相似内容相关类型定义
 */

import type { Movie } from '@/app/lib/api/types';
import type { MediaTypeEnum } from '@/app/type/movie';

/**
 * 推荐类型枚举
 */
export enum RecommendationType {
  RECOMMENDATIONS = 'recommendations',
  SIMILAR = 'similar'
}

/**
 * 推荐标签页数据
 */
export interface RecommendationTab {
  key: RecommendationType;
  label: string;
  count: number;
}

/**
 * 推荐区域组件属性
 */
export interface RecommendationSectionProps {
  mediaId: number;
  mediaType: MediaTypeEnum;
  mediaTitle: string;
  translations: {
    recommendations: string;
    similar: string;
    recommendedFor: string;
    similarTo: string;
    noRecommendations: string;
    noSimilar: string;
    loadingError: string;
    retryLater: string;
    showMore: string;
    showLess: string;
  };
}

/**
 * 推荐区域客户端组件属性
 */
export interface RecommendationSectionClientProps {
  mediaId: number;
  mediaType: MediaTypeEnum;
  mediaTitle: string;
  translations: RecommendationSectionProps['translations'];
}

/**
 * 推荐列表组件属性
 */
export interface RecommendationListProps {
  items: Movie[];
  mediaType: MediaTypeEnum;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  showCount?: number;
  className?: string;
}

/**
 * 推荐卡片组件属性
 */
export interface RecommendationCardProps {
  item: Movie;
  mediaType: MediaTypeEnum;
  index: number;
  priority?: boolean;
  className?: string;
}

/**
 * 推荐数据响应
 */
export interface RecommendationResponse {
  recommendations: Movie[];
  similar: Movie[];
}

/**
 * 推荐API参数
 */
export interface RecommendationApiParams {
  mediaId: number;
  mediaType: MediaTypeEnum;
  page?: number;
  language?: string;
}

/**
 * 推荐状态
 */
export interface RecommendationState {
  recommendations: Movie[];
  similar: Movie[];
  isLoading: boolean;
  error: string | null;
  activeTab: RecommendationType;
}

/**
 * 推荐操作类型
 */
export type RecommendationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RECOMMENDATIONS'; payload: Movie[] }
  | { type: 'SET_SIMILAR'; payload: Movie[] }
  | { type: 'SET_ACTIVE_TAB'; payload: RecommendationType }
  | { type: 'RESET' };

/**
 * 推荐配置
 */
export interface RecommendationConfig {
  defaultShowCount: number;
  maxShowCount: number;
  enableInfiniteScroll: boolean;
  enableAutoRefresh: boolean;
  refreshInterval: number;
}

/**
 * 推荐统计信息
 */
export interface RecommendationStats {
  totalRecommendations: number;
  totalSimilar: number;
  averageRating: number;
  topGenres: string[];
}

/**
 * 推荐过滤选项
 */
export interface RecommendationFilters {
  minRating?: number;
  maxRating?: number;
  genres?: number[];
  releaseYear?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'popularity' | 'rating' | 'release_date';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 推荐元数据
 */
export interface RecommendationMetadata {
  algorithm: string;
  confidence: number;
  reasons: string[];
  lastUpdated: string;
}
