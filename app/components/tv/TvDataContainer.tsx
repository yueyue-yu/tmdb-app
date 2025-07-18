import { Suspense } from 'react';
import { fetchTvShows, type TvCategory } from '@/app/lib/api/tvActions';
import TvGrid from './TvGrid';
import TvLoadMoreButton from './TvLoadMoreButton';

interface TvDataContainerProps {
  category: TvCategory;
  page: number;
}

export default async function TvDataContainer({ category, page }: TvDataContainerProps) {
  try {
    const response = await fetchTvShows(category, page);
    
    return (
      <div className="space-y-6">
        <TvGrid tvShows={response.results} />
        
        {/* 分页控件 */}
        {response.total_pages > 1 && (
          <div className="flex justify-center">
            <Suspense fallback={<div className="loading loading-spinner"></div>}>
              <TvLoadMoreButton 
                category={category}
                currentPage={page}
                totalPages={response.total_pages}
              />
            </Suspense>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('获取电视剧数据失败:', error);
    
    return (
      <div className="text-center py-12">
        <div className="alert alert-error max-w-md mx-auto">
          <span>获取电视剧数据失败，请稍后重试</span>
        </div>
      </div>
    );
  }
}
