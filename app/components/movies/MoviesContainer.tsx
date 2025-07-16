/**
 * 电影容器组件
 * 服务端组件，负责数据获取和协调子组件
 */

import { fetchMovies } from '@/app/lib/api/movieActions';
import type { MovieCategory } from '@/app/lib/api/movieActions';
import type { CategoryConfig } from '@/app/constant/movieCategories';
import PageHeader from './PageHeader';
import MovieGrid from './MovieGrid';
import LoadMoreButton from './LoadMoreButton';

interface MoviesContainerProps {
  category: MovieCategory;
  page: number;
  categoryConfig: CategoryConfig;
}

export default async function MoviesContainer({ 
  category, 
  page, 
  categoryConfig 
}: MoviesContainerProps) {
  try {
    // 服务端获取数据
    const response = await fetchMovies(category, page);
    const { results: movies, total_pages, page: currentPage } = response;
    
    const hasMore = currentPage < total_pages;
    const totalMovies = movies.length;

    return (
      <>
        {/* 页面标题 */}
        <PageHeader 
          categoryConfig={categoryConfig} 
          currentCategory={category}
        />
        
        {/* 电影网格 */}
        <MovieGrid 
          movies={movies} 
          category={category} 
        />
        
        {/* 加载更多按钮 */}
        <LoadMoreButton
          category={category}
          currentPage={currentPage}
          hasMore={hasMore}
          totalMovies={totalMovies}
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
            <div className="card-actions justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                重新加载
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
