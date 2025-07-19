/**
 * 视频区域客户端组件
 * 在详情页面显示视频内容
 */

'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, FilmIcon } from '@heroicons/react/24/outline';
import type { VideoSectionProps, Video, GroupedVideos } from '@/app/type/video';
import { fetchMediaVideos } from '@/app/lib/api/videoActions';
import { isValidVideo, groupVideosByType, getMainTrailer } from '@/app/lib/utils/videoUtils';
import VideoPlayer from './VideoPlayer';
import VideoList from './VideoList';
import VideoModal from './VideoModal';
import ErrorBoundary, { ApiErrorFallback } from '@/app/components/common/ErrorBoundary';

interface VideoSectionClientProps extends VideoSectionProps {
  translations: {
    videos: string;
    mainTrailer: string;
    all: string;
    trailers: string;
    clips: string;
    behindTheScenes: string;
    featurettes: string;
    showMore: string;
    showLess: string;
    official: string;
    loadingError: string;
    retryLater: string;
  };
}

export default function VideoSectionClient({ mediaId, mediaType, mediaTitle, translations }: VideoSectionClientProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [groupedVideos, setGroupedVideos] = useState<GroupedVideos | null>(null);
  const [mainTrailer, setMainTrailer] = useState<Video | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  // 重试函数
  const retryLoadVideos = () => {
    setError(null);
    loadVideos();
  };

  // 获取视频数据
  const loadVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const videoData = await fetchMediaVideos(mediaId, mediaType);
      const validVideos = videoData.filter(isValidVideo);

      setVideos(validVideos);

      if (validVideos.length > 0) {
        const grouped = groupVideosByType(validVideos);
        setGroupedVideos(grouped);

        const trailer = getMainTrailer(validVideos);
        setMainTrailer(trailer);
      }
    } catch (err) {
      console.error('获取视频失败:', err);
      setError(translations.loadingError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [mediaId, mediaType, translations.loadingError]);

  // 处理视频点击
  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <FilmIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{translations.videos}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="aspect-video bg-base-200 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-video bg-base-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <FilmIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{translations.videos}</h2>
        </div>
        <ApiErrorFallback
          error={new Error(error)}
          resetError={retryLoadVideos}
          title={translations.loadingError}
          description="请检查网络连接后重试"
        />
      </div>
    );
  }

  // 没有视频
  if (videos.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <FilmIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{translations.videos}</h2>
        </div>
        <div className="text-center py-12">
          <FilmIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
          <p className="text-base-content/60">{translations.videos}</p>
        </div>
      </div>
    );
  }

  // 准备标签页数据
  const tabs = [
    { key: 'all', label: translations.all, count: videos.length },
    ...(groupedVideos?.trailers.length ? [{ key: 'trailers', label: translations.trailers, count: groupedVideos.trailers.length }] : []),
    ...(groupedVideos?.clips.length ? [{ key: 'clips', label: translations.clips, count: groupedVideos.clips.length }] : []),
    ...(groupedVideos?.behindTheScenes.length ? [{ key: 'behind', label: translations.behindTheScenes, count: groupedVideos.behindTheScenes.length }] : []),
    ...(groupedVideos?.featurettes.length ? [{ key: 'featurettes', label: translations.featurettes, count: groupedVideos.featurettes.length }] : [])
  ];

  // 获取当前标签页的视频
  const getCurrentVideos = () => {
    if (!groupedVideos) return videos;
    
    switch (activeTab) {
      case 'trailers':
        return [...groupedVideos.trailers, ...groupedVideos.teasers];
      case 'clips':
        return groupedVideos.clips;
      case 'behind':
        return groupedVideos.behindTheScenes;
      case 'featurettes':
        return groupedVideos.featurettes;
      default:
        return videos;
    }
  };

  const currentVideos = getCurrentVideos();

  return (
    <ErrorBoundary fallback={ApiErrorFallback}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="flex items-center gap-3 mb-6">
          <FilmIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{translations.videos}</h2>
          <span className="text-base-content/60">({videos.length})</span>
        </div>

        {/* 主要预告片 */}
        {mainTrailer && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{translations.mainTrailer}</h3>
            <div className="max-w-4xl">
              <ErrorBoundary>
                <VideoPlayer
                  video={mainTrailer}
                  className="w-full"
                />
              </ErrorBoundary>
            </div>
          </div>
        )}

        {/* 标签页导航 */}
        {tabs.length > 1 && (
          <div className="tabs tabs-bordered mb-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`tab ${activeTab === tab.key ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="ml-1 text-xs opacity-60">({tab.count})</span>
              </button>
            ))}
          </div>
        )}

        {/* 视频列表 */}
        <ErrorBoundary>
          <VideoList
            videos={currentVideos}
            title=""
            showType={activeTab === 'all'}
            onVideoClick={handleVideoClick}
            translations={{
              videos: translations.videos,
              showMore: translations.showMore,
              showLess: translations.showLess,
              official: translations.official
            }}
          />
        </ErrorBoundary>

        {/* 视频播放模态框 */}
        <ErrorBoundary>
          <VideoModal
            video={selectedVideo}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={`${mediaTitle} - ${translations.videos}`}
          />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
