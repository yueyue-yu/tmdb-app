/**
 * 人员详情页面相关类型定义
 */

import type { 
  PersonDetails, 
  PersonMovieCredits, 
  PersonTvCredits 
} from '@/app/lib/api/types';

/**
 * 人员详情页面属性
 */
export interface PersonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 人员详情Hero组件属性
 */
export interface PersonDetailHeroProps {
  person: PersonDetails;
}

/**
 * 人员详情信息组件属性
 */
export interface PersonDetailInfoProps {
  person: PersonDetails;
}

/**
 * 人员作品组件属性
 */
export interface PersonCreditsProps {
  movieCredits: PersonMovieCredits;
  tvCredits: PersonTvCredits;
  personName: string;
}

/**
 * 人员电影作品组件属性
 */
export interface PersonMovieCreditsProps {
  movieCredits: PersonMovieCredits;
  personName: string;
}

/**
 * 人员电视剧作品组件属性
 */
export interface PersonTvCreditsProps {
  tvCredits: PersonTvCredits;
  personName: string;
}

/**
 * 人员详情操作组件属性
 */
export interface PersonDetailActionsProps {
  personId: number;
  personName: string;
}

/**
 * 作品卡片组件属性
 */
export interface WorkCardProps {
  work: PersonMovieWork | PersonTvWork;
  type: 'movie' | 'tv';
  role: 'cast' | 'crew';
}

/**
 * 人员电影作品（统一格式）
 */
export interface PersonMovieWork {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  character?: string; // 演员角色
  job?: string; // 制作职位
  department?: string; // 制作部门
  order?: number; // 演员排序
  credit_id: string;
}

/**
 * 人员电视剧作品（统一格式）
 */
export interface PersonTvWork {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  character?: string; // 演员角色
  job?: string; // 制作职位
  department?: string; // 制作部门
  episode_count?: number; // 参与集数
  credit_id: string;
}

/**
 * 人员统计信息
 */
export interface PersonStats {
  totalMovies: number;
  totalTvShows: number;
  totalWorks: number;
  actingRoles: number;
  crewRoles: number;
  departments: string[];
  activeYears: {
    start: number;
    end: number;
  };
}

/**
 * 人员作品分类
 */
export interface PersonWorksByCategory {
  movieCast: PersonMovieWork[];
  movieCrew: PersonMovieWork[];
  tvCast: PersonTvWork[];
  tvCrew: PersonTvWork[];
}

/**
 * 人员作品时间线项目
 */
export interface PersonTimelineItem {
  year: number;
  works: (PersonMovieWork | PersonTvWork)[];
  type: 'movie' | 'tv';
  role: 'cast' | 'crew';
}
