/**
 * 视频列表组件
 * 显示视频列表，支持点击播放
 */

'use client';

import { useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/outline';
import type { VideoListProps, Video } from '@/app/type/video';
import { 
  getThumbnailUrl, 
  getVideoDisplayTitle, 
  getVideoTypeLabel,
  isValidVideo
} from '@/app/lib/utils/videoUtils';
import VideoModal from './VideoModal';

interface VideoListClientProps extends VideoListProps {
  translations: {
    videos: string;
    showMore: string;
    showLess: string;
    official: string;
  };
}

export default function VideoList({
  videos,
  title,
  showType = true,
  maxItems = 4,
  onVideoClick,
  translations
}: VideoListClientProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 筛选有效视频
  const validVideos = videos.filter(isValidVideo);

  // 限制显示数量
  const defaultMaxItems = maxItems || 4;
  const displayVideos = isExpanded ? validVideos : validVideos.slice(0, defaultMaxItems);
  const remainingVideos = validVideos.slice(defaultMaxItems);
  const hasMoreVideos = validVideos.length > defaultMaxItems;

  // 如果没有有效视频，不显示组件
  if (validVideos.length === 0) {
    return null;
  }

  // 处理视频点击
  const handleVideoClick = (video: Video) => {
    if (onVideoClick) {
      onVideoClick(video);
    } else {
      setSelectedVideo(video);
      setIsModalOpen(true);
    }
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{title || translations.videos}</h3>
        <span className="text-base-content/60 text-sm">
          {validVideos.length} {translations.videos}
        </span>
      </div>

      {/* 视频网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayVideos.map((video, index) => (
          <VideoCard
            key={`${video.id}-${index}`}
            video={video}
            showType={showType}
            onClick={handleVideoClick}
            translations={translations}
          />
        ))}
      </div>

      {/* 展开/折叠按钮 */}
      {hasMoreVideos && (
        <div className="text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-outline btn-sm gap-2"
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {translations.showLess}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {translations.showMore} ({remainingVideos.length})
              </>
            )}
          </button>
        </div>
      )}

      {/* 视频播放模态框 */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

/**
 * 视频卡片组件
 */
interface VideoCardProps {
  video: Video;
  showType?: boolean;
  onClick: (video: Video) => void;
  translations: {
    official: string;
  };
}

function VideoCard({ video, showType = true, onClick, translations }: VideoCardProps) {
  const thumbnailUrl = getThumbnailUrl(video, 'medium');
  const videoTitle = getVideoDisplayTitle(video, 40);
  const videoType = getVideoTypeLabel(video.type);

  return (
    <div 
      className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(video)}
    >
      <figure className="relative aspect-video overflow-hidden">
        {/* 缩略图 */}
        <img
          src={thumbnailUrl}
          alt={videoTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* 播放按钮覆盖层 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="btn btn-circle btn-lg bg-primary/20 backdrop-blur-md border-primary/30">
              <PlayIcon className="w-6 h-6 text-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* 视频类型标签 */}
        {showType && (
          <div className="absolute top-2 left-2">
            <span className="badge badge-primary badge-sm">{videoType}</span>
          </div>
        )}

        {/* 官方标识 */}
        {video.official && (
          <div className="absolute top-2 right-2">
            <span className="badge badge-success badge-sm">{translations.official}</span>
          </div>
        )}

        {/* 时长标识（如果有的话） */}
        <div className="absolute bottom-2 right-2">
          <span className="badge badge-neutral badge-sm bg-black/60 text-white border-none">
            {video.site}
          </span>
        </div>
      </figure>

      <div className="card-body p-3">
        <h4 className="card-title text-sm line-clamp-2 leading-tight">
          {videoTitle}
        </h4>
        
        <div className="flex items-center justify-between text-xs text-base-content/60 mt-1">
          <span>{videoType}</span>
          {video.published_at && (
            <span>
              {new Date(video.published_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short'
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
