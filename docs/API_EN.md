# 📡 API Documentation

## TMDB API Integration

This project is built on [The Movie Database (TMDB) API](https://developers.themoviedb.org/3), providing rich movie and TV data.

## 🔑 API Configuration

### Environment Variables
```env
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### API Client
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

## 🎬 Movie API

### Get Popular Movies
```typescript
// GET /movie/popular
export async function getPopularMovies(page: number = 1) {
  const apiClient = await getApiClient();
  return apiClient.get(`/movie/popular?page=${page}`);
}
```

### Get Movie Details
```typescript
// GET /movie/{movie_id}
export async function getMovieDetails(id: number) {
  const apiClient = await getApiClient();
  return apiClient.get(`/movie/${id}?append_to_response=credits,reviews,recommendations`);
}
```

### Search Movies
```typescript
// GET /search/movie
export async function searchMovies(query: string, page: number = 1) {
  const apiClient = await getApiClient();
  return apiClient.get(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
}
```

## 📺 TV Show API

### Get Popular TV Shows
```typescript
// GET /tv/popular
export async function getPopularTVShows(page: number = 1) {
  const apiClient = await getApiClient();
  return apiClient.get(`/tv/popular?page=${page}`);
}
```

### Get TV Show Details
```typescript
// GET /tv/{tv_id}
export async function getTVShowDetails(id: number) {
  const apiClient = await getApiClient();
  return apiClient.get(`/tv/${id}?append_to_response=credits,reviews,recommendations`);
}
```

## 👤 Person API

### Search People
```typescript
// GET /search/person
export async function searchPeople(query: string, page: number = 1) {
  const apiClient = await getApiClient();
  return apiClient.get(`/search/person?query=${encodeURIComponent(query)}&page=${page}`);
}
```

### Get Person Details
```typescript
// GET /person/{person_id}
export async function getPersonDetails(id: number) {
  const apiClient = await getApiClient();
  return apiClient.get(`/person/${id}?append_to_response=movie_credits,tv_credits`);
}
```

## 🏷️ Genre API

### Get Movie Genres
```typescript
// GET /genre/movie/list
export async function getMovieGenres() {
  const apiClient = await getApiClient();
  const response = await apiClient.get('/genre/movie/list');
  return response.genres;
}
```

### Get TV Genres
```typescript
// GET /genre/tv/list
export async function getTVGenres() {
  const apiClient = await getApiClient();
  const response = await apiClient.get('/genre/tv/list');
  return response.genres;
}
```

## 🔍 Unified Search API

### Comprehensive Search
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
      // Parallel search for all types
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

## 🖼️ Image API

### Image URL Construction
```typescript
export function getImageUrl(path: string, size: string = 'w500') {
  if (!path) return '/placeholder-image.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Supported image sizes
export const IMAGE_SIZES = {
  poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
  backdrop: ['w300', 'w780', 'w1280', 'original'],
  profile: ['w45', 'w185', 'h632', 'original']
};
```

## 📊 Data Type Definitions

### Movie Type
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

### TV Show Type
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

### Person Type
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

## 🚦 Error Handling

### API Error Types
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

### Error Handling Strategy
```typescript
export async function handleApiCall<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof ApiError) {
      // Log API errors
      console.error('API Error:', error.message, error.status);
    }
    throw error;
  }
}
```

## 📈 Caching Strategy

### SWR Configuration
```typescript
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  dedupingInterval: 2000,
  errorRetryCount: 3,
  errorRetryInterval: 5000
};
```

### Cache Key Generation
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

## 🔒 Security Considerations

### API Key Protection
- API Key stored in server-side environment variables
- Client requests proxied through server
- Avoid exposing sensitive information in client code

### Request Limiting
- Implement request rate limiting
- Use debounce and throttle to optimize requests
- Error retry mechanism to avoid excessive requests
