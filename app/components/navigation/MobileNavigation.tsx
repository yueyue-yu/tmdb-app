'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 1. 引入 React Portal
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { MAIN_NAVIGATION, USER_NAVIGATION, isPathActive } from '@/app/config/navigation'; // 假设这些配置是正确的
import UserActions from './UserActions'; // 假设 UserActions 组件已存在

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  // 确保 document.body 只在客户端被访问
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  // 当路由变化时，自动关闭菜单
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // 当菜单打开时，禁止背景滚动
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // 组件卸载时，恢复 body 滚动
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // 汉堡菜单按钮样式
  const hamburgerButtonClasses = 'text-base-content/70 hover:text-primary hover:bg-primary/5';

  return (
      <>
        {/* 汉堡菜单触发按钮 */}
        <button
            onClick={() => setIsMenuOpen(true)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${hamburgerButtonClasses} ${className}`}
            aria-label={t('openMenu')}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>


        {isMounted && isMenuOpen && createPortal(
            <>
              {/* 遮罩层，现在会相对于 body 定位，覆盖全屏 */}
              <div
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={closeMenu}
                  aria-hidden="true"
              />

              {/* 菜单面板，使用不透明的 bg-base-200 或 bg-base-100 (如果你的 base-100 本身不透明) */}
              <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw]
                         bg-base-100 shadow-xl z-50
                         lg:hidden transform transition-transform duration-300 ease-in-out
                         data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full"
                   data-state={isMenuOpen ? "open" : "closed"}
              >
                {/* 菜单头部 */}
                <div className="flex items-center justify-between p-4 border-b border-base-300">
                  <div className="flex items-center gap-3">
                    <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">I</span>
                      </div>
                      <div>
                        <h2 className="font-bold text-lg text-base-content">ICE•ICE FILM</h2>
                      </div>
                    </Link>
                  </div>

                  <button
                      onClick={closeMenu}
                      className="p-2 rounded-lg text-base-content/70 hover:text-base-content hover:bg-base-200 transition-all duration-300"
                      aria-label={t('closeMenu')}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* 菜单内容区域，可滚动 */}
                <div className="h-[calc(100%-140px)] overflow-y-auto">
                  {/* 主导航 */}
                  <nav className="p-4">
                    <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
                      主导航
                    </h3>
                    <ul className="space-y-1">
                      {MAIN_NAVIGATION.map((item) => {
                        // 假设 item.icon 是一个有效的 React 组件
                        const IconComponent = item.icon;
                        const isActive = isPathActive(pathname, item.path);

                        return (
                            <li key={item.key}>
                              <Link
                                  href={item.path}
                                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                                      isActive
                                          ? 'bg-primary text-primary-content'
                                          : 'text-base-content hover:bg-base-200/50' // 使用标准 hover 效果
                                  }`}
                                  onClick={closeMenu} // 点击链接后关闭菜单
                              >
                                {IconComponent && <IconComponent className="h-5 w-5" />}
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

                  {/* 个人中心导航 */}
                  {USER_NAVIGATION && USER_NAVIGATION.length > 0 && (
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
                                              : 'text-base-content hover:bg-base-200/50'
                                      }`}
                                      onClick={closeMenu}
                                  >
                                    {IconComponent && <IconComponent className="h-5 w-5" />}
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
                  )}
                </div>

                {/* 菜单底部 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-200">
                  <UserActions isMobile={true} />
                </div>
              </div>
            </>,
            document.body // 3. 指定渲染到 body
        )}
      </>
  );
}