'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { fetchGenres } from '@/app/lib/api/genreActions';
import type { Genre } from '@/app/lib/api/types';

interface GenreFilterProps {
  selectedGenres: number[];
  onChange: (genres: number[]) => void;
  mediaType: 'movie' | 'tv';
  className?: string;
}

/**
 * 类型筛选组件
 * 支持多选电影/电视剧类型
 */
export default function GenreFilter({ 
  selectedGenres, 
  onChange, 
  mediaType, 
  className = '' 
}: GenreFilterProps) {
  const t = useTranslations('Search');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取类型列表
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        const genreList = await fetchGenres(mediaType);
        setGenres(genreList);
      } catch (err) {
        console.error('获取类型列表失败:', err);
        setError('获取类型列表失败');
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, [mediaType]);

  // 处理类型选择
  const handleGenreToggle = (genreId: number) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    onChange(newSelectedGenres);
  };

  // 清除所有类型选择
  const clearAllGenres = () => {
    onChange([]);
  };





  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
        <p className="text-xs text-base-content/60 text-center">
          加载类型列表...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="alert alert-error alert-sm">
          <span className="text-xs">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 快捷操作按钮 */}
      {selectedGenres.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={clearAllGenres}
            className="btn btn-xs btn-ghost"
          >
            {t('filters.clearAll')}
          </button>
        </div>
      )}

      {/* 已选择的类型数量 */}
      {selectedGenres.length > 0 && (
        <div className="text-xs text-base-content/60">
          已选择 {selectedGenres.length} 个类型
        </div>
      )}

      {/* 类型选择网格 */}
      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-2">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);

          return (
            <button
              key={genre.id}
              onClick={() => handleGenreToggle(genre.id)}
              className={`btn btn-sm justify-center h-9 text-sm ${
                isSelected ? 'btn-primary' : 'btn-outline'
              }`}
              title={genre.name}
            >
              <span className="font-medium truncate">
                {genre.name}
              </span>
              {isSelected && (
                <span className="text-xs ml-1">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 已选择类型的显示 */}
      {selectedGenres.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-base-content/60">已选择:</p>
          <div className="flex flex-wrap gap-1">
            {selectedGenres.map((genreId) => {
              const genre = genres.find(g => g.id === genreId);
              if (!genre) return null;
              
              return (
                <div
                  key={genreId}
                  className="badge badge-primary badge-sm gap-1"
                >
                  <span>{genre.name}</span>
                  <button
                    onClick={() => handleGenreToggle(genreId)}
                    className="btn btn-ghost btn-xs p-0 min-h-0 h-auto"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
