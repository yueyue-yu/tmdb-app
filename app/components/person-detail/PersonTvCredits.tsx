/**
 * 人员电视剧作品组件
 * 显示人员的电视剧作品（演员和制作人员）
 */

import { getTranslations } from 'next-intl/server';
import WorkCard from './WorkCard';
import type { PersonTvCreditsProps, PersonTvWork } from '@/app/type/personDetail';

export default async function PersonTvCredits({ 
  tvCredits, 
  personName 
}: PersonTvCreditsProps) {
  const t = await getTranslations('PersonDetail');

  // 转换演员作品为统一格式
  const castWorks: PersonTvWork[] = (tvCredits.cast || []).map(tv => ({
    id: tv.id,
    name: tv.name,
    poster_path: tv.poster_path,
    first_air_date: tv.first_air_date,
    vote_average: tv.vote_average,
    character: tv.character,
    episode_count: tv.episode_count,
    credit_id: tv.credit_id
  }));

  // 转换制作人员作品为统一格式
  const crewWorks: PersonTvWork[] = (tvCredits.crew || []).map(tv => ({
    id: tv.id,
    name: tv.name,
    poster_path: tv.poster_path,
    first_air_date: tv.first_air_date,
    vote_average: tv.vote_average,
    job: tv.job,
    department: tv.department,
    episode_count: tv.episode_count,
    credit_id: tv.credit_id
  }));

  // 按首播日期排序（最新的在前）
  const sortedCastWorks = castWorks.sort((a, b) => 
    new Date(b.first_air_date || '1900-01-01').getTime() - new Date(a.first_air_date || '1900-01-01').getTime()
  );
  
  const sortedCrewWorks = crewWorks.sort((a, b) => 
    new Date(b.first_air_date || '1900-01-01').getTime() - new Date(a.first_air_date || '1900-01-01').getTime()
  );

  const totalTvShows = castWorks.length + crewWorks.length;

  if (totalTvShows === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>{t('tvShows')}</span>
          <span className="badge badge-primary">{totalTvShows}</span>
        </h3>
      </div>

      {/* 演员作品 */}
      {castWorks.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>{t('asActor')}</span>
            <span className="badge badge-secondary">{castWorks.length}</span>
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {sortedCastWorks.slice(0, 12).map((work) => (
              <WorkCard
                key={`cast-${work.credit_id}`}
                work={work}
                type="tv"
                role="cast"
              />
            ))}
          </div>

          {castWorks.length > 12 && (
            <div className="text-center mt-4">
              <button className="btn btn-outline btn-sm">
                {t('viewAllTvActing')} ({castWorks.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* 制作人员作品 */}
      {crewWorks.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>{t('asCrew')}</span>
            <span className="badge badge-accent">{crewWorks.length}</span>
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {sortedCrewWorks.slice(0, 12).map((work) => (
              <WorkCard
                key={`crew-${work.credit_id}`}
                work={work}
                type="tv"
                role="crew"
              />
            ))}
          </div>

          {crewWorks.length > 12 && (
            <div className="text-center mt-4">
              <button className="btn btn-outline btn-sm">
                {t('viewAllTvCrew')} ({crewWorks.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
