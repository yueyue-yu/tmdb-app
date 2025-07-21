/**
 * 搜索结果展示组件
 * 根据搜索类型展示不同的结果格式
 */

import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { unifiedSearch } from '@/app/lib/api/searchActions';
import type { SearchResultsProps, SearchTypeEnum, FilterParams } from '@/app/type/search';
import type { Movie, Person } from '@/app/lib/api/types';
import { MediaTypeEnum } from '@/app/type/movie';

// 导入现有组件
import MovieGrid from '@/app/components/movies/MovieGrid';
import MovieGridSkeleton from '@/app/components/movies/MovieGridSkeleton';
import PersonGrid from './PersonGrid';
import SearchResultsEmpty from './SearchResultsEmpty';
import SearchResultsError from './SearchResultsError';

interface SearchResultsContainerProps {
  searchParams: {
    query: string;
    type: SearchTypeEnum;
    page: number;
    filters?: FilterParams;
  };
}

/**
 * 搜索结果容器组件（服务器组件）
 */
async function SearchResultsContainer({ searchParams }: SearchResultsContainerProps) {
  const t = await getTranslations('Search');
  const { query, type, page } = searchParams;

  try {
    const response = await unifiedSearch(searchParams);

    // 处理不同类型的搜索结果
    switch (type) {
      case 'movie':
      case 'tv': {
        const movieResponse = response as { results: Movie[]; total_results: number; page: number; total_pages: number };
        
        if (movieResponse.results.length === 0) {
          return <SearchResultsEmpty searchType={type} query={query} />;
        }

        return (
          <div className="space-y-6">
            {/* 结果统计 */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {t('searchResultsFor', { query })}
              </h2>
              <span className="text-sm text-base-content/60">
                {t('resultsCount', { count: movieResponse.total_results })}
              </span>
            </div>

            {/* 电影/电视剧网格 */}
            <MovieGrid
              movies={movieResponse.results}
              category={`search-${type}`}
              mediaType={type === 'movie' ? MediaTypeEnum.Movie : MediaTypeEnum.TV}
            />
          </div>
        );
      }

      case 'person': {
        const personResponse = response as { results: Person[]; total_results: number; page: number; total_pages: number };
        
        if (personResponse.results.length === 0) {
          return <SearchResultsEmpty searchType={type} query={query} />;
        }

        return (
          <div className="space-y-6">
            {/* 结果统计 */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {t('searchResultsFor', { query })}
              </h2>
              <span className="text-sm text-base-content/60">
                {t('resultsCount', { count: personResponse.total_results })}
              </span>
            </div>

            {/* 人员网格 */}
            <PersonGrid people={personResponse.results} />
          </div>
        );
      }

      case 'all': {
        const multiResponse = response as {
          movies: { results: Movie[]; total_results: number };
          tvShows: { results: Movie[]; total_results: number };
          people: { results: Person[]; total_results: number };
          totalResults: number;
        };

        if (multiResponse.totalResults === 0) {
          return <SearchResultsEmpty searchType={type} query={query} />;
        }

        return (
          <div className="space-y-8">
            {/* 总体结果统计 */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {t('searchResultsFor', { query })}
              </h2>
              <p className="text-base-content/60">
                {t('resultsCount', { count: multiResponse.totalResults })}
              </p>
            </div>

            {/* 电影结果 */}
            {multiResponse.movies.results.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    🎬 {t('searchTypes.movie')}
                  </h3>
                  <span className="text-sm text-base-content/60">
                    {t('resultsCount', { count: multiResponse.movies.total_results })}
                  </span>
                </div>
                <MovieGrid
                  movies={multiResponse.movies.results.slice(0, 10)}
                  category="search-movies"
                  mediaType={MediaTypeEnum.Movie}
                />
              </section>
            )}

            {/* 电视剧结果 */}
            {multiResponse.tvShows.results.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    📺 {t('searchTypes.tv')}
                  </h3>
                  <span className="text-sm text-base-content/60">
                    {t('resultsCount', { count: multiResponse.tvShows.total_results })}
                  </span>
                </div>
                <MovieGrid
                  movies={multiResponse.tvShows.results.slice(0, 10)}
                  category="search-tv"
                  mediaType={MediaTypeEnum.TV}
                />
              </section>
            )}

            {/* 人员结果 */}
            {multiResponse.people.results.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    👤 {t('searchTypes.person')}
                  </h3>
                  <span className="text-sm text-base-content/60">
                    {t('resultsCount', { count: multiResponse.people.total_results })}
                  </span>
                </div>
                <PersonGrid people={multiResponse.people.results.slice(0, 10)} />
              </section>
            )}
          </div>
        );
      }

      default:
        throw new Error(`不支持的搜索类型: ${type}`);
    }
  } catch (error) {
    console.error('搜索失败:', error);
    return <SearchResultsError error={error as Error} />;
  }
}

/**
 * 搜索结果主组件
 */
export default function SearchResults({ searchParams, className = '' }: SearchResultsProps) {
  return (
    <div className={`w-full ${className}`}>
      <Suspense fallback={<MovieGridSkeleton />}>
        <SearchResultsContainer searchParams={{...searchParams, page: searchParams.page || 1}} />
      </Suspense>
    </div>
  );
}
