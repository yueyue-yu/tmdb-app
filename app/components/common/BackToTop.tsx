'use client';

import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

interface BackToTopProps {
  threshold?: number; // 显示按钮的滚动阈值
  className?: string;
}

/**
 * 回到顶部按钮组件
 * 当用户滚动超过阈值时显示，点击平滑滚动到顶部
 */
export default function BackToTop({ 
  threshold = 300, 
  className = '' 
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动事件
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 节流处理滚动事件
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(toggleVisibility, 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [threshold]);

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 z-50
        btn btn-circle btn-primary
        shadow-lg hover:shadow-xl
        transition-all duration-300
        ${className}
      `}
      aria-label="回到顶部"
      title="回到顶部"
    >
      <ChevronUpIcon className="w-5 h-5" />
    </button>
  );
}
