/**
 * 制作人员区域组件
 * 显示主要制作人员信息
 */

import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import PersonCard from './PersonCard';
import { getKeyCrewMembers } from '@/app/lib/utils/creditsUtils';
import type { CrewSectionProps } from '@/app/type/credits';

export default async function CrewSection({ crew, mediaType }: CrewSectionProps) {
  const t = await getTranslations('Credits');
  
  if (!crew || crew.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        {t('noCrewInfo')}
      </div>
    );
  }

  // 获取关键制作人员
  const keyCrewMembers = getKeyCrewMembers(crew, mediaType, 8);
  const hasMoreCrew = crew.length > keyCrewMembers.length;

  return (
    <div className="space-y-4">
      {/* 标题和查看全部链接 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('crew')}</h2>
        {hasMoreCrew && (
          <Link 
            href={`/credits/${mediaType}/crew`}
            className="flex items-center gap-1 text-primary hover:text-primary-focus transition-colors"
          >
            <span className="text-sm">{t('viewAll')} ({crew.length})</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* 制作人员网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {keyCrewMembers.map((member) => (
          <PersonCard
            key={member.credit_id}
            person={member}
            type="crew"
            mediaType={mediaType}
          />
        ))}
      </div>

      {/* 主要制作人员信息（文字形式） */}
      {mediaType === 'movie' && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold mb-3">{t('keyCrewMembers')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* 导演 */}
            {(() => {
              const directors = crew.filter(person => person.job === 'Director');
              if (directors.length > 0) {
                return (
                  <div>
                    <span className="font-medium text-base-content/80">{t('director')}:</span>
                    <span className="ml-2">
                      {directors.map(d => d.name).join(', ')}
                    </span>
                  </div>
                );
              }
            })()}

            {/* 编剧 */}
            {(() => {
              const writers = crew.filter(person => 
                person.job === 'Writer' || person.job === 'Screenplay' || person.job === 'Story'
              );
              if (writers.length > 0) {
                return (
                  <div>
                    <span className="font-medium text-base-content/80">{t('writer')}:</span>
                    <span className="ml-2">
                      {writers.slice(0, 3).map(w => w.name).join(', ')}
                    </span>
                  </div>
                );
              }
            })()}

            {/* 制片人 */}
            {(() => {
              const producers = crew.filter(person => 
                person.job === 'Producer' || person.job === 'Executive Producer'
              );
              if (producers.length > 0) {
                return (
                  <div>
                    <span className="font-medium text-base-content/80">{t('producer')}:</span>
                    <span className="ml-2">
                      {producers.slice(0, 3).map(p => p.name).join(', ')}
                    </span>
                  </div>
                );
              }
            })()}

            {/* 音乐 */}
            {(() => {
              const composers = crew.filter(person => person.job === 'Original Music Composer');
              if (composers.length > 0) {
                return (
                  <div>
                    <span className="font-medium text-base-content/80">{t('composer')}:</span>
                    <span className="ml-2">
                      {composers.map(c => c.name).join(', ')}
                    </span>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}

      {/* 电视剧制作人员信息 */}
      {mediaType === 'tv' && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold mb-3">{t('keyCrewMembers')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* 创作者 */}
            {(() => {
              const creators = crew.filter(person => 
                person.job === 'Creator' || person.job === 'Developer'
              );
              if (creators.length > 0) {
                return (
                  <div>
                    <span className="font-medium text-base-content/80">{t('creator')}:</span>
                    <span className="ml-2">
                      {creators.map(c => c.name).join(', ')}
                    </span>
                  </div>
                );
              }
            })()}

            {/* 执行制片人 */}
            {(() => {
              const executiveProducers = crew.filter(person => person.job === 'Executive Producer');
              if (executiveProducers.length > 0) {
                return (
                  <div>
                    <span className="font-medium text-base-content/80">{t('executiveProducer')}:</span>
                    <span className="ml-2">
                      {executiveProducers.slice(0, 3).map(ep => ep.name).join(', ')}
                    </span>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}

      {/* 查看全部按钮（移动端） */}
      {hasMoreCrew && (
        <div className="text-center mt-6 lg:hidden">
          <Link 
            href={`/credits/${mediaType}/crew`}
            className="btn btn-outline btn-sm"
          >
            {t('viewAllCrew')} ({crew.length})
          </Link>
        </div>
      )}
    </div>
  );
}
