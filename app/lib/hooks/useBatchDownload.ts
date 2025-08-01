/**
 * 批量下载功能的自定义 Hook
 * 管理图片选择状态和批量下载逻辑
 */

'use client';

import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ProcessedImage } from '@/app/type/image';

export interface BatchDownloadState {
  selectedImages: Set<string>;
  isDownloading: boolean;
  downloadProgress: number;
  downloadStatus: string;
}

export interface BatchDownloadActions {
  toggleImageSelection: (imageId: string) => void;
  selectAllImages: (images: ProcessedImage[]) => void;
  clearSelection: () => void;
  downloadSelectedImages: (images: ProcessedImage[], mediaTitle: string) => Promise<void>;
  isImageSelected: (imageId: string) => boolean;
}

export function useBatchDownload(): BatchDownloadState & BatchDownloadActions {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');

  // 切换图片选择状态
  const toggleImageSelection = useCallback((imageId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  }, []);

  // 全选图片
  const selectAllImages = useCallback((images: ProcessedImage[]) => {
    const allImageIds = new Set(images.map(img => img.id));
    setSelectedImages(allImageIds);
  }, []);

  // 清空选择
  const clearSelection = useCallback(() => {
    setSelectedImages(new Set());
  }, []);

  // 检查图片是否被选中
  const isImageSelected = useCallback((imageId: string) => {
    return selectedImages.has(imageId);
  }, [selectedImages]);

  // 下载图片文件
  const downloadImage = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    return response.blob();
  };

  // 生成文件名
  const generateFileName = (image: ProcessedImage, index: number, mediaTitle: string): string => {
    const cleanTitle = mediaTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_');
    const typeMap: { [key: string]: string } = {
      'backdrop': '背景图',
      'poster': '海报',
      'still': '剧照',
      'logo': '标志'
    };
    const typeName = typeMap[image.type] || image.type;
    const extension = image.urls.original.split('.').pop() || 'jpg';
    return `${cleanTitle}_${typeName}_${String(index + 1).padStart(3, '0')}.${extension}`;
  };

  // 批量下载选中的图片
  const downloadSelectedImages = useCallback(async (images: ProcessedImage[], mediaTitle: string) => {
    if (selectedImages.size === 0) {
      alert('请先选择要下载的图片');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus('准备下载...');

    try {
      const zip = new JSZip();
      const selectedImageList = images.filter(img => selectedImages.has(img.id));
      const totalImages = selectedImageList.length;

      setDownloadStatus(`正在下载 ${totalImages} 张图片...`);

      // 并发下载图片（限制并发数）
      const concurrencyLimit = 3;
      let completedCount = 0;

      for (let i = 0; i < selectedImageList.length; i += concurrencyLimit) {
        const batch = selectedImageList.slice(i, i + concurrencyLimit);
        
        await Promise.all(
          batch.map(async (image, batchIndex) => {
            try {
              const actualIndex = i + batchIndex;
              setDownloadStatus(`正在下载第 ${actualIndex + 1} 张图片...`);
              
              const blob = await downloadImage(image.urls.original);
              const fileName = generateFileName(image, actualIndex, mediaTitle);
              zip.file(fileName, blob);
              
              completedCount++;
              setDownloadProgress((completedCount / totalImages) * 100);
            } catch (error) {
              console.error(`下载图片失败: ${image.id}`, error);
              // 继续下载其他图片，不中断整个过程
            }
          })
        );
      }

      setDownloadStatus('正在打包文件...');
      
      // 生成 ZIP 文件
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // 下载 ZIP 文件
      const cleanTitle = mediaTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_');
      const zipFileName = `${cleanTitle}_图片合集_${selectedImages.size}张.zip`;
      saveAs(zipBlob, zipFileName);

      setDownloadStatus('下载完成！');
      
      // 清空选择
      clearSelection();
      
      // 2秒后重置状态
      setTimeout(() => {
        setDownloadStatus('');
        setDownloadProgress(0);
      }, 2000);

    } catch (error) {
      console.error('批量下载失败:', error);
      setDownloadStatus('下载失败，请重试');
      
      setTimeout(() => {
        setDownloadStatus('');
        setDownloadProgress(0);
      }, 3000);
    } finally {
      setIsDownloading(false);
    }
  }, [selectedImages, clearSelection]);

  return {
    selectedImages,
    isDownloading,
    downloadProgress,
    downloadStatus,
    toggleImageSelection,
    selectAllImages,
    clearSelection,
    downloadSelectedImages,
    isImageSelected
  };
}
