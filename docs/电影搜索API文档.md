# 电影搜索API文档

## 概述

本文档详细描述了TMDB应用中电影搜索系统的API架构、接口设计和使用方法。搜索系统支持电影、电视剧、演员的统一搜索，并提供丰富的筛选功能。

## 架构设计

### 核心组件

```
搜索系统架构
├── 统一搜索入口 (unifiedSearch)
├── 媒体类型处理
│   ├── 电影搜索 (discoverMovies)
│   ├── 电视剧搜索 (discoverTvShows)
│   └── 演员搜索 (peopleApi.search)
├── API策略选择
│   ├── 关键词搜索 (/search/*)
│   └── 筛选搜索 (/discover/*)
└── 结果统一格式化
```

### 搜索类型枚举

```typescript
export enum SearchTypeEnum {
  ALL = 'all',        // 综合搜索
  MOVIE = 'movie',    // 电影
  TV = 'tv',          // 电视剧
  PERSON = 'person'   // 演员
}
```

## API接口详情

### 1. 统一搜索接口

**函数**: `unifiedSearch(params: SearchParams)`

**参数**:
```typescript
interface SearchParams {
  query: string;              // 搜索关键词
  type: SearchTypeEnum;       // 搜索类型
  page?: number;              // 页码（默认1）
  filters?: FilterParams;     // 筛选参数
}
```

**返回值**:
- `SearchTypeEnum.MOVIE`: `ApiResponse<Movie>`
- `SearchTypeEnum.TV`: `ApiResponse<Movie>` (转换格式)
- `SearchTypeEnum.PERSON`: `ApiResponse<Person>`
- `SearchTypeEnum.ALL`: `MultiSearchResponse`

### 2. 筛选参数

```typescript
interface FilterParams {
  yearFrom?: number;          // 起始年份
  yearTo?: number;            // 结束年份
  ratingFrom?: number;        // 最低评分
  ratingTo?: number;          // 最高评分
  genres?: number[];          // 类型ID数组
  sortBy?: SortOption;        // 排序方式
}
```

### 3. 排序选项

```typescript
export enum SortOption {
  RELEVANCE = 'relevance',
  POPULARITY_DESC = 'popularity.desc',
  POPULARITY_ASC = 'popularity.asc',
  RELEASE_DATE_DESC = 'release_date.desc',
  RELEASE_DATE_ASC = 'release_date.asc',
  VOTE_AVERAGE_DESC = 'vote_average.desc',
  VOTE_AVERAGE_ASC = 'vote_average.asc',
  VOTE_COUNT_DESC = 'vote_count.desc',
  VOTE_COUNT_ASC = 'vote_count.asc'
}
```

## TMDB API端点映射

### 搜索端点

| 功能 | 端点 | 参数 |
|------|------|------|
| 电影搜索 | `/search/movie` | `query`, `page` |
| 电视剧搜索 | `/search/tv` | `query`, `page` |
| 演员搜索 | `/search/person` | `query`, `page` |

### 发现端点（支持筛选）

| 功能 | 端点 | 主要参数 |
|------|------|----------|
| 电影发现 | `/discover/movie` | `sort_by`, `with_genres`, `primary_release_date.gte/lte`, `vote_average.gte/lte` |
| 电视剧发现 | `/discover/tv` | `sort_by`, `with_genres`, `first_air_date.gte/lte`, `vote_average.gte/lte` |

### 筛选参数转换

```typescript
function convertFiltersToApiParams(filters: FilterParams, mediaType: 'movie' | 'tv') {
  const params: Record<string, string> = {};
  
  // 年份筛选
  if (mediaType === 'movie') {
    if (filters.yearFrom) params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`;
    if (filters.yearTo) params['primary_release_date.lte'] = `${filters.yearTo}-12-31`;
  } else {
    if (filters.yearFrom) params['first_air_date.gte'] = `${filters.yearFrom}-01-01`;
    if (filters.yearTo) params['first_air_date.lte'] = `${filters.yearTo}-12-31`;
  }
  
  // 评分筛选
  if (filters.ratingFrom !== undefined) {
    params['vote_average.gte'] = filters.ratingFrom.toString();
  }
  if (filters.ratingTo !== undefined) {
    params['vote_average.lte'] = filters.ratingTo.toString();
  }
  
  // 类型筛选
  if (filters.genres && filters.genres.length > 0) {
    params['with_genres'] = filters.genres.join(',');
  }
  
  // 排序
  if (filters.sortBy && filters.sortBy !== SortOption.RELEVANCE) {
    params['sort_by'] = filters.sortBy;
  }
  
  return params;
}
```

## Server Actions

### 主要搜索Actions

```typescript
// 统一搜索
export async function unifiedSearch(params: SearchParams)

