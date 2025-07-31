import { Suspense } from 'react';
import type { Metadata } from 'next';
import Hero from '@/app/components/home/hero';
import HomeContent from '@/app/components/home/HomeContent';
import FloatingNavbar from '@/app/components/navigation/FloatingNavbar';
import { fetchMedia } from '@/app/lib/api/mediaActions';
import { MediaTypeEnum } from '@/app/type/movie';

export const metadata: Metadata = {
  title: '首页',
  description: '欢迎来到 ICE•ICE FILM，冰雪世界中的电影奇迹。探索无限精彩的影视宇宙，发现最新热门电影、经典佳作和明星资讯。',
  openGraph: {
    title: 'ICE•ICE FILM - 冰雪世界的电影奇迹',
    description: '纯净如冰，精彩如影。探索无限精彩的影视宇宙，发现最新热门电影、经典佳作和明星资讯。',
  },
};

// 加载组件
function HomeLoading() {
  return (
    <div className="space-y-0">
      {/* Hero区域 */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 animate-pulse" />

      {/* 内容区域骨架屏 */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-base-300 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-6 bg-base-300 rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="aspect-[2/3] bg-base-300 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  try {
    // 并行获取所有需要的数据
    const [
      popularMoviesResponse,
      topRatedMoviesResponse,
      popularTvResponse
    ] = await Promise.all([
      fetchMedia(MediaTypeEnum.Movie, 'popular', 1),
      fetchMedia(MediaTypeEnum.Movie, 'top-rated', 1),
      fetchMedia(MediaTypeEnum.TV, 'popular', 1)
    ]);

    // 提取数据
    const popularMovies = popularMoviesResponse.results;
    const topRatedMovies = topRatedMoviesResponse.results;
    const popularTvShows = popularTvResponse.results;

    return (
      <Suspense fallback={<HomeLoading />}>
        <div className="relative">
          {/* 浮动导航栏 */}
          <FloatingNavbar />

          {/* Hero 区域 */}
          <section id="hero" className="relative">
            <Hero />
          </section>

          {/* 主要内容区域 */}
          <section id="content" className="relative bg-base-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <HomeContent
                popularMovies={popularMovies}
                topRatedMovies={topRatedMovies}
                popularTvShows={popularTvShows}
              />
            </div>
          </section>
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error('获取首页数据失败:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">加载失败</h1>
          <p className="text-base-content/60">请刷新页面重试</p>
        </div>
      </div>
    );
  }
}
