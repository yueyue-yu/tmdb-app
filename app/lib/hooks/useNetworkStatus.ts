/**
 * 网络状态检测 Hook
 * 监听网络连接状态变化
 */

'use client';

import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  effectiveType: string;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false,
    connectionType: 'unknown',
    effectiveType: 'unknown'
  });

  useEffect(() => {
    // 检查是否支持网络状态 API
    const updateNetworkStatus = () => {
      const isOnline = navigator.onLine;
      let isSlowConnection = false;
      let connectionType = 'unknown';
      let effectiveType = 'unknown';

      // 检查网络连接信息（如果支持）
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connectionType = connection.type || 'unknown';
        effectiveType = connection.effectiveType || 'unknown';
        
        // 判断是否为慢速连接
        isSlowConnection = ['slow-2g', '2g'].includes(effectiveType) || 
                          connection.downlink < 1.5;
      }

      setNetworkStatus({
        isOnline,
        isSlowConnection,
        connectionType,
        effectiveType
      });
    };

    // 初始检查
    updateNetworkStatus();

    // 监听网络状态变化
    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 监听连接变化（如果支持）
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkStatus);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', updateNetworkStatus);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return networkStatus;
}

/**
 * 网络重连 Hook
 * 提供重连功能和状态
 */
export function useNetworkRetry(onRetry?: () => void) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const networkStatus = useNetworkStatus();

  const retry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      if (onRetry) {
        await onRetry();
      }
    } finally {
      setIsRetrying(false);
    }
  };

  // 当网络恢复时自动重试
  useEffect(() => {
    if (networkStatus.isOnline && retryCount > 0 && !isRetrying) {
      const timer = setTimeout(() => {
        retry();
      }, 1000); // 延迟1秒后重试

      return () => clearTimeout(timer);
    }
  }, [networkStatus.isOnline, retryCount, isRetrying]);

  const reset = () => {
    setRetryCount(0);
    setIsRetrying(false);
  };

  return {
    retry,
    reset,
    isRetrying,
    retryCount,
    networkStatus
  };
}
