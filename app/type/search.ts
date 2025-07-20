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
 * 排序选项枚举
 */
export enum SortOption {
  RELEVANCE = 'relevance',           // 相关度（仅搜索时可用）
  POPULARITY_DESC = 'popularity.desc', // 热门度降序
  POPULARITY_ASC = 'popularity.asc',   // 热门度升序
  VOTE_AVERAGE_DESC = 'vote_average.desc', // 评分降序
  VOTE_AVERAGE_ASC = 'vote_average.asc',   // 评分升序
  RELEASE_DATE_DESC = 'release_date.desc', // 发布日期降序（电影）
  RELEASE_DATE_ASC = 'release_date.asc',   // 发布日期升序（电影）
  FIRST_AIR_DATE_DESC = 'first_air_date.desc', // 首播日期降序（电视剧）
  FIRST_AIR_DATE_ASC = 'first_air_date.asc',   // 首播日期升序（电视剧）
  TITLE_ASC = 'title.asc',           // 标题升序
  TITLE_DESC = 'title.desc'          // 标题降序
}

/**
 * 排序选项到国际化键名的映射
 * 将包含点号的排序选项映射到下划线键名
 */
export const SORT_OPTION_I18N_MAP: Record<SortOption, string> = {
  [SortOption.RELEVANCE]: 'relevance',
  [SortOption.POPULARITY_DESC]: 'popularity_desc',
  [SortOption.POPULARITY_ASC]: 'popularity_asc',
  [SortOption.VOTE_AVERAGE_DESC]: 'vote_average_desc',
  [SortOption.VOTE_AVERAGE_ASC]: 'vote_average_asc',
  [SortOption.RELEASE_DATE_DESC]: 'release_date_desc',
  [SortOption.RELEASE_DATE_ASC]: 'release_date_asc',
  [SortOption.FIRST_AIR_DATE_DESC]: 'first_air_date_desc',
  [SortOption.FIRST_AIR_DATE_ASC]: 'first_air_date_asc',
  [SortOption.TITLE_ASC]: 'title_asc',
  [SortOption.TITLE_DESC]: 'title_desc'
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

  // 排序
  sortBy?: SortOption;
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
