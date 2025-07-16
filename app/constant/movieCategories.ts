/**
 * 电影分类配置常量
 */

import { 
  FireIcon, 
  TrophyIcon, 
  CalendarIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import type { MovieCategory } from '@/app/lib/api/movieActions';

export interface CategoryConfig {
  key: MovieCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export const MOVIE_CATEGORIES: CategoryConfig[] = [
  {
    key: 'popular',
    label: '热门电影',
    icon: FireIcon,
    description: '当前最受欢迎的电影',
    color: 'text-red-500',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-orange-500'
  },
  {
    key: 'top-rated',
    label: '高分电影',
    icon: TrophyIcon,
    description: '评分最高的经典佳作',
    color: 'text-yellow-500',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-amber-500'
  },
  {
    key: 'now-playing',
    label: '正在上映',
    icon: ClockIcon,
    description: '影院正在热映的新片',
    color: 'text-green-500',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500'
  },
  {
    key: 'upcoming',
    label: '即将上映',
    icon: CalendarIcon,
    description: '即将与观众见面的新电影',
    color: 'text-blue-500',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-indigo-500'
  }
];

// 根据key获取分类配置的工具函数
export function getCategoryConfig(categoryKey: MovieCategory): CategoryConfig {
  return MOVIE_CATEGORIES.find(cat => cat.key === categoryKey) || MOVIE_CATEGORIES[0];
}

// 获取默认分类
export const DEFAULT_CATEGORY: MovieCategory = 'popular';
