import Link from 'next/link';
import type { MovieInfoProps } from '@/app/type/movieCard';
import { MediaTypeEnum } from '@/app/type/movie';
import { getTranslations } from 'next-intl/server';
import MovieStats from './MovieStats';

/**
 * 电影信息组件（服务器组件）
 */
export default async function MovieInfo({ movie, year, mediaType = MediaTypeEnum.Movie }: MovieInfoProps) {
  // 根据媒体类型生成正确的详情页面链接
  const detailPath = mediaType === MediaTypeEnum.TV
    ? `/detail/tv/${movie.id}`
    : `/detail/movie/${movie.id}`;
  const t = await getTranslations('MovieCard');
  return (
    <div className="card-body p-4 space-y-3">
      {/* 标题 */}
      <Link href={detailPath}>
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
    </div>
  );
}
