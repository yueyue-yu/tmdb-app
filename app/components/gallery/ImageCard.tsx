/**
 * 图片卡片组件
 * 显示单个图片的缩略图和基本信息
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { EyeIcon, ArrowDownTrayIcon, StarIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { ImageCardProps } from '@/app/type/image';
import { 
  getImageDisplayTitle, 
  getAspectRatioCategory,
  calculateImageQuality,
  getBestImageForContainer
} from '@/app/lib/utils/imageUtils';

export default function ImageCard({
  image,
  onClick,
  className = '',
  showInfo = true,
  isSelectable = false,
  isSelected = false,
  onSelectionChange
}: ImageCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 获取图片信息
  const title = getImageDisplayTitle(image);
  const aspectCategory = getAspectRatioCategory(image.aspectRatio);
  const quality = calculateImageQuality(image);
  
  // 处理图片点击
  const handleClick = () => {
    if (onClick) {
      onClick(image);
    }
  };

  // 处理选择状态变化
  const handleSelectionChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectionChange) {
      onSelectionChange(image.id, !isSelected);
    }
  };

  // 处理图片下载
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = image.urls.original;
    link.download = `image_${image.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理图片加载错误
  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className={`relative bg-base-200 rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="text-base-content/30 text-4xl mb-3">🖼️</div>
            <p className="text-base-content/60 text-sm font-medium">图片加载失败</p>
            <p className="text-base-content/40 text-xs mt-1">点击重试</p>
          </div>
        </div>

        {/* 重试按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setImageError(false);
            setImageLoaded(false);
          }}
          className="absolute inset-0 w-full h-full bg-transparent hover:bg-black/10 transition-colors"
          title="重试加载图片"
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative group cursor-pointer bg-base-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      {/* 图片容器 */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image.urls.medium}
          alt={title}
          fill
          className={`object-cover transition-all duration-500 ${
            imageLoaded 
              ? 'scale-100 opacity-100 blur-0' 
              : 'scale-110 opacity-0 blur-sm'
          } group-hover:scale-110`}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
        />

        {/* 加载状态 */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loading loading-spinner loading-sm"></div>
          </div>
        )}

        {/* 选择复选框 */}
        {isSelectable && (
          <div className="absolute top-2 left-2 z-10">
            <button
              onClick={handleSelectionChange}
              className={`btn btn-circle btn-sm transition-all duration-200 ${
                isSelected
                  ? 'bg-primary border-primary text-primary-content'
                  : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
              }`}
              title={isSelected ? '取消选择' : '选择图片'}
            >
              {isSelected ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4 border-2 border-current rounded"></div>
              )}
            </button>
          </div>
        )}

        {/* 悬停遮罩 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
          {/* 操作按钮 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              {/* 查看按钮 */}
              <button
                className="btn btn-circle btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={handleClick}
                title="查看大图"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              
              {/* 下载按钮 */}
              <button
                className="btn btn-circle btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={handleDownload}
                title="下载图片"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 图片质量标识 */}
        {quality >= 80 && (
          <div className="absolute top-2 right-2">
            <div className="badge badge-success badge-sm gap-1">
              <StarIcon className="w-3 h-3" />
              高质量
            </div>
          </div>
        )}

        {/* 语言标识 */}
        {image.language && (
          <div className="absolute top-2 left-2">
            <div className="badge badge-outline badge-sm bg-black/50 text-white border-white/30">
              {image.language.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* 图片信息 */}
      {showInfo && (
        <div className="p-3 space-y-2">
          {/* 标题和尺寸 */}
          <div>
            <h4 className="font-medium text-sm truncate" title={title}>
              {title}
            </h4>
            <p className="text-xs text-base-content/60">
              {aspectCategory} • {image.width}×{image.height}
            </p>
          </div>

          {/* 评分信息 */}
          {image.voteCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <div className="flex items-center gap-1">
                <StarIcon className="w-3 h-3" />
                <span>{image.voteAverage.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{image.voteCount} 票</span>
            </div>
          )}

          {/* 质量指示器 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-base-300 rounded-full h-1">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  quality >= 80 ? 'bg-success' :
                  quality >= 60 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${quality}%` }}
              />
            </div>
            <span className="text-xs text-base-content/60">{quality}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
