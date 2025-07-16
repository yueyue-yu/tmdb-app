/**
 * API客户端配置
 * 参考 app/api/movies/popular/route.ts 的实现
 */

const API_KEY = process.env.TMDB_API_KEY || 'c07245f6cabd71848d42faa2949c0f61';
const API_BASE_URL = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';

class ApiClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string = API_BASE_URL, apiKey: string = API_KEY) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // 构建完整的URL，参考API route的做法
    const url = `${this.baseURL}${endpoint}`;
    
    // 添加API key和语言参数，参考API route
    const separator = url.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}api_key=${this.apiKey}&language=zh-CN`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // 添加缓存配置，参考API route
      next: { revalidate: 300 },
      ...options,
    };

    const response = await fetch(fullUrl, config);

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    return response.json();
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

export const apiClient = new ApiClient();
