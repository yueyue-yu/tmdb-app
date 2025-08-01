'use client';

import { useState, useEffect } from 'react';

interface ScrollPosition {
  scrollY: number;
  isScrolled: boolean;
  direction: 'up' | 'down' | null;
}

interface UseScrollPositionOptions {
  threshold?: number;
  debounceMs?: number;
}

/**
 * 滚动位置检测Hook
 * @param options 配置选项
 * @returns 滚动状态信息
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}): ScrollPosition {
  const { threshold = 100, debounceMs = 10 } = options;
  
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    isScrolled: false,
    direction: null,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollY = 0;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const direction = currentScrollY > lastScrollY ? 'down' : 'up';
        
        setScrollPosition({
          scrollY: currentScrollY,
          isScrolled: currentScrollY > threshold,
          direction: currentScrollY !== lastScrollY ? direction : null,
        });
        
        lastScrollY = currentScrollY;
      }, debounceMs);
    };

    // 初始化
    handleScroll();
    
    // 添加事件监听
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [threshold, debounceMs]);

  return scrollPosition;
}

/**
 * 导航栏状态Hook
 * @param scrollThreshold 滚动阈值
 * @returns 导航栏状态
 */
export function useNavbarState(scrollThreshold: number = 100) {
  const { isScrolled, direction } = useScrollPosition({ threshold: scrollThreshold });
  
  return {
    isVisible: direction !== 'down' || !isScrolled,
    shouldShowBackground: isScrolled,
    shouldShowShadow: isScrolled,
  };
}
