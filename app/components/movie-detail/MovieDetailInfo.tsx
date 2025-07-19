/**
 * 电影详情信息组件
 * 显示制作信息、公司等详细信息
 */

import { getTranslations } from 'next-intl/server';
import type { MovieDetailInfoProps } from '@/app/type/movieDetail';
import ProductionCompanies from './ProductionCompanies';

export default async function MovieDetailInfo({ movie }: MovieDetailInfoProps) {
  const t = await getTranslations('MovieDetail');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLanguages = (languages: typeof movie.spoken_languages) => {
    return languages.map(lang => lang.name).join(', ');
  };

  const formatCountries = (countries: typeof movie.production_countries) => {
    return countries.map(country => country.name).join(', ');
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
                <span className="badge badge-success">{movie.status}</span>
              </div>

              {/* 原始语言 */}
              <div className="flex justify-between">
                <span className="font-semibold">{t('originalLanguage')}:</span>
                <span>{movie.original_language.toUpperCase()}</span>
              </div>

              {/* 语言 */}
              {movie.spoken_languages.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('languages')}:</span>
                  <span className="text-right">{formatLanguages(movie.spoken_languages)}</span>
                </div>
              )}

              {/* 制作国家 */}
              {movie.production_countries.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('countries')}:</span>
                  <span className="text-right">{formatCountries(movie.production_countries)}</span>
                </div>
              )}

              {/* 预算 */}
              {movie.budget && movie.budget > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('budget')}:</span>
                  <span className="text-success font-semibold">{formatCurrency(movie.budget)}</span>
                </div>
              )}

              {/* 票房 */}
              {movie.revenue && movie.revenue > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('revenue')}:</span>
                  <span className="text-success font-semibold">{formatCurrency(movie.revenue)}</span>
                </div>
              )}

              {/* 受欢迎程度 */}
              <div className="flex justify-between">
                <span className="font-semibold">{t('popularity')}:</span>
                <span>{movie.popularity.toFixed(1)}</span>
              </div>

              {/* IMDB链接 */}
              {movie.imdb_id && (
                <div className="flex justify-between">
                  <span className="font-semibold">IMDB:</span>
                  <a 
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                  >
                    {movie.imdb_id}
                  </a>
                </div>
              )}

              {/* 官方网站 */}
              {movie.homepage && (
                <div className="flex justify-between">
                  <span className="font-semibold">{t('homepage')}:</span>
                  <a 
                    href={movie.homepage}
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

        {/* 制作公司 */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">{t('productionCompanies')}</h2>
            <ProductionCompanies companies={movie.production_companies} />
          </div>
        </div>
      </div>
    </div>
  );
}
