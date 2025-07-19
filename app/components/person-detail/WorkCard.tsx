/**
 * 作品卡片组件
 * 显示人员参与的电影或电视剧作品
 */

import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import type { WorkCardProps } from '@/app/type/personDetail';

// 获取海报URL
function getPosterUrl(posterPath: string | null): string {
  if (!posterPath) {
    return '/images/no-poster.jpg'; // 默认海报
  }
  return `https://image.tmdb.org/t/p/w300${posterPath}`;
}

// 获取年份
function getYear(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
}

export default function WorkCard({ work, type, role }: WorkCardProps) {
  const posterUrl = getPosterUrl(work.poster_path);
  const isMovie = type === 'movie';
  const isActor = role === 'cast';
  
  // 获取标题和日期
  const title = isMovie ? (work as any).title : (work as any).name;
  const date = isMovie ? (work as any).release_date : (work as any).first_air_date;
  const year = getYear(date);
  
  // 获取角色或职位信息
  const roleInfo = isActor 
    ? (work.character || '未知角色')
    : (work.job || '未知职位');
  
  // 生成详情页面链接
  const detailPath = isMovie
    ? `/detail/movie/${work.id}`
    : `/detail/tv/${work.id}`;

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 group">
      <Link href={detailPath} className="block">
        <figure className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
          
          {/* 评分徽章 */}
          {work.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <StarIcon className="w-3 h-3 text-yellow-400" />
              <span>{work.vote_average.toFixed(1)}</span>
            </div>
          )}
          
          {/* 悬停遮罩 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
        </figure>
        
        <div className="card-body p-3">
          {/* 标题 */}
          <h3 className="card-title text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* 年份 */}
          {year && (
            <div className="flex items-center gap-1 text-xs text-base-content/60">
              <CalendarIcon className="w-3 h-3" />
              <span>{year}</span>
            </div>
          )}
          
          {/* 角色/职位 */}
          <p className="text-xs text-base-content/70 line-clamp-2 mt-1">
            {isActor ? `饰演 ${roleInfo}` : roleInfo}
          </p>
          
          {/* 额外信息 */}
          <div className="mt-2">
            {/* 电视剧集数 */}
            {!isMovie && (work as any).episode_count && (
              <div className="text-xs text-base-content/50">
                {(work as any).episode_count} 集
              </div>
            )}
            
            {/* 制作部门 */}
            {!isActor && work.department && (
              <div className="mt-1">
                <span className="badge badge-outline badge-xs">
                  {work.department}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
