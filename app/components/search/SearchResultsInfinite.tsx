'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import InfiniteScrollContainer from '@/app/components/common/InfiniteScrollContainer';
import SearchResultListItem from './SearchResultListItem';
import { unifiedSearch } from '@/app/lib/api/searchActions';
import type { InfiniteSearchResultsProps, SearchTypeEnum } from '@/app/type/search';
import type { Movie, Person } from '@/app/lib/api/types';

/**
 * 无限滚动搜索结果组件
 * 替换传统分页的搜索结果展示
 */
export default function SearchResultsInfinite({
  searchParams,
  className = ''
}: InfiniteSearchResultsProps) {
  const t = useTranslations('Search');
  const { query, type, filters = {} } = searchParams;

  // 加载更多数据的函数
  const loadMore = useCallback(async (page: number) => {
    try {
      const response = await unifiedSearch({
        query,
        type,
        page,
        filters
      });

      // 处理不同类型的响应
      if (type === 'all') {
        // 综合搜索：合并所有类型的结果
        const multiResponse = response as any;
        const allItems: (Movie | Person)[] = [
          ...(multiResponse.movies?.results || []),
          ...(multiResponse.tvShows?.results || []),
          ...(multiResponse.people?.results || [])
        ];

        return {
          items: allItems,
          hasMore: page < Math.max(
            multiResponse.movies?.total_pages || 0,
            multiResponse.tvShows?.total_pages || 0,
            multiResponse.people?.total_pages || 0
          )
        };
      } else {
        // 单类型搜索
        const singleResponse = response as any;
        return {
          items: singleResponse.results || [],
          hasMore: page < (singleResponse.total_pages || 0)
        };
      }
    } catch (error) {
      console.error('加载搜索结果失败:', error);
      throw new Error('加载搜索结果失败');
    }
  }, [query, type, filters]);

  // 渲染单个搜索结果项
  const renderItem = useCallback((item: Movie | Person, index: number) => {
    return (
      <SearchResultListItem
        key={`search-result-${item.id}-${index}`}
        item={item}
        index={index}
      />
    );
  }, []);

  // 渲染空状态
  const renderEmpty = useCallback(() => (
    <div className="text-center py-12">
      <div className="space-y-4">
        <div className="text-6xl">🔍</div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {t('noResultsFound')}
          </h3>
          <p className="text-base-content/60">
            {t('noResultsFoundDesc')}
          </p>
        </div>
      </div>
    </div>
  ), [t]);

  // 渲染错误状态
  const renderError = useCallback((error: string, retry: () => void) => (
    <div className="text-center py-12">
      <div className="space-y-4">
        <div className="text-6xl">😕</div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {t('searchError')}
          </h3>
          <p className="text-base-content/60 mb-4">{error}</p>
          <button onClick={retry} className="btn btn-primary">
            {t('retry')}
          </button>
        </div>
      </div>
    </div>
  ), [t]);

  return (
    <div className={className}>
      {/* 搜索结果标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {t('searchResultsFor', { query })}
        </h2>
        <p className="text-sm text-base-content/60">
          {t('infiniteScrollHint')}
        </p>
      </div>

      {/* 无限滚动容器 */}
      <InfiniteScrollContainer
        loadMore={loadMore}
        renderItem={renderItem}
        renderEmpty={renderEmpty}
        renderError={renderError}
        config={{
          threshold: 0.1,
          rootMargin: '200px',
          enabled: !!query
        }}
        className=""
        itemClassName=""
        showBackToTop={true}
        backToTopThreshold={500}
      />
    </div>
  );
}
