'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { MAIN_NAVIGATION, USER_NAVIGATION, isPathActive } from '@/app/config/navigation';
import UserActions from './UserActions';

interface MobileNavigationProps {
  className?: string;
}

/**
 * 移动端导航组件
 * 包含汉堡菜单按钮和侧滑菜单
 */
export default function MobileNavigation({className = '' }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  // 关闭菜单
  const closeMenu = () => setIsMenuOpen(false);

  // 路由变化时关闭菜单
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // 阻止背景滚动
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* 汉堡菜单按钮 */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className={`lg:hidden p-2 rounded-lg transition-all duration-300 
        'text-base-content/70 hover:text-primary hover:bg-primary/5'  ${className}`}
        aria-label={t('openMenu')}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* 侧滑菜单 */}
      {isMenuOpen && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMenu}
          />

          {/* 菜单内容 */}
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-base-100 shadow-2xl z-50 lg:hidden transform transition-transform duration-300">
            {/* 菜单头部 */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-base-content">ICE•ICE FILM</h2>
                  <p className="text-sm text-base-content/60">冰雪世界的电影奇迹</p>
                </div>
              </div>
              
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg text-base-content/70 hover:text-base-content hover:bg-base-200 transition-all duration-300"
                aria-label={t('closeMenu')}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* 菜单内容 */}
            <div className="flex-1 overflow-y-auto">
              {/* 主导航 */}
              <nav className="p-4">
                <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
                  主导航
                </h3>
                <ul className="space-y-1">
                  {MAIN_NAVIGATION.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = isPathActive(pathname, item.path);
                    
                    return (
                      <li key={item.key}>
                        <Link
                          href={item.path}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                            isActive
                              ? 'bg-primary text-primary-content'
                              : 'text-base-content hover:bg-base-200'
                          }`}
                          onClick={closeMenu}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span className="font-medium flex-1">
                            {t(item.key as any)}
                          </span>
                          {isActive && (
                            <div className="w-2 h-2 bg-primary-content rounded-full" />
                          )}
                          <ChevronRightIcon className="h-4 w-4 opacity-50" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* 用户导航 */}
              {USER_NAVIGATION.length > 0 && (
                <nav className="p-4 border-t border-base-300">
                  <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
                    个人中心
                  </h3>
                  <ul className="space-y-1">
                    {USER_NAVIGATION.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = isPathActive(pathname, item.path);
                      
                      return (
                        <li key={item.key}>
                          <Link
                            href={item.path}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                              isActive
                                ? 'bg-primary text-primary-content'
                                : 'text-base-content hover:bg-base-200'
                            }`}
                            onClick={closeMenu}
                          >
                            <IconComponent className="h-5 w-5" />
                            <span className="font-medium flex-1">
                              {t(item.key as any)}
                            </span>
                            <ChevronRightIcon className="h-4 w-4 opacity-50" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}
            </div>

            {/* 菜单底部 */}
            <div className="p-4 border-t border-base-300">
              <UserActions isMobile={true} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
