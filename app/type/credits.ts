/**
 * 演职人员相关类型定义
 */

/**
 * 演员信息
 */
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
  cast_id: number;
  credit_id: string;
}

/**
 * 制作人员信息
 */
export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  adult: boolean;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
  credit_id: string;
}

/**
 * 演职人员信息
 */
export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

/**
 * 演职人员组件属性
 */
export interface CreditsProps {
  credits: Credits;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
}

/**
 * 演员区域组件属性
 */
export interface CastSectionProps {
  cast: Cast[];
  mediaType: 'movie' | 'tv';
}

/**
 * 制作人员区域组件属性
 */
export interface CrewSectionProps {
  crew: Crew[];
  mediaType: 'movie' | 'tv';
}

/**
 * 人员卡片组件属性
 */
export interface PersonCardProps {
  person: Cast | Crew;
  type: 'cast' | 'crew';
  mediaType: 'movie' | 'tv';
  index?: number;
  priority?: boolean;
  className?: string;
}

/**
 * 演职人员页面属性
 */
export interface CreditsPageProps {
  params: Promise<{
    id: string;
    mediaType: 'movie' | 'tv';
  }>;
}

/**
 * 主要制作人员信息（用于详情页面显示）
 */
export interface MainCredits {
  director?: Crew; // 导演（电影）
  creators?: Crew[]; // 创作者（电视剧）
  mainCast: Cast[]; // 主要演员（前6-8位）
  keyCrewMembers: Crew[]; // 关键制作人员
}

/**
 * 制作人员按部门分组
 */
export interface CrewByDepartment {
  [department: string]: Crew[];
}

/**
 * 演职人员统计信息
 */
export interface CreditsStats {
  totalCast: number;
  totalCrew: number;
  departments: string[];
  topBilledCast: Cast[];
}

/**
 * 人员详情链接属性
 */
export interface PersonLinkProps {
  personId: number;
  children: React.ReactNode;
  className?: string;
}
