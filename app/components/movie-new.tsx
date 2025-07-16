/**
 * 重构后的电影页面组件示例
 * 展示如何使用统一的 fetchMovies Server Action
 */

'use client';

import { useState, useEffect, useTransition } from 'react';
import type { Movie } from '@/app/lib/api';
import { fetchMovies, type MovieCategory } from '@/app/lib/api/movieActions';
import MovieCard from './movie-card/MovieCard';
import {
  FireIcon,
  TrophyIcon,
  CalendarIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface CategoryConfig {
  key: MovieCategory;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function MoviesPageRefactored() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<MovieCategory>('popular');
  const [isChangingCategory, setIsChangingCategory] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 电影分类配置
  const categories: CategoryConfig[] = [
    {
      key: 'popular',
      label: '热门电影',
      icon: <FireIcon className="w-5 h-5" />,
      description: '当前最受欢迎的电影',
      color: 'text-red-500',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-orange-500'
    },
    {
      key: 'top-rated',
      label: '高分电影',
      icon: <TrophyIcon className="w-5 h-5" />,
      description: '评分最高的经典佳作',
      color: 'text-yellow-500',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-amber-500'
    },
    {
      key: 'now-playing',
      label: '正在上映',
      icon: <ClockIcon className="w-5 h-5" />,
      description: '影院正在热映的新片',
      color: 'text-green-500',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-emerald-500'
    },
    {
      key: 'upcoming',
      label: '即将上映',
      icon: <CalendarIcon className="w-5 h-5" />,
      description: '即将与观众见面的新电影',
      color: 'text-blue-500',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-indigo-500'
    }
  ];

  // 🎯 重构后的统一获取电影数据函数
  const fetchMoviesData = async (category: MovieCategory, pageNum: number = 1) => {
    try {
      setLoading(true);
      
      // 使用统一的 fetchMovies Server Action
      const response = await fetchMovies(category, pageNum);

      if (pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      setHasMore(pageNum < response.total_pages);
    } catch (error) {
      console.error('获取电影数据失败:', error);
      // 可以添加错误状态处理
    } finally {
      setLoading(false);
      setIsChangingCategory(false);
    }
  };

  useEffect(() => {
    fetchMoviesData(currentCategory, 1);
    setPage(1);
  }, [currentCategory]);

  // 切换分类 - 使用 Transition 优化用户体验
  const handleCategoryChange = (category: MovieCategory) => {
    if (category !== currentCategory) {
      setIsChangingCategory(true);
      startTransition(() => {
        setCurrentCategory(category);
        setPage(1);
      });
    }
  };

  // 加载更多
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMoviesData(currentCategory, nextPage);
    }
  };

  // 刷新当前分类
  const refreshCurrentCategory = () => {
    setIsChangingCategory(true);
    setPage(1);
    startTransition(() => {
      fetchMoviesData(currentCategory, 1);
    });
  };

  const currentCategoryConfig = categories.find(cat => cat.key === currentCategory) || categories[0];

  // 加载骨架屏
  if (loading && movies.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 骨架屏分类选择器 */}
        <div className="mb-8">
          <div className="h-8 bg-base-300 rounded w-48 mb-4 animate-pulse"></div>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-base-300 rounded-lg w-32 animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* 骨架屏电影网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-base-300 rounded-lg aspect-[2/3] mb-2"></div>
              <div className="h-4 bg-base-300 rounded mb-1"></div>
              <div className="h-3 bg-base-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题和描述 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-full bg-gradient-to-r ${currentCategoryConfig.gradientFrom} ${currentCategoryConfig.gradientTo}`}>
            <span className="text-white text-xl">
              {currentCategoryConfig.icon}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{currentCategoryConfig.label}</h1>
            <p className="text-base-content/60 mt-1">{currentCategoryConfig.description}</p>
          </div>
          
          {/* 刷新按钮 */}
          <div className="ml-auto">
            <button
              onClick={refreshCurrentCategory}
              className="btn btn-ghost btn-circle"
              disabled={isChangingCategory || isPending}
            >
              <ArrowPathIcon className={`w-5 h-5 ${(isChangingCategory || isPending) ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 分类选择器 */}
        <div className="tabs tabs-boxed bg-base-100/50 backdrop-blur-sm">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryChange(category.key)}
              className={`tab gap-2 ${
                currentCategory === category.key ? 'tab-active' : ''
              } ${(isChangingCategory || isPending) && currentCategory === category.key ? 'loading' : ''}`}
              disabled={isChangingCategory || isPending}
            >
              <span className={category.color}>
                {category.icon}
              </span>
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 电影网格 */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-all duration-500 ${
        isChangingCategory || isPending ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}>
        {movies.map((movie, index) => (
          <MovieCard
            key={`${currentCategory}-${movie.id}`}
            movie={movie}
            index={index}
          />
        ))}
      </div>

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn btn-primary btn-wide gap-2"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                加载中...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4" />
                加载更多电影
              </>
            )}
          </button>
        </div>
      )}

      {/* 没有更多内容提示 */}
      {!hasMore && movies.length > 0 && (
        <div className="text-center mt-12">
          <div className="card bg-base-100 shadow-md max-w-md mx-auto">
            <div className="card-body text-center">
              <h3 className="card-title justify-center text-base-content/80">
                🎬 已经到底了
              </h3>
              <p className="text-base-content/60">
                共找到 <span className="font-bold text-primary">{movies.length}</span> 部{currentCategoryConfig.label}
              </p>
              <div className="card-actions justify-center mt-4">
                <button 
                  onClick={refreshCurrentCategory}
                  className="btn btn-outline btn-sm gap-2"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  刷新列表
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!loading && movies.length === 0 && (
        <div className="text-center mt-20">
          <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
            <div className="card-body text-center">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="card-title justify-center text-xl">暂无电影</h3>
              <p className="text-base-content/60 mb-6">
                {currentCategoryConfig.label}暂时没有可显示的内容
              </p>
              <div className="card-actions justify-center">
                <button 
                  onClick={refreshCurrentCategory}
                  className="btn btn-primary gap-2"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  重新加载
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
