

/**
 * 动态路由加载状态
 * 当 page.tsx 中的异步操作执行时显示
 */

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 骨架屏分类选择器 */}
      <div className="mb-8">
        <div className="tabs tabs-boxed bg-base-100/50 backdrop-blur-sm">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="tab gap-2">
              <div className="w-5 h-5 bg-base-300 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-base-300 rounded animate-pulse hidden sm:block"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 骨架屏页面标题 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-base-300 rounded-full animate-pulse"></div>
          <div>
            <div className="h-8 bg-base-300 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-base-300 rounded w-64 animate-pulse"></div>
          </div>
          <div className="ml-auto">
            <div className="w-12 h-12 bg-base-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* 骨架屏电影网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-base-300 rounded-lg aspect-[2/3] mb-2"></div>
            <div className="h-4 bg-base-300 rounded mb-1"></div>
            <div className="h-3 bg-base-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* 骨架屏加载更多 */}
      <div className="text-center mt-12">
        <div className="w-48 h-12 bg-base-300 rounded-lg mx-auto animate-pulse"></div>
      </div>
    </div>
  );
}