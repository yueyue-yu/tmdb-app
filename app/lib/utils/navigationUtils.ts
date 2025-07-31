/**
 * 智能导航工具函数
 * 提供智能返回逻辑和导航路径判断
 */

'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * 页面类型枚举
 */
export enum PageType {
  MOVIE_DETAIL = 'movie-detail',
  TV_DETAIL = 'tv-detail',
  PERSON_DETAIL = 'person-detail',
  MOVIE_LIST = 'movie-list',
  TV_LIST = 'tv-list',
  PEOPLE_LIST = 'people-list',
  SEARCH = 'search',
  HOME = 'home',
  EXTERNAL = 'external',
  UNKNOWN = 'unknown'
}

/**
 * 默认返回路径映射
 */
export const DEFAULT_RETURN_PATHS = {
  [PageType.MOVIE_DETAIL]: '/movie/popular',
  [PageType.TV_DETAIL]: '/tv/popular',
  [PageType.PERSON_DETAIL]: '/',
  [PageType.MOVIE_LIST]: '/movie',
  [PageType.TV_LIST]: '/tv',
  [PageType.PEOPLE_LIST]: '/',
  [PageType.SEARCH]: '/search',
  [PageType.HOME]: '/',
  [PageType.EXTERNAL]: '/',
  [PageType.UNKNOWN]: '/'
} as const;

/**
 * 根据URL路径判断页面类型
 * @param pathname URL路径
 * @returns 页面类型
 */
export function getPageTypeFromPath(pathname: string): PageType {
  if (!pathname || pathname === '/') {
    return PageType.HOME;
  }

  // 移除查询参数和hash
  const cleanPath = pathname.split('?')[0].split('#')[0];

  // 详情页面
  if (cleanPath.includes('/detail/movie/') || cleanPath.includes('/movie/detail/')) {
    return PageType.MOVIE_DETAIL;
  }
  if (cleanPath.includes('/detail/tv/') || cleanPath.includes('/tv/detail/')) {
    return PageType.TV_DETAIL;
  }
  if (cleanPath.includes('/detail/person/') || cleanPath.includes('/person/')) {
    return PageType.PERSON_DETAIL;
  }

  // 列表页面
  if (cleanPath.includes('/movie')) {
    return PageType.MOVIE_LIST;
  }
  if (cleanPath.includes('/tv')) {
    return PageType.TV_LIST;
  }
  if (cleanPath.includes('/people')) {
    return PageType.PEOPLE_LIST;
  }
  if (cleanPath.includes('/search')) {
    return PageType.SEARCH;
  }
  if (cleanPath.includes('/home')) {
    return PageType.HOME;
  }

  // 外部或未知页面
  if (!cleanPath.startsWith('/home') && !cleanPath.startsWith('/person') && !cleanPath.startsWith('/detail')) {
    return PageType.EXTERNAL;
  }

  return PageType.UNKNOWN;
}

/**
 * 检查是否有可用的浏览器历史记录
 * @returns 是否有历史记录
 */
export function hasValidHistory(): boolean {
  try {
    // 检查是否有历史记录
    return window.history.length > 1;
  } catch (error) {
    console.warn('无法访问浏览器历史记录:', error);
    return false;
  }
}

/**
 * 检查来源页面是否为应用内页面
 * @returns 是否为应用内来源
 */
export function isInternalReferrer(): boolean {
  try {
    const referrer = document.referrer;
    if (!referrer) return false;

    const referrerUrl = new URL(referrer);
    const currentUrl = new URL(window.location.href);

    // 检查是否为同域名
    return referrerUrl.origin === currentUrl.origin;
  } catch (error) {
    console.warn('无法检查来源页面:', error);
    return false;
  }
}

/**
 * 获取来源页面类型
 * @returns 来源页面类型
 */
export function getReferrerPageType(): PageType {
  try {
    const referrer = document.referrer;
    if (!referrer) return PageType.UNKNOWN;

    const referrerUrl = new URL(referrer);
    return getPageTypeFromPath(referrerUrl.pathname);
  } catch (error) {
    console.warn('无法获取来源页面类型:', error);
    return PageType.UNKNOWN;
  }
}

/**
 * 智能返回导航函数
 * @param router Next.js路由器实例
 * @param currentPageType 当前页面类型
 * @param fallbackPath 可选的自定义回退路径
 */
export function smartNavigateBack(
  router: AppRouterInstance,
  currentPageType: PageType,
  fallbackPath?: string
): void {
  try {
    // 1. 检查是否有有效的历史记录且来源是应用内
    if (hasValidHistory() && isInternalReferrer()) {
      const referrerType = getReferrerPageType();
      
      // 如果来源是应用内的有效页面，使用浏览器返回
      if (referrerType !== PageType.EXTERNAL && referrerType !== PageType.UNKNOWN) {
        console.log('使用浏览器历史记录返回');
        router.back();
        return;
      }
    }

    // 2. 使用自定义回退路径或默认路径
    const targetPath = fallbackPath || DEFAULT_RETURN_PATHS[currentPageType] || '/';
    console.log('导航到默认路径:', targetPath);
    router.push(targetPath);
  } catch (error) {
    console.error('智能导航失败:', error);
    // 最后的回退方案：返回首页
    router.push('/');
  }
}

/**
 * 获取面包屑导航路径
 * @param currentPageType 当前页面类型
 * @param currentPath 当前路径
 * @returns 面包屑路径数组
 */
export function getBreadcrumbPaths(
  currentPageType: PageType,
  currentPath: string
): Array<{ label: string; path: string }> {
  const breadcrumbs: Array<{ label: string; path: string }> = [
    { label: '首页', path: '/' }
  ];

  switch (currentPageType) {
    case PageType.MOVIE_DETAIL:
      breadcrumbs.push(
        { label: '电影', path: '/movie' },
        { label: '电影详情', path: currentPath }
      );
      break;
    case PageType.TV_DETAIL:
      breadcrumbs.push(
        { label: '电视剧', path: '/tv' },
        { label: '电视剧详情', path: currentPath }
      );
      break;
    case PageType.PERSON_DETAIL:
      breadcrumbs.push(
        { label: '演员', path: '/people' },
        { label: '演员详情', path: currentPath }
      );
      break;
    case PageType.MOVIE_LIST:
      breadcrumbs.push({ label: '电影', path: currentPath });
      break;
    case PageType.TV_LIST:
      breadcrumbs.push({ label: '电视剧', path: currentPath });
      break;
    case PageType.PEOPLE_LIST:
      breadcrumbs.push({ label: '演员', path: currentPath });
      break;
    case PageType.SEARCH:
      breadcrumbs.push({ label: '搜索', path: currentPath });
      break;
  }

  return breadcrumbs;
}

/**
 * 生成智能返回按钮的提示文本
 * @param currentPageType 当前页面类型
 * @returns 提示文本
 */
export function getBackButtonLabel(currentPageType: PageType): string {
  // 为了避免水合错误，始终返回一致的标签
  switch (currentPageType) {
    case PageType.MOVIE_DETAIL:
      return '返回电影列表';
    case PageType.TV_DETAIL:
      return '返回电视剧列表';
    case PageType.PERSON_DETAIL:
      return '返回演员列表';
    default:
      return '返回首页';
  }
}
