'use client';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { LikeButtonProps } from '@/app/type/movieCard';

/**
 * 喜欢按钮组件（客户端组件 - 需要交互）
 */
export default function LikeButton({ isLiked, movieId, onClick }: LikeButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(movieId);
  };

  return (
    <button
      onClick={handleClick}
      className={`btn btn-circle btn-sm ${
        isLiked ? 'btn-error' : 'btn-ghost'
      } backdrop-blur-sm bg-black/60 hover:bg-black/80 border-none hover:scale-110 transition-all duration-200`}
      aria-label={isLiked ? '取消喜欢' : '喜欢'}
    >
      {isLiked ? (
        <HeartSolidIcon className="w-4 h-4 text-white" />
      ) : (
        <HeartIcon className="w-4 h-4 text-white" />
      )}
    </button>
  );
}
