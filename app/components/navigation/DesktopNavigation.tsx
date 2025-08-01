'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MAIN_NAVIGATION, isPathActive } from '@/app/config/navigation';


interface DesktopNavigationProps {
  className?: string;
}

/**
 * 桌面端导航菜单组件
 * (移除了滚动状态的样式变化，采用固定样式)
 */
export default function DesktopNavigation({ className = '' }: DesktopNavigationProps) {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  return (
      <nav className={`hidden lg:flex items-center space-x-8 ${className}`}>
        {MAIN_NAVIGATION.map((item) => {
          const IconComponent = item.icon;
          const isActive = isPathActive(pathname, item.path);

          return (
              <Link
                  key={item.key}
                  href={item.path}
                  className={`relative group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-base-content/70 hover:text-primary hover:bg-primary/5'
                  }`}
                  aria-label={t(item.key as any)}
              >
                <IconComponent
                    className={`h-5 w-5 transition-all duration-300 ${
                        isActive
                            ? 'text-primary'
                            : 'group-hover:scale-110'
                    }`}
                />
                <span className="font-medium">
                  {t(item.key as any)}
                </span>

                {/* 激活状态指示器 */}
                {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 bg-primary" />
                )}
              </Link>
          );
        })}
      </nav>
  );
}