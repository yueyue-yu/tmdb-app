/**
 * 搜索相关类型定义
 */

import type { Movie, Person, ApiResponse } from '@/app/lib/api/types';
import type { MediaTypeEnum } from './movie';

/**
 * 搜索类型枚举
 */
export enum SearchTypeEnum {
  ALL = 'all',        // 综合搜索
  MOVIE = 'movie',    // 电影
  TV = 'tv',          // 电视剧
  PERSON = 'person'   // 演员
}

/**
 * 搜索类型配置
 */
export interface SearchTypeConfig {
  key: SearchTypeEnum;
  label: string;
  icon: string;
}



/**
 * 筛选参数
 */
export interface FilterParams {
  // 年份筛选
  yearFrom?: number;
  yearTo?: number;

  // 评分筛选
  ratingFrom?: number;
  ratingTo?: number;

  // 类型筛选
  genres?: number[];
}

/**
 * 搜索参数
 */
export interface SearchParams {
  query: string;
  type: SearchTypeEnum;
  page?: number;  // 页码（可选，用于分页和无限滚动）
  filters?: FilterParams;
}

/**
 * 搜索结果项（统一格式）
 */
export interface SearchResultItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  media_type: 'movie' | 'tv' | 'person';
  popularity: number;
  
  // 电影/电视剧特有字段
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  video?: boolean;
  
  // 电视剧特有字段
  first_air_date?: string;
  origin_country?: string[];
  original_name?: string;
  
  // 演员特有字段
  profile_path?: string | null;
  known_for_department?: string;
  known_for?: Movie[];
}

/**
 * 搜索结果响应
 */
export interface SearchResponse {
  results: SearchResultItem[];
  page: number;
  total_pages: number;
  total_results: number;
}

/**
 * 综合搜索结果
 */
export interface MultiSearchResponse {
  movies: ApiResponse<Movie>;
  tvShows: ApiResponse<Movie>; // 使用Movie格式以复用组件
  people: ApiResponse<Person>;
  totalResults: number;
}

/**
 * 搜索状态
 */
export interface SearchState {
  query: string;
  type: SearchTypeEnum;
  page: number;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

/**
 * 搜索表单属性
 */
export interface SearchFormProps {
  initialQuery?: string;
  onSearch?: (params: SearchParams) => void;
}

/**
 * 搜索结果组件属性
 */
export interface SearchResultsProps {
  searchParams: SearchParams;
  className?: string;
}

/**
 * 搜索类型选择器属性
 */
export interface SearchTypeSelectorProps {
  currentType: SearchTypeEnum;
  onTypeChange: (type: SearchTypeEnum) => void;
  className?: string;
}

/**
 * 筛选器组件属性
 */
export interface FilterSidebarProps {
  searchParams: SearchParams;
  onFiltersChange: (filters: FilterParams) => void;
  className?: string;
}

/**
 * 筛选状态组件属性
 */
export interface FilterStatusProps {
  filters: FilterParams;
  onClearFilter: (filterKey: keyof FilterParams) => void;
  onClearAll: () => void;
  className?: string;
}

/**
 * 无限滚动搜索结果组件属性
 */
export interface InfiniteSearchResultsProps {
  searchParams: {
    query: string;
    type: SearchTypeEnum;
    filters?: FilterParams;
  };
  className?: string;
}

/**
 * 无限滚动加载状态
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * 搜索分页组件属性
 */
export interface SearchPaginationProps {
  searchParams: SearchParams;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  className?: string;
}

/**
 * 人员搜索结果卡片属性
 */
export interface PersonCardProps {
  person: Person;
  index: number;
  priority?: boolean;
  className?: string;
}

/**
 * 空搜索状态属性
 */
export interface EmptySearchStateProps {
  searchType: SearchTypeEnum;
  query: string;
  className?: string;
}

/**
 * 搜索加载状态属性
 */
export interface SearchLoadingProps {
  searchType: SearchTypeEnum;
  className?: string;
}
