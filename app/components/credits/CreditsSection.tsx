/**
 * 演职人员总组件
 * 统一显示演员和制作人员信息
 */

import { getTranslations } from 'next-intl/server';
import CastSection from './CastSection';
import CrewSection from './CrewSection';
import type { CreditsProps } from '@/app/type/credits';

export default async function CreditsSection({ credits, mediaType, mediaTitle }: CreditsProps) {
  const t = await getTranslations('Credits');

  if (!credits || (!credits.cast?.length && !credits.crew?.length)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-base-content/60 py-12">
          <h2 className="text-2xl font-bold mb-4">{t('creditsTitle')}</h2>
          <p>{t('noCreditsInfo')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 演职人员标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('creditsTitle')}</h1>
        <p className="text-base-content/70">
          {mediaTitle} - {t('castAndCrew')}
        </p>
      </div>

      <div className="space-y-12">
        {/* 演员区域 */}
        {credits.cast && credits.cast.length > 0 && (
          <CastSection cast={credits.cast} mediaType={mediaType} />
        )}

        {/* 制作人员区域 */}
        {credits.crew && credits.crew.length > 0 && (
          <CrewSection crew={credits.crew} mediaType={mediaType} />
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-12 p-6 bg-base-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">{t('creditsStats')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {credits.cast?.length || 0}
            </div>
            <div className="text-sm text-base-content/70">{t('totalCast')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">
              {credits.crew?.length || 0}
            </div>
            <div className="text-sm text-base-content/70">{t('totalCrew')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">
              {(credits.cast?.length || 0) + (credits.crew?.length || 0)}
            </div>
            <div className="text-sm text-base-content/70">{t('totalPeople')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-info">
              {credits.crew ? 
                [...new Set(credits.crew.map(person => person.department))].length : 0
              }
            </div>
            <div className="text-sm text-base-content/70">{t('departments')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
