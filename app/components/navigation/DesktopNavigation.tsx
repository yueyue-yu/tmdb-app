'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MAIN_NAVIGATION, isPathActive } from '@/app/config/navigation';

interface DesktopNavigationProps {
  isScrolled?: boolean;
  className?: string;
}

/**
 * 桌面端导航菜单组件
 */
export default function DesktopNavigation({ isScrolled = false, className = '' }: DesktopNavigationProps) {
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
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              isActive
                ? isScrolled
                  ? 'bg-primary/10 text-primary'
                  : 'bg-white/20 text-cyan-200'
                : isScrolled
                  ? 'text-base-content/70 hover:text-primary hover:bg-primary/5'
                  : 'text-white/80 hover:text-cyan-200 hover:bg-white/10'
            }`}
            aria-label={t(item.key as any)}
          >
            <IconComponent 
              className={`h-5 w-5 transition-all duration-300 ${
                isActive
                  ? isScrolled
                    ? 'text-primary'
                    : 'text-cyan-200'
                  : 'group-hover:scale-110'
              }`} 
            />
            <span className="font-medium">
              {t(item.key as any)}
            </span>
            
            {/* 激活状态指示器 */}
            {isActive && (
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
                isScrolled ? 'bg-primary' : 'bg-cyan-300'
              }`} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
