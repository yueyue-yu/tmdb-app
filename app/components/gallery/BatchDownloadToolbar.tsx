/**
 * 批量下载工具栏组件
 * 提供全选、取消全选、批量下载等功能
 */

'use client';

import { 
  CheckIcon, 
  XMarkIcon, 
  ArrowDownTrayIcon,
  DocumentArrowDownIcon 
} from '@heroicons/react/24/outline';
import type { ProcessedImage } from '@/app/type/image';
import type { BatchDownloadState, BatchDownloadActions } from '@/app/lib/hooks/useBatchDownload';

interface BatchDownloadToolbarProps {
  images: ProcessedImage[];
  mediaTitle: string;
  batchDownload: BatchDownloadState & BatchDownloadActions;
  className?: string;
}

export default function BatchDownloadToolbar({
  images,
  mediaTitle,
  batchDownload,
  className = ''
}: BatchDownloadToolbarProps) {
  const {
    selectedImages,
    isDownloading,
    downloadProgress,
    downloadStatus,
    selectAllImages,
    clearSelection,
    downloadSelectedImages
  } = batchDownload;

  const selectedCount = selectedImages.size;
  const totalCount = images.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const hasSelection = selectedCount > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllImages(images);
    }
  };

  const handleDownload = () => {
    downloadSelectedImages(images, mediaTitle);
  };

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className={`batch-download-toolbar bg-base-200 border border-base-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* 左侧：选择状态和操作 */}
        <div className="flex items-center gap-4">
          {/* 全选/取消全选按钮 */}
          <button
            onClick={handleSelectAll}
            className={`btn btn-sm gap-2 ${isAllSelected ? 'btn-primary' : 'btn-outline'}`}
            disabled={isDownloading}
          >
            {isAllSelected ? (
              <>
                <XMarkIcon className="w-4 h-4" />
                取消全选
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                全选
              </>
            )}
          </button>

          {/* 选择状态 */}
          <div className="text-sm text-base-content/70">
            已选择 <span className="font-semibold text-primary">{selectedCount}</span> / {totalCount} 张图片
          </div>

          {/* 清空选择按钮 */}
          {hasSelection && (
            <button
              onClick={clearSelection}
              className="btn btn-ghost btn-sm"
              disabled={isDownloading}
            >
              清空选择
            </button>
          )}
        </div>

        {/* 右侧：下载操作 */}
        <div className="flex items-center gap-4">
          {/* 下载状态 */}
          {isDownloading && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-base-content/70">
                {downloadStatus}
              </div>
              <div className="w-32">
                <progress 
                  className="progress progress-primary w-full" 
                  value={downloadProgress} 
                  max="100"
                ></progress>
              </div>
              <div className="text-xs text-base-content/60 min-w-[3rem]">
                {Math.round(downloadProgress)}%
              </div>
            </div>
          )}

          {/* 批量下载按钮 */}
          <button
            onClick={handleDownload}
            disabled={!hasSelection || isDownloading}
            className={`btn gap-2 ${hasSelection ? 'btn-primary' : 'btn-disabled'}`}
          >
            {isDownloading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                下载中...
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className="w-4 h-4" />
                下载选中图片 ({selectedCount})
              </>
            )}
          </button>
        </div>
      </div>

      {/* 下载提示 */}
      {hasSelection && !isDownloading && (
        <div className="mt-3 p-3 bg-info/10 border border-info/20 rounded-lg">
          <div className="flex items-start gap-2">
            <ArrowDownTrayIcon className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
            <div className="text-sm text-info">
              <div className="font-medium mb-1">批量下载说明：</div>
              <ul className="text-xs space-y-1 text-info/80">
                <li>• 图片将打包为 ZIP 文件下载</li>
                <li>• 文件名格式：{mediaTitle.slice(0, 10)}..._图片类型_序号.jpg</li>
                <li>• 下载过程中请勿关闭页面</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 批量下载工具栏骨架屏
 */
export function BatchDownloadToolbarSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`batch-download-toolbar-skeleton bg-base-200 border border-base-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-8 bg-base-300 rounded animate-pulse"></div>
          <div className="w-32 h-4 bg-base-300 rounded animate-pulse"></div>
        </div>
        <div className="w-40 h-8 bg-base-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
