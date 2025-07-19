/**
 * 返回按钮组件
 * 在详情页面Hero区域显示的浮动返回按钮
 */

'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import {
  smartNavigateBack,
  getPageTypeFromPath,
  getBackButtonLabel,
  PageType
} from '@/app/lib/utils/navigationUtils';

interface BackButtonProps {
  pageType: PageType;
  className?: string;
}

export default function BackButton({ pageType, className = '' }: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 获取返回按钮标签
  const backButtonLabel = getBackButtonLabel(pageType);

  const handleBack = () => {
    smartNavigateBack(router, pageType);
  };

  return (
    <button
      onClick={handleBack}
      className={`btn btn-circle btn-ghost bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 border-none ${className}`}
      aria-label={backButtonLabel}
      title={backButtonLabel}
    >
      <ArrowLeftIcon className="w-5 h-5" />
    </button>
  );
}
