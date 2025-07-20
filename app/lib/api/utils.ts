/**
 * API错误处理工具
 */

import type { ApiError } from './types';

export class ApiErrorHandler {
  static handle(error: unknown): string {
    if (error instanceof Error) {
      // 检查是否是API错误响应
      try {
        const apiError = JSON.parse(error.message) as ApiError;
        if (apiError.status_message) {
          return this.getErrorMessage(apiError.status_code, apiError.status_message);
        }
      } catch {
        // 不是JSON格式的错误
      }
      
      return error.message;
    }
    
    return '发生未知错误';
  }

  private static getErrorMessage(statusCode: number, statusMessage: string): string {
    const errorMessages: Record<number, string> = {
      401: 'API密钥无效',
      404: '请求的资源未找到',
      429: '请求过于频繁，请稍后再试',
      500: '服务器内部错误',
      503: '服务暂时不可用'
    };

    return errorMessages[statusCode] || statusMessage || '请求失败';
  }
}

/**
 * 重试机制
 */
export class RetryHandler {
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // 如果是最后一次尝试，直接抛出错误
        if (i === maxRetries) {
          throw error;
        }

        // 等待指定时间后重试
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }

    throw lastError;
  }
}


