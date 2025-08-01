'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// 移除了 isScrolled prop
interface NavbarSearchProps {
  isMobile?: boolean;
  className?: string;
}

/**
 * 导航栏搜索组件
 * 支持桌面端和移动端不同的展示方式
 * (移除了滚动状态的样式变化，采用固定样式)
 */
export default function NavbarSearch({ isMobile = false, className = '' }: NavbarSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations('Navigation');

  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsExpanded(false);
    }
  };

  // 处理展开/收起
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('.search-container')?.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // 移动端版本
  if (isMobile) {
    return (
        <button
            onClick={handleToggle}
            className={`p-2 rounded-lg transition-all duration-300 text-base-content/70 hover:text-primary hover:bg-primary/5 ${className}`}
            aria-label={t('search')}
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
    );
  }

  // 桌面端版本
  return (
      <div className={`search-container relative ${className}`}>
        {/* 搜索按钮/输入框 */}
        <form onSubmit={handleSearch} className="relative">
          <div className={`flex items-center transition-all duration-300 ${
              isExpanded ? 'w-80' : 'w-10'
          }`}>
            {/* 搜索图标按钮 */}
            <button
                type={isExpanded ? 'submit' : 'button'}
                onClick={isExpanded ? undefined : handleToggle}
                className="flex-shrink-0 p-2 rounded-lg transition-all duration-300 text-base-content/70 hover:text-primary hover:bg-primary/5"
                aria-label={isExpanded ? t('search') : t('openSearch')}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* 搜索输入框 */}
            {isExpanded && (
                <div className="flex-1 relative">
                  <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="w-full px-4 py-2 rounded-lg border transition-all duration-300 bg-base-100 border-base-300 text-base-content placeholder-base-content/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  {/* 关闭按钮 */}
                  <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-all duration-300 text-base-content/50 hover:text-base-content"
                      aria-label={t('close')}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
            )}
          </div>
        </form>
      </div>
  );
}