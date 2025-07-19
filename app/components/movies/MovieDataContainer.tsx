/**
 * 电影数据容器组件
 * 负责获取分页数据并渲染内容
 */

import {fetchMedia} from '@/app/lib/api/mediaActions';
import {MediaCategoryKeys, MediaTypeEnum} from "@/app/type/movie";
import { getTranslations } from 'next-intl/server';
import MovieGrid from './MovieGrid';
import Pagination from './Pagination';

interface MovieDataContainerProps {
    mediaType: MediaTypeEnum; // 可选，默认为'movie'
    category: MediaCategoryKeys;
    page: number;
}

export default async function MovieDataContainer({
                                                     mediaType,
                                                     category,
                                                     page
                                                 }: MovieDataContainerProps) {
    const t = await getTranslations('Movies');

    try {

        const response = await fetchMedia(mediaType, category, page);
        const {results: movies, total_pages, page: currentPage} = response;
        const hasMore = currentPage < total_pages;

        return (
            <>
                {/* 电影网格 */}
                <MovieGrid
                    movies={movies}
                    category={category}
                    mediaType={mediaType}
                />

                {/* 分页导航 */}
                <Pagination
                    mediaType={mediaType}
                    category={category}
                    currentPage={currentPage}
                    hasMore={hasMore}
                    totalMovies={movies.length}
                />
            </>
        );
    } catch (error) {
        console.error('获取电影数据失败:', error);

        return (
            <div className="text-center mt-20">
                <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
                    <div className="card-body text-center">
                        <div className="text-6xl mb-4">❌</div>
                        <h3 className="card-title justify-center text-xl text-error">{t('loadFailed')}</h3>
                        <p className="text-base-content/60 mb-6">
                            {t('loadFailedDesc')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
