/**
 * Cast页面客户端组件
 * 显示完整的Cast和Crew信息
 */

'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import CastSection from './CastSection';
import CrewSection from './CrewSection';
import type { Credits } from '@/app/type/credits';

interface CastPageClientProps {
  credits: Credits;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  mediaId: number;
  posterPath?: string;
  translations: {
    castAndCrew: string;
    cast: string;
    crew: string;
    noCastInfo: string;
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
    creditsStats: string;
    totalCast: string;
    totalCrew: string;
    totalPeople: string;
    departments: string;
    backToDetail: string;
  };
}

/**
 * 获取海报URL
 */
function getPosterUrl(path: string | null | undefined): string {
  if (!path) return '/images/no-poster.jpg';
  return `https://image.tmdb.org/t/p/w342${path}`;
}

export default function CastPageClient({
  credits,
  mediaType,
  mediaTitle,
  mediaId,
  posterPath,
  translations
}: CastPageClientProps) {
  const router = useRouter();
  const detailPageUrl = `/detail/${mediaType}/${mediaId}`;

  const handleBack = () => {
    router.back();
  };

  if (!credits || (!credits.cast?.length && !credits.crew?.length)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={handleBack}
          className="btn btn-ghost gap-2 mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {translations.backToDetail}
        </button>

        <div className="text-center text-base-content/60 py-12">
          <h1 className="text-3xl font-bold mb-4">{translations.castAndCrew}</h1>
          <p>暂无演职人员信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        className="btn btn-ghost gap-2 mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        {translations.backToDetail}
      </button>

      {/* 页面标题和海报 */}
      <div className="flex items-start gap-6 mb-8">
        {/* 海报 */}
        {posterPath && (
          <div className="flex-shrink-0">
            <img
              src={getPosterUrl(posterPath)}
              alt={mediaTitle}
              className="w-24 h-36 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        
        {/* 标题信息 */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{translations.castAndCrew}</h1>
          <p className="text-base-content/70 text-lg">
            {mediaTitle}
          </p>
          
          {/* 快速统计 */}
          <div className="flex gap-6 mt-4 text-sm">
            {credits.cast && credits.cast.length > 0 && (
              <div>
                <span className="font-semibold text-primary">{credits.cast.length}</span>
                <span className="text-base-content/60 ml-1">{translations.cast}</span>
              </div>
            )}
            {credits.crew && credits.crew.length > 0 && (
              <div>
                <span className="font-semibold text-secondary">{credits.crew.length}</span>
                <span className="text-base-content/60 ml-1">{translations.crew}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* 演员区域 */}
        {credits.cast && credits.cast.length > 0 && (
          <CastSection
            cast={credits.cast}
            mediaType={mediaType}
            translations={{
              cast: translations.cast,
              noCastInfo: translations.noCastInfo,
              showMore: translations.showMore,
              showLess: translations.showLess
            }}
          />
        )}

        {/* 制作人员区域 */}
        {credits.crew && credits.crew.length > 0 && (
          <CrewSection
            crew={credits.crew}
            mediaType={mediaType}
            translations={{
              crew: translations.crew,
              noCrewInfo: translations.noCrewInfo,
              showMore: translations.showMore,
              showLess: translations.showLess,
              keyCrewMembers: translations.keyCrewMembers,
              director: translations.director,
              writer: translations.writer,
              producer: translations.producer,
              composer: translations.composer,
              creator: translations.creator,
              executiveProducer: translations.executiveProducer
            }}
          />
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-12 p-6 bg-base-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">{translations.creditsStats}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {credits.cast?.length || 0}
            </div>
            <div className="text-sm text-base-content/70">{translations.totalCast}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">
              {credits.crew?.length || 0}
            </div>
            <div className="text-sm text-base-content/70">{translations.totalCrew}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">
              {(credits.cast?.length || 0) + (credits.crew?.length || 0)}
            </div>
            <div className="text-sm text-base-content/70">{translations.totalPeople}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-info">
              {credits.crew ? 
                [...new Set(credits.crew.map(person => person.department))].length : 0
              }
            </div>
            <div className="text-sm text-base-content/70">{translations.departments}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
