/**
 * 电影组件入口文件
 * 统一导出所有电影相关组件
 */

// 主要组件
export { default as MovieCard} from './MovieCard';

export { default as MoviePoster } from './MoviePoster';
export { default as MovieInfo } from './MovieInfo';

// 子组件
export { default as PopularityBadge } from './PopularityBadge';
export { default as RatingBadge } from './RatingBadge';
export { default as PlayButton } from './PlayButton';
export { default as MovieStats } from './MovieStats';


// 类型导出
export type * from '@/app/type/movieCard';
