/**
 * 推荐组件导出
 */

export { default as RecommendationCard } from './RecommendationCard';
export { default as RecommendationList } from './RecommendationList';
export { default as RecommendationSection } from './RecommendationSection';
export { default as RecommendationSectionClient } from './RecommendationSectionClient';

// 导出类型
export type {
  RecommendationCardProps,
  RecommendationListProps,
  RecommendationSectionProps,
  RecommendationSectionClientProps,
  RecommendationType,
  RecommendationTab,
  RecommendationState,
  RecommendationAction
} from '@/app/type/recommendations';
