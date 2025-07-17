import { getImageUrl } from '@/app/lib/api';

// 通用媒体项接口
export interface MediaItem {
  id: number;
  poster_path?: string | null;
  vote_average: number;
  overview?: string;
  // 电影专用字段
  title?: string;
  release_date?: string;
  // 电视剧专用字段
  name?: string;
  first_air_date?: string;
}

interface MediaGridProps {
  items: MediaItem[];
  type: 'movie' | 'tv';
}

export default function MediaGrid({ items, type }: MediaGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">
          暂无{type === 'movie' ? '电影' : '电视剧'}数据
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item: MediaItem) => {
        const title = type === 'movie' ? item.title : item.name;
        const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
        
        return (
          <div key={item.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <figure className="relative aspect-[2/3] overflow-hidden">
              {item.poster_path ? (
                <img
                  src={getImageUrl(item.poster_path, 'w500')}
                  alt={title || '未知标题'}
                  className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-base-300 flex items-center justify-center">
                  <span className="text-base-content/60">暂无图片</span>
                </div>
              )}
              
              {/* 评分标签 */}
              {item.vote_average > 0 && (
                <div className="absolute top-2 right-2 badge badge-primary">
                  {item.vote_average.toFixed(1)}
                </div>
              )}
            </figure>
            
            <div className="card-body p-4">
              <h2 className="card-title text-sm leading-tight line-clamp-2">
                {title || '未知标题'}
              </h2>
              
              {/* 发布/首播日期 */}
              {releaseDate && (
                <p className="text-xs text-base-content/60">
                  {type === 'movie' ? '上映' : '首播'}: {new Date(releaseDate).getFullYear()}
                </p>
              )}
              
              {/* 简介 */}
              {item.overview && (
                <p className="text-xs text-base-content/80 line-clamp-3 mt-2">
                  {item.overview}
                </p>
              )}
              
              <div className="card-actions justify-end mt-3">
                <button className="btn btn-primary btn-xs">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
