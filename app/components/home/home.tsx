/**
 * 新的Home页面组件
 * 包含动态内容和真实数据
 */

import HomeHero from './HomeHero';
import HomeContent from "@/app/components/home/HomeContent";
import {Movie} from "@/app/lib/api";


interface HomeProps {
  featuredMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  popularTvShows: Movie[];
}

export default function Home({
  featuredMovies,
  popularMovies,
  topRatedMovies,
  popularTvShows
}: HomeProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12">
      {/* Hero区域 */}
      <HomeHero featuredMovies={featuredMovies} />

      {/* 内容区域 */}
      <HomeContent
        popularMovies={popularMovies}
        topRatedMovies={topRatedMovies}
        popularTvShows={popularTvShows}
      />
    </div>
  );
}
