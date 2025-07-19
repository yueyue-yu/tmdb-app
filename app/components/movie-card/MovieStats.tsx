import { ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';
import type { MovieStatsProps } from '@/app/type/movieCard';
import { formatVoteCount } from '@/app/lib/movieUtils';

/**
 * 电影统计信息组件（服务器组件）
 */
export default async function MovieStats({ year, voteCount }: MovieStatsProps) {
  const t = await getTranslations('MovieCard');
  return (
    <div className="stats stats-horizontal shadow-sm bg-base-100/50">
      <div className="stat py-2 px-3">
        <div className="stat-figure text-primary">
          <ClockIcon className="w-4 h-4" />
        </div>
        <div className="stat-value text-sm">{year || 'N/A'}</div>
        <div className="stat-desc text-xs">{t('year')}</div>
      </div>

      <div className="stat py-2 px-3">
        <div className="stat-figure text-secondary">
          <EyeIcon className="w-4 h-4" />
        </div>
        <div className="stat-value text-sm">{formatVoteCount(voteCount)}</div>
        <div className="stat-desc text-xs">{t('views')}</div>
      </div>
    </div>
  );
}
