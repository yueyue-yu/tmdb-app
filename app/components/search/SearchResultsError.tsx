/**
 * 搜索结果错误状态组件
 */

import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface SearchResultsErrorProps {
  error: Error;
  className?: string;
}

export default async function SearchResultsError({ 
  error, 
  className = '' 
}: SearchResultsErrorProps) {
  const t = await getTranslations('Search');

  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* 错误图标 */}
        <div className="text-8xl mb-6">❌</div>
        
        {/* 标题 */}
        <h2 className="text-2xl font-bold text-error mb-4">
          {t('searchError')}
        </h2>
        
        {/* 错误描述 */}
        <p className="text-base-content/60 mb-6">
          {t('searchErrorDesc')}
        </p>
        
        {/* 错误详情（开发环境显示） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-left">
            <p className="text-sm font-mono text-error">
              {error.message}
            </p>
          </div>
        )}
        
        {/* 解决建议 */}
        <div className="space-y-4 mb-8">
          <div className="text-sm text-base-content/70 space-y-2">
            <p>可能的解决方案:</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>检查网络连接</li>
              <li>稍后重试</li>
              <li>尝试不同的搜索关键词</li>
              <li>刷新页面</li>
            </ul>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary btn-wide"
          >
            重试搜索
          </button>
          
          <div className="text-center">
            <Link 
              href="/home"
              className="btn btn-ghost btn-sm"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
