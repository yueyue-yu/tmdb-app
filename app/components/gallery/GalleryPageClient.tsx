/**
 * 画廊页面客户端组件
 * 处理画廊页面的交互和状态管理
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import ImageGallery from './ImageGallery';
import type { GroupedImages } from '@/app/type/image';

interface GalleryPageClientProps {
  images: GroupedImages;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  mediaId: number;
  posterPath?: string;
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
    backToDetail: string;
    galleryFor: string;
  };
}

export default function GalleryPageClient({
  images,
  mediaType,
  mediaTitle,
  mediaId,
  posterPath,
  translations
}: GalleryPageClientProps) {
  const detailPageUrl = `/detail/${mediaType}/${mediaId}`;
  const totalImages = images.backdrops.length + images.posters.length + 
                     images.stills.length + images.logos.length;

  return (
    <div className="min-h-screen bg-base-100">
      {/* 页面头部 */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* 返回按钮 */}
            <Link
              href={detailPageUrl}
              className="btn btn-ghost btn-circle"
              aria-label={translations.backToDetail}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>

            {/* 媒体海报 */}
            {posterPath && (
              <div className="flex-shrink-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w92${posterPath}`}
                  alt={mediaTitle}
                  width={60}
                  height={90}
                  className="rounded-lg shadow-md"
                />
              </div>
            )}

            {/* 标题信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <PhotoIcon className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold truncate">
                  {translations.galleryFor} - {mediaTitle}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-base-content/70">
                <span>{totalImages} 张图片</span>
                <Link
                  href={detailPageUrl}
                  className="hover:text-primary transition-colors"
                >
                  {translations.backToDetail}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 画廊内容 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {totalImages > 0 ? (
          <ImageGallery
            images={images}
            mediaTitle={mediaTitle}
            translations={{
              all: translations.all,
              backdrops: translations.backdrops,
              posters: translations.posters,
              stills: translations.stills,
              logos: translations.logos,
              showMore: translations.showMore,
              showLess: translations.showLess,
              sortBy: translations.sortBy,
              sortByVote: translations.sortByVote,
              sortBySize: translations.sortBySize,
              sortByQuality: translations.sortByQuality,
              filterByLanguage: translations.filterByLanguage,
              allLanguages: translations.allLanguages,
              noImages: translations.noImages
            }}
          />
        ) : (
          <div className="text-center py-20">
            <div className="text-base-content/30 text-6xl mb-6">🖼️</div>
            <h2 className="text-2xl font-bold mb-4">{translations.noImages}</h2>
            <p className="text-base-content/60 mb-8">
              这个{mediaType === 'movie' ? '电影' : '电视剧'}暂时没有可用的图片。
            </p>
            <Link
              href={detailPageUrl}
              className="btn btn-primary gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {translations.backToDetail}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
