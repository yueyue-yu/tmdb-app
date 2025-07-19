/**
 * 人员作品组件
 * 显示人员的电影和电视剧作品
 */

import { getTranslations } from 'next-intl/server';
import PersonMovieCredits from './PersonMovieCredits';
import PersonTvCredits from './PersonTvCredits';
import type { PersonCreditsProps } from '@/app/type/personDetail';

export default async function PersonCredits({ 
  movieCredits, 
  tvCredits, 
  personName 
}: PersonCreditsProps) {
  const t = await getTranslations('PersonDetail');

  const totalMovies = (movieCredits.cast?.length || 0) + (movieCredits.crew?.length || 0);
  const totalTvShows = (tvCredits.cast?.length || 0) + (tvCredits.crew?.length || 0);
  const totalWorks = totalMovies + totalTvShows;

  if (totalWorks === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-base-content/60 py-12">
          <h2 className="text-2xl font-bold mb-4">{t('works')}</h2>
          <p>{t('noWorksFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 作品标题和统计 */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">{t('works')}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="badge badge-primary badge-lg">
            {t('totalWorks')}: {totalWorks}
          </div>
          {totalMovies > 0 && (
            <div className="badge badge-secondary badge-lg">
              {t('movies')}: {totalMovies}
            </div>
          )}
          {totalTvShows > 0 && (
            <div className="badge badge-accent badge-lg">
              {t('tvShows')}: {totalTvShows}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {/* 电影作品 */}
        {totalMovies > 0 && (
          <PersonMovieCredits 
            movieCredits={movieCredits} 
            personName={personName} 
          />
        )}

        {/* 电视剧作品 */}
        {totalTvShows > 0 && (
          <PersonTvCredits 
            tvCredits={tvCredits} 
            personName={personName} 
          />
        )}
      </div>

      {/* 作品统计信息 */}
      <div className="mt-12 p-6 bg-base-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">{t('workStats')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {movieCredits.cast?.length || 0}
            </div>
            <div className="text-sm text-base-content/70">{t('movieActing')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">
              {movieCredits.crew?.length || 0}
            </div>
            <div className="text-sm text-base-content/70">{t('movieCrew')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">
              {tvCredits.cast?.length || 0}
            </div>
            <div className="text-sm text-base-content/70">{t('tvActing')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-info">
              {tvCredits.crew?.length || 0}
            </div>
            <div className="text-sm text-base-content/70">{t('tvCrew')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
