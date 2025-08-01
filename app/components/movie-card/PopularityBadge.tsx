import { FireIcon } from '@heroicons/react/24/outline';
import type { PopularityBadgeProps } from '@/app/type/movieCard';
import { POPULARITY_LABELS } from '@/app/lib/constant/movieCard';

/**
 * 受欢迎程度徽章组件（服务端组件）
 * 使用百分比高度和自适应宽度
 */
export default function PopularityBadge({ level }: PopularityBadgeProps) {
  if (level === 'normal') return null;

  // 根据级别确定背景色
  const bgColor = level === 'hot'
    ? 'bg-red-500 hover:bg-red-600'
    : 'bg-purple-500 hover:bg-purple-600';

  const label = POPULARITY_LABELS[level];

  return (
    <div className={`
      absolute top-[3%] left-[3%] z-10
      ${bgColor}
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
      hidden sm:flex
    `}>
      <FireIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}
