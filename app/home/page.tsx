import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import HomeComponent from '@/app/components/home/home';
import { fetchMedia } from '@/app/lib/api/mediaActions';
import { MediaTypeEnum } from '@/app/type/movie';

// 加载组件
function HomeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12">
      {/* Hero区域骨架屏 */}
      <div className="min-h-[70vh] bg-base-200 rounded-2xl animate-pulse" />

      {/* 内容区域骨架屏 */}
      <div className="space-y-12">
        {[1, 2, 3, 4].map((section) => (
          <div key={section} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-base-300 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-6 bg-base-300 rounded animate-pulse" />
                <div className="w-48 h-4 bg-base-300 rounded animate-pulse" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="aspect-[2/3] bg-base-300 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
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

    // 选择特色电影（从热门电影中选择前5部作为轮播）
    const featuredMovies = popularMovies.slice(0, 5);

    return (
      <Suspense fallback={<HomeLoading />}>
        <HomeComponent
          featuredMovies={featuredMovies}
          popularMovies={popularMovies}
          topRatedMovies={topRatedMovies}
          popularTvShows={popularTvShows}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('获取首页数据失败:', error);
    notFound();
  }
}

// 设置重新验证时间，实现 ISR
export const revalidate = 1800; // 30分钟重新验证一次
