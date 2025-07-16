'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Movie } from '../../api/types';
import {
  StarIcon,
  HeartIcon,
  EyeIcon,
  FireIcon,
  ClockIcon,
  PlayIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import './line-clamp.css';

interface MovieCardProps {
  movie: Movie;
  index: number;
  isLiked: boolean;
  onToggleLike: (movieId: number) => void;
}

export default function MovieCard({ movie, index, isLiked, onToggleLike }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // 获取海报URL
  const getPosterUrl = (posterPath: string | null) => {
    if (!posterPath) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2NjY2NiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMzMzMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2JnKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBvcGFjaXR5PSIwLjgiPuaaguaXoOWbvueJhzwvdGV4dD48L3N2Zz4=';
    }
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  // 格式化年份
  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  // 获取流行度等级
  const getPopularityLevel = (popularity: number) => {
    if (popularity > 100) return 'hot';
    if (popularity > 50) return 'trending';
    return 'normal';
  };

  // 获取评分颜色类
  const getRatingBadgeClass = (rating: number) => {
    if (rating >= 8) return 'badge-success';
    if (rating >= 7) return 'badge-warning';
    if (rating >= 6) return 'badge-orange';
    return 'badge-error';
  };

  const popularity = movie.popularity || 0;
  const popularityLevel = getPopularityLevel(popularity);

  return (
    <div className="group relative">
      {/* DaisyUI Card 容器 */}
      <div className="card card-compact bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 border border-base-300 hover:border-primary/50">
        
        {/* 海报容器 */}
        <figure className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
          <Image
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            priority={index < 8}
            className={`object-cover transition-all duration-700 ${
              imageLoaded 
                ? 'scale-100 opacity-100 blur-0' 
                : 'scale-110 opacity-0 blur-sm'
            } group-hover:scale-110`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* DaisyUI 流行度徽章 */}
          {popularityLevel === 'hot' && (
            <div className="badge badge-error badge-lg gap-1 absolute top-3 left-3 text-white font-bold">
              <FireIcon className="w-3 h-3" />
              HOT
            </div>
          )}
          
          {popularityLevel === 'trending' && (
            <div className="badge badge-secondary badge-lg gap-1 absolute top-3 left-3 text-white font-bold">
              <FireIcon className="w-3 h-3" />
              TRENDING
            </div>
          )}

          {/* DaisyUI 评分徽章 */}
          <div className={`badge ${getRatingBadgeClass(movie.vote_average)} badge-lg gap-1 absolute top-3 right-3 text-white font-bold shadow-lg`}>
            <StarSolidIcon className="w-3 h-3" />
            {movie.vote_average.toFixed(1)}
          </div>

          {/* DaisyUI 喜欢按钮 */}
          <div className="absolute bottom-3 right-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleLike(movie.id);
              }}
              className={`btn btn-circle btn-sm ${
                isLiked ? 'btn-error' : 'btn-ghost'
              } backdrop-blur-sm bg-black/60 hover:bg-black/80 border-none hover:scale-110 transition-all duration-200`}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-4 h-4 text-white" />
              ) : (
                <HeartIcon className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          {/* DaisyUI 悬停播放按钮 */}
          <Link
            href={`/app/home/movies/${movie.id}`}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <button className="btn btn-circle btn-lg btn-primary bg-primary/20 backdrop-blur-md border-primary/30 hover:bg-primary/30">
              <PlayIcon className="w-8 h-8 text-white ml-1" />
            </button>
          </Link>
        </figure>

        {/* DaisyUI Card Body */}
        <div className="card-body p-4 space-y-3">
          {/* 标题 */}
          <Link href={`/app/home/movies/${movie.id}`}>
            <h2 className="card-title text-base leading-tight hover:text-primary transition-colors duration-200 line-clamp-2 cursor-pointer">
              {movie.title}
            </h2>
          </Link>

          {/* DaisyUI Stats */}
          <div className="stats stats-horizontal shadow-sm bg-base-100/50">
            <div className="stat py-2 px-3">
              <div className="stat-figure text-primary">
                <ClockIcon className="w-4 h-4" />
              </div>
              <div className="stat-value text-sm">{getYear(movie.release_date)}</div>
              <div className="stat-desc text-xs">年份</div>
            </div>
            
            <div className="stat py-2 px-3">
              <div className="stat-figure text-secondary">
                <EyeIcon className="w-4 h-4" />
              </div>
              <div className="stat-value text-sm">{(movie.vote_count / 1000).toFixed(1)}k</div>
              <div className="stat-desc text-xs">观看</div>
            </div>
          </div>

          {/* 简介 */}
          <p className="text-sm text-base-content/70 line-clamp-3 leading-relaxed">
            {movie.overview || '这部电影暂时还没有详细的介绍信息...'}
          </p>

          {/* DaisyUI Card Actions */}
          <div className="card-actions justify-between items-center pt-2">
            <Link
              href={`/app/home/movies/${movie.id}`}
              className="btn btn-primary btn-sm flex-1 gap-2"
            >
              <InformationCircleIcon className="w-4 h-4" />
              查看详情
            </Link>
            
            {/* DaisyUI Dropdown 菜单 */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 text-sm">
                <li><a>分享</a></li>
                <li><a>收藏</a></li>
                <li><a>举报</a></li>
              </ul>
            </div>
          </div>

          {/* DaisyUI Progress Bar (评分可视化) */}
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>评分</span>
              <span className="font-medium">{movie.vote_average}/10</span>
            </div>
            <progress 
              className={`progress ${getRatingBadgeClass(movie.vote_average).replace('badge-', 'progress-')} progress-xs w-full`}
              value={movie.vote_average} 
              max="10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
