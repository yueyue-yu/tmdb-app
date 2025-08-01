/**
 * 页面标题组件
 * 服务端组件
 */

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';
import type { CategoryConfig } from '@/app/lib/utils/categoryUtils';
import RefreshButton from './RefreshButton';

interface PageHeaderProps {
  categoryConfig: CategoryConfig;
  currentCategory: string;
}

export default async function PageHeader({ categoryConfig, currentCategory }: PageHeaderProps) {
  const IconComponent = categoryConfig.icon;
  const t = await getTranslations('Categories');

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-full bg-gradient-to-r ${categoryConfig.gradientFrom} ${categoryConfig.gradientTo}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t(categoryConfig.labelKey as any)}</h1>
          <p className="text-base-content/60 mt-1">{t(categoryConfig.descriptionKey as any)}</p>
        </div>
        
        {/* 刷新按钮 */}
        <div className="ml-auto">
          <RefreshButton category={currentCategory} />
        </div>
      </div>
    </div>
  );
}
