/**
 * Cast页面服务端组件
 * 处理翻译和数据传递
 */

import { getTranslations } from 'next-intl/server';
import CastPageClient from './CastPageClient';
import type { Credits } from '@/app/type/credits';

interface CastPageProps {
  credits: Credits;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
  mediaId: number;
  posterPath?: string;
}

export default async function CastPage({
  credits,
  mediaType,
  mediaTitle,
  mediaId,
  posterPath
}: CastPageProps) {
  const t = await getTranslations('Credits');

  const translations = {
    castAndCrew: t('castAndCrew'),
    cast: t('cast'),
    crew: t('crew'),
    noCastInfo: t('noCastInfo'),
    noCrewInfo: t('noCrewInfo'),
    showMore: t('showMore'),
    showLess: t('showLess'),
    keyCrewMembers: t('keyCrewMembers'),
    director: t('director'),
    writer: t('writer'),
    producer: t('producer'),
    composer: t('composer'),
    creator: t('creator'),
    executiveProducer: t('executiveProducer'),
    creditsStats: t('creditsStats'),
    totalCast: t('totalCast'),
    totalCrew: t('totalCrew'),
    totalPeople: t('totalPeople'),
    departments: t('departments'),
    backToDetail: t('backToDetail')
  };

  return (
    <CastPageClient
      credits={credits}
      mediaType={mediaType}
      mediaTitle={mediaTitle}
      mediaId={mediaId}
      posterPath={posterPath}
      translations={translations}
    />
  );
}
