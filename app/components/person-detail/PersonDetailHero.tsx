/**
 * 人员详情Hero组件
 * 显示人员头像、姓名和基本信息
 */

import Image from 'next/image';
import { CalendarIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';
import type { PersonDetailHeroProps } from '@/app/type/personDetail';
import BackButton from '../common/BackButton';
import { PageType } from '@/app/lib/utils/navigationUtils';

// 获取人员头像URL
function getProfileUrl(profilePath: string | null): string {
  if (!profilePath) {
    return '/images/no-profile.jpg'; // 默认头像
  }
  return `https://image.tmdb.org/t/p/w500${profilePath}`;
}

// 获取性别显示文本
function getGenderText(gender: number): string {
  switch (gender) {
    case 1: return '女性';
    case 2: return '男性';
    default: return '未知';
  }
}

// 计算年龄
function calculateAge(birthday: string | null, deathday: string | null): number | null {
  if (!birthday) return null;
  
  const birthDate = new Date(birthday);
  const endDate = deathday ? new Date(deathday) : new Date();
  
  let age = endDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = endDate.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// 格式化日期
function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function PersonDetailHero({ person }: PersonDetailHeroProps) {
  const t = await getTranslations('PersonDetail');
  
  const profileUrl = getProfileUrl(person.profile_path);
  const age = calculateAge(person.birthday, person.deathday);
  const genderText = getGenderText(person.gender);
  
  return (
    <div className="bg-gradient-to-b from-base-200 to-base-100 py-12 relative">
      {/* 返回按钮 */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton pageType={PageType.PERSON_DETAIL} />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* 头像 */}
          <div className="flex-shrink-0">
            <div className="w-80 h-80 relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={profileUrl}
                alt={person.name}
                fill
                className="object-cover"
                priority
                sizes="320px"
              />
            </div>
          </div>
          
          {/* 人员信息 */}
          <div className="flex-1 space-y-6">
            {/* 姓名和别名 */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-base-content mb-2">
                {person.name}
              </h1>
              {person.also_known_as && person.also_known_as.length > 0 && (
                <div className="text-lg text-base-content/70">
                  <span className="font-medium">{t('alsoKnownAs')}: </span>
                  <span>{person.also_known_as.slice(0, 3).join(', ')}</span>
                  {person.also_known_as.length > 3 && (
                    <span className="text-base-content/50"> +{person.also_known_as.length - 3} {t('more')}</span>
                  )}
                </div>
              )}
            </div>

            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 知名领域 */}
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-base-content/60">{t('knownFor')}</div>
                  <div className="font-medium">{person.known_for_department}</div>
                </div>
              </div>

              {/* 性别 */}
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-base-content/60">{t('gender')}</div>
                  <div className="font-medium">{genderText}</div>
                </div>
              </div>

              {/* 生日 */}
              {person.birthday && (
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-base-content/60">{t('birthday')}</div>
                    <div className="font-medium">
                      {formatDate(person.birthday)}
                      {age && !person.deathday && (
                        <span className="text-base-content/70 ml-2">({age} {t('yearsOld')})</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 逝世日期 */}
              {person.deathday && (
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-error" />
                  <div>
                    <div className="text-sm text-base-content/60">{t('deathday')}</div>
                    <div className="font-medium">
                      {formatDate(person.deathday)}
                      {age && (
                        <span className="text-base-content/70 ml-2">({t('ageAtDeath')}: {age})</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 出生地 */}
              {person.place_of_birth && (
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-base-content/60">{t('placeOfBirth')}</div>
                    <div className="font-medium">{person.place_of_birth}</div>
                  </div>
                </div>
              )}

              {/* 受欢迎程度 */}
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-base-content/60">{t('popularity')}</div>
                  <div className="font-medium">{person.popularity.toFixed(1)}</div>
                </div>
              </div>
            </div>

            {/* 传记 */}
            {person.biography && (
              <div>
                <h3 className="text-xl font-semibold mb-3">{t('biography')}</h3>
                <div className="prose prose-base max-w-none">
                  <p className="text-base-content/80 leading-relaxed">
                    {person.biography.length > 500 
                      ? `${person.biography.substring(0, 500)}...` 
                      : person.biography
                    }
                  </p>
                </div>
              </div>
            )}

            {/* 外部链接 */}
            <div className="flex flex-wrap gap-4">
              {person.homepage && (
                <a
                  href={person.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  {t('officialSite')}
                </a>
              )}
              {person.imdb_id && (
                <a
                  href={`https://www.imdb.com/name/${person.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  IMDb
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
