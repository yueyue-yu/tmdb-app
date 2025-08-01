/**
 * 图片画廊组件
 * 显示分类的图片网格，支持筛选和排序
 */

'use client';

import { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import type { ImageGalleryProps, ProcessedImage, ImageType } from '@/app/type/image';
import { createImageTabs, filterAndSortImages } from '@/app/lib/utils/imageUtils';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';
import BatchDownloadToolbar from './BatchDownloadToolbar';
import { useBatchDownload } from '@/app/lib/hooks/useBatchDownload';

interface ImageGalleryClientProps extends ImageGalleryProps {
  translations: {
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
  };
}

export default function ImageGallery({
  images,
  mediaTitle,
  initialType = 'all' as ImageType,
  className = '',
  translations
}: ImageGalleryClientProps) {
  const [activeTab, setActiveTab] = useState<string>(initialType);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'vote_average' | 'vote_count' | 'width'>('vote_average');
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 批量下载功能
  const batchDownload = useBatchDownload();

  // 创建标签页数据
  const tabs = useMemo(() => 
    createImageTabs(images, translations), 
    [images, translations]
  );

  // 获取当前标签页的图片
  const currentTabImages = useMemo(() => {
    const tab = tabs.find(t => t.key === activeTab);
    return tab ? tab.images : [];
  }, [tabs, activeTab]);

  // 获取可用语言
  const availableLanguages = useMemo(() => {
    const languages = new Set<string>();
    currentTabImages.forEach(img => {
      if (img.language) languages.add(img.language);
    });
    return Array.from(languages).sort();
  }, [currentTabImages]);

  // 过滤和排序图片
  const filteredImages = useMemo(() => {
    return filterAndSortImages(currentTabImages, {
      language: languageFilter,
      sortBy,
      sortOrder: 'desc'
    });
  }, [currentTabImages, languageFilter, sortBy]);

  // 显示的图片（支持展开/折叠）
  const displayImages = useMemo(() => {
    const maxItems = 12;
    return isExpanded ? filteredImages : filteredImages.slice(0, maxItems);
  }, [filteredImages, isExpanded]);

  const hasMoreImages = filteredImages.length > 12;

  // 处理图片点击
  const handleImageClick = (image: ProcessedImage) => {
    const index = filteredImages.findIndex(img => img.id === image.id);
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  // 模态框导航
  const handlePrevious = () => {
    setSelectedImageIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => Math.min(filteredImages.length - 1, prev + 1));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (tabs.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-base-content/30 text-4xl mb-4">🖼️</div>
        <p className="text-base-content/60">{translations.noImages}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 标签页导航 */}
      {tabs.length > 1 && (
        <div className="tabs tabs-bordered">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'tab-active' : ''}`}
              onClick={() => {
                setActiveTab(tab.key);
                setIsExpanded(false);
                setLanguageFilter(null);
              }}
            >
              {tab.label}
              <span className="ml-1 text-xs opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* 筛选和排序控件 */}
      {currentTabImages.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {/* 排序选择 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/70">{translations.sortBy}:</span>
            <select
              className="select select-sm select-bordered"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="vote_average">{translations.sortByVote}</option>
              <option value="vote_count">热门度</option>
              <option value="width">{translations.sortBySize}</option>
            </select>
          </div>

          {/* 语言筛选 */}
          {availableLanguages.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/70">{translations.filterByLanguage}:</span>
              <select
                className="select select-sm select-bordered"
                value={languageFilter || ''}
                onChange={(e) => setLanguageFilter(e.target.value || null)}
              >
                <option value="">{translations.allLanguages}</option>
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}

          {/* 结果统计 */}
          <div className="text-sm text-base-content/60">
            显示 {displayImages.length} / {filteredImages.length} 张图片
          </div>
        </div>
      )}

      {/* 批量下载工具栏 */}
      {displayImages.length > 0 && (
        <BatchDownloadToolbar
          images={displayImages}
          mediaTitle={mediaTitle}
          batchDownload={batchDownload}
          className="mb-6"
        />
      )}

      {/* 图片网格 */}
      {displayImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onClick={handleImageClick}
              showInfo={false}
              isSelectable={true}
              isSelected={batchDownload.isImageSelected(image.id)}
              onSelectionChange={batchDownload.toggleImageSelection}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-base-content/60">没有找到符合条件的图片</p>
        </div>
      )}

      {/* 展开/折叠按钮 */}
      {hasMoreImages && (
        <div className="text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-outline btn-sm gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                {translations.showLess}
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                {translations.showMore} ({filteredImages.length - 12})
              </>
            )}
          </button>
        </div>
      )}

      {/* 图片模态框 */}
      <ImageModal
        images={filteredImages}
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
