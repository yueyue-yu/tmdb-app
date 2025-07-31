import type { MovieCardProps } from '@/app/type/movieCard';
import { MediaTypeEnum } from '@/app/type/movie';
import {
  getPosterUrl,
  getYear,
  getPopularityLevel,
  getRatingBadgeClass
} from '@/app/lib/movieUtils';

import MoviePoster from "@/app/components/movie-card/MoviePoster";
import MovieInfo from "@/app/components/movie-card/MovieInfo";

/**
 * 电影卡片服务端组件
 * 负责数据处理和预计算，将结果传递给纯展示组件
 */
export default function MovieCard({ movie, index, mediaType = MediaTypeEnum.Movie }: MovieCardProps) {
  // 服务端预计算所有值
  const posterUrl = getPosterUrl(movie.poster_path);
  // 根据媒体类型使用正确的日期字段
  const dateString = mediaType === MediaTypeEnum.Movie ? movie.release_date : movie.first_air_date;
  const year = dateString ? getYear(dateString) : null;
  const popularity = movie.popularity || 0;
  const popularityLevel = getPopularityLevel(popularity);
  const ratingBadgeClass = getRatingBadgeClass(movie.vote_average);
  const priority = index < 8; // 前8个图片优先加载

  return (
      <div className="group relative">
        <div className="card card-compact bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 border border-base-300 hover:border-primary/50 h-full">

          {/* 响应式布局容器 */}
          <div className="flex flex-row sm:flex-col h-full">
            {/* 海报区域 - 客户端组件 */}
            <div className="flex-shrink-0 w-1/3 sm:w-full">
              <MoviePoster
                  movie={movie}
                  posterUrl={posterUrl}
                  popularityLevel={popularityLevel}
                  ratingBadgeClass={ratingBadgeClass}
                  priority={priority}
                  mediaType={mediaType}
              />
            </div>

            {/* 信息区域 - 服务端组件 */}
            <div className="flex-1 sm:flex-none flex flex-col">
              <MovieInfo movie={movie} year={year} mediaType={mediaType} />
            </div>
          </div>
        </div>
      </div>
  );
}
