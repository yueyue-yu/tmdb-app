/**
 * API响应类型定义
 */

export interface ApiResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  first_air_date?: string; // 用于TV Show转换后的数据
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  adult: boolean;
  known_for_department: string;
  popularity: number;
}

export interface PersonDetails extends Person {
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string | null;
  place_of_birth: string | null;
  known_for: Movie[] | TvShow[];
}

export interface PersonMovieCredits {
  id: number;
  cast: PersonMovieCast[];
  crew: PersonMovieCrew[];
}

export interface PersonTvCredits {
  id: number;
  cast: PersonTvCast[];
  crew: PersonTvCrew[];
}

export interface PersonMovieCast {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  order: number;
  credit_id: string;
}

export interface PersonMovieCrew {
  id: number;
  title: string;
  job: string;
  department: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  credit_id: string;
}

export interface PersonTvCast {
  id: number;
  name: string;
  character: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  episode_count: number;
  credit_id: string;
}

export interface PersonTvCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  episode_count: number;
  credit_id: string;
}

export interface TvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface Network {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TvDetails extends TvShow {
  genres: Genre[];
  episode_run_time: number[];
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: Season[];
  networks: Network[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  homepage: string;
  in_production: boolean;
  last_air_date: string;
  type: string;
}

/**
 * 统一的媒体详情接口
 * 用于电影和电视剧详情页面的统一数据格式
 */
export interface MediaDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  runtime: number | null; // 电影为分钟数，电视剧为平均每集时长
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  homepage: string;
  original_language: string;
  original_title: string;
  popularity: number;

  // 媒体类型标识
  media_type: 'movie' | 'tv';

  // 电影特有字段
  budget?: number;
  revenue?: number;
  imdb_id?: string;
  adult?: boolean;
  video?: boolean;

  // 电视剧特有字段
  number_of_episodes?: number;
  number_of_seasons?: number;
  seasons?: Season[];
  networks?: Network[];
  in_production?: boolean;
  last_air_date?: string;
  type?: string;
  episode_run_time?: number[];
  origin_country?: string[];
}

export interface ApiError {
  status_code: number;
  status_message: string;
  success: boolean;
}
