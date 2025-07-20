/**
 * 搜索页面
 * 支持电影、电视剧、演员的综合搜索
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// 导入搜索组件
import SearchForm from '@/app/components/search/SearchForm';
import SearchResultsInfinite from '@/app/components/search/SearchResultsInfinite';
import SearchPageClient from '@/app/components/search/SearchPageClient';
import { SortOption, SearchTypeEnum } from '@/app/type/search';
import type { FilterParams } from '@/app/type/search';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    // 筛选参数
    yearFrom?: string;
    yearTo?: string;
    ratingFrom?: string;
    ratingTo?: string;
    genres?: string;
    sortBy?: string;
  }>;
}



export default async function SearchPage({ searchParams }: SearchPageProps) {
  const t = await getTranslations('Search');
  const params = await searchParams;

  // 解析搜索参数
  const query = params.q?.trim() || '';
  const type = (params.type as SearchTypeEnum) || SearchTypeEnum.ALL;

  // 解析筛选参数
  const filters: FilterParams = {};

  if (params.yearFrom) {
    const yearFrom = parseInt(params.yearFrom);
    if (!isNaN(yearFrom)) filters.yearFrom = yearFrom;
  }

  if (params.yearTo) {
    const yearTo = parseInt(params.yearTo);
    if (!isNaN(yearTo)) filters.yearTo = yearTo;
  }

  if (params.ratingFrom) {
    const ratingFrom = parseFloat(params.ratingFrom);
    if (!isNaN(ratingFrom)) filters.ratingFrom = ratingFrom;
  }

  if (params.ratingTo) {
    const ratingTo = parseFloat(params.ratingTo);
    if (!isNaN(ratingTo)) filters.ratingTo = ratingTo;
  }

  if (params.genres) {
    const genres = params.genres.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
    if (genres.length > 0) filters.genres = genres;
  }

  if (params.sortBy && Object.values(SortOption).includes(params.sortBy as SortOption)) {
    filters.sortBy = params.sortBy as SortOption;
  }

  // 验证搜索类型
  const validTypes: SearchTypeEnum[] = [SearchTypeEnum.ALL, SearchTypeEnum.MOVIE, SearchTypeEnum.TV, SearchTypeEnum.PERSON];
  if (!validTypes.includes(type)) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <MagnifyingGlassIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-base-content/60 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>

      {/* 搜索表单 */}
      <div className="mb-8">
        <SearchForm
          initialQuery={query}
        />
      </div>

      {/* 搜索结果 */}
      {query ? (
        <SearchPageClient
          query={query}
          type={type}
          filters={filters}
        >
          <SearchResultsInfinite
            key={`infinite-search-${query}-${type}-${JSON.stringify(filters)}`}
            searchParams={{ query, type, filters }}
          />
        </SearchPageClient>
      ) : (
        /* 空状态 - 显示搜索建议 */
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-xl font-semibold mb-4">{t('startSearching')}</h2>
            <p className="text-base-content/60 mb-8">
              {t('startSearchingDesc')}
            </p>

            {/* 热门搜索建议 */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-base-content/80">
                {t('popularSearches')}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {(t.raw('popularSearchTerms') as string[]).map((suggestion) => (
                  <a
                    key={suggestion}
                    href={`/home/search?q=${encodeURIComponent(suggestion)}&type=all&page=1`}
                    className="badge badge-outline hover:badge-primary transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
