/**
 * 电视剧详情信息组件
 * 显示制作信息、网络、季度等详细信息
 */

import { getTranslations } from 'next-intl/server';
import type { TvDetailInfoProps } from '@/app/type/tvDetail';
import NetworksInfo from './NetworksInfo';
import SeasonsHorizontal from './SeasonsHorizontal';

export default async function TvDetailInfo({ tv }: TvDetailInfoProps) {
  const t = await getTranslations('TvDetail');

  const formatLanguages = (languages: typeof tv.spoken_languages) => {
    return languages.map(lang => lang.name).join(', ');
  };

  const formatCountries = (countries: typeof tv.production_countries) => {
    return countries.map(country => country.name).join(', ');
  };

  const formatOriginCountries = (countries: string[]) => {
    return countries.join(', ');
  };

  const formatEpisodeRunTime = (runTimes: number[]) => {
    if (runTimes.length === 0) return t('unknown');
    if (runTimes.length === 1) return `${runTimes[0]} ${t('minutes')}`;
    const min = Math.min(...runTimes);
    const max = Math.max(...runTimes);
    return `${min}-${max} ${t('minutes')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 基本信息 */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">{t('basicInfo')}</h2>
            
            <div className="space-y-4">
              {/* 状态 */}
              <div className="flex justify-between">
                <span className="font-semibold">{t('status')}:</span>
                <span className={`badge ${tv.in_production ? 'badge-success' : 'badge-info'}`}>
                  {tv.status}
                </span>
              </div>

              {/* 类型 */}
              {tv.type && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('type')}:</span>
                  <span>{tv.type}</span>
                </div>
              )}

              {/* 首播日期 */}
              <div className="flex justify-between">
                <span className="font-semibold">{t('firstAirDate')}:</span>
                <span>{new Date(tv.first_air_date).toLocaleDateString()}</span>
              </div>

              {/* 最后播出日期 */}
              {tv.last_air_date && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('lastAirDate')}:</span>
                  <span>{new Date(tv.last_air_date).toLocaleDateString()}</span>
                </div>
              )}

              {/* 季数和集数 */}
              <div className="flex justify-between">
                <span className="font-semibold">{t('seasons')}:</span>
                <span>{tv.number_of_seasons}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">{t('episodes')}:</span>
                <span>{tv.number_of_episodes}</span>
              </div>

              {/* 每集时长 */}
              <div className="flex justify-between">
                <span className="font-semibold">{t('episodeRunTime')}:</span>
                <span>{formatEpisodeRunTime(tv.episode_run_time)}</span>
              </div>

              {/* 原始语言 */}
              <div className="flex justify-between">
                <span className="font-semibold">{t('originalLanguage')}:</span>
                <span>{tv.original_language.toUpperCase()}</span>
              </div>

              {/* 语言 */}
              {tv.spoken_languages.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('languages')}:</span>
                  <span className="text-right">{formatLanguages(tv.spoken_languages)}</span>
                </div>
              )}

              {/* 制作国家 */}
              {tv.production_countries.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('productionCountries')}:</span>
                  <span className="text-right">{formatCountries(tv.production_countries)}</span>
                </div>
              )}

              {/* 原产国 */}
              {tv.origin_country.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('originCountries')}:</span>
                  <span className="text-right">{formatOriginCountries(tv.origin_country)}</span>
                </div>
              )}

              {/* 受欢迎程度 */}
              <div className="flex justify-between">
                <span className="font-semibold">{t('popularity')}:</span>
                <span>{tv.popularity.toFixed(1)}</span>
              </div>

              {/* 官方网站 */}
              {tv.homepage && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('homepage')}:</span>
                  <a 
                    href={tv.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                  >
                    {t('officialSite')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 播出网络 */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">{t('networks')}</h2>
            <NetworksInfo networks={tv.networks} />
          </div>
        </div>
      </div>

      {/* 制作公司 */}
      {tv.production_companies.length > 0 && (
        <div className="card bg-base-100 shadow-lg mt-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">{t('productionCompanies')}</h2>
            <div className="space-y-4">
              {tv.production_companies.map((company) => (
                <div key={company.id} className="flex items-center gap-4 p-3 rounded-lg bg-base-200">
                  {company.logo_path ? (
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <img
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-base-content/40">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    <p className="text-sm text-base-content/70">{company.origin_country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 季度信息 */}
      {tv.seasons.length > 0 && (
        <div className="mt-8">
          <SeasonsHorizontal
            seasons={tv.seasons}
            tvId={tv.id}
            tvTitle={tv.name}
          />
        </div>
      )}
    </div>
  );
}
