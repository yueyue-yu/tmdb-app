/**
 * 视频工具函数
 * 处理视频URL、缩略图、嵌入等功能
 */

import {
  Video,
  VideoType,
  VideoSite,
  GroupedVideos,
  VideoFilterOptions,
  VideoSortConfig,
  VideoSortBy,
  VideoSortOrder
} from '@/app/type/video';

/**
 * 获取视频观看URL
 * @param video 视频对象
 * @returns 视频URL
 */
export function getVideoUrl(video: Video): string {
  if (!video || !video.site) {
    return '';
  }

  switch (video.site) {
    case VideoSite.YOUTUBE:
      return `https://www.youtube.com/watch?v=${video.key}`;
    case VideoSite.VIMEO:
      return `https://vimeo.com/${video.key}`;
    default:
      return '';
  }
}

/**
 * 获取视频缩略图URL
 * @param video 视频对象
 * @param quality 缩略图质量
 * @returns 缩略图URL
 */
export function getThumbnailUrl(
  video: Video,
  quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'
): string {
  if (!video || !video.site) {
    return '';
  }

  switch (video.site) {
    case VideoSite.YOUTUBE:
      const qualityMap = {
        'default': 'default',
        'medium': 'mqdefault',
        'high': 'hqdefault',
        'standard': 'sddefault',
        'maxres': 'maxresdefault'
      };
      return `https://img.youtube.com/vi/${video.key}/${qualityMap[quality]}.jpg`;
    case VideoSite.VIMEO:
      // Vimeo缩略图需要额外的API调用，这里返回占位符
      return `https://vumbnail.com/${video.key}.jpg`;
    default:
      return '';
  }
}

/**
 * 获取视频嵌入URL
 * @param video 视频对象
 * @param autoplay 是否自动播放
 * @param controls 是否显示控制条
 * @returns 嵌入URL
 */
export function getEmbedUrl(
  video: Video,
  autoplay: boolean = false,
  controls: boolean = true
): string {
  if (!video || !video.site) {
    return '';
  }

  switch (video.site) {
    case VideoSite.YOUTUBE:
      const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        controls: controls ? '1' : '0',
        rel: '0', // 不显示相关视频
        modestbranding: '1', // 简化品牌
        fs: '1', // 允许全屏
        cc_load_policy: '1', // 显示字幕
        iv_load_policy: '3', // 不显示注释
        autohide: '1' // 自动隐藏控制条
      });
      return `https://www.youtube.com/embed/${video.key}?${params.toString()}`;
    case VideoSite.VIMEO:
      const vimeoParams = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        controls: controls ? '1' : '0',
        loop: '0',
        muted: autoplay ? '1' : '0', // 自动播放时静音
        title: '0', // 不显示标题
        byline: '0', // 不显示作者
        portrait: '0' // 不显示头像
      });
      return `https://player.vimeo.com/video/${video.key}?${vimeoParams.toString()}`;
    default:
      return '';
  }
}

/**
 * 检查是否为YouTube视频
 * @param video 视频对象
 * @returns 是否为YouTube
 */
export function isYouTube(video: Video): boolean {
  return video.site === VideoSite.YOUTUBE;
}

/**
 * 检查是否为Vimeo视频
 * @param video 视频对象
 * @returns 是否为Vimeo
 */
export function isVimeo(video: Video): boolean {
  return video.site === VideoSite.VIMEO;
}

/**
 * 格式化时长
 * @param seconds 秒数
 * @returns 格式化的时长字符串
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

/**
 * 获取视频类型的中文标签
 * @param type 视频类型
 * @returns 中文标签
 */
export function getVideoTypeLabel(type: VideoType): string {
  const typeLabels: Record<VideoType, string> = {
    [VideoType.TRAILER]: '预告片',
    [VideoType.TEASER]: '预告',
    [VideoType.CLIP]: '片段',
    [VideoType.BEHIND_THE_SCENES]: '幕后花絮',
    [VideoType.BLOOPERS]: '花絮',
    [VideoType.FEATURETTE]: '特辑',
    [VideoType.OPENING_CREDITS]: '片头',
    [VideoType.RECAP]: '回顾'
  };

  return typeLabels[type] || type;
}

/**
 * 获取视频网站的图标类名
 * @param site 视频网站
 * @returns 图标类名
 */
export function getVideoSiteIcon(site: VideoSite): string {
  switch (site) {
    case VideoSite.YOUTUBE:
      return 'fab fa-youtube';
    case VideoSite.VIMEO:
      return 'fab fa-vimeo';
    default:
      return 'fas fa-play';
  }
}

/**
 * 获取视频网站的颜色
 * @param site 视频网站
 * @returns 颜色类名
 */
export function getVideoSiteColor(site: VideoSite): string {
  switch (site) {
    case VideoSite.YOUTUBE:
      return 'text-red-600';
    case VideoSite.VIMEO:
      return 'text-blue-500';
    default:
      return 'text-gray-600';
  }
}

/**
 * 验证视频URL是否有效
 * @param video 视频对象
 * @returns 是否有效
 */
export function isValidVideo(video: Video): boolean {
  return !!(video.key && video.site && (isYouTube(video) || isVimeo(video)));
}

/**
 * 获取视频的显示标题
 * @param video 视频对象
 * @param maxLength 最大长度
 * @returns 显示标题
 */
export function getVideoDisplayTitle(video: Video, maxLength: number = 50): string {
  if (!video || !video.name) {
    return video ? getVideoTypeLabel(video.type) : '';
  }

  if (video.name.length <= maxLength) {
    return video.name;
  }

  return video.name.substring(0, maxLength - 3) + '...';
}

