import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import type { RatingBadgeProps } from '@/app/type/movieCard';

/**
 * 评分徽章组件（服务端组件）
 */
export default function RatingBadge({ rating, badgeClass }: RatingBadgeProps) {
  return (
    <div className={`badge ${badgeClass} badge-lg gap-1 absolute top-3 right-3 text-white font-bold shadow-lg`}>
      <StarSolidIcon className="w-3 h-3" />
      {rating.toFixed(1)}
    </div>
  );
}
