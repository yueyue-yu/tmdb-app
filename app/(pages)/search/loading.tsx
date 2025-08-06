import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchResultsSkeleton from '@/app/components/search/SearchResultsSkeleton';

/**
 * 搜索页面的加载状态
 * 当页面数据在服务端获取时，将显示此UI
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 页面标题骨架 */}
        <div className="flex items-center gap-3 mb-6 animate-pulse">
          <div className="p-2 rounded-xl bg-gray-300">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
            <div className="h-3 w-48 bg-gray-300 rounded mt-2 hidden sm:block"></div>
          </div>
        </div>

        {/* 搜索表单骨架 */}
        <div className="mb-6 animate-pulse">
          <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
        </div>

        {/* 搜索结果区域 */}
        <div>
          {/* 搜索结果标题骨架 */}
          <div className="mb-4 animate-pulse">
            <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-56 bg-gray-300 rounded"></div>
          </div>
          
          {/* 结果列表骨架 */}
          <SearchResultsSkeleton />
        </div>
      </div>
    </div>
  );
}
