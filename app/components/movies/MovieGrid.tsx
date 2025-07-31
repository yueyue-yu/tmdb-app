/**
 * 电影网格组件
 * 服务器组件，显示电影列表
 */

import type { Movie } from '@/app/lib/api';
import type { MediaTypeEnum } from '@/app/type/movie';
import MovieCard from '../movie-card/MovieCard';
import { getTranslations } from 'next-intl/server';

interface MovieGridProps {
  movies: Movie[];
  category: string;
  mediaType?: MediaTypeEnum;
}

export default async function MovieGrid({ movies, category, mediaType }: MovieGridProps) {
  const t = await getTranslations('Movies');
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center mt-20">
        <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="card-title justify-center text-xl">{t('noMovies')}</h3>
            <p className="text-base-content/60 mb-6">
              {t('noMoviesDesc')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {movies.map((movie, index) => (
        <MovieCard
          key={`${category}-${movie.id}`}
          movie={movie}
          index={index}
          mediaType={mediaType}
        />
      ))}
    </div>
  );
}
