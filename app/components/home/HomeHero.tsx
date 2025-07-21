/**
 * Home页面Hero区域组件
 * Netflix风格的Hero Banner设计
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  PlayIcon,
  InformationCircleIcon,
  StarIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

import { getPosterUrl, getYear } from '@/app/lib/movieUtils';
import {Movie} from "@/app/lib/api";

interface HomeHeroProps {
  featuredMovies: Movie[];
}

export default function HomeHero({ featuredMovies }: HomeHeroProps) {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const t = useTranslations('MovieCard');

  // 轮播背景图片
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000); // 每5秒切换

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const currentMovie = featuredMovies[currentMovieIndex];
  const backdropUrl = currentMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path}`
    : '/images/default-backdrop.svg';



  // 渲染星级评分
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating / 2) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <StarIcon className="absolute w-4 h-4 text-yellow-400" />
            <div className="absolute overflow-hidden w-2">
              <StarSolidIcon className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-gray-400" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="relative min-h-[70vh] flex items-end overflow-hidden rounded-2xl">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={currentMovie?.title || 'Hero Background'}
          fill
          className="object-cover"
          priority
        />
        {/* 更深的渐变遮罩，为信息卡片提供更好的对比度 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>

      {/* Netflix风格的信息卡片 */}
      {currentMovie && (
        <div className="relative z-10 w-full p-8 md:p-12">
          <div className="max-w-4xl">
            {/* 电影海报 - 小尺寸装饰性 */}
            <div className="flex items-start gap-6 mb-6">
              <div className="hidden md:block flex-shrink-0">
                <Image
                  src={getPosterUrl(currentMovie.poster_path)}
                  alt={currentMovie.title}
                  width={120}
                  height={180}
                  className="rounded-lg shadow-2xl"
                />
              </div>

              {/* 电影信息 */}
              <div className="flex-1 text-white">
                {/* 标题 */}
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                  {currentMovie.title}
                </h1>

                {/* 评分和基本信息 */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {/* 星级评分 */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {renderStars(currentMovie.vote_average)}
                    </div>
                    <span className="text-lg font-semibold">
                      {currentMovie.vote_average.toFixed(1)}
                    </span>
                  </div>

                  {/* 年份 */}
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{getYear(currentMovie.release_date)}</span>
                  </div>

                  {/* 热门标签 */}
                  <div className="flex items-center gap-1 bg-red-500 px-3 py-1 rounded-full">
                    <TagIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">热门</span>
                  </div>
                </div>

                {/* 简介 */}
                <p className="text-lg md:text-xl mb-6 opacity-90 max-w-3xl leading-relaxed line-clamp-3">
                  {currentMovie.overview}
                </p>

                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/detail/movie/${currentMovie.id}`}
                    className="btn btn-primary btn-lg gap-2 shadow-lg"
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                    {t('viewDetails')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 轮播指示器 - 移到右下角，提高z-index */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2 z-20">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMovieIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentMovieIndex
                  ? 'bg-white shadow-lg'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
