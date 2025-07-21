/**
 * 搜索结果空状态组件
 */

import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { EmptySearchStateProps, SearchTypeEnum } from '@/app/type/search';

// 获取搜索类型对应的图标和建议
function getSearchTypeInfo(searchType: SearchTypeEnum) {
  switch (searchType) {
    case 'movie':
      return {
        icon: '🎬',
        suggestions: ['复仇者联盟', '泰坦尼克号', '阿凡达', '星球大战']
      };
    case 'tv':
      return {
        icon: '📺',
        suggestions: ['权力的游戏', '老友记', '绝命毒师', '纸牌屋']
      };
    case 'person':
      return {
        icon: '👤',
        suggestions: ['汤姆·汉克斯', '安吉丽娜·朱莉', '莱昂纳多', '斯嘉丽']
      };
    case 'all':
    default:
      return {
        icon: '🔍',
        suggestions: ['复仇者联盟', '权力的游戏', '汤姆·汉克斯', '阿凡达']
      };
  }
}

export default async function SearchResultsEmpty({ 
  searchType, 
  query, 
  className = '' 
}: EmptySearchStateProps) {
  const t = await getTranslations('Search');
  const { icon, suggestions } = getSearchTypeInfo(searchType);

  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* 图标 */}
        <div className="text-8xl mb-6">{icon}</div>
        
        {/* 标题 */}
        <h2 className="text-2xl font-bold mb-4">
          {t('noResults')}
        </h2>
        
        {/* 描述 */}
        <p className="text-base-content/60 mb-6">
          {t('noResultsDesc')}
        </p>
        
        {/* 建议 */}
        <div className="space-y-4">
          <p className="text-sm text-base-content/70">
            {t('noResultsDesc')}
          </p>
          
          {/* 搜索建议 */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-base-content/80">
              {t('popularSearches')}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={`/home/search?q=${encodeURIComponent(suggestion)}&type=${searchType}&page=1`}
                  className="badge badge-outline hover:badge-primary transition-colors cursor-pointer"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="mt-8 space-y-3">
          <Link 
            href="/home/search"
            className="btn btn-primary btn-wide"
          >
            重新搜索
          </Link>
          
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
