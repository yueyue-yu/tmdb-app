/**
 * Home页面内容区域组件
 * 包含各种推荐内容列表
 */

import Link from 'next/link';
import {
  TvIcon,
  StarIcon,
  ClockIcon,
  FireIcon,
  ChevronRightIcon,
  TrophyIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';

import MovieCard from '../movie-card/MovieCard';
import { MediaTypeEnum } from '@/app/type/movie';
import {Movie} from "@/app/lib/api";

interface HomeContentProps {
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  popularTvShows: Movie[];
}

export default async function HomeContent({
  popularMovies,
  topRatedMovies,
  popularTvShows
}: HomeContentProps) {
  const t = await getTranslations('Home');
  const tCategories = await getTranslations('Categories');

  return (
    <div className="space-y-12">
     

      {/* 评分最高 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <StarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t('topRated')}</h2>
            </div>
          </div>
          <Link 
            href="/home/movie/top_rated" 
            className="btn btn-ghost btn-sm gap-2"
          >
            {t('viewAll')}
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {topRatedMovies.slice(0, 5).map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              mediaType={MediaTypeEnum.Movie}
            />
          ))}
        </div>
      </section>


       {/* 热门电影 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <FireIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t('popularMovies')}</h2>
            </div>
          </div>
          <Link 
            href="/home/movie/popular" 
            className="btn btn-ghost btn-sm gap-2"
          >
            {t('viewAll')}
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {popularMovies.slice(0, 5).map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              mediaType={MediaTypeEnum.Movie}
            />
          ))}
        </div>
      </section>



      {/* 热门电视剧 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <TvIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t('popularTv')}</h2>
            </div>
          </div>
          <Link 
            href="/home/tv/popular" 
            className="btn btn-ghost btn-sm gap-2"
          >
            {t('viewAll')}
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {popularTvShows.slice(0, 5).map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              mediaType={MediaTypeEnum.TV}
            />
          ))}
        </div>
      </section>

      {/* 电影分类导航 */}
      <section className="bg-base-200 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-8">{t('exploreMovieCategories')}</h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          <Link
            href="/movie/popular"
            className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="card-body items-center text-center p-6">
              <FireIcon className="w-8 h-8 text-red-500 mb-2" />
              <h3 className="font-semibold">{tCategories('popularMovies')}</h3>
              <p className="text-sm text-base-content/60">{tCategories('popularMoviesDesc')}</p>
            </div>
          </Link>

          <Link
            href="/movie/top_rated"
            className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="card-body items-center text-center p-6">
              <TrophyIcon className="w-8 h-8 text-yellow-500 mb-2" />
              <h3 className="font-semibold">{tCategories('topRatedMovies')}</h3>
              <p className="text-sm text-base-content/60">{tCategories('topRatedMoviesDesc')}</p>
            </div>
          </Link>

          <Link
            href="/movie/now_playing"
            className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="card-body items-center text-center p-6">
              <ClockIcon className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="font-semibold">{tCategories('nowPlayingMovies')}</h3>
              <p className="text-sm text-base-content/60">{tCategories('nowPlayingMoviesDesc')}</p>
            </div>
          </Link>

          <Link
            href="/movie/upcoming"
            className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="card-body items-center text-center p-6">
              <CalendarIcon className="w-8 h-8 text-blue-500 mb-2" />
              <h3 className="font-semibold">{tCategories('upcomingMovies')}</h3>
              <p className="text-sm text-base-content/60">{tCategories('upcomingMoviesDesc')}</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
