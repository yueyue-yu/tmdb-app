/**
 * 网络状态指示器组件
 * 显示网络连接状态和提供重连功能
 */

'use client';

import { useEffect, useState } from 'react';
import { 
  WifiIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  SignalIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';
import { useNetworkStatus } from '@/app/lib/hooks/useNetworkStatus';

interface NetworkStatusProps {
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

export default function NetworkStatus({ 
  onRetry, 
  showDetails = false, 
  className = '' 
}: NetworkStatusProps) {
  const networkStatus = useNetworkStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [lastOnlineStatus, setLastOnlineStatus] = useState(networkStatus.isOnline);

  // 监听网络状态变化
  useEffect(() => {
    if (lastOnlineStatus !== networkStatus.isOnline) {
      setShowNotification(true);
      setLastOnlineStatus(networkStatus.isOnline);
      
      // 3秒后隐藏通知
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [networkStatus.isOnline, lastOnlineStatus]);

  // 获取连接类型图标
  const getConnectionIcon = () => {
    if (!networkStatus.isOnline) {
      return <SignalSlashIcon className="w-4 h-4" />;
    }
    
    if (networkStatus.isSlowConnection) {
      return <SignalIcon className="w-4 h-4 text-warning" />;
    }
    
    return <WifiIcon className="w-4 h-4 text-success" />;
  };

  // 获取连接状态文本
  const getStatusText = () => {
    if (!networkStatus.isOnline) {
      return '离线';
    }
    
    if (networkStatus.isSlowConnection) {
      return '网络较慢';
    }
    
    return '在线';
  };

  // 获取连接详情
  const getConnectionDetails = () => {
    if (!showDetails) return null;
    
    return (
      <div className="text-xs text-base-content/60 mt-1">
        {networkStatus.effectiveType !== 'unknown' && (
          <span>连接类型: {networkStatus.effectiveType.toUpperCase()}</span>
        )}
      </div>
    );
  };

  // 离线状态的完整提示
  if (!networkStatus.isOnline) {
    return (
      <div className={`alert alert-error ${className}`}>
        <SignalSlashIcon className="w-5 h-5" />
        <div className="flex-1">
          <h3 className="font-semibold">网络连接已断开</h3>
          <p className="text-sm opacity-80">请检查网络连接后重试</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-sm btn-outline"
          >
            <ArrowPathIcon className="w-4 h-4" />
            重试
          </button>
        )}
      </div>
    );
  }

  // 慢速连接警告
  if (networkStatus.isSlowConnection) {
    return (
      <div className={`alert alert-warning ${className}`}>
        <ExclamationTriangleIcon className="w-5 h-5" />
        <div className="flex-1">
          <h3 className="font-semibold">网络连接较慢</h3>
          <p className="text-sm opacity-80">内容加载可能需要更长时间</p>
        </div>
      </div>
    );
  }

  // 状态变化通知
  if (showNotification) {
    return (
      <div className={`toast toast-top toast-center ${className}`}>
        <div className={`alert ${networkStatus.isOnline ? 'alert-success' : 'alert-error'}`}>
          {getConnectionIcon()}
          <span>{networkStatus.isOnline ? '网络已恢复' : '网络连接断开'}</span>
        </div>
      </div>
    );
  }

  // 简单的状态指示器
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {getConnectionIcon()}
      <span>{getStatusText()}</span>
      {getConnectionDetails()}
    </div>
  );
}

/**
 * 网络状态徽章组件
 * 用于在页面角落显示网络状态
 */
export function NetworkStatusBadge({ className = '' }: { className?: string }) {
  const networkStatus = useNetworkStatus();
  
  if (networkStatus.isOnline && !networkStatus.isSlowConnection) {
    return null; // 网络正常时不显示
  }
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className={`badge gap-2 ${
        networkStatus.isOnline 
          ? 'badge-warning' 
          : 'badge-error'
      }`}>
        {networkStatus.isOnline ? (
          <SignalIcon className="w-3 h-3" />
        ) : (
          <SignalSlashIcon className="w-3 h-3" />
        )}
        {networkStatus.isOnline ? '网络较慢' : '离线'}
      </div>
    </div>
  );
}

/**
 * 网络重连按钮组件
 */
export function NetworkRetryButton({ 
  onRetry, 
  isRetrying = false,
  className = '' 
}: { 
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onRetry}
      disabled={isRetrying}
      className={`btn btn-outline gap-2 ${isRetrying ? 'loading' : ''} ${className}`}
    >
      {!isRetrying && <ArrowPathIcon className="w-4 h-4" />}
      {isRetrying ? '重试中...' : '重试'}
    </button>
  );
}
