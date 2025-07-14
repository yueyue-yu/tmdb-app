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
  ClockIcon
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

  // 获取评分样式
  const getRatingStyle = (rating: number) => {
    if (rating >= 8) return 'from-emerald-500 to-green-600';
    if (rating >= 7) return 'from-amber-400 to-orange-500';
    if (rating >= 6) return 'from-orange-400 to-red-500';
    return 'from-red-500 to-pink-600';
  };

  const popularity = movie.popularity || 0;
  const popularityLevel = getPopularityLevel(popularity);

  return (
    <div className="group relative">
      {/* 主卡片容器 */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
        
        {/* 海报容器 */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
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
          
          {/* 流行度指示器 */}
          {popularityLevel === 'hot' && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              <FireIcon className="w-3 h-3" />
              HOT
            </div>
          )}
          
          {popularityLevel === 'trending' && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              <FireIcon className="w-3 h-3" />
              TRENDING
            </div>
          )}

          {/* 评分徽章 */}
          <div className={`absolute top-3 right-3 bg-gradient-to-r ${getRatingStyle(movie.vote_average)} text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-lg`}>
            <StarSolidIcon className="w-3 h-3" />
            <span className="text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
          </div>

          {/* 喜欢按钮 */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleLike(movie.id);
            }}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all duration-200 hover:scale-110"
          >
            {isLiked ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-white" />
            )}
          </button>

          {/* 悬停时的播放按钮 */}
          <Link
            href={`/app/home/movies/${movie.id}`}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 hover:bg-white/30 transition-colors duration-200">
              <div className="w-8 h-8 border-l-8 border-l-white border-y-4 border-y-transparent border-r-0 ml-1" />
            </div>
          </Link>
        </div>

        {/* 内容区域 */}
        <div className="p-4 space-y-3">
          {/* 标题 */}
          <Link href={`/app/home/movies/${movie.id}`}>
            <h3 className="font-bold text-base leading-tight text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 cursor-pointer">
              {movie.title}
            </h3>
          </Link>

          {/* 年份和投票数 */}
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{getYear(movie.release_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>{(movie.vote_count / 1000).toFixed(1)}k</span>
            </div>
          </div>

          {/* 简介 */}
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {movie.overview || '这部电影暂时还没有详细的介绍信息...'}
          </p>

          {/* 底部操作栏 */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <Link
              href={`/app/home/movies/${movie.id}`}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 text-center"
            >
              查看详情
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
