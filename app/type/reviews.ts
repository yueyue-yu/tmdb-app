/**
 * 评论相关类型定义
 */

/**
 * 评论作者信息
 */
export interface ReviewAuthor {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

/**
 * 评论数据结构
 */
export interface Review {
  id: string;
  author: string;
  author_details: ReviewAuthor;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

/**
 * 评论API响应结构
 */
export interface ReviewsResponse {
  id: number;
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

/**
 * 评论卡片组件属性
 */
export interface ReviewCardProps {
  review: Review;
  index?: number;
  priority?: boolean;
  className?: string;
  showFullContent?: boolean;
}

/**
 * 简化评论区域组件属性
 */
export interface ReviewSectionSimpleProps {
  reviews: Review[];
  mediaType: 'movie' | 'tv';
  mediaId: number;
  showCount?: number;
  totalReviews?: number;
}

/**
 * 评论页面客户端组件属性
 */
export interface ReviewPageClientProps {
  reviews: Review[];
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  mediaId: number;
  posterPath?: string;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  translations: {
    reviews: string;
    noReviews: string;
    loadingError: string;
    retryLater: string;
    showMore: string;
    showLess: string;
    backToDetail: string;
    reviewsFor: string;
    totalReviews: string;
    page: string;
    of: string;
    rating: string;
    noRating: string;
    readMore: string;
    readLess: string;
    writtenBy: string;
    on: string;
    sortBy: string;
    newest: string;
    oldest: string;
    highestRated: string;
    lowestRated: string;
  };
}

/**
 * 评论页面服务端组件属性
 */
export interface ReviewPageProps {
  reviews: Review[];
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  mediaId: number;
  posterPath?: string;
  totalResults: number;
  totalPages: number;
  currentPage: number;
}

/**
 * 评论API参数
 */
export interface ReviewApiParams {
  page?: number;
  language?: string;
}

/**
 * 评论排序选项
 */
export enum ReviewSortOption {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  HIGHEST_RATED = 'highest_rated',
  LOWEST_RATED = 'lowest_rated'
}

/**
 * 评论状态管理
 */
export interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  sortBy: ReviewSortOption;
}

/**
 * 评论状态操作
 */
export type ReviewAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'SET_PAGE_INFO'; payload: { currentPage: number; totalPages: number; totalResults: number } }
  | { type: 'SET_SORT'; payload: ReviewSortOption }
  | { type: 'RESET' };

/**
 * 评论页面路由参数
 */
export interface ReviewPageParams {
  id: string;
  page?: string;
}
