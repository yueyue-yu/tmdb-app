'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface YearFilterProps {
  yearFrom?: number;
  yearTo?: number;
  onChange: (yearFrom?: number, yearTo?: number) => void;
  className?: string;
}

/**
 * 年份筛选组件
 * 支持年份范围选择
 */
export default function YearFilter({ 
  yearFrom, 
  yearTo, 
  onChange, 
  className = '' 
}: YearFilterProps) {
  const t = useTranslations('Search');
  const currentYear = new Date().getFullYear();
  const minYear = 1900;
  
  const [localYearFrom, setLocalYearFrom] = useState<string>(yearFrom?.toString() || '');
  const [localYearTo, setLocalYearTo] = useState<string>(yearTo?.toString() || '');

  // 同步外部状态
  useEffect(() => {
    setLocalYearFrom(yearFrom?.toString() || '');
    setLocalYearTo(yearTo?.toString() || '');
  }, [yearFrom, yearTo]);

  // 处理年份输入变化
  const handleYearFromChange = (value: string) => {
    setLocalYearFrom(value);
    
    const numValue = value ? parseInt(value) : undefined;
    if (!value || (numValue && numValue >= minYear && numValue <= currentYear)) {
      onChange(numValue, yearTo);
    }
  };

  const handleYearToChange = (value: string) => {
    setLocalYearTo(value);
    
    const numValue = value ? parseInt(value) : undefined;
    if (!value || (numValue && numValue >= minYear && numValue <= currentYear)) {
      onChange(yearFrom, numValue);
    }
  };



  // 清除年份筛选
  const clearYearFilter = () => {
    setLocalYearFrom('');
    setLocalYearTo('');
    onChange(undefined, undefined);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 年份范围输入 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label label-text text-sm font-medium">
            从
          </label>
          <input
            type="number"
            value={localYearFrom}
            onChange={(e) => handleYearFromChange(e.target.value)}
            placeholder={minYear.toString()}
            min={minYear}
            max={currentYear}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label label-text text-sm font-medium">
            到
          </label>
          <input
            type="number"
            value={localYearTo}
            onChange={(e) => handleYearToChange(e.target.value)}
            placeholder={currentYear.toString()}
            min={minYear}
            max={currentYear}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* 清除按钮 */}
      {(yearFrom || yearTo) && (
        <button
          onClick={clearYearFilter}
          className="btn btn-ghost btn-xs w-full"
        >
          {t('filters.clearFilter')}
        </button>
      )}

      {/* 年份范围显示 */}
      {(yearFrom || yearTo) && (
        <div className="text-xs text-base-content/60 text-center">
          {yearFrom && yearTo ? (
            `${yearFrom} - ${yearTo}`
          ) : yearFrom ? (
            `${yearFrom}年及以后`
          ) : yearTo ? (
            `${yearTo}年及以前`
          ) : null}
        </div>
      )}
    </div>
  );
}
