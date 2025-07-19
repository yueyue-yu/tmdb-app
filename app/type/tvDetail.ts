/**
 * 电视剧详情页面相关类型定义
 */

import type { TvDetails, MediaDetails } from '@/app/lib/api/types';

/**
 * 电视剧详情页面属性
 */
export interface TvDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 电视剧Cast页面属性
 */
export interface TvCastPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 电视剧详情Hero组件属性
 */
export interface TvDetailHeroProps {
  tv: TvDetails;
}

/**
 * 电视剧详情卡片组件属性
 */
export interface TvDetailCardProps {
  tv: TvDetails;
}

/**
 * 电视剧详情信息组件属性
 */
export interface TvDetailInfoProps {
  tv: TvDetails;
}

/**
 * 电视剧详情操作组件属性
 */
export interface TvDetailActionsProps {
  tvId: number;
  title: string;
}

/**
 * 季度信息组件属性
 */
export interface SeasonsInfoProps {
  seasons: Array<{
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }>;
}

/**
 * 网络信息组件属性
 */
export interface NetworksInfoProps {
  networks: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
}

/**
 * 电视剧统计信息组件属性
 */
export interface TvStatsProps {
  episodeRunTime: number[];
  firstAirDate: string;
  lastAirDate: string;
  voteAverage: number;
  voteCount: number;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  inProduction: boolean;
}
