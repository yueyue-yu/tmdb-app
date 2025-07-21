/**
 * 人员相关的API请求方法
 */

import { apiClient, getApiClient } from './client';
import type { ApiResponse, Person } from './types';

export const peopleApi = {
  /**
   * 获取热门人员
   */
  getPopular: (page: number = 1): Promise<ApiResponse<Person>> => {
    return apiClient.get('/person/popular', { page: page.toString() });
  },

  /**
   * 搜索人员
   */
  search: async (query: string, page: number = 1): Promise<ApiResponse<Person>> => {
    const client = await getApiClient();
    return client.get('/search/person', {
      query,
      page: page.toString()
    });
  },

  /**
   * 获取人员详情
   */
  getDetails: (personId: number): Promise<Person> => {
    return apiClient.get(`/person/${personId}`);
  }
};
