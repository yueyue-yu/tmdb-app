/**
 * 评论组件导出
 */

export { default as ReviewCard } from './ReviewCard';
export { default as ReviewSectionSimple } from './ReviewSectionSimple';
export { default as ReviewPage } from './ReviewPage';
export { default as ReviewPageClient } from './ReviewPageClient';

// 导出类型
export type {
  Review,
  ReviewAuthor,
  ReviewsResponse,
  ReviewCardProps,
  ReviewSectionSimpleProps,
  ReviewPageProps,
  ReviewPageClientProps,
  ReviewApiParams,
  ReviewSortOption,
  ReviewState,
  ReviewAction,
  ReviewPageParams
} from '@/app/type/reviews';
