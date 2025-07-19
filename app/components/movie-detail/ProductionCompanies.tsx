/**
 * 制作公司组件
 * 显示电影的制作公司信息
 */

import Image from 'next/image';
import type { ProductionCompaniesProps } from '@/app/type/movieDetail';

export default function ProductionCompanies({ companies }: ProductionCompaniesProps) {
  if (!companies || companies.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        暂无制作公司信息
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <div key={company.id} className="flex items-center gap-4 p-3 rounded-lg bg-base-200">
          {/* 公司Logo */}
          {company.logo_path ? (
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                alt={company.name}
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-base-content/40">
                {company.name.charAt(0)}
              </span>
            </div>
          )}
          
          {/* 公司信息 */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{company.name}</h3>
            <p className="text-sm text-base-content/70">{company.origin_country}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
