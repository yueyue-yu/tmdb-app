'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { SearchFormProps, SearchTypeEnum } from '@/app/type/search';

export default function SearchForm({
  initialQuery = '',
  onSearch
}: SearchFormProps) {
  const t = useTranslations('Search');
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);

  // 固定使用 'all' 类型，类型选择移到筛选器中
  const searchType = 'all' as SearchTypeEnum;

  // 从URL参数初始化状态
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    setQuery(urlQuery);
  }, [searchParams]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ⌘K 或 Ctrl+K 快捷键聚焦搜索框
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      
      // ESC 清空搜索框
      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('');
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 处理搜索提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const searchParams = {
        query: query.trim(),
        type: searchType,
        page: 1
      };

      // 如果有自定义搜索处理函数，使用它
      if (onSearch) {
        onSearch(searchParams);
      } else {
        // 否则导航到搜索页面
        const params = new URLSearchParams({
          q: searchParams.query,
          type: searchParams.type,
          page: searchParams.page.toString()
        });
        
        router.push(`/home/search?${params.toString()}`);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 清空搜索
  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };



  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 主搜索框 */}
        <div className="form-control">
          <div className="input-group">
            {/* 搜索输入框 */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="input input-bordered w-full pr-20"
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
              />
              
              {/* 清空按钮 */}
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                  disabled={isLoading}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
              
              {/* 快捷键提示 */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 hidden md:flex gap-1">
                <kbd className="kbd kbd-xs">⌘</kbd>
                <kbd className="kbd kbd-xs">K</kbd>
              </div>
            </div>

            {/* 搜索按钮 */}
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <MagnifyingGlassIcon className="h-5 w-5" />
              )}
              <span className="hidden sm:inline ml-2">
                {isLoading ? t('searching') : t('searchButton')}
              </span>
            </button>
          </div>
        </div>

        {/* 搜索提示 */}
        <div className="text-center">
          <p className="text-sm text-base-content/60">
            {t('shortcut')} • ESC {t('clearSearch')}
          </p>
        </div>
      </form>
    </div>
  );
}
