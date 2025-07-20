/**
 * 语言相关工具函数（服务器端）
 */

import { cookies } from 'next/headers';

/**
 * 支持的语言映射
 * 将应用语言代码映射到TMDB API语言代码
 */
const LANGUAGE_MAP: Record<string, string> = {
  'zh': 'zh-CN',  // 中文
  'en': 'en-US',  // 英文
};

/**
 * 默认语言
 */
const DEFAULT_LANGUAGE = 'zh-CN';

/**
 * 获取当前用户的语言设置
 * @returns 用户选择的语言代码
 */
export async function getCurrentLocale(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get('locale')?.value || 'zh';

    // 验证语言是否支持
    const supportedLocales = ['en', 'zh'];
    return supportedLocales.includes(locale) ? locale : 'zh';
  } catch (error) {
    console.error('获取用户语言设置失败:', error);
    return 'zh'; // 默认返回中文
  }
}

/**
 * 将应用语言代码转换为TMDB API语言代码
 * @param locale 应用语言代码 (zh, en)
 * @returns TMDB API语言代码 (zh-CN, en-US)
 */
export function mapLocaleToTmdbLanguage(locale: string): string {
  return LANGUAGE_MAP[locale] || DEFAULT_LANGUAGE;
}

/**
 * 获取TMDB API使用的语言代码
 * @returns TMDB API语言代码
 */
export async function getTmdbLanguage(): Promise<string> {
  const locale = await getCurrentLocale();
  return mapLocaleToTmdbLanguage(locale);
}
