'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  SunIcon, 
  MoonIcon, 
  LanguageIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import ThemeSelector from '../layout/ThemeSelector';
import LanguageSelector from '../layout/LanguageSelector';

interface UserActionsProps {
  isScrolled?: boolean;
  isMobile?: boolean;
  className?: string;
}

/**
 * 用户操作组件
 * 包含主题切换、语言切换、用户菜单等
 */
export default function UserActions({ isScrolled = false, isMobile = false, className = '' }: UserActionsProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const t = useTranslations('Navigation');

  // 移动端版本 - 简化显示
  if (isMobile) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <ThemeSelector isScrolled={isScrolled} />
        <LanguageSelector isScrolled={isScrolled} />
      </div>
    );
  }

  // 桌面端版本 - 完整功能
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 主题切换器 */}
      <ThemeSelector isScrolled={isScrolled} />
      
      {/* 语言切换器 */}
      <LanguageSelector isScrolled={isScrolled} />
      
      {/* 用户菜单 */}
      <div className="relative">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isScrolled
              ? 'text-base-content/70 hover:text-primary hover:bg-primary/5'
              : 'text-white/80 hover:text-cyan-200 hover:bg-white/10'
          }`}
          aria-label={t('userProfile')}
        >
          <UserCircleIcon className="h-6 w-6" />
        </button>

        {/* 用户下拉菜单 */}
        {isUserMenuOpen && (
          <>
            {/* 遮罩层 */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsUserMenuOpen(false)}
            />
            
            {/* 菜单内容 */}
            <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50 ${
              isScrolled
                ? 'bg-base-100 border-base-300'
                : 'bg-white/10 backdrop-blur-md border-white/20'
            }`}>
              <div className="py-2">
                <button
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-all duration-300 ${
                    isScrolled
                      ? 'text-base-content hover:bg-primary/5 hover:text-primary'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  {t('userProfile')}
                </button>
                
                <button
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-all duration-300 ${
                    isScrolled
                      ? 'text-base-content hover:bg-primary/5 hover:text-primary'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  {t('settings')}
                </button>
                
                <hr className={`my-2 ${
                  isScrolled ? 'border-base-300' : 'border-white/20'
                }`} />
                
                <button
                  className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-all duration-300 ${
                    isScrolled
                      ? 'text-error hover:bg-error/5'
                      : 'text-red-300 hover:bg-red-500/10'
                  }`}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  {t('logout')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
