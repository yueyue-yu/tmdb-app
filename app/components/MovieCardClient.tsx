'use client';

import type { Movie } from '@/app/lib/api/types';
import { MovieCard } from './movie';
import type { PopularityLevel, RatingBadgeClass } from '@/app/type/movieCard';

interface MovieCardClientProps {
  movie: Movie;
  index: number;
  isLiked: boolean;
  posterUrl: string;
  year: number;
  popularityLevel: PopularityLevel;
  ratingBadgeClass: RatingBadgeClass;
}

/**
 * 向后兼容的 MovieCardClient 组件
 * @deprecated 请使用 ./movie/MovieCard 代替
 */
export default function MovieCardClient({ 
  movie, 
  index, 
  isLiked, 
  posterUrl,
  year,
  popularityLevel,
  ratingBadgeClass
}: MovieCardClientProps) {
  const priority = index < 8;
  
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
