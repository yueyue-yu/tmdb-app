/**
 * 推荐卡片组件
 * 用于展示单个推荐项目的紧凑卡片
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, CalendarIcon } from '@heroicons/react/24/solid';
import type { RecommendationCardProps } from '@/app/type/recommendations';
import { MediaTypeEnum } from '@/app/type/movie';

/**
 * 获取图片URL
 */
function getImageUrl(path: string | null, size: string = 'w342'): string {
  if (!path) return '/images/no-poster.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * 获取详情页面链接
 */
function getDetailLink(id: number, mediaType: MediaTypeEnum): string {
  return `/detail/${mediaType}/${id}`;
}

/**
 * 获取年份
 */
function getYear(item: any, mediaType: MediaTypeEnum): number {
  const date = mediaType === MediaTypeEnum.Movie ? item.release_date : item.first_air_date;
  return date ? new Date(date).getFullYear() : 0;
}

/**
 * 获取标题
 */
function getTitle(item: any, mediaType: MediaTypeEnum): string {
  return mediaType === MediaTypeEnum.Movie ? item.title : item.name;
}

/**
 * 获取评分徽章样式
 */
function getRatingBadgeClass(rating: number): string {
  if (rating >= 8) return 'badge-success';
  if (rating >= 7) return 'badge-warning';
  if (rating >= 6) return 'badge-orange';
  return 'badge-error';
}

/**
 * 推荐卡片组件
 */
export default function RecommendationCard({
  item,
  mediaType,
  index,
  priority = false,
  className = ''
}: RecommendationCardProps) {
  const title = getTitle(item, mediaType);
  const year = getYear(item, mediaType);
  const posterUrl = getImageUrl(item.poster_path);
  const detailLink = getDetailLink(item.id, mediaType);
  const rating = Math.round(item.vote_average * 10) / 10;
  const ratingBadgeClass = getRatingBadgeClass(rating);

  return (
    <div className={`recommendation-card flex-shrink-0 ${className}`}>
      <Link 
        href={detailLink}
        className="block group"
      >
        <div className="bg-base-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          {/* 海报图片 */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={priority}
              sizes="(max-width: 768px) 150px, 200px"
            />
            
            {/* 评分徽章 */}
            {rating > 0 && (
              <div className="absolute top-2 right-2">
                <div className={`badge ${ratingBadgeClass} badge-sm gap-1`}>
                  <StarIcon className="w-3 h-3" />
                  {rating}
                </div>
              </div>
            )}

            {/* 悬停遮罩 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>

          {/* 内容信息 */}
          <div className="p-3">
            {/* 标题 */}
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* 年份和类型 */}
            <div className="flex items-center gap-2 text-xs text-base-content/60">
              {year > 0 && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{year}</span>
                </div>
              )}
              
              <div className="badge badge-outline badge-xs">
                {mediaType === MediaTypeEnum.Movie ? '电影' : '电视剧'}
              </div>
            </div>

            {/* 简介 */}
            {item.overview && (
              <p className="text-xs text-base-content/70 line-clamp-2 mt-2">
                {item.overview}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

/**
 * 推荐卡片骨架屏
 */
export function RecommendationCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`recommendation-card flex-shrink-0 ${className}`}>
      <div className="bg-base-100 rounded-lg shadow-md overflow-hidden animate-pulse">
        {/* 海报骨架 */}
        <div className="aspect-[2/3] bg-base-300" />
        
        {/* 内容骨架 */}
        <div className="p-3 space-y-2">
          <div className="h-4 bg-base-300 rounded w-3/4" />
          <div className="h-3 bg-base-300 rounded w-1/2" />
          <div className="h-3 bg-base-300 rounded w-full" />
          <div className="h-3 bg-base-300 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * 空状态卡片
 */
export function EmptyRecommendationCard({ 
  message = '暂无推荐内容',
  className = '' 
}: { 
  message?: string;
  className?: string;
}) {
  return (
    <div className={`recommendation-card flex-shrink-0 ${className}`}>
      <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
        <div className="aspect-[2/3] bg-base-200 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">📽️</div>
            <p className="text-sm text-base-content/60">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
