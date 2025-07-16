'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Movie } from '@/app/lib/api/types';
import {
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

interface MovieCardClientProps {
  movie: Movie;
  index: number;
  isLiked: boolean;
  onToggleLikeAction: (movieId: number) => void;
  posterUrl: string;
  year: number;
  popularityLevel: 'hot' | 'trending' | 'normal';
  ratingBadgeClass: string;
}

export default function MovieCardClient({ 
  movie, 
  index, 
  isLiked, 
  onToggleLikeAction,
  posterUrl,
  year,
  popularityLevel,
  ratingBadgeClass
}: MovieCardClientProps) {
  // 只保留必需的客户端状态
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group relative">
      {/* DaisyUI Card 容器 */}
      <div className="card card-compact bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 border border-base-300 hover:border-primary/50">
        
        {/* 海报容器 */}
        <figure className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
          <Image
            src={posterUrl}
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
          <div className={`badge ${ratingBadgeClass} badge-lg gap-1 absolute top-3 right-3 text-white font-bold shadow-lg`}>
            <StarSolidIcon className="w-3 h-3" />
            {movie.vote_average.toFixed(1)}
          </div>

          {/* DaisyUI 喜欢按钮 */}
          <div className="absolute bottom-3 right-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleLikeAction(movie.id);
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
              <div className="stat-value text-sm">{year}</div>
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
        </div>
      </div>
    </div>
  );
}
