'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { moviesApiNext } from '../../api/moviesNext';
import type { Movie } from '../../api/types';
import {
  StarIcon,
  HeartIcon,
  ShareIcon,
  PlayIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid';

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

  // 获取海报URL
  const getPosterUrl = (posterPath: string | null) => {
    if (!posterPath) {
      // 返回一个内联的 SVG 占位图
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEyNSIgeT0iMjUwIiB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgcng9IjEyLjUiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTE4NyAzMjVMMjEyLjUgMzUwTDI1MCAzMTJMIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjx0ZXh0IHg9IjI1MCIgeT0iNDUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBNEFGIiBmb250LWZhbWlseT0iYXJpYWwiIGZvbnQtc2l6ZT0iMTYiPuaaguaXoOa1t+aKpTwvdGV4dD4KPC9zdmc+';
    }
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  // 获取评分颜色
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 7) return 'text-yellow-500';
    if (rating >= 6) return 'text-orange-500';
    return 'text-red-500';
  };

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
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* 电影海报 */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />

                {/* 悬停遮罩层 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <Link
                    href={`/app/home/movies/${movie.id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <PlayIcon className="h-12 w-12 text-white" />
                  </Link>
                </div>

                {/* 评分徽章 */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 rounded-full px-2 py-1 flex items-center">
                  <StarIcon className={`h-3 w-3 mr-1 ${getRatingColor(movie.vote_average)}`} />
                  <span className="text-white text-xs font-medium">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>

                {/* 喜欢按钮 */}
                <button
                  onClick={() => toggleLike(movie.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black bg-opacity-70 hover:bg-opacity-90 transition-all duration-200"
                >
                  {likedMovies.has(movie.id) ? (
                    <HeartSolidIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <HeartIcon className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>

              {/* 电影信息 */}
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {movie.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {formatDate(movie.release_date)}
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-3 w-3 mr-1" />
                    {movie.vote_count}
                  </div>
                </div>

                {/* 简介 */}
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                  {movie.overview || '暂无简介...'}
                </p>

                {/* 操作按钮 */}
                <div className="flex justify-between items-center">
                  <Link
                    href={`/app/home/movies/${movie.id}`}
                    className="btn btn-primary btn-xs"
                  >
                    查看详情
                  </Link>
                  <button className="btn btn-ghost btn-xs">
                    <ShareIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
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
