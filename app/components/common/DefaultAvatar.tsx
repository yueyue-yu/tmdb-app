/**
 * 默认头像组件
 * 用于显示人物图片加载失败时的占位图
 */

'use client';

import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

interface DefaultAvatarProps {
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

export default function DefaultAvatar({
  name,
  className = '',
  size = 'md',
  showIcon = true
}: DefaultAvatarProps) {
  // 获取姓名的首字母
  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      // 单个名字，取前两个字符
      return names[0].slice(0, 2).toUpperCase();
    } else {
      // 多个名字，取每个名字的首字母
      return names
        .slice(0, 2) // 最多取两个名字
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase();
    }
  };

  // 根据姓名生成背景颜色
  const getBackgroundColor = (fullName?: string): string => {
    if (!fullName) return 'bg-base-300';
    
    const colors = [
      'bg-red-200 text-red-800',
      'bg-blue-200 text-blue-800',
      'bg-green-200 text-green-800',
      'bg-yellow-200 text-yellow-800',
      'bg-purple-200 text-purple-800',
      'bg-pink-200 text-pink-800',
      'bg-indigo-200 text-indigo-800',
      'bg-orange-200 text-orange-800',
      'bg-teal-200 text-teal-800',
      'bg-cyan-200 text-cyan-800'
    ];
    
    // 根据姓名的字符码生成一个稳定的颜色索引
    const hash = fullName
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return colors[hash % colors.length];
  };

  // 尺寸样式映射
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const initials = getInitials(name);
  const bgColor = getBackgroundColor(name);
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  return (
    <div 
      className={`
        ${sizeClass} 
        ${bgColor} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        font-semibold 
        select-none
        transition-colors
        duration-200
        ${className}
      `}
      title={name || '未知用户'}
    >
      {showIcon && (!name || initials === '?') ? (
        <UserIcon className={`${iconSize} opacity-60`} />
      ) : (
        <span className="font-bold tracking-tight">
          {initials}
        </span>
      )}
    </div>
  );
}

/**
 * 默认人物头像组件（专门用于演员/工作人员）
 */
export function DefaultPersonAvatar({
  name,
  className = '',
  size = 'md'
}: {
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  return (
    <div className={`relative ${className}`}>
      <DefaultAvatar 
        name={name} 
        size={size}
        className="border-2 border-base-300"
      />
      
      {/* 装饰性边框 */}
      <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"></div>
    </div>
  );
}

/**
 * 带加载状态的头像组件
 */
export function AvatarWithFallback({
  src,
  name,
  alt,
  className = '',
  size = 'md',
  onError,
  priority = false
}: {
  src?: string;
  name?: string;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onError?: () => void;
  priority?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // 如果没有图片源或图片加载失败，显示默认头像
  if (!src || imageError) {
    return (
      <DefaultPersonAvatar 
        name={name} 
        className={className}
        size={size}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* 加载状态 */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-200 rounded-full">
          <div className="loading loading-spinner loading-sm opacity-50"></div>
        </div>
      )}
      
      {/* 实际图片 */}
      <img
        src={src}
        alt={alt || name || '人物头像'}
        className={`
          w-full h-full object-cover rounded-full
          transition-opacity duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}


