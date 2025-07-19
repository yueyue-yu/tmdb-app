/**
 * 播出网络信息组件
 * 显示电视剧的播出网络信息
 */

import Image from 'next/image';
import type { NetworksInfoProps } from '@/app/type/tvDetail';

export default function NetworksInfo({ networks }: NetworksInfoProps) {
  if (!networks || networks.length === 0) {
    return (
      <div className="text-center text-base-content/60 py-8">
        暂无播出网络信息
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {networks.map((network) => (
        <div key={network.id} className="flex items-center gap-4 p-3 rounded-lg bg-base-200">
          {/* 网络Logo */}
          {network.logo_path ? (
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                alt={network.name}
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-base-content/40">
                {network.name.charAt(0)}
              </span>
            </div>
          )}
          
          {/* 网络信息 */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{network.name}</h3>
            <p className="text-sm text-base-content/70">{network.origin_country}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
