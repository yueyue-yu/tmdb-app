/**
 * 视频相关类型定义
 */

/**
 * 视频类型枚举
 */
export enum VideoType {
  TRAILER = 'Trailer',
  TEASER = 'Teaser',
  CLIP = 'Clip',
  BEHIND_THE_SCENES = 'Behind the Scenes',
  BLOOPERS = 'Bloopers',
  FEATURETTE = 'Featurette',
  OPENING_CREDITS = 'Opening Credits',
  RECAP = 'Recap'
}

/**
 * 视频网站枚举
 */
export enum VideoSite {
  YOUTUBE = 'YouTube',
  VIMEO = 'Vimeo'
}

/**
 * 视频数据接口
 */
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: VideoSite;
  size: number;
  type: VideoType;
  official: boolean;
  published_at: string;
}

/**
 * 视频响应接口
 */
export interface VideoResponse {
  id: number;
  results: Video[];
}

/**
 * 视频播放器组件属性
 */
export interface VideoPlayerProps {
  video: Video;
  autoplay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * 视频模态框组件属性
 */
export interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

/**
 * 视频列表组件属性
 */
export interface VideoListProps {
  videos: Video[];
  title?: string;
  showType?: boolean;
  maxItems?: number;
  onVideoClick?: (video: Video) => void;
}

/**
 * 视频区域组件属性
 */
export interface VideoSectionProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
}

/**
 * 视频卡片组件属性
 */
export interface VideoCardProps {
  video: Video;
  onClick?: (video: Video) => void;
  showType?: boolean;
  className?: string;
}

/**
 * 视频缩略图组件属性
 */
export interface VideoThumbnailProps {
  video: Video;
  size?: 'small' | 'medium' | 'large';
  showPlayIcon?: boolean;
  className?: string;
}

/**
 * 视频播放按钮组件属性
 */
export interface VideoPlayButtonProps {
  video: Video;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  onClick?: (video: Video) => void;
}

/**
 * 视频工具函数类型
 */
export interface VideoUtils {
  getVideoUrl: (video: Video) => string;
  getThumbnailUrl: (video: Video, quality?: 'default' | 'medium' | 'high' | 'standard' | 'maxres') => string;
  getEmbedUrl: (video: Video, autoplay?: boolean) => string;
  isYouTube: (video: Video) => boolean;
  isVimeo: (video: Video) => boolean;
  formatDuration: (seconds: number) => string;
  getVideoTypeLabel: (type: VideoType) => string;
}

/**
 * 视频筛选选项
 */
export interface VideoFilterOptions {
  type?: VideoType[];
  site?: VideoSite[];
  official?: boolean;
  language?: string;
  limit?: number;
}

/**
 * 视频排序选项
 */
export enum VideoSortBy {
  PUBLISHED_DATE = 'published_date',
  NAME = 'name',
  TYPE = 'type',
  OFFICIAL = 'official'
}

/**
 * 视频排序方向
 */
export enum VideoSortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * 视频排序配置
 */
export interface VideoSortConfig {
  sortBy: VideoSortBy;
  order: VideoSortOrder;
}

/**
 * 处理后的视频数据（按类型分组）
 */
export interface GroupedVideos {
  trailers: Video[];
  teasers: Video[];
  clips: Video[];
  behindTheScenes: Video[];
  bloopers: Video[];
  featurettes: Video[];
  others: Video[];
}

/**
 * 视频统计信息
 */
export interface VideoStats {
  total: number;
  byType: Record<VideoType, number>;
  bySite: Record<VideoSite, number>;
  official: number;
  unofficial: number;
}

/**
 * 视频加载状态
 */
export interface VideoLoadingState {
  isLoading: boolean;
  error: string | null;
  videos: Video[];
  hasMore: boolean;
}

/**
 * 视频播放状态
 */
export interface VideoPlayState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  fullscreen: boolean;
}
