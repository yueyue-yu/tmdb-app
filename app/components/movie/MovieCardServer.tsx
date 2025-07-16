import type { MovieCardProps } from '@/app/type/movieCard';
import { 
  getPosterUrl, 
  getYear, 
  getPopularityLevel, 
  getRatingBadgeClass 
} from '@/app/lib/movieUtils';
import MovieCard from './MovieCard';

/**
 * 电影卡片服务端组件
 * 负责数据处理和预计算，将结果传递给纯展示组件
 */
export default function MovieCardServer({ movie, index }: MovieCardProps) {
  // 服务端预计算所有值
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = getYear(movie.release_date);
  const popularity = movie.popularity || 0;
  const popularityLevel = getPopularityLevel(popularity);
  const ratingBadgeClass = getRatingBadgeClass(movie.vote_average);
  const priority = index < 8; // 前8个图片优先加载

  return (
    <MovieCard
      movie={movie}
      posterUrl={posterUrl}
      year={year}
      popularityLevel={popularityLevel}
      ratingBadgeClass={ratingBadgeClass}
      priority={priority}
    />
  );
}
