/**
 * 图片模态框组件
 * 全屏查看图片，支持缩放、切换和下载
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import type { ImageModalProps } from '@/app/type/image';
import { getImageDisplayTitle, getImageDownloadFilename } from '@/app/lib/utils/imageUtils';

export default function ImageModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  title = ''
}: ImageModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentImage = images[currentIndex];

  // 重置缩放和位置
  const resetTransform = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // 当图片切换时重置状态
  useEffect(() => {
    if (isOpen) {
      resetTransform();
      setImageLoaded(false);
    }
  }, [currentIndex, isOpen, resetTransform]);

  // 键盘事件处理
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) onPrevious();
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) onNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          resetTransform();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onPrevious, onNext, resetTransform]);

  // 缩放处理
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  // 鼠标拖拽处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(5, prev * delta)));
  };

  // 下载图片
  const handleDownload = () => {
    if (!currentImage) return;
    
    const link = document.createElement('a');
    link.href = currentImage.urls.original;
    link.download = getImageDownloadFilename(currentImage, title);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !currentImage) return null;

  const imageTitle = getImageDisplayTitle(currentImage);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* 顶部工具栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between p-4">
          {/* 图片信息 */}
          <div className="text-white">
            <h3 className="font-semibold">{imageTitle}</h3>
            <p className="text-sm text-white/70">
              {currentIndex + 1} / {images.length}
              {title && ` • ${title}`}
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {/* 下载按钮 */}
            <button
              className="btn btn-circle btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={handleDownload}
              title="下载图片"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
            </button>

            {/* 缩放按钮 */}
            <button
              className="btn btn-circle btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={handleZoomOut}
              title="缩小"
            >
              <MagnifyingGlassMinusIcon className="w-4 h-4" />
            </button>

            <button
              className="btn btn-circle btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={resetTransform}
              title="重置缩放"
            >
              <ArrowsPointingOutIcon className="w-4 h-4" />
            </button>

            <button
              className="btn btn-circle btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={handleZoomIn}
              title="放大"
            >
              <MagnifyingGlassPlusIcon className="w-4 h-4" />
            </button>

            {/* 关闭按钮 */}
            <button
              className="btn btn-circle btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={onClose}
              title="关闭"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 图片容器 */}
      <div 
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
        >
          <Image
            src={currentImage.urls.large}
            alt={imageTitle}
            width={currentImage.width}
            height={currentImage.height}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onLoad={() => setImageLoaded(true)}
            priority
          />

          {/* 加载状态 */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loading loading-spinner loading-lg text-white"></div>
            </div>
          )}
        </div>
      </div>

      {/* 导航按钮 */}
      {images.length > 1 && (
        <>
          {/* 上一张 */}
          {currentIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={onPrevious}
              title="上一张"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
          )}

          {/* 下一张 */}
          {currentIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={onNext}
              title="下一张"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          )}
        </>
      )}

      {/* 底部缩略图导航 */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-center p-4 gap-2 overflow-x-auto">
            {images.slice(Math.max(0, currentIndex - 5), currentIndex + 6).map((img, idx) => {
              const actualIndex = Math.max(0, currentIndex - 5) + idx;
              return (
                <button
                  key={img.id}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                    actualIndex === currentIndex 
                      ? 'border-white scale-110' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                  onClick={() => {
                    const diff = actualIndex - currentIndex;
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) onNext();
                    } else if (diff < 0) {
                      for (let i = 0; i < Math.abs(diff); i++) onPrevious();
                    }
                  }}
                >
                  <Image
                    src={img.urls.thumbnail}
                    alt=""
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 点击背景关闭 */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}
