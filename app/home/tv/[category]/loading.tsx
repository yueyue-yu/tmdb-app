import TvGridSkeleton from '@/app/components/tv/TvGridSkeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4">
      {/* 页面标题骨架 */}
      <div className="mb-8">
        <div className="bg-base-300 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="skeleton w-8 h-8 rounded"></div>
            <div className="skeleton h-8 w-32"></div>
          </div>
          <div className="skeleton h-6 w-64"></div>
        </div>
      </div>
      
      {/* 分类选择器骨架 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-8 w-24 rounded-btn"></div>
        ))}
      </div>
      
      {/* 电视剧网格骨架 */}
      <TvGridSkeleton />
    </div>
  );
}
