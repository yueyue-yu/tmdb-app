
import type { Movie } from '@/app/lib/api/types';
import { MovieCardServer as NewMovieCardServer } from './movie';

interface MovieCardServerProps {
  movie: Movie;
  index: number;
}

/**
 * 向后兼容的 MovieCardServer 组件
 * @deprecated 请使用 ./movie/MovieCardServer 代替
 */
export default function MovieCardServer({ movie, index }: MovieCardServerProps) {
  return <NewMovieCardServer movie={movie} index={index} />;
}
