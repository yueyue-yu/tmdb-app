import Link from 'next/link';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';
import type { MovieActionsProps } from '@/app/type/movieCard';
import MoreActions from './MoreActions';

/**
 * 电影操作组件（服务端组件，仅包含一个客户端子组件）
 */
export default async function MovieActions({ movieId }: MovieActionsProps) {
  const t = await getTranslations('MovieCard');
  return (
    <div className="card-actions justify-between items-center pt-2">
      <Link
        href={`/app/home/movies/${movieId}`}
        className="btn btn-primary btn-sm flex-1 gap-2"
      >
        <InformationCircleIcon className="w-4 h-4" />
        {t('viewDetails')}
      </Link>
      
      <MoreActions movieId={movieId} />
    </div>
  );
}
