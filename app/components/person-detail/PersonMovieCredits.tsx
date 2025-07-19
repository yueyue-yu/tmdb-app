/**
 * 人员电影作品组件
 * 显示人员的电影作品（演员和制作人员）
 */

import { getTranslations } from 'next-intl/server';
import WorkCard from './WorkCard';
import type { PersonMovieCreditsProps, PersonMovieWork } from '@/app/type/personDetail';

export default async function PersonMovieCredits({ 
  movieCredits, 
  personName 
}: PersonMovieCreditsProps) {
  const t = await getTranslations('PersonDetail');

  // 转换演员作品为统一格式
  const castWorks: PersonMovieWork[] = (movieCredits.cast || []).map(movie => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    character: movie.character,
    order: movie.order,
    credit_id: movie.credit_id
  }));

  // 转换制作人员作品为统一格式
  const crewWorks: PersonMovieWork[] = (movieCredits.crew || []).map(movie => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    job: movie.job,
    department: movie.department,
    credit_id: movie.credit_id
  }));

  // 按发布日期排序（最新的在前）
  const sortedCastWorks = castWorks.sort((a, b) => 
    new Date(b.release_date || '1900-01-01').getTime() - new Date(a.release_date || '1900-01-01').getTime()
  );
  
  const sortedCrewWorks = crewWorks.sort((a, b) => 
    new Date(b.release_date || '1900-01-01').getTime() - new Date(a.release_date || '1900-01-01').getTime()
  );

  const totalMovies = castWorks.length + crewWorks.length;

  if (totalMovies === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>{t('movies')}</span>
          <span className="badge badge-primary">{totalMovies}</span>
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
                type="movie"
                role="cast"
              />
            ))}
          </div>

          {castWorks.length > 12 && (
            <div className="text-center mt-4">
              <button className="btn btn-outline btn-sm">
                {t('viewAllMovieActing')} ({castWorks.length})
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
                type="movie"
                role="crew"
              />
            ))}
          </div>

          {crewWorks.length > 12 && (
            <div className="text-center mt-4">
              <button className="btn btn-outline btn-sm">
                {t('viewAllMovieCrew')} ({crewWorks.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
