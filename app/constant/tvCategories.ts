/**
 * 电视剧分类配置常量
 */

import { 
  FireIcon, 
  TrophyIcon, 
  SignalIcon, 
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';
import type { TvCategory } from '@/app/lib/api/tvActions';

export interface TvCategoryConfig {
  key: TvCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export const DEFAULT_CATEGORY = 'popular';

export const TV_CATEGORIES: TvCategoryConfig[] = [
  {
    key: 'popular',
    label: '热门电视剧',
    icon: FireIcon,
    description: '当前最受欢迎的电视剧',
    color: 'text-red-500',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-orange-500'
  },
  {
    key: 'top-rated',
    label: '高分电视剧',
    icon: TrophyIcon,
    description: '评分最高的电视剧',
    color: 'text-yellow-500',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-amber-500'
  },
  {
    key: 'on-the-air',
    label: '正在播出',
    icon: SignalIcon,
    description: '目前正在播出的电视剧',
    color: 'text-green-500',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500'
  },
  {
    key: 'airing-today',
    label: '今日播出',
    icon: CalendarDaysIcon,
    description: '今天播出的电视剧',
    color: 'text-blue-500',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500'
  }
];

/**
 * 根据分类key获取配置信息
 * @param category 电视剧分类
 * @returns 分类配置
 */
export function getTvCategoryConfig(category: TvCategory): TvCategoryConfig {
  const config = TV_CATEGORIES.find(cat => cat.key === category);
  
  if (!config) {
    // 默认返回热门电视剧配置
    return TV_CATEGORIES[0];
  }
  
  return config;
}

/**
 * 获取所有电视剧分类的keys
 * @returns 分类key数组
 */
export function getTvCategoryKeys(): TvCategory[] {
  return TV_CATEGORIES.map(cat => cat.key);
}

/**
 * 检查分类是否有效
 * @param category 待检查的分类
 * @returns 是否有效
 */
export function isValidTvCategory(category: string): category is TvCategory {
  return TV_CATEGORIES.some(cat => cat.key === category);
}
