/**
 * 电视剧详情操作组件
 * 包含播放、分享、收藏等操作按钮
 */

'use client';

import { useState } from 'react';
import {
  PlayIcon,
  ShareIcon,
  HeartIcon,
  BookmarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useRouter, usePathname } from 'next/navigation';
import {
  smartNavigateBack,
  getPageTypeFromPath,
  getBackButtonLabel,
  PageType
} from '@/app/lib/utils/navigationUtils';
import type { TvDetailActionsProps } from '@/app/type/tvDetail';
import TrailerButton from '../video/TrailerButton';

export default function TvDetailActions({ tvId, title }: TvDetailActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 获取当前页面类型和返回按钮标签
  const currentPageType = getPageTypeFromPath(pathname);
  const backButtonLabel = getBackButtonLabel(currentPageType);

  const handleBack = () => {
    smartNavigateBack(router, PageType.TV_DETAIL);
  };

  // 移除handlePlay函数，使用TrailerButton组件

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `查看电视剧《${title}》的详情`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('分享取消或失败');
      }
    } else {
      // 降级到复制链接
      try {
        await navigator.clipboard.writeText(window.location.href);
        // TODO: 显示复制成功提示
        console.log('链接已复制到剪贴板');
      } catch (error) {
        console.log('复制失败');
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: 实现喜欢功能的 API 调用
    console.log('切换喜欢状态:', tvId);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: 实现收藏功能的 API 调用
    console.log('切换收藏状态:', tvId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 p-4 z-50 lg:relative lg:border-none lg:bg-transparent lg:p-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
          {/* 返回按钮 */}
          <button
            onClick={handleBack}
            className="btn btn-ghost btn-circle lg:btn-md"
            aria-label={backButtonLabel}
            title={backButtonLabel}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          {/* 播放预告片按钮 */}
          <TrailerButton
            movieId={tvId}
            mediaType="tv"
            title={title}
            className="flex-1 lg:flex-none"
          />

          {/* 喜欢按钮 */}
          <button
            onClick={handleLike}
            className={`btn btn-circle ${isLiked ? 'btn-error' : 'btn-ghost'} transition-all duration-200`}
            aria-label={isLiked ? '取消喜欢' : '喜欢'}
          >
            {isLiked ? (
              <HeartSolidIcon className="w-5 h-5 text-white" />
            ) : (
              <HeartIcon className="w-5 h-5" />
            )}
          </button>

          {/* 收藏按钮 */}
          <button
            onClick={handleBookmark}
            className={`btn btn-circle ${isBookmarked ? 'btn-warning' : 'btn-ghost'} transition-all duration-200`}
            aria-label={isBookmarked ? '取消收藏' : '收藏'}
          >
            <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* 分享按钮 */}
          <button
            onClick={handleShare}
            className="btn btn-ghost btn-circle"
            aria-label="分享"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
