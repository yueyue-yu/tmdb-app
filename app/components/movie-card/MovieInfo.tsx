'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { MovieInfoProps } from '@/app/type/movieCard';
import { MediaTypeEnum } from '@/app/type/movie';

/**
 * 电影信息组件（客户端组件）
 */
export default function MovieInfo({ movie, year, mediaType = MediaTypeEnum.Movie }: MovieInfoProps) {
  // 根据媒体类型生成正确的详情页面链接
  const detailPath = mediaType === MediaTypeEnum.TV
    ? `/detail/tv/${movie.id}`
    : `/detail/movie/${movie.id}`;
  const t = useTranslations('MovieCard');
  return (
    <div className="card-body p-4 space-y-3 flex-1 flex flex-col">
      {/* 标题 */}
      <Link href={detailPath}>
        <h2 className="card-title text-base leading-tight hover:text-primary transition-colors duration-200 line-clamp-2 cursor-pointer">
          {movie.title}{year && <span className="text-base-content/60">（{year}）</span>}
        </h2>
      </Link>

      {/* 简介 */}
      <p className="text-sm text-base-content/70 line-clamp-3 leading-relaxed flex-1">
        {movie.overview || t('noOverview')}
      </p>
    </div>
  );
}
