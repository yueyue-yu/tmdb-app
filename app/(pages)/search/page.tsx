/**
 * 搜索页面
 * 支持电影、电视剧、演员的综合搜索
 */

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

// 导入搜索组件
import SearchForm from '@/app/components/search/SearchForm';
import SearchResultsInfinite from '@/app/components/search/SearchResultsInfinite';
import SearchPageClient from '@/app/components/search/SearchPageClient';
import { SearchTypeEnum } from '@/app/type/search';
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
  }>;
}

// 生成页面元数据
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const type = params.type || 'all';

  if (query) {
    const typeMap = {
      'all': '全部',
      'movie': '电影',
      'tv': '电视剧',
      'person': '演员'
    };

    const typeText = typeMap[type as keyof typeof typeMap] || '全部';

    return {
      title: `"${query}" 的搜索结果`,
      description: `在 ${typeText} 中搜索 "${query}" 的结果，发现相关的电影、电视剧和演员信息。`,
      openGraph: {
        title: `"${query}" 的搜索结果 - TMDB`,
        description: `在 ${typeText} 中搜索 "${query}" 的结果`,
      },
    };
  }

  return {
    title: '搜索',
    description: '搜索电影、电视剧和演员信息，发现你感兴趣的内容。支持多种筛选条件，帮你快速找到想要的影视作品。',
    openGraph: {
      title: '搜索 - TMDB',
      description: '搜索电影、电视剧和演员信息',
    },
  };
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





  // 验证搜索类型
  const validTypes: SearchTypeEnum[] = [SearchTypeEnum.ALL, SearchTypeEnum.MOVIE, SearchTypeEnum.TV, SearchTypeEnum.PERSON];
  if (!validTypes.includes(type)) {
    notFound();
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
        {/* 移动端优先的头部 - 正常滚动 */}
        <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 简化的页面标题 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
            <MagnifyingGlassIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t('title')}</h1>
            <p className="text-xs text-base-content/60 hidden sm:block">
              {t('description')}
            </p>
          </div>
        </div>

        {/* 搜索表单 */}
        <div className="mb-6">
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
          /* 移动端优先的空状态 */
          <div className="text-center py-8">
            <div className="max-w-sm mx-auto">
              {/* 搜索图标 */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <MagnifyingGlassIcon className="w-10 h-10 text-purple-500" />
              </div>

              <h2 className="text-lg font-semibold mb-3">{t('startSearching')}</h2>
              <p className="text-sm text-base-content/60 mb-6">
                {t('startSearchingDesc')}
              </p>

              {/* 热门搜索建议 - 移动端优化 */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-base-content/80">
                  {t('popularSearches')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(t.raw('popularSearchTerms') as string[]).slice(0, 6).map((suggestion) => (
                    <a
                      key={suggestion}
                      href={`/search?q=${encodeURIComponent(suggestion)}&type=all`}
                      className="btn btn-outline btn-sm text-xs hover:btn-primary transition-colors"
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
      </div>
  );
}
