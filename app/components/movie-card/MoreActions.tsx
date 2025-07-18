'use client';

import { useTranslations } from 'next-intl';
import type { MoreActionsProps } from '@/app/type/movieCard';

/**
 * 更多操作菜单组件（客户端组件 - 需要交互）
 */
export default function MoreActions({ movieId }: MoreActionsProps) {
  const t = useTranslations('MovieCard');
  const handleShare = () => {
    // TODO: 实现分享功能
    console.log('分享电影', movieId);
  };

  const handleFavorite = () => {
    // TODO: 实现收藏功能
    console.log('收藏电影', movieId);
  };

  const handleReport = () => {
    // TODO: 实现举报功能
    console.log('举报电影', movieId);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 text-sm">
        <li><button onClick={handleShare}>{t('share')}</button></li>
        <li><button onClick={handleFavorite}>{t('favorite')}</button></li>
        <li><button onClick={handleReport}>{t('report')}</button></li>
      </ul>
    </div>
  );
}