// 电影搜索
export async function searchMoviesAction(query: string, page?: number)

// 电视剧搜索  
export async function searchTvAction(query: string, page?: number)

// 演员搜索
export async function searchPeopleAction(query: string, page?: number)

// 综合搜索
export async function multiSearch(query: string, page?: number)
```

### 基础媒体Actions

```typescript
// 电影相关
export async function fetchMovies(category: MovieCategoryKeys, page?: number)
export async function searchMovies(query: string, page?: number)
export async function fetchMoviesByGenre(genreId: number, page?: number)

// 电视剧相关
export async function fetchTvShows(category: TvCategoryKeys, page?: number)
export async function searchTvShows(query: string, page?: number)
export async function searchTvShowsAsMovies(query: string, page?: number)
```

## API策略选择逻辑

**重要修复**: 修复了搜索结果排序问题，确保搜索关键词优先级高于筛选条件。

```typescript
function hasFilters(filters: FilterParams): boolean {
  return !!(
    filters.yearFrom ||
    filters.yearTo ||
    filters.ratingFrom !== undefined ||
    filters.ratingTo !== undefined ||
    (filters.genres && filters.genres.length > 0) ||
    (filters.sortBy && filters.sortBy !== SortOption.RELEVANCE)
  );
}

// 修复后的电影搜索策略
async function discoverMovies(query: string, filters: FilterParams, page: number) {
  // 优先级1: 有搜索关键词时，使用 /search API
  if (query.trim()) {
    let response = await searchMovies(query, page);

    // 在客户端对搜索结果进行筛选和排序
    if (hasFilters(filters)) {
      response = await applyFiltersToResults(response, filters);
    }

    return response;
  }
  // 优先级2: 没有关键词但有筛选条件时，使用 /discover API
  else if (hasFilters(filters)) {
    const apiParams = convertFiltersToApiParams(filters, 'movie');
    return apiClient.get('/discover/movie', { ...apiParams, page: page.toString() });
  }
  // 优先级3: 既没有关键词也没有筛选条件，返回热门内容
  else {
    return apiClient.get('/movie/popular', { page: page.toString() });
  }
}
```

### 客户端筛选和排序

为了解决 TMDB API 的限制（`/discover` API 不支持关键词搜索），我们实现了客户端筛选：

```typescript
async function applyFiltersToResults(
  response: ApiResponse<Movie>,
  filters: FilterParams
): Promise<ApiResponse<Movie>> {
  let filteredResults = [...response.results];

  // 年份筛选
  if (filters.yearFrom || filters.yearTo) {
    filteredResults = filteredResults.filter(item => {
      const releaseDate = item.release_date || item.first_air_date;
      if (!releaseDate) return false;

      const year = new Date(releaseDate).getFullYear();
      if (filters.yearFrom && year < filters.yearFrom) return false;
      if (filters.yearTo && year > filters.yearTo) return false;
      return true;
    });
  }

  // 评分筛选
  if (filters.ratingFrom !== undefined || filters.ratingTo !== undefined) {
    filteredResults = filteredResults.filter(item => {
      const rating = item.vote_average;
      if (filters.ratingFrom !== undefined && rating < filters.ratingFrom) return false;
      if (filters.ratingTo !== undefined && rating > filters.ratingTo) return false;
      return true;
    });
  }

  // 类型筛选
  if (filters.genres && filters.genres.length > 0) {
    filteredResults = filteredResults.filter(item => {
      return filters.genres!.some(genreId => item.genre_ids.includes(genreId));
    });
  }

  // 排序
  if (filters.sortBy && filters.sortBy !== SortOption.RELEVANCE) {
    filteredResults = sortResults(filteredResults, filters.sortBy);
  }

  return {
    ...response,
    results: filteredResults,
    total_results: filteredResults.length,
    total_pages: Math.ceil(filteredResults.length / 20)
  };
}
```

## 数据类型定义

### API响应格式

```typescript
interface ApiResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}
```

### 电影数据结构

```typescript
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  // ... 其他字段
}
```

### 演员数据结构

```typescript
interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for: Movie[];
  // ... 其他字段
}
```

### 综合搜索响应

```typescript
interface MultiSearchResponse {
  movies: ApiResponse<Movie>;
  tvShows: ApiResponse<Movie>;  // 转换为Movie格式
  people: ApiResponse<Person>;
  totalResults: number;
}
```

## 错误处理

### API客户端错误处理

```typescript
class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const maxRetries = 3;
    const retryDelay = 1000;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(fullUrl, config);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        if (attempt === maxRetries || !this.isRetryableError(error)) {
          break;
        }
        await this.delay(retryDelay * Math.pow(2, attempt));
      }
    }
    
    throw lastError;
  }
}
```

### 可重试错误类型

- 网络连接错误 (ECONNRESET, ENOTFOUND, ETIMEDOUT)
- 5xx服务器错误
- 超时错误 (AbortError)
- 网络连接重置

## 使用示例

### 基础搜索

```typescript
// 搜索电影
const movieResults = await unifiedSearch({
  query: "复仇者联盟",
  type: SearchTypeEnum.MOVIE,
  page: 1
});

