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

  // 预设年份选项
  const presetYears = [
    { label: '最近5年', yearFrom: currentYear - 4, yearTo: currentYear },
    { label: '2020年代', yearFrom: 2020, yearTo: currentYear },
    { label: '2010年代', yearFrom: 2010, yearTo: 2019 },
    { label: '2000年代', yearFrom: 2000, yearTo: 2009 },
    { label: '90年代', yearFrom: 1990, yearTo: 1999 },
    { label: '经典老片', yearFrom: minYear, yearTo: 1989 }
  ];

  // 应用预设年份
  const applyPreset = (preset: { yearFrom: number; yearTo: number }) => {
    setLocalYearFrom(preset.yearFrom.toString());
    setLocalYearTo(preset.yearTo.toString());
    onChange(preset.yearFrom, preset.yearTo);
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

      {/* 预设年份选项 */}
      <div className="space-y-3">
        <p className="text-sm text-base-content/80 font-medium">快速选择:</p>
        <div className="grid grid-cols-2 gap-2">
          {presetYears.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className={`btn btn-sm text-base ${
                yearFrom === preset.yearFrom && yearTo === preset.yearTo
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
            >
              {preset.label}
            </button>
          ))}
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
