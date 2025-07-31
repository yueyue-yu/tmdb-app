import {
  HomeIcon,
  FilmIcon,
  TvIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

export interface NavigationItem {
  key: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  external?: boolean;
}

/**
 * 主导航菜单配置
 */
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    key: 'home',
    path: '/',
    icon: HomeIcon,
  },
  {
    key: 'movies',
    path: '/movie/popular',
    icon: FilmIcon,
  },
  {
    key: 'tv',
    path: '/tv/popular',
    icon: TvIcon,
  },
  {
    key: 'people',
    path: '/people',
    icon: UserGroupIcon,
  },
  {
    key: 'search',
    path: '/search',
    icon: MagnifyingGlassIcon,
  },
];

/**
 * 用户相关导航
 */
export const USER_NAVIGATION: NavigationItem[] = [
  {
    key: 'favorites',
    path: '/favorites',
    icon: HeartIcon,
    requiresAuth: true,
  },
];

/**
 * 检查路径是否激活
 * @param currentPath 当前路径
 * @param itemPath 菜单项路径
 * @returns 是否激活
 */
export function isPathActive(currentPath: string, itemPath: string): boolean {
  if (itemPath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(itemPath);
}

/**
 * 获取当前激活的导航项
 * @param currentPath 当前路径
 * @returns 激活的导航项
 */
export function getActiveNavItem(currentPath: string): NavigationItem | null {
  return MAIN_NAVIGATION.find(item => isPathActive(currentPath, item.path)) || null;
}
