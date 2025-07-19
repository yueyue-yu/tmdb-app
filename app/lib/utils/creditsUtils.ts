/**
 * 演职人员相关的工具函数
 */

import type { Credits, Cast, Crew, MainCredits, CrewByDepartment } from '@/app/type/credits';

/**
 * 提取主要演职人员信息
 * @param credits 完整的演职人员信息
 * @param mediaType 媒体类型
 * @returns 主要演职人员信息
 */
export function extractMainCredits(credits: Credits, mediaType: 'movie' | 'tv'): MainCredits {
  // 主要演员（前8位）
  const mainCast = credits.cast.slice(0, 8);

  // 关键制作人员
  const keyCrewMembers: Crew[] = [];
  
  if (mediaType === 'movie') {
    // 电影：导演、编剧、制片人、摄影师、音乐
    const director = credits.crew.find(person => person.job === 'Director');
    const writers = credits.crew.filter(person => 
      person.job === 'Writer' || person.job === 'Screenplay' || person.job === 'Story'
    ).slice(0, 2);
    const producers = credits.crew.filter(person => 
      person.job === 'Producer' || person.job === 'Executive Producer'
    ).slice(0, 2);
    const cinematographer = credits.crew.find(person => person.job === 'Director of Photography');
    const composer = credits.crew.find(person => person.job === 'Original Music Composer');

    if (director) keyCrewMembers.push(director);
    keyCrewMembers.push(...writers);
    keyCrewMembers.push(...producers);
    if (cinematographer) keyCrewMembers.push(cinematographer);
    if (composer) keyCrewMembers.push(composer);

    return {
      director,
      mainCast,
      keyCrewMembers: keyCrewMembers.slice(0, 8) // 最多8个关键制作人员
    };
  } else {
    // 电视剧：创作者、执行制片人、制片人
    const creators = credits.crew.filter(person => 
      person.job === 'Creator' || person.job === 'Developer'
    );
    const executiveProducers = credits.crew.filter(person => 
      person.job === 'Executive Producer'
    ).slice(0, 3);
    const producers = credits.crew.filter(person => 
      person.job === 'Producer'
    ).slice(0, 2);

    keyCrewMembers.push(...creators);
    keyCrewMembers.push(...executiveProducers);
    keyCrewMembers.push(...producers);

    return {
      creators,
      mainCast,
      keyCrewMembers: keyCrewMembers.slice(0, 8) // 最多8个关键制作人员
    };
  }
}

/**
 * 按部门分组制作人员
 * @param crew 制作人员列表
 * @returns 按部门分组的制作人员
 */
export function groupCrewByDepartment(crew: Crew[]): CrewByDepartment {
  return crew.reduce((groups: CrewByDepartment, person) => {
    const department = person.department;
    if (!groups[department]) {
      groups[department] = [];
    }
    groups[department].push(person);
    return groups;
  }, {});
}

/**
 * 获取热门演员（按受欢迎程度排序）
 * @param cast 演员列表
 * @param limit 限制数量
 * @returns 热门演员列表
 */
export function getPopularCast(cast: Cast[], limit: number = 6): Cast[] {
  return cast
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

/**
 * 获取主要制作人员（按重要性排序）
 * @param crew 制作人员列表
 * @param mediaType 媒体类型
 * @param limit 限制数量
 * @returns 主要制作人员列表
 */
export function getKeyCrewMembers(crew: Crew[], mediaType: 'movie' | 'tv', limit: number = 6): Crew[] {
  const importantJobs = mediaType === 'movie' 
    ? ['Director', 'Writer', 'Screenplay', 'Producer', 'Executive Producer', 'Director of Photography', 'Original Music Composer']
    : ['Creator', 'Developer', 'Executive Producer', 'Producer', 'Writer', 'Director'];

  const keyMembers = crew.filter(person => 
    importantJobs.includes(person.job)
  );

  // 按职位重要性和受欢迎程度排序
  return keyMembers
    .sort((a, b) => {
      const aIndex = importantJobs.indexOf(a.job);
      const bIndex = importantJobs.indexOf(b.job);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      return b.popularity - a.popularity;
    })
    .slice(0, limit);
}
