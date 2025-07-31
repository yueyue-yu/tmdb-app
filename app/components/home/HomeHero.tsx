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
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden px-4 md:px-8">
      {/* 轮播容器 */}
      <div className="relative w-full h-full">
        {/* 轮播卡片容器 */}
        <div className="flex transition-transform duration-500 ease-in-out h-full gap-4 md:gap-8"
             style={{ transform: `translateX(calc(-${currentMovieIndex * 100}% - ${currentMovieIndex * 1}rem))` }}>
          {featuredMovies.map((movie, index) => {
            const backdropUrl = movie?.backdrop_path
              ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
              : '/images/default-backdrop.svg';

            return (
              <div key={movie.id} className="w-full h-full flex-shrink-0 relative rounded-2xl overflow-hidden">
                {/* 背景图片 - 移动端使用海报，非移动端使用背景图 */}
                <div className="absolute inset-0">
                  {/* 移动端海报背景 */}
                  <div className="md:hidden">
                    <Image
                      src={getPosterUrl(movie.poster_path)}
                      alt={movie?.title || 'Hero Background'}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="100vw"
                    />
                    {/* 移动端渐变遮罩 - 更强的遮罩确保文字可读 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
                  </div>

                  {/* 非移动端背景图 */}
                  <div className="hidden md:block">
                    <Image
                      src={backdropUrl}
                      alt={movie?.title || 'Hero Background'}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="100vw"
                    />
                    {/* 非移动端渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  </div>
                </div>

                {/* 响应式内容区域 - 始终渲染 */}
                {/* 移动端布局 - 底部信息覆盖 */}
                <div className="relative z-10 w-full h-full flex flex-col justify-end p-4 text-white md:hidden">
                  {/* 底部信息区域 */}
                  <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 rounded-t-2xl">
                    {/* 标题 */}
                    <h1 className="text-2xl font-bold mb-3 drop-shadow-lg line-clamp-2">
                      {movie.title}
                    </h1>

                    {/* 评分和年份 */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      {/* 评分 */}
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {renderStars(movie.vote_average)}
                        </div>
                        <span className="text-lg font-semibold">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>

                      {/* 年份标签 */}
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="font-medium">{getYear(movie.release_date)}</span>
                      </div>
                    </div>

                    {/* 简化的简介 - 固定高度 */}
                    <div className="h-12 flex items-center">
                      <p className="text-sm opacity-90 line-clamp-2 leading-relaxed text-center">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 非移动端布局 - 电影院式 */}
                <div className="hidden md:flex relative z-10 w-full h-full items-center p-8 lg:p-12">
                  <div className="max-w-6xl mx-auto w-full">
                    <div className="flex items-center gap-8 lg:gap-12">
                      {/* 海报 */}
                      <div className="flex-shrink-0">
                        <Image
                          src={getPosterUrl(movie.poster_path)}
                          alt={movie.title}
                          width={200}
                          height={300}
                          className="rounded-xl shadow-2xl"
                          sizes="(max-width: 1024px) 160px, 200px"
                        />
                      </div>

                      {/* 电影信息 */}
                      <div className="flex-1 text-white">
                        {/* 标题 - 固定高度 */}
                        <div className="h-20 lg:h-32 flex items-center mb-6">
                          <h1 className="text-4xl lg:text-6xl font-bold drop-shadow-lg line-clamp-2">
                            {movie.title}
                          </h1>
                        </div>

                        {/* 评分和信息标签 */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                          {/* 星级评分 */}
                          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                            <div className="flex gap-1">
                              {renderStars(movie.vote_average)}
                            </div>
                            <span className="text-lg font-semibold">
                              {movie.vote_average.toFixed(1)}
                            </span>
                          </div>

                          {/* 年份 */}
                          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="font-medium">{getYear(movie.release_date)}</span>
                          </div>

                          {/* 热门标签 */}
                          <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                            <TagIcon className="w-4 h-4" />
                            <span className="text-sm font-semibold">热门</span>
                          </div>
                        </div>

                        {/* 简介 - 固定高度 */}
                        <div className="h-24 lg:h-32 flex items-start mb-8">
                          <p className="text-lg lg:text-xl opacity-90 max-w-3xl leading-relaxed line-clamp-3">
                            {movie.overview}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 左右导航按钮 */}
        {featuredMovies.length > 1 && (
          <>
            {/* 左侧导航按钮 */}
            <button
              onClick={() => setCurrentMovieIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="上一部电影"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 右侧导航按钮 */}
            <button
              onClick={() => setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="下一部电影"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
