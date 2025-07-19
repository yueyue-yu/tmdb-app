/**
 * 预告片播放按钮组件
 * 用于在电影卡片中播放预告片
 */

'use client';

import { useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/outline';
import { Video } from '@/app/type/video';
import { fetchMediaVideos } from '@/app/lib/api/videoActions';
import { getMainTrailer } from '@/app/lib/utils/videoUtils';
import VideoModal from './VideoModal';

interface TrailerButtonProps {
  movieId: number;
  mediaType: 'movie' | 'tv';
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TrailerButton({ 
  movieId, 
  mediaType, 
  title,
  className = '',
  size = 'sm'
}: TrailerButtonProps) {
  const [mainTrailer, setMainTrailer] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (mainTrailer) {
      setIsModalOpen(true);
      return;
    }

    if (hasSearched && !mainTrailer) {
      // 如果已经搜索过但没有预告片，不做任何操作
      return;
    }

    try {
      setIsLoading(true);
      const videos = await fetchMediaVideos(movieId, mediaType);
      const trailer = getMainTrailer(videos);

      setHasSearched(true);

      if (trailer) {
        setMainTrailer(trailer);
        setIsModalOpen(true);
      } else {
        setMainTrailer(null);
      }
    } catch (error) {
      console.error('获取预告片失败:', error);
      setHasSearched(true);
      setMainTrailer(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 根据尺寸设置样式
  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'btn-lg gap-3';
      case 'md':
        return 'btn-md gap-2';
      case 'sm':
      default:
        return 'btn-sm gap-2';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'lg':
        return 'w-6 h-6';
      case 'md':
        return 'w-5 h-5';
      case 'sm':
      default:
        return 'w-4 h-4';
    }
  };

  // 如果已经搜索过但没有预告片，不显示按钮
  if (hasSearched && !mainTrailer) {
    return null;
  }

  return (
    <>
      <button
        onClick={handlePlay}
        disabled={isLoading}
        className={`btn btn-primary ${getSizeClasses()} ${className}`}
        aria-label="播放预告片"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <PlayIcon className={getIconSize()} />
        )}
        预告片
      </button>

      {/* 视频播放模态框 */}
      <VideoModal
        video={mainTrailer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={title}
      />
    </>
  );
}
