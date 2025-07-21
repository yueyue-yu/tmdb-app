'use client';

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { THEMES, DEFAULT_THEME } from '../../lib/themeUtils';
import { ThemeContextType, ThemeProviderProps } from '../../types/theme';

/**
 * 主题上下文
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 主题提供者组件
 * 管理全局主题状态，处理主题初始化、localStorage 持久化和 DOM 更新
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_THEME);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 主题切换处理函数
  const handleSetTheme = (theme: string) => {
    // 验证主题是否存在
    if (!THEMES.find(t => t.name === theme)) {
      console.warn(`Theme "${theme}" not found, using default theme`);
      theme = DEFAULT_THEME;
    }

    setCurrentTheme(theme);
    
    // 更新 DOM
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      // 保存到 localStorage
      localStorage.setItem('theme', theme);
    }
  };

  // 初始化主题（仅在客户端执行，避免 SSR 水合错误）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const initialTheme = savedTheme && THEMES.find(t => t.name === savedTheme) 
        ? savedTheme 
        : DEFAULT_THEME;
      
      setCurrentTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
      setIsInitialized(true);
    }
  }, []);

  // 当前主题详细信息
  const currentThemeInfo = useMemo(() => {
    return THEMES.find(t => t.name === currentTheme) || THEMES.find(t => t.name === DEFAULT_THEME)!;
  }, [currentTheme]);

  // Context 值
  const contextValue = useMemo<ThemeContextType>(() => ({
    currentTheme,
    setTheme: handleSetTheme,
    themes: THEMES,
    currentThemeInfo,
    isInitialized,
  }), [currentTheme, currentThemeInfo, isInitialized]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
