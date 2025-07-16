/**
 * 电影网格骨架屏组件
 * 用于分页数据加载时的占位符
 */

export default function MovieGridSkeleton() {
  return (
    <>
      {/* 骨架屏电影网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-base-300 rounded-lg aspect-[2/3] mb-2"></div>
            <div className="h-4 bg-base-300 rounded mb-1"></div>
            <div className="h-3 bg-base-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* 骨架屏加载更多按钮 */}
      <div className="text-center">
        <div className="w-48 h-12 bg-base-300 rounded-lg mx-auto animate-pulse"></div>
      </div>
    </>
  );
}
