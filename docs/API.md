# 📡 API 文档

## TMDB API 集成

本项目基于 [The Movie Database (TMDB) API](https://developers.themoviedb.org/3) 构建，提供丰富的影视数据。

## 🔑 API 配置

### 环境变量
```env
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### API 客户端
```typescript
// app/lib/api/client.ts
export async function getApiClient() {
  return {
    get: async (url: string) => {
      const response = await fetch(`${TMDB_BASE_URL}${url}?api_key=${API_KEY}`);
      return response.json();
    }
  };
}
```

## 🎬 电影 API

### 获取热门电影
```typescript
// GET /movie/popular
export async function getPopularMovies(page: number = 1) {
  const apiClient = await getApiClient();
  return apiClient.get(`/movie/popular?page=${page}`);
}
```

### 获取电影详情
```typescript
// GET /movie/{movie_id}
export async function getMovieDetails(id: number) {
  const apiClient = await getApiClient();
  return apiClient.get(`/movie/${id}?append_to_response=credits,reviews,recommendations`);
}
```

### 搜索电影
```typescript
// GET /search/movie
export async function searchMovies(query: string, page: number = 1) {
  const apiClient = await getApiClient();
  return apiClient.get(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
}
```

## 📺 电视剧 API

### 获取热门电视剧
```typescript
// GET /tv/popular
export async function getPopularTVShows(page: number = 1) {
  const apiClient = await getApiClient();
  return apiClient.get(`/tv/popular?page=${page}`);
}
```

### 获取电视剧详情
```typescript
// GET /tv/{tv_id}
export async function getTVShowDetails(id: number) {
  const apiClient = await getApiClient();
  return apiClient.get(`/tv/${id}?append_to_response=credits,reviews,recommendations`);
}
```

## 👤 演员 API

### 搜索演员
```typescript
// GET /search/person
export async function searchPeople(query: string, page: number = 1) {
  const apiClient = await getApiClient();
  return apiClient.get(`/search/person?query=${encodeURIComponent(query)}&page=${page}`);
}
```

### 获取演员详情
```typescript
// GET /person/{person_id}
export async function getPersonDetails(id: number) {
  const apiClient = await getApiClient();
  return apiClient.get(`/person/${id}?append_to_response=movie_credits,tv_credits`);
}
```

## 🏷️ 类型 API

### 获取电影类型
```typescript
// GET /genre/movie/list
export async function getMovieGenres() {
  const apiClient = await getApiClient();
  const response = await apiClient.get('/genre/movie/list');
  return response.genres;
}
```

### 获取电视剧类型
```typescript
// GET /genre/tv/list
export async function getTVGenres() {
  const apiClient = await getApiClient();
  const response = await apiClient.get('/genre/tv/list');
  return response.genres;
}
```

## 🔍 统一搜索 API

### 综合搜索
```typescript
export async function unifiedSearch(params: SearchParams) {
  const { query, type, page = 1, filters = {} } = params;
  
  switch (type) {
    case SearchTypeEnum.MOVIE:
      return await discoverMovies(query, filters, page);
    
    case SearchTypeEnum.TV:
      return await discoverTvShows(query, filters, page);
    
    case SearchTypeEnum.PERSON:
      return await searchPeople(query, page);
    
    case SearchTypeEnum.ALL:
      // 并行搜索所有类型
      const [movies, tvShows, people] = await Promise.allSettled([
        discoverMovies(query, filters, page),
        discoverTvShows(query, filters, page),
        searchPeople(query, page)
      ]);
      
      return {
        movies: movies.status === 'fulfilled' ? movies.value : emptyResponse,
        tvShows: tvShows.status === 'fulfilled' ? tvShows.value : emptyResponse,
        people: people.status === 'fulfilled' ? people.value : emptyResponse
      };
  }
}
```

## 🖼️ 图片 API

### 图片 URL 构建
```typescript
export function getImageUrl(path: string, size: string = 'w500') {
  if (!path) return '/placeholder-image.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// 支持的图片尺寸
export const IMAGE_SIZES = {
  poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
  backdrop: ['w300', 'w780', 'w1280', 'original'],
  profile: ['w45', 'w185', 'h632', 'original']
};
```

## 📊 数据类型定义

### 电影类型
```typescript
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  original_title: string;
}
```

### 电视剧类型
```typescript
export interface TvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
}
```

### 演员类型
```typescript
export interface Person {
  id: number;
  name: string;
  profile_path: string;
  popularity: number;
  known_for_department: string;
  gender: number;
  adult: boolean;
}
```

## 🚦 错误处理

### API 错误类型
```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### 错误处理策略
```typescript
export async function handleApiCall<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError) {
      // 记录API错误
      console.error('API Error:', error.message, error.status);
    }
    throw error;
  }
}
```

## 📈 缓存策略

### SWR 配置
```typescript
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 5 * 60 * 1000, // 5分钟
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000
};
```

### 缓存键生成
```typescript
export function generateCacheKey(
  endpoint: string,
  params: Record<string, any>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {} as Record<string, any>);
  
  return `${endpoint}:${JSON.stringify(sortedParams)}`;
}
```

## 🔒 安全考虑

### API Key 保护
- API Key 存储在服务器端环境变量中
- 客户端请求通过服务器代理
- 避免在客户端代码中暴露敏感信息

### 请求限制
- 实现请求频率限制
- 使用防抖和节流优化请求
- 错误重试机制避免过度请求
