'use client';

import { useState, useEffect } from 'react';
import { moviesApiNext } from '../../api/moviesNext';
import type { Movie } from '../../api/types';
import MovieCard from './MovieCard';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedMovies, setLikedMovies] = useState<Set<number>>(new Set());

  // 获取电影数据
  const fetchMovies = async (pageNum: number = 1) => {
    try {
      const response = await moviesApiNext.getPopular(pageNum);
      if (pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      setHasMore(pageNum < response.total_pages);
    } catch (error) {
      console.error('获取电影数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  // 加载更多
  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  };

  // 切换喜欢状态
  const toggleLike = (movieId: number) => {
    setLikedMovies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  // 加载骨架屏
  if (loading && movies.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 rounded-lg aspect-[3/4] mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">热门电影</h1>
        <p className="text-gray-600">发现最受欢迎的电影作品</p>
      </div>

      {/* 瀑布流电影网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            isLiked={likedMovies.has(movie.id)}
            onToggleLike={toggleLike}
          />
        ))}
      </div>

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn btn-primary btn-wide"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                加载中...
              </>
            ) : (
              '加载更多'
            )}
          </button>
        </div>
      )}

      {/* 没有更多内容提示 */}
      {!hasMore && movies.length > 0 && (
        <div className="text-center mt-8 text-gray-500">
          <p>已经到底了，共 {movies.length} 部电影</p>
        </div>
      )}
    </div>
  );
}
