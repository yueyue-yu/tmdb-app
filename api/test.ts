/**
 * API测试工具
 */

import { apiClient } from './client';
import { moviesApi } from './movies';
import { ApiErrorHandler } from './utils';

export interface ApiTestResult {
  isSuccess: boolean;
  message: string;
  responseTime?: number;
  data?: any;
}

export class ApiTester {
  /**
   * 测试API基础连接
   */
  static async testConnection(): Promise<ApiTestResult> {
    const startTime = Date.now();
    
    try {
      // 使用配置端点测试基础连接
      const response = await apiClient.get('/configuration');
      const responseTime = Date.now() - startTime;
      
      return {
        isSuccess: true,
        message: `API连接成功！响应时间: ${responseTime}ms`,
        responseTime,
        data: response
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        isSuccess: false,
        message: `API连接失败: ${ApiErrorHandler.handle(error)}`,
        responseTime
      };
    }
  }

  /**
   * 测试电影API
   */
  static async testMoviesApi(): Promise<ApiTestResult> {
    const startTime = Date.now();
    
    try {
      // 获取热门电影来测试
      const response = await moviesApi.getPopular(1);
      const responseTime = Date.now() - startTime;
      
      if (response.results && response.results.length > 0) {
        return {
          isSuccess: true,
          message: `电影API测试成功！获取到 ${response.results.length} 部电影`,
          responseTime,
          data: {
            totalResults: response.total_results,
            totalPages: response.total_pages,
            firstMovieTitle: response.results[0].title
          }
        };
      } else {
        return {
          isSuccess: false,
          message: '电影API返回空数据',
          responseTime
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        isSuccess: false,
        message: `电影API测试失败: ${ApiErrorHandler.handle(error)}`,
        responseTime
      };
    }
  }

  /**
   * 综合API测试
   */
  static async runFullTest(): Promise<{
    connection: ApiTestResult;
    movies: ApiTestResult;
    overall: {
      isSuccess: boolean;
      summary: string;
    };
  }> {
    console.log('🚀 开始API测试...');
    
    // 测试基础连接
    console.log('📡 测试基础连接...');
    const connectionResult = await this.testConnection();
    console.log(connectionResult.isSuccess ? '✅' : '❌', connectionResult.message);
    
    // 测试电影API
    console.log('🎬 测试电影API...');
    const moviesResult = await this.testMoviesApi();
    console.log(moviesResult.isSuccess ? '✅' : '❌', moviesResult.message);
    
    // 总结
    const overallSuccess = connectionResult.isSuccess && moviesResult.isSuccess;
    const summary = overallSuccess 
      ? '🎉 所有API测试通过！' 
      : '⚠️ 部分API测试失败，请检查配置';
    
    console.log('\n📊 测试总结:', summary);
    
    return {
      connection: connectionResult,
      movies: moviesResult,
      overall: {
        isSuccess: overallSuccess,
        summary
      }
    };
  }
}

/**
 * 快速测试函数 - 可以在浏览器控制台或组件中调用
 */
export const testApi = async (): Promise<void> => {
  const results = await ApiTester.runFullTest();
  
  if (!results.overall.isSuccess) {
    console.error('❌ API测试失败，请检查：');
    console.error('1. 网络连接是否正常');
    console.error('2. API密钥是否正确设置');
    console.error('3. 环境变量是否正确加载');
  }
  
  return;
};

/**
 * 简单的API健康检查
 */
export const quickHealthCheck = async (): Promise<boolean> => {
  try {
    const result = await ApiTester.testConnection();
    return result.isSuccess;
  } catch {
    return false;
  }
};
