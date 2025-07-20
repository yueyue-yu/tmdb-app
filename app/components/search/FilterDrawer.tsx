'use client';

import { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FilterSidebar from './FilterSidebar';
import type { FilterSidebarProps } from '@/app/type/search';

interface FilterDrawerProps extends FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 筛选器抽屉组件
 * 从左侧滑入的筛选面板
 */
export default function FilterDrawer({
  isOpen,
  onClose,
  searchParams,
  onFiltersChange,
  className = ''
}: FilterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // 处理ESC键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 点击遮罩关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* 抽屉面板 */}
      <div
        ref={drawerRef}
        className={`fixed left-0 top-0 h-full w-96 bg-base-100 shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
      >
        {/* 抽屉头部 */}
        <div className="flex items-center justify-between p-4 border-b border-base-200 flex-shrink-0">
          <h2 id="filter-drawer-title" className="text-xl font-semibold">
            筛选
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="关闭"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 抽屉内容 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <FilterSidebar
            searchParams={searchParams}
            onFiltersChange={onFiltersChange}
            className="p-6"
          />
        </div>
      </div>
    </>
  );
}
