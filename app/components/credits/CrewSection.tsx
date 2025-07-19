/**
 * 制作人员区域组件
 * 显示主要制作人员信息，支持折叠展开
 */

'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import PersonCard from './PersonCard';
import { getKeyCrewMembers } from '@/app/lib/utils/creditsUtils';
import type { CrewSectionProps } from '@/app/type/credits';

interface CrewSectionClientProps extends CrewSectionProps {
  translations: {
    crew: string;
    noCrewInfo: string;
    showMore: string;
    showLess: string;
    keyCrewMembers: string;
    director: string;
    writer: string;
    producer: string;
    composer: string;
    creator: string;
    executiveProducer: string;
  };
}

export default function CrewSection({ crew, mediaType, translations }: CrewSectionClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!crew || crew.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        {translations.noCrewInfo}
      </div>
    );
  }

  // 获取关键制作人员
  const keyCrewMembers = getKeyCrewMembers(crew, mediaType, 8);
  const remainingCrew = crew.filter(member =>
    !keyCrewMembers.some(key => key.credit_id === member.credit_id)
  );
  const hasMoreCrew = crew.length > keyCrewMembers.length;
  const displayCrew = isExpanded ? crew : keyCrewMembers;

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{translations.crew}</h2>
        <span className="text-sm text-base-content/60">({crew.length})</span>
      </div>

      {/* 制作人员网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {displayCrew.map((member) => (
          <PersonCard
            key={member.credit_id}
            person={member}
            type="crew"
            mediaType={mediaType}
          />
        ))}
      </div>

      {/* 展开/折叠按钮 */}
      {hasMoreCrew && (
        <div className="text-center mt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-outline btn-sm gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                {translations.showLess}
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                {translations.showMore} ({remainingCrew.length})
              </>
            )}
          </button>
        </div>
      )}

      {/* 主要制作人员信息（文字形式） */}
      {mediaType === 'movie' && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold mb-3">{translations.keyCrewMembers}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* 导演 */}
            {(() => {
              const directors = crew.filter(person => person.job === 'Director');
              if (directors.length > 0) {
                return (
                  <div>
                    <span className="font-medium text-base-content/80">{translations.director}:</span>
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
                    <span className="font-medium text-base-content/80">{translations.writer}:</span>
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
                    <span className="font-medium text-base-content/80">{translations.producer}:</span>
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
                    <span className="font-medium text-base-content/80">{translations.composer}:</span>
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
          <h3 className="font-semibold mb-3">{translations.keyCrewMembers}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* 创作者 */}
            {(() => {
              const creators = crew.filter(person =>
                person.job === 'Creator' || person.job === 'Developer'
              );
              if (creators.length > 0) {
                return (
                  <div>
                    <span className="font-medium text-base-content/80">{translations.creator}:</span>
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
                    <span className="font-medium text-base-content/80">{translations.executiveProducer}:</span>
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
    </div>
  );
}