/**
 * 获取视频的发布日期格式化字符串
 * @param video 视频对象
 * @returns 格式化的日期字符串
 */
export function getVideoPublishedDate(video: Video): string {
  if (!video.published_at) {
    return '';
  }

  const date = new Date(video.published_at);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 生成视频分享URL
 * @param video 视频对象
 * @returns 分享URL
 */
export function getVideoShareUrl(video: Video): string {
  switch (video.site) {
    case VideoSite.YOUTUBE:
      return `https://youtu.be/${video.key}`;
    case VideoSite.VIMEO:
      return `https://vimeo.com/${video.key}`;
    default:
      return getVideoUrl(video);
  }
}

/**
 * 检查视频是否支持嵌入播放
 * @param video 视频对象
 * @returns 是否支持嵌入
 */
export function supportsEmbed(video: Video): boolean {
  return isYouTube(video) || isVimeo(video);
}

/**
 * 获取视频的响应式嵌入尺寸
 * @param aspectRatio 宽高比，默认16:9
 * @returns 响应式样式对象
 */
export function getResponsiveVideoSize(aspectRatio: string = '16:9'): { paddingBottom: string } {
  const [width, height] = aspectRatio.split(':').map(Number);
  const percentage = (height / width) * 100;
  
  return {
    paddingBottom: `${percentage}%`
  };
}

/**
 * 创建视频播放器配置
 * @param video 视频对象
 * @param options 播放选项
 * @returns 播放器配置
 */
export function createPlayerConfig(
  video: Video,
  options: {
    autoplay?: boolean;
    controls?: boolean;
    muted?: boolean;
    loop?: boolean;
  } = {}
) {
  const {
    autoplay = false,
    controls = true,
    muted = false,
    loop = false
  } = options;

  return {
    url: getVideoUrl(video),
    embedUrl: getEmbedUrl(video, autoplay, controls),
    thumbnail: getThumbnailUrl(video, 'high'),
    config: {
      autoplay,
      controls,
      muted,
      loop,
      responsive: true,
      aspectRatio: '16:9'
    }
  };
}

/**
 * 筛选视频
 * @param videos 视频数组
 * @param options 筛选选项
 * @returns 筛选后的视频
 */
export function filterVideos(videos: Video[], options: VideoFilterOptions = {}): Video[] {
  let filtered = [...videos];

  // 按类型筛选
  if (options.type && options.type.length > 0) {
    filtered = filtered.filter(video => options.type!.includes(video.type));
  }

  // 按网站筛选
  if (options.site && options.site.length > 0) {
    filtered = filtered.filter(video => options.site!.includes(video.site));
  }

  // 按官方状态筛选
  if (options.official !== undefined) {
    filtered = filtered.filter(video => video.official === options.official);
  }

  // 按语言筛选
  if (options.language) {
    filtered = filtered.filter(video => video.iso_639_1 === options.language);
  }

  // 限制数量
  if (options.limit && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

/**
 * 排序视频
 * @param videos 视频数组
 * @param config 排序配置
 * @returns 排序后的视频
 */
export function sortVideos(videos: Video[], config: VideoSortConfig): Video[] {
  const sorted = [...videos];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (config.sortBy) {
      case VideoSortBy.PUBLISHED_DATE:
        comparison = new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        break;
      case VideoSortBy.NAME:
        comparison = a.name.localeCompare(b.name);
        break;
      case VideoSortBy.TYPE:
        comparison = a.type.localeCompare(b.type);
        break;
      case VideoSortBy.OFFICIAL:
        comparison = (a.official ? 1 : 0) - (b.official ? 1 : 0);
        break;
      default:
        comparison = 0;
    }

    return config.order === VideoSortOrder.DESC ? -comparison : comparison;
  });

  return sorted;
}

/**
 * 按类型分组视频
 * @param videos 视频数组
 * @returns 分组后的视频
 */
export function groupVideosByType(videos: Video[]): GroupedVideos {
  const grouped: GroupedVideos = {
    trailers: [],
    teasers: [],
    clips: [],
    behindTheScenes: [],
    bloopers: [],
    featurettes: [],
    others: []
  };

  videos.forEach(video => {
    switch (video.type) {
      case VideoType.TRAILER:
        grouped.trailers.push(video);
        break;
      case VideoType.TEASER:
        grouped.teasers.push(video);
        break;
      case VideoType.CLIP:
        grouped.clips.push(video);
        break;
      case VideoType.BEHIND_THE_SCENES:
        grouped.behindTheScenes.push(video);
        break;
      case VideoType.BLOOPERS:
        grouped.bloopers.push(video);
        break;
      case VideoType.FEATURETTE:
        grouped.featurettes.push(video);
        break;
      default:
        grouped.others.push(video);
    }
  });

  return grouped;
}

/**
 * 获取主要预告片（优先官方、最新的预告片）
 * @param videos 视频数组
 * @returns 主要预告片或null
 */
export function getMainTrailer(videos: Video[]): Video | null {
  // 筛选预告片
  const trailers = videos.filter(video =>
    video.type === VideoType.TRAILER || video.type === VideoType.TEASER
  );

  if (trailers.length === 0) {
    return null;
  }

  // 优先选择官方预告片
  const officialTrailers = trailers.filter(video => video.official);
  const targetTrailers = officialTrailers.length > 0 ? officialTrailers : trailers;

  // 按发布日期排序，选择最新的
  const sortedTrailers = sortVideos(targetTrailers, {
    sortBy: VideoSortBy.PUBLISHED_DATE,
    order: VideoSortOrder.DESC
  });

  return sortedTrailers[0];
}
