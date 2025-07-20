'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface RatingFilterProps {
  ratingFrom?: number;
  ratingTo?: number;
  onChange: (ratingFrom?: number, ratingTo?: number) => void;
  className?: string;
}

/**
 * 评分筛选组件
 * 支持评分范围选择
 */
export default function RatingFilter({
  ratingFrom,
  ratingTo,
  onChange,
  className = ''
}: RatingFilterProps) {
  const t = useTranslations('Search');

  // 渲染星级显示
  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 2); // 10分制转5星制
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`text-lg ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };
  
  const [localRatingFrom, setLocalRatingFrom] = useState<string>(ratingFrom?.toString() || '');
  const [localRatingTo, setLocalRatingTo] = useState<string>(ratingTo?.toString() || '');

  // 同步外部状态
  useEffect(() => {
    setLocalRatingFrom(ratingFrom?.toString() || '');
    setLocalRatingTo(ratingTo?.toString() || '');
  }, [ratingFrom, ratingTo]);

  // 处理评分输入变化
  const handleRatingFromChange = (value: string) => {
    setLocalRatingFrom(value);
    
    const numValue = value ? parseFloat(value) : undefined;
    if (!value || (numValue && numValue >= 0 && numValue <= 10)) {
      onChange(numValue, ratingTo);
    }
  };

  const handleRatingToChange = (value: string) => {
    setLocalRatingTo(value);
    
    const numValue = value ? parseFloat(value) : undefined;
    if (!value || (numValue && numValue >= 0 && numValue <= 10)) {
      onChange(ratingFrom, numValue);
    }
  };

  // 清除评分筛选
  const clearRatingFilter = () => {
    setLocalRatingFrom('');
    setLocalRatingTo('');
    onChange(undefined, undefined);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 评分范围滑动条 */}
      <div className="space-y-4">
        <div>
          <label className="label label-text text-sm font-medium">
            最低评分: {localRatingFrom || 0}
          </label>
          <input
            type="range"
            value={localRatingFrom || 0}
            onChange={(e) => handleRatingFromChange(e.target.value)}
            min="0"
            max="10"
            step="0.1"
            className="range range-primary w-full"
          />
          <div className="w-full flex justify-between text-xs px-2 text-base-content/60">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8</span>
            <span>10</span>
          </div>
        </div>
        <div>
          <label className="label label-text text-sm font-medium">
            最高评分: {localRatingTo || 10}
          </label>
          <input
            type="range"
            value={localRatingTo || 10}
            onChange={(e) => handleRatingToChange(e.target.value)}
            min="0"
            max="10"
            step="0.1"
            className="range range-primary w-full"
          />
          <div className="w-full flex justify-between text-xs px-2 text-base-content/60">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8</span>
            <span>10</span>
          </div>
        </div>
      </div>



      {/* 清除按钮 */}
      {(ratingFrom !== undefined || ratingTo !== undefined) && (
        <button
          onClick={clearRatingFilter}
          className="btn btn-ghost btn-xs w-full"
        >
          {t('filters.clearFilter')}
        </button>
      )}

      {/* 评分范围显示 */}
      {(ratingFrom !== undefined || ratingTo !== undefined) && (
        <div className="text-xs text-base-content/60 text-center space-y-1">
          <div>
            {ratingFrom !== undefined && ratingTo !== undefined ? (
              `${ratingFrom} - ${ratingTo} 分`
            ) : ratingFrom !== undefined ? (
              `${ratingFrom}分及以上`
            ) : ratingTo !== undefined ? (
              `${ratingTo}分及以下`
            ) : null}
          </div>
          {ratingFrom !== undefined && (
            <div className="flex justify-center">
              {renderStars(ratingFrom)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
