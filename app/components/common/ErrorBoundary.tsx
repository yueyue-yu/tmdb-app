/**
 * 错误边界组件
 * 捕获组件渲染错误并显示友好的错误信息
 */

'use client';

import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
  title?: string;
  description?: string;
}

/**
 * 默认错误回退组件
 */
function DefaultErrorFallback({ 
  error, 
  resetError, 
  title = "出现了一些问题", 
  description = "我们正在努力修复这个问题，请稍后重试。" 
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">
        <ExclamationTriangleIcon className="w-16 h-16 text-warning mx-auto" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-base-content/70 mb-6 max-w-md">{description}</p>
      
      <div className="space-y-3">
        <button
          onClick={resetError}
          className="btn btn-primary gap-2"
        >
          <ArrowPathIcon className="w-4 h-4" />
          重试
        </button>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-base-content/60 hover:text-base-content">
              查看错误详情
            </summary>
            <pre className="mt-2 p-3 bg-base-200 rounded text-xs overflow-auto max-w-md">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * 错误边界类组件
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 调用错误回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * 网络错误回退组件
 */
export function NetworkErrorFallback({ 
  error, 
  resetError, 
  title = "网络连接问题", 
  description = "无法连接到服务器，请检查网络连接后重试。" 
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
          <ExclamationTriangleIcon className="w-8 h-8 text-error" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-base-content/70 mb-6 max-w-md">{description}</p>
      
      <div className="space-y-3">
        <button
          onClick={resetError}
          className="btn btn-outline gap-2"
        >
          <ArrowPathIcon className="w-4 h-4" />
          重新加载
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="btn btn-ghost btn-sm"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}

/**
 * API 错误回退组件
 */
export function ApiErrorFallback({ 
  error, 
  resetError, 
  title = "数据加载失败", 
  description = "无法获取数据，请稍后重试。" 
}: ErrorFallbackProps) {
  const isNetworkError = error?.message?.includes('fetch failed') || 
                        error?.message?.includes('ECONNRESET') ||
                        error?.message?.includes('network');

  if (isNetworkError) {
    return (
      <NetworkErrorFallback
        error={error}
        resetError={resetError}
        title="网络连接问题"
        description="无法连接到 TMDB 服务器，请检查网络连接后重试。"
      />
    );
  }

  return (
    <DefaultErrorFallback
      error={error}
      resetError={resetError}
      title={title}
      description={description}
    />
  );
}

export default ErrorBoundary;
