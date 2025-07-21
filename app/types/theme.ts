import { Theme } from '../lib/themeUtils';

/**
 * 主题上下文类型定义
 */
export interface ThemeContextType {
  /** 当前主题名称 */
  currentTheme: string;
  /** 设置主题的函数 */
  setTheme: (theme: string) => void;
  /** 所有可用主题列表 */
  themes: Theme[];
  /** 当前主题的详细信息 */
  currentThemeInfo: Theme;
  /** 主题是否已初始化（避免 SSR 水合错误） */
  isInitialized: boolean;
}

/**
 * 主题提供者组件的 Props
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
}
