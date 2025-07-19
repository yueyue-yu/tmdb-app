/**
 * API客户端配置
 * 参考 app/api/movies/popular/route.ts 的实现
 */

import { getTmdbLanguage } from './utils';

const API_KEY = process.env.TMDB_API_KEY || 'c07245f6cabd71848d42faa2949c0f61';
const API_BASE_URL = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';

class ApiClient {
  private baseURL: string;
  private apiKey: string;
  private language: string;

  constructor(baseURL: string = API_BASE_URL, apiKey: string = API_KEY, language: string = 'zh-CN') {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.language = language;
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 检查错误是否可以重试
   */
  private isRetryableError(error: any): boolean {
    // 网络连接错误
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return true;
    }

    // HTTP 状态码错误 (5xx 服务器错误)
    if (error.status >= 500 && error.status < 600) {
      return true;
    }

    // 超时错误
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return true;
    }

    // 网络连接被重置
    if (error.message?.includes('ECONNRESET') || error.message?.includes('network')) {
      return true;
    }

    return false;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // 构建完整的URL，参考API route的做法
    const url = `${this.baseURL}${endpoint}`;

    // 添加API key和语言参数，参考API route
    const separator = url.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}api_key=${this.apiKey}&language=${this.language}`;

    const maxRetries = 3;
    const retryDelay = 1000; // 1秒
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

        const config: RequestInit = {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'TMDB-App/1.0',
            ...options.headers,
          },
          // 添加缓存配置，参考API route
          next: { revalidate: 300 },
          signal: controller.signal,
          ...options,
        };

        const response = await fetch(fullUrl, config);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = new Error(`API请求失败: ${response.status} ${response.statusText}`);
          (error as any).status = response.status;
          throw error;
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        console.error(`API request failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);

        // 如果是最后一次尝试，或者错误不可重试，直接抛出错误
        if (attempt === maxRetries || !this.isRetryableError(error)) {
          break;
        }

        // 等待后重试（指数退避）
        const delayTime = retryDelay * Math.pow(2, attempt);
        console.log(`Retrying in ${delayTime}ms...`);
        await this.delay(delayTime);
      }
    }

    throw lastError;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint;
    
    // 添加查询参数
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}${searchParams.toString()}`;
    }

    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// 默认API客户端实例（向后兼容）
export const apiClient = new ApiClient();

/**
 * 创建语言感知的API客户端
 * @param language TMDB API语言代码 (如: zh-CN, en-US)
 * @returns 配置了指定语言的API客户端实例
 */
export function createApiClient(language: string): ApiClient {
  return new ApiClient(API_BASE_URL, API_KEY, language);
}

/**
 * 获取当前用户语言的API客户端
 * @returns 配置了用户当前语言的API客户端实例
 */
export async function getApiClient(): Promise<ApiClient> {
  const language = await getTmdbLanguage();
  return createApiClient(language);
}
