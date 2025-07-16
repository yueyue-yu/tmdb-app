'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MoviePosterProps } from '@/app/type/movieCard';
import { IMAGE_SIZES } from '@/app/constant/movieCard';
import PopularityBadge from './PopularityBadge';
import RatingBadge from './RatingBadge';
import LikeButton from './LikeButton';
import PlayButton from './PlayButton';

/**
 * 电影海报组件（客户端组件 - 仅因为需要图片加载状态）
 */
export default function MoviePoster({ 
  movie, 
  posterUrl, 
  popularityLevel, 
  ratingBadgeClass, 
  priority = false 
}: MoviePosterProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (movieId: number) => {
    setIsLiked(!isLiked);
    // TODO: 实现喜欢功能的 API 调用
    console.log('切换喜欢状态', movieId);
  };

  return (
    <figure className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
      <Image
        src={posterUrl}
        alt={movie.title}
        fill
        priority={priority}
        className={`object-cover transition-all duration-700 ${
          imageLoaded 
            ? 'scale-100 opacity-100 blur-0' 
            : 'scale-110 opacity-0 blur-sm'
        } group-hover:scale-110`}
        sizes={IMAGE_SIZES.CARD_POSTER}
        onLoad={() => setImageLoaded(true)}
      />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* 受欢迎程度徽章 */}
      <PopularityBadge level={popularityLevel} />

      {/* 评分徽章 */}
      <RatingBadge rating={movie.vote_average} badgeClass={ratingBadgeClass} />

      {/* 喜欢按钮 */}
      <div className="absolute bottom-3 right-3">
        <LikeButton 
          isLiked={isLiked} 
          movieId={movie.id} 
          onClick={handleLike} 
        />
      </div>

      {/* 播放按钮 */}
      <PlayButton movieId={movie.id} />
    </figure>
  );
}
