// 电影分类类型
export type MovieCategoryKeys = 'popular' | 'top-rated' | 'now-playing' | 'upcoming';

export type TvCategoryKeys = 'popular' | 'top-rated' | 'on-the-air' | 'airing-today';

export type MediaCategoryKeys = MovieCategoryKeys | TvCategoryKeys;

export enum MediaTypeEnum {
    Movie = 'movie',
    TV = 'tv',
}

