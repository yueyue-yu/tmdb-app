/**
 * 视频模态框组件
 * 在模态框中播放视频
 */

'use client';

import { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { VideoModalProps } from '@/app/type/video';
import { 
  getEmbedUrl, 
  getVideoDisplayTitle, 
  getVideoTypeLabel,
  isValidVideo,
  supportsEmbed
} from '@/app/lib/utils/videoUtils';

export default function VideoModal({ 
  video, 
  isOpen, 
  onClose, 
  title 
}: VideoModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  // 处理模态框开关
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen && video) {
      if (!modal.open) {
        modal.showModal();
      }
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      if (modal.open) {
        modal.close();
      }
      // 恢复背景滚动
      document.body.style.overflow = 'unset';
    }

    // 清理函数
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, video]);

  // 处理ESC键和背景点击关闭
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 处理模态框关闭
  const handleClose = () => {
    onClose();
  };

  // 处理背景点击
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const modal = modalRef.current;
    const rect = modal?.getBoundingClientRect();
    if (modal && rect) {
      const isInDialog = (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
      if (!isInDialog) {
        handleClose();
      }
    }
  };

  const embedUrl = getEmbedUrl(video, true, true); // 自动播放，显示控制条
  const videoTitle = title || getVideoDisplayTitle(video);
  const videoType = video ? getVideoTypeLabel(video.type) : '';

  // 如果没有视频或视频无效，不渲染任何内容
  if (!isOpen || !video || !isValidVideo(video) || !supportsEmbed(video)) {
    return null;
  }

  return (
    <dialog
      ref={modalRef}
      className="modal"
      onClick={handleBackdropClick}
    >
      <div className="modal-box max-w-6xl w-full p-0 bg-black">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-4 bg-base-100">
          <div className="flex-1">
            <h3 className="font-bold text-lg line-clamp-1">{videoTitle}</h3>
            <p className="text-base-content/60 text-sm">{videoType}</p>
          </div>
          
          {/* 官方标识 */}
          {video.official && (
            <span className="badge badge-success badge-sm mr-2">官方</span>
          )}
          
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="btn btn-circle btn-ghost btn-sm"
            aria-label="关闭视频"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 视频播放区域 */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={videoTitle}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* 视频信息 */}
        <div className="p-4 bg-base-100">
          <div className="flex items-center justify-between text-sm text-base-content/60">
            <div className="flex items-center gap-4">
              <span>类型: {videoType}</span>
              <span>网站: {video.site}</span>
              {video.published_at && (
                <span>
                  发布: {new Date(video.published_at).toLocaleDateString('zh-CN')}
                </span>
              )}
            </div>
            
            {/* 语言信息 */}
            {video.iso_639_1 && (
              <span className="badge badge-outline badge-sm">
                {video.iso_639_1.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 模态框背景 */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>关闭</button>
      </form>
    </dialog>
  );
}
