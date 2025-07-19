/**
 * 演员区域组件
 * 显示主要演员信息，支持折叠展开
 */

'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import PersonCard from './PersonCard';
import type { CastSectionProps } from '@/app/type/credits';

interface CastSectionClientProps extends CastSectionProps {
  translations: {
    cast: string;
    noCastInfo: string;
    showMore: string;
    showLess: string;
  };
}

export default function CastSection({ cast, mediaType, translations }: CastSectionClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!cast || cast.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        {translations.noCastInfo}
      </div>
    );
  }

  // 显示前8位主要演员
  const mainCast = cast.slice(0, 8);
  const remainingCast = cast.slice(8);
  const hasMoreCast = cast.length > 8;
  const displayCast = isExpanded ? cast : mainCast;

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{translations.cast}</h2>
        <span className="text-sm text-base-content/60">({cast.length})</span>
      </div>

      {/* 演员网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {displayCast.map((actor) => (
          <PersonCard
            key={actor.cast_id}
            person={actor}
            type="cast"
            mediaType={mediaType}
          />
        ))}
      </div>

      {/* 展开/折叠按钮 */}
      {hasMoreCast && (
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
                {translations.showMore} ({remainingCast.length})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
