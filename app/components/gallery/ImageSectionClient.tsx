/**
 * 图片区域客户端组件
 * 处理图片数据加载和状态管理
 */

'use client';

import { useState, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import type { ImageSectionProps, GroupedImages } from '@/app/type/image';
import { fetchMediaImages } from '@/app/lib/api/imageActions';
import ImageSectionHorizontal from './ImageSectionHorizontal';
import ErrorBoundary, { ApiErrorFallback } from '@/app/components/common/ErrorBoundary';

interface ImageSectionClientProps extends ImageSectionProps {
  translations: {
    images: string;
    all: string;
    backdrops: string;
    posters: string;
    stills: string;
    logos: string;
    showMore: string;
    showLess: string;
    sortBy: string;
    sortByVote: string;
    sortBySize: string;
    sortByQuality: string;
    filterByLanguage: string;
    allLanguages: string;
    noImages: string;
    loadingError: string;
    retryLater: string;
  };
}

export default function ImageSectionClient({ 
  mediaId, 
  mediaType, 
  mediaTitle, 
  translations 
}: ImageSectionClientProps) {
  const [images, setImages] = useState<GroupedImages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 重试函数
  const retryLoadImages = () => {
    setError(null);
    loadImages();
  };

  // 获取图片数据
  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const imageData = await fetchMediaImages(mediaId, mediaType);
      setImages(imageData);
    } catch (err) {
      console.error('获取图片失败:', err);
      setError(translations.loadingError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [mediaId, mediaType, translations.loadingError]);

  // 加载状态
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <PhotoIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{translations.images}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-video bg-base-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <PhotoIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{translations.images}</h2>
        </div>
        <ApiErrorFallback
          error={new Error(error)}
          resetError={retryLoadImages}
          title={translations.loadingError}
          description="请检查网络连接后重试"
        />
      </div>
    );
  }

  // 检查是否有图片
  const hasImages = images && (
    images.backdrops.length > 0 ||
    images.posters.length > 0 ||
    images.stills.length > 0 ||
    images.logos.length > 0
  );

  // 没有图片
  if (!hasImages) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <PhotoIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{translations.images}</h2>
        </div>
        <div className="text-center py-12">
          <PhotoIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
          <p className="text-base-content/60">{translations.noImages}</p>
        </div>
      </div>
    );
  }

  // 计算总图片数量
  const totalImages = images.backdrops.length + 
                     images.posters.length + 
                     images.stills.length + 
                     images.logos.length;

  return (
    <ErrorBoundary fallback={ApiErrorFallback}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 横向滑动图片画廊 */}
        <ErrorBoundary>
          <ImageSectionHorizontal
            images={images}
            mediaType={mediaType}
            mediaId={mediaId}
            mediaTitle={mediaTitle}
          />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
