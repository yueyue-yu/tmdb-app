/**
 * 电影相关工具函数
 */

import type { RatingBadgeClass } from '@/app/type/movieCard';

/**
 * 获取海报图片URL
 */
export const getPosterUrl = (posterPath: string | null): string => {
  if (!posterPath) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzY2NjY2NiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMzMzMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2JnKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBvcGFjaXR5PSIwLjgiPuaaguaXoOWbvueJhzwvdGV4dD48L3N2Zz4=';
  }
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

/**
 * 从日期字符串提取年份
 */
export const getYear = (dateString: string): number => {
  return new Date(dateString).getFullYear();
};

/**
 * 根据受欢迎程度获取等级
 */
export const getPopularityLevel = (popularity: number): 'hot' | 'trending' | 'normal' => {
  if (popularity > 100) return 'hot';
  if (popularity > 50) return 'trending';
  return 'normal';
};

/**
 * 根据评分获取徽章样式类
 */
export const getRatingBadgeClass = (rating: number): RatingBadgeClass => {
  if (rating >= 8) return 'badge-success';
  if (rating >= 7) return 'badge-warning';
  if (rating >= 6) return 'badge-orange';
  return 'badge-error';
};

/**
 * 格式化投票数为可读格式
 */
export const formatVoteCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

/**
 * 截断文本到指定长度
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
