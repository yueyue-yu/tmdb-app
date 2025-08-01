'use client';

import { useNavbarState } from '@/app/hooks/useScrollPosition';
import NavbarLogo from './NavbarLogo';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import NavbarSearch from './NavbarSearch';
import UserActions from './UserActions';

interface FloatingNavbarProps {
  className?: string;
}

/**
 * 浮动导航栏主组件
 * 根据滚动状态自动调整样式和行为
 */
export default function FloatingNavbar({ className = '' }: FloatingNavbarProps) {
  const {isVisible, shouldShowBackground, shouldShowShadow } = useNavbarState(100);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${className}`}
    >
      {/* 导航栏容器 */}
      <div className={`transition-all duration-300 ${
        shouldShowBackground
          ? 'bg-base-100/95 backdrop-blur-lg border-b border-base-300/50'
          : 'bg-gradient-to-b from-white/30 via-white/10 to-transparent backdrop-blur-2xl'
      } ${
        shouldShowShadow ? 'shadow-lg' : ''
      }`}>
        
        {/* 导航栏内容 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* 左侧：移动端菜单 + Logo */}
            <div className="flex items-center gap-4">
              <MobileNavigation/>
              <NavbarLogo/>
            </div>
            {/* 中间：桌面端导航菜单 */}
            <DesktopNavigation/>
            {/* 右侧：搜索 + 用户操作 */}
            <div className="flex items-center gap-4">
              {/* 桌面端搜索 */}
              <NavbarSearch className="hidden md:block" />
              
              {/* 移动端搜索 */}
              <NavbarSearch  isMobile className="md:hidden" />
              
              {/* 用户操作 */}
              <UserActions className="hidden sm:flex" />
            </div>
          </div>
        </div>

        {/* 冰雪主题装饰线 */}
        {!isVisible && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
        )}
      </div>

      {/* 冰晶装饰元素 */}
      {!isVisible && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-1/4 w-1 h-1 bg-cyan-300/40 rounded-full animate-pulse" />
          <div className="absolute top-8 right-1/3 w-0.5 h-0.5 bg-blue-200/30 rounded-full animate-ping" />
          <div className="absolute top-6 left-3/4 w-1.5 h-1.5 bg-indigo-300/20 rounded-full animate-pulse delay-1000" />
        </div>
      )}
    </header>
  );
}
