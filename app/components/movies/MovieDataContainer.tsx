/**
 * 电影数据容器组件
 * 负责获取分页数据并渲染内容
 */

import { fetchMovies } from '@/app/lib/api/movieActions';
import type { MovieCategory } from '@/app/lib/api/movieActions';
import MovieGrid from './MovieGrid';
import Pagination from './LoadMoreButton';

interface MovieDataContainerProps {
  category: MovieCategory;
  page: number;
}

export default async function MovieDataContainer({ 
  category, 
  page 
}: MovieDataContainerProps) {
  try {
    const response = await fetchMovies(category, page);
    const { results: movies, total_pages, page: currentPage } = response;
    const hasMore = currentPage < total_pages;

    return (
      <>
        {/* 电影网格 */}
        <MovieGrid 
          movies={movies} 
          category={category} 
        />
        
        {/* 分页导航 */}
        <Pagination
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
            <h3 className="card-title justify-center text-xl text-error">加载失败</h3>
            <p className="text-base-content/60 mb-6">
              获取电影数据时出现错误，请稍后重试
            </p>
          </div>
        </div>
      </div>
    );
  }
}
