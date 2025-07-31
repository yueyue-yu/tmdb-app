'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Bars3Icon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { MENU_ITEMS, type MenuItem } from '../../lib/navigation';

/**
 * 移动端侧边栏组件
 * 提供汉堡菜单和抽屉式导航
 */
export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  // 检查路径是否激活
  const isActivePath = (path: string) => {
    if (path === '/home') return pathname === '/home';
    return pathname.startsWith(path);
  };

  // ESC 键关闭侧边栏
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 点击菜单项后关闭侧边栏
  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 汉堡菜单按钮 - 只在移动端显示 */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost btn-circle lg:hidden"
        aria-label="打开导航菜单"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* 侧边栏抽屉 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* 侧边栏内容 */}
          <div className="fixed left-0 top-0 h-full w-80 max-w-[80vw] bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* 侧边栏头部 */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎭</span>
                <h2 className="text-xl font-bold text-primary">TMDB</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="关闭导航菜单"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* 导航菜单 */}
            <nav className="p-4">
              <ul className="menu w-full text-base-content space-y-2">
                {MENU_ITEMS.map((item: MenuItem) => {
                  const IconComponent = item.icon;
                  const isActive = isActivePath(item.path);
                  
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        onClick={handleMenuClick}
                        className={`${
                          isActive ? 'active bg-primary/10 text-primary' : ''
                        } py-3 text-base font-medium rounded-lg hover:bg-base-200 transition-colors`}
                      >
                        <IconComponent className="w-5 h-5" />
                        {t(item.key as any)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* 侧边栏底部信息 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-100">
              <div className="text-center text-sm text-base-content/60">
                <p>TMDB 电影数据库</p>
                <p className="text-xs mt-1">探索精彩影视世界</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
