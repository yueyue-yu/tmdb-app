import type { Movie } from '@/app/lib/api/types';
import type { PopularityLevel, RatingBadgeClass } from '@/app/type/movieCard';
import MoviePoster from './MoviePoster';
import MovieInfo from './MovieInfo';

interface MovieCardProps {
  movie: Movie;
  posterUrl: string;
  year: number;
  popularityLevel: PopularityLevel;
  ratingBadgeClass: RatingBadgeClass;
  priority: boolean;
}

/**
 * 电影卡片主组件（服务端组件）
 * 组合海报和信息组件，只有海报组件是客户端组件
 */
export default function MovieCard({ 
  movie, 
  posterUrl,
  year,
  popularityLevel,
  ratingBadgeClass,
  priority
}: MovieCardProps) {
  return (
    <div className="group relative">
      <div className="card card-compact bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 border border-base-300 hover:border-primary/50">
        
        {/* 海报区域 - 客户端组件 */}
        <MoviePoster
          movie={movie}
          posterUrl={posterUrl}
          popularityLevel={popularityLevel}
          ratingBadgeClass={ratingBadgeClass}
          priority={priority}
        />

        {/* 信息区域 - 服务端组件 */}
        <MovieInfo movie={movie} year={year} />
      </div>
    </div>
  );
}
