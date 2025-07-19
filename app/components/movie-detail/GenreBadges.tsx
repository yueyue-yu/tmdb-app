/**
 * 类型标签组件
 * 显示电影的类型标签
 */

import type { GenreBadgesProps } from '@/app/type/movieDetail';

export default function GenreBadges({ genres }: GenreBadgesProps) {
  if (!genres || genres.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <div
          key={genre.id}
          className="badge badge-primary badge-lg text-white font-medium shadow-lg border border-white/20 backdrop-blur-sm drop-shadow-lg [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]"
        >
          {genre.name}
        </div>
      ))}
    </div>
  );
}
