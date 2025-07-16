// 纯服务端组件 - 不需要 'use client'
import type { Movie } from '../../api/types';

// 客户端交互组件
import MovieCardClient from './MovieCardClient';

interface MovieCardServerProps {
  movie: Movie;
  index: number;
  isLiked: boolean;
  onToggleLike: (movieId: number) => void;
}

// 纯函数 - 服务端可用
const getPosterUrl = (posterPath: string | null): string => {
  if (!posterPath) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2NjY2NiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMzMzMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2JnKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBvcGFjaXR5PSIwLjgiPuaaguaXoOWbvueJhzwvdGV4dD48L3N2Zz4=';
  }
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

const getYear = (dateString: string): number => {
  return new Date(dateString).getFullYear();
};

const getPopularityLevel = (popularity: number): 'hot' | 'trending' | 'normal' => {
  if (popularity > 100) return 'hot';
  if (popularity > 50) return 'trending';
  return 'normal';
};

const getRatingBadgeClass = (rating: number): string => {
  if (rating >= 8) return 'badge-success';
  if (rating >= 7) return 'badge-warning';
  if (rating >= 6) return 'badge-orange';
  return 'badge-error';
};

export default function MovieCardServer({ movie, index, isLiked, onToggleLike }: MovieCardServerProps) {
  // 服务端预计算所有值
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = getYear(movie.release_date);
  const popularity = movie.popularity || 0;
  const popularityLevel = getPopularityLevel(popularity);
  const ratingBadgeClass = getRatingBadgeClass(movie.vote_average);

  // 将计算结果和props传递给客户端组件
  return (
    <MovieCardClient
      movie={movie}
      index={index}
      isLiked={isLiked}
      onToggleLike={onToggleLike}
      posterUrl={posterUrl}
      year={year}
      popularityLevel={popularityLevel}
      ratingBadgeClass={ratingBadgeClass}
    />
  );
}