// 综合搜索
const allResults = await unifiedSearch({
  query: "漫威",
  type: SearchTypeEnum.ALL,
  page: 1
});
```

### 带筛选的搜索

```typescript
const filteredResults = await unifiedSearch({
  query: "动作",
  type: SearchTypeEnum.MOVIE,
  page: 1,
  filters: {
    yearFrom: 2020,
    yearTo: 2024,
    ratingFrom: 7.0,
    genres: [28, 12], // 动作、冒险
    sortBy: SortOption.VOTE_AVERAGE_DESC
  }
});
```

## 性能优化

### 并行请求

综合搜索使用 `Promise.allSettled` 并行请求所有类型：

```typescript
const [moviesResponse, tvResponse, peopleResponse] = await Promise.allSettled([
  discoverMovies(trimmedQuery, filters, page),
  discoverTvShows(trimmedQuery, filters, page),
  peopleApi.search(trimmedQuery, page)
]);
```

### 缓存策略

- API客户端配置 `next: { revalidate: 300 }` (5分钟缓存)
- 支持指数退避重试机制
- 15秒请求超时

### 语言本地化

- 自动检测用户语言设置
- 支持 `zh-CN`, `en-US` 等语言
- API请求自动添加 `language` 参数

## 重要修复记录

### 搜索结果排序问题修复 (2024-12-19)

**问题描述**:
当用户搜索关键词并设置排序条件时（如搜索"Friends"并按热度排序），系统错误地使用了 `/discover` API 而不是 `/search` API，导致显示的是所有电影按热度排序的结果，而不是"Friends"的搜索结果。

**根本原因**:
- `/discover` API 不支持关键词搜索，只能按条件筛选所有内容
- 原逻辑优先检查筛选条件，忽略了搜索关键词的重要性

**修复方案**:
1. **优先级调整**: 搜索关键词优先级高于筛选条件
2. **混合策略**: 先用 `/search` API 搜索关键词，再在客户端应用筛选和排序
3. **三级策略**: 关键词搜索 → 筛选搜索 → 热门内容

**影响范围**:
- 电影搜索 (`discoverMovies`)
- 电视剧搜索 (`discoverTvShows`)
- 综合搜索中的电影和电视剧部分

## 注意事项

1. **API限制**: TMDB API有请求频率限制，建议合理使用缓存
2. **数据转换**: 电视剧数据会转换为Movie格式以复用组件
3. **筛选限制**: 演员搜索不支持筛选，只支持关键词搜索
4. **错误恢复**: 综合搜索中单个类型失败不影响其他类型结果
5. **类型安全**: 所有接口都有完整的TypeScript类型定义
6. **客户端筛选**: 当有搜索关键词时，筛选和排序在客户端进行，可能影响分页准确性
7. **性能考虑**: 客户端筛选可能减少实际返回的结果数量

## 相关文件

- `app/lib/api/searchActions.ts` - 统一搜索Server Actions
- `app/lib/api/movieActions.ts` - 电影相关Actions
- `app/lib/api/tvActions.ts` - 电视剧相关Actions
- `app/lib/api/people.ts` - 演员API
- `app/lib/api/client.ts` - API客户端
- `app/type/search.ts` - 搜索类型定义
- `app/home/search/page.tsx` - 搜索页面实现
