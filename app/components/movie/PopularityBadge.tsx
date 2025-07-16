import { FireIcon } from '@heroicons/react/24/outline';
import type { PopularityBadgeProps } from '@/app/type/movieCard';
import { POPULARITY_LABELS } from '@/app/constant/movieCard';

/**
 * 受欢迎程度徽章组件（服务端组件）
 */
export default function PopularityBadge({ level }: PopularityBadgeProps) {
  if (level === 'normal') return null;

  const badgeClass = level === 'hot' ? 'badge-error' : 'badge-secondary';
  const label = POPULARITY_LABELS[level];

  return (
    <div className={`badge ${badgeClass} badge-lg gap-1 absolute top-3 left-3 text-white font-bold`}>
      <FireIcon className="w-3 h-3" />
      {label}
    </div>
  );
}
