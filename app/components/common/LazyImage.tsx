'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholder?: React.ReactNode;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 懒加载图片组件
 * 使用Intersection Observer实现图片懒加载
 */
export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  priority = false,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // 使用Intersection Observer监听图片是否进入视口
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // 处理图片加载错误
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // 默认占位符
  const defaultPlaceholder = (
    <div className={`bg-base-200 animate-pulse flex items-center justify-center ${className}`}>
      <div className="text-base-content/20">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

  // 错误状态
  const errorPlaceholder = (
    <div className={`bg-base-200 flex items-center justify-center ${className}`}>
      <div className="text-base-content/20">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* 显示占位符直到图片加载 */}
      {(!isInView || !isLoaded) && !hasError && (
        <div className="absolute inset-0">
          {placeholder || defaultPlaceholder}
        </div>
      )}

      {/* 显示错误占位符 */}
      {hasError && (
        <div className="absolute inset-0">
          {errorPlaceholder}
        </div>
      )}

      {/* 实际图片 */}
      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
        />
      )}
    </div>
  );
}
