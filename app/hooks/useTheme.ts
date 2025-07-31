'use client';

import { useContext } from 'react';
import { ThemeContext } from '../components/providers/ThemeProvider';
import { ThemeContextType } from '../type/theme';

/**
 * 主题 Hook
 * 提供访问主题上下文的便捷接口
 * 
 * @returns 主题上下文对象，包含当前主题、设置主题函数等
 * @throws 如果在 ThemeProvider 外使用会抛出错误
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentTheme, setTheme, themes } = useTheme();
 *   
 *   return (
 *     <div>
 *       <p>Current theme: {currentTheme}</p>
 *       <button onClick={() => setTheme('dark')}>
 *         Switch to Dark
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Make sure to wrap your component tree with <ThemeProvider>.'
    );
  }
  
  return context;
}
