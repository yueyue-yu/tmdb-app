/**
 * 视频播放器组件
 * 支持YouTube和Vimeo视频的嵌入播放
 */

'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { VideoPlayerProps } from '@/app/type/video';
import { 
  getEmbedUrl, 
  getThumbnailUrl, 
  isValidVideo,
  getVideoDisplayTitle,
  getVideoTypeLabel,
  supportsEmbed
} from '@/app/lib/utils/videoUtils';

export default function VideoPlayer({ 
  video, 
  autoplay = false, 
  controls = true,
  width = '100%',
  height = 'auto',
  className = ''
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 验证视频是否有效
  useEffect(() => {
    if (!isValidVideo(video)) {
      setError('不支持的视频格式');
    } else if (!supportsEmbed(video)) {
      setError('该视频不支持嵌入播放');
    } else {
      setError(null);
    }
  }, [video]);

  // 处理播放按钮点击
  const handlePlay = () => {
    if (error) return;
    
    setIsLoading(true);
    setIsPlaying(true);
    
    // 模拟加载延迟
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // 处理停止播放
  const handleStop = () => {
    setIsPlaying(false);
    setIsLoading(false);
  };

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className={`relative bg-base-200 rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="text-error text-lg mb-2">⚠️</div>
            <p className="text-base-content/60">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 获取视频信息
  const embedUrl = getEmbedUrl(video, autoplay, controls);
  const thumbnailUrl = getThumbnailUrl(video, 'high');
  const videoTitle = getVideoDisplayTitle(video);
  const videoType = getVideoTypeLabel(video.type);

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      style={{ width, height: height === 'auto' ? undefined : height }}
    >
      {!isPlaying ? (
        // 视频缩略图和播放按钮
        <div className="relative aspect-video group cursor-pointer" onClick={handlePlay}>
          {/* 缩略图 */}
          <img
            src={thumbnailUrl}
            alt={videoTitle}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* 播放按钮 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="btn btn-circle btn-lg bg-primary/20 backdrop-blur-md border-primary/30 hover:bg-primary/40 transition-all duration-300 group-hover:scale-110"
              aria-label={`播放${videoType}`}
            >
              <PlayIcon className="w-8 h-8 text-white ml-1" />
            </button>
          </div>
          
          {/* 视频信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">{videoTitle}</h3>
              <p className="text-white/80 text-sm">{videoType}</p>
            </div>
          </div>
          
          {/* 视频类型标签 */}
          <div className="absolute top-4 left-4">
            <span className="badge badge-primary badge-sm">{videoType}</span>
          </div>
          
          {/* 官方标识 */}
          {video.official && (
            <div className="absolute top-4 right-4">
              <span className="badge badge-success badge-sm">官方</span>
            </div>
          )}
        </div>
      ) : (
        // 视频播放器
        <div className="relative aspect-video">
          {/* 加载状态 */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          )}
          
          {/* 关闭按钮 */}
          <button
            onClick={handleStop}
            className="absolute top-4 right-4 z-20 btn btn-circle btn-sm bg-black/50 border-none text-white hover:bg-black/70"
            aria-label="关闭视频"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          
          {/* 嵌入式播放器 */}
          <iframe
            src={embedUrl}
            title={videoTitle}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
