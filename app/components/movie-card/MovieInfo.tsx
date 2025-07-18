import Link from 'next/link';
import type { MovieInfoProps } from '@/app/type/movieCard';
import { getTranslations } from 'next-intl/server';
import MovieStats from './MovieStats';
import MovieActions from './MovieActions';

/**
 * 电影信息组件（服务器组件）
 */
export default async function MovieInfo({ movie, year }: MovieInfoProps) {
  const t = await getTranslations('MovieCard');
  return (
    <div className="card-body p-4 space-y-3">
      {/* 标题 */}
      <Link href={`/app/home/movies/${movie.id}`}>
        <h2 className="card-title text-base leading-tight hover:text-primary transition-colors duration-200 line-clamp-2 cursor-pointer">
          {movie.title}
        </h2>
      </Link>

      {/* 统计信息 */}
      <MovieStats year={year} voteCount={movie.vote_count} />

      {/* 简介 */}
      <p className="text-sm text-base-content/70 line-clamp-3 leading-relaxed">
        {movie.overview || t('noOverview')}
      </p>

      {/* 操作按钮 */}
      <MovieActions movieId={movie.id} />
    </div>
  );
}
