'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { SearchFormProps, SearchTypeEnum } from '@/app/type/search';

export default function SearchForm({
  initialQuery = '',
  onSearch
}: SearchFormProps) {
  const t = useTranslations();
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
        type: searchType
      };

      // 如果有自定义搜索处理函数，使用它
      if (onSearch) {
        onSearch(searchParams);
      } else {
        // 否则导航到搜索页面
        const params = new URLSearchParams({
          q: searchParams.query,
          type: searchParams.type
        });

        router.push(`/search?${params.toString()}`);
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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 紧凑的搜索框 */}
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('Search.searchPlaceholder')}
            className="input input-bordered w-full pr-20 h-12 text-base bg-base-100/50 backdrop-blur-sm border-base-300 focus:border-primary focus:bg-base-100 transition-all"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* 移动端搜索提示 */}
        <div className="text-center sm:hidden">
          <p className="text-xs text-base-content/50">
            {t('Search.mobileSearchHint')}
          </p>
        </div>
      </form>
    </div>
  );
}
