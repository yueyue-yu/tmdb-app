/**
 * 季度信息组件
 * 显示电视剧的季度信息
 */

import Image from 'next/image';
import { CalendarIcon, FilmIcon, StarIcon } from '@heroicons/react/24/outline';
import type { SeasonsInfoProps } from '@/app/type/tvDetail';
import { getPosterUrl } from '@/app/lib/movieUtils';

export default function SeasonsInfo({ seasons }: SeasonsInfoProps) {
  if (!seasons || seasons.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        暂无季度信息
      </div>
    );
  }

  // 过滤掉特殊季度（如第0季）并按季度号排序
  const regularSeasons = seasons
    .filter(season => season.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {regularSeasons.map((season) => (
        <div key={season.id} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
          <figure className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={getPosterUrl(season.poster_path)}
              alt={season.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </figure>
          
          <div className="card-body p-4">
            <h3 className="card-title text-lg">{season.name}</h3>
            
            {/* 季度信息 */}
            <div className="space-y-2 text-sm">
              {/* 播出日期 */}
              {season.air_date && (
                <div className="flex items-center gap-2 text-base-content/70">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(season.air_date).getFullYear()}</span>
                </div>
              )}
              
              {/* 集数 */}
              <div className="flex items-center gap-2 text-base-content/70">
                <FilmIcon className="w-4 h-4" />
                <span>{season.episode_count} 集</span>
              </div>
              
              {/* 评分 */}
              {season.vote_average > 0 && (
                <div className="flex items-center gap-2 text-base-content/70">
                  <StarIcon className="w-4 h-4" />
                  <span>{season.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* 简介 */}
            {season.overview && (
              <p className="text-sm text-base-content/70 line-clamp-3 mt-2">
                {season.overview}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
