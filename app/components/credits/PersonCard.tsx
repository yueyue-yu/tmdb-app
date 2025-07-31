/**
 * 人员卡片组件
 * 显示演员或制作人员的信息
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DefaultPersonAvatar } from '@/app/components/common/DefaultAvatar';
import type { PersonCardProps } from '@/app/type/credits';

// 获取人员头像URL
function getProfileUrl(profilePath: string | null): string {
  if (!profilePath) {
    return '/images/no-profile.jpg'; // 默认头像
  }
  return `https://image.tmdb.org/t/p/w185${profilePath}`;
}



export default function PersonCard({ person, type, mediaType }: PersonCardProps) {
  const t = useTranslations('Credits');
  const profileUrl = getProfileUrl(person.profile_path);
  const isActor = type === 'cast';
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // 演员显示角色名，制作人员显示职位
  const roleOrJob = isActor
    ? (person as any).character
    : (person as any).job;

  // 处理图片加载错误
  const handleImageError = () => {
    if (retryCount < maxRetries) {
      // 重试加载
      setRetryCount(prev => prev + 1);
      setImageLoaded(false);
      // 延迟重试，避免立即重试
      setTimeout(() => {
        const img = document.createElement('img');
        img.onload = () => setImageLoaded(true);
        img.onerror = () => {
          if (retryCount + 1 >= maxRetries) {
            setImageError(true);
          }
        };
        img.src = profileUrl;
      }, 1000 * (retryCount + 1)); // 递增延迟
    } else {
      setImageError(true);
    }
  };

  // 处理图片加载成功
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 group">
      <Link href={`/detail/person/${person.id}`} className="block">
        <figure className="relative aspect-[2/3] overflow-hidden">
          {/* 如果图片加载失败或没有图片，显示默认头像 */}
          {imageError || !person.profile_path ? (
            <div className="w-full h-full flex items-center justify-center bg-base-200">
              <DefaultPersonAvatar
                name={person.name}
                size="xl"
                className="w-20 h-20"
              />
            </div>
          ) : (
            <>
              {/* 加载状态 */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                  <div className="loading loading-spinner loading-sm opacity-50"></div>
                </div>
              )}

              {/* 实际图片 */}
              <Image
                src={profileUrl}
                alt={person.name}
                fill
                className={`object-cover group-hover:scale-105 transition-all duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </>
          )}

          {/* 悬停遮罩 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
        </figure>
    
        <div className="card-body p-3">
          {/* 姓名 */}
          <h3 className="card-title text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {person.name}
          </h3>

          {/* 角色/职位 */}
          {roleOrJob && (
            <p className="text-xs text-base-content/70 line-clamp-2 mt-1">
              {isActor ? `${t('playedBy')} ${roleOrJob}` : roleOrJob}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
