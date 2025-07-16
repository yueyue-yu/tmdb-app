/**
 * 刷新按钮组件
 * 客户端组件，处理页面刷新
 */

'use client';

import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface RefreshButtonProps {
  category: string;
}

export default function RefreshButton({ category }: RefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 刷新当前页面
    router.refresh();
    // 模拟刷新延迟
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <button
      onClick={handleRefresh}
      className="btn btn-ghost btn-circle"
      disabled={isRefreshing}
    >
      <ArrowPathIcon 
        className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
      />
    </button>
  );
}
