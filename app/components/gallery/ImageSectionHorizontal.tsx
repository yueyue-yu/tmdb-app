/**
 * 横向滑动图片组件
 * 用于详情页面，支持横向滑动浏览图片
 */

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PhotoIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import HorizontalScrollContainer from '@/app/components/common/HorizontalScrollContainer';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';
import { useState, useMemo } from 'react';
import type { GroupedImages, ProcessedImage } from '@/app/type/image';

interface ImageSectionHorizontalProps {
  images: GroupedImages;
  mediaType: 'movie' | 'tv';
  mediaId: number;
  mediaTitle: string;
  showCount?: number;
  className?: string;
}

export default function ImageSectionHorizontal({
  images,
  mediaType,
  mediaId,
  mediaTitle,
  showCount = 10,
  className = ''
}: ImageSectionHorizontalProps) {
  const t = useTranslations('Gallery');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 合并所有图片并按评分排序
  const allImages = useMemo(() => {
    const combined: ProcessedImage[] = [
      ...images.backdrops,
      ...images.posters,
      ...images.stills,
      ...images.logos
    ];
    
    // 按评分和尺寸排序
    return combined
      .sort((a, b) => {
        // 首先按评分排序
        if (b.voteAverage !== a.voteAverage) {
          return b.voteAverage - a.voteAverage;
        }
        // 评分相同时按尺寸排序
        return (b.width * b.height) - (a.width * a.height);
      })
      .slice(0, showCount);
  }, [images, showCount]);

  const totalImages = images.backdrops.length + images.posters.length + 
                     images.stills.length + images.logos.length;

  if (!images || totalImages === 0) {
    return null;
  }

  const galleryPageUrl = `/detail/${mediaType}/${mediaId}/gallery`;

  // 处理图片点击
  const handleImageClick = (image: ProcessedImage) => {
    const index = allImages.findIndex(img => img.id === image.id);
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  // 渲染图片卡片
  const renderImageCard = (image: ProcessedImage, index: number) => (
    <ImageCard
      image={image}
      onClick={handleImageClick}
      showInfo={false}
      className="h-full"
    />
  );

  // 模态框导航
  const handlePrevious = () => {
    setSelectedImageIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => Math.min(allImages.length - 1, prev + 1));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`image-section-horizontal space-y-6 ${className}`}>
      {/* 标题和查看更多按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PhotoIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold">{t('images')}</h2>
          <span className="text-base-content/60">({totalImages})</span>
        </div>
        
        {totalImages > showCount && (
          <Link
            href={galleryPageUrl}
            className="btn btn-outline btn-sm gap-2 hover:btn-primary"
          >
            查看全部
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* 横向滑动图片列表 */}
      <HorizontalScrollContainer
        items={allImages}
        renderItem={renderImageCard}
        itemWidth="w-[200px] sm:w-[240px] md:w-[280px]"
        gap="gap-3 sm:gap-4"
        className=""
        aria-label={`${t('images')} - ${totalImages}张图片`}
      />

      {/* 查看更多提示 */}
      {totalImages > showCount && (
        <div className="text-center pt-2">
          <Link
            href={galleryPageUrl}
            className="text-primary hover:text-primary-focus transition-colors text-sm"
          >
            还有 {totalImages - showCount} 张图片...
          </Link>
        </div>
      )}

      {/* 图片模态框 */}
      <ImageModal
        images={allImages}
        currentIndex={selectedImageIndex}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPrevious={handlePrevious}
        onNext={handleNext}
        title={mediaTitle}
      />
    </div>
  );
}

/**
 * 图片列表骨架屏组件
 */
export function ImageSectionHorizontalSkeleton({
  showCount = 8,
  className = ''
}: {
  showCount?: number;
  className?: string;
}) {
  return (
    <div className={`image-section-horizontal-skeleton space-y-6 ${className}`}>
      {/* 标题骨架 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-base-300 rounded animate-pulse"></div>
          <div className="w-16 h-8 bg-base-300 rounded animate-pulse"></div>
          <div className="w-8 h-6 bg-base-300 rounded animate-pulse"></div>
        </div>
        <div className="w-20 h-8 bg-base-300 rounded animate-pulse"></div>
      </div>

      {/* 图片列表骨架 */}
      <div className="flex gap-3 sm:gap-4 overflow-hidden">
        {Array.from({ length: showCount }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px]"
          >
            <div className="animate-pulse">
              <div className="bg-base-300 aspect-video rounded-lg mb-2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 查看更多骨架 */}
      <div className="text-center pt-2">
        <div className="w-24 h-4 bg-base-300 rounded animate-pulse mx-auto"></div>
      </div>
    </div>
  );
}

/**
 * 空图片列表组件
 */
export function ImageSectionHorizontalEmpty({
  message,
  className = ''
}: {
  message?: string;
  className?: string;
}) {
  const t = useTranslations('Gallery');
  const emptyMessage = message || t('noImages');

  return (
    <div className={`image-section-horizontal-empty space-y-6 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center gap-3">
        <PhotoIcon className="w-6 h-6" />
        <h2 className="text-2xl font-bold">{t('images')}</h2>
        <span className="text-base-content/60">(0)</span>
      </div>

      {/* 空状态 */}
      <div className="text-center py-12">
        <div className="text-base-content/60">
          {emptyMessage}
        </div>
      </div>
    </div>
  );
}
