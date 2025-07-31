import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import type { RatingBadgeProps } from '@/app/type/movieCard';

/**
 * 评分徽章组件（服务端组件）
 * 使用百分比高度和自适应宽度
 */
export default function RatingBadge({ rating, badgeClass }: RatingBadgeProps) {
  // 根据评分确定背景色
  const getBgColor = () => {
    if (rating >= 8) return 'bg-green-500 hover:bg-green-600';
    if (rating >= 7) return 'bg-yellow-500 hover:bg-yellow-600';
    if (rating >= 6) return 'bg-orange-500 hover:bg-orange-600';
    return 'bg-red-500 hover:bg-red-600';
  };

  return (
    <div className={`
      absolute top-[3%] right-[3%] z-10
      ${getBgColor()}
      text-white font-bold
      rounded-full
      px-2 py-1
      flex items-center gap-1
      shadow-lg backdrop-blur-sm
      transition-all duration-300
      hover:scale-105
      text-xs sm:text-sm
      h-[8%] min-h-[24px] max-h-[32px]
      w-auto
    `}>
      <StarSolidIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
      <span className="whitespace-nowrap">{rating.toFixed(1)}</span>
    </div>
  );
}
