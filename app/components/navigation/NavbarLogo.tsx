'use client';

import Link from 'next/link';
import { FilmIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface NavbarLogoProps {
  isScrolled?: boolean;
  className?: string;
}

/**
 * 导航栏Logo组件
 * 支持滚动状态的样式变化
 */
export default function NavbarLogo({ isScrolled = false, className = '' }: NavbarLogoProps) {
  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2 group transition-all duration-300 ${className}`}
      aria-label="ICE•ICE FILM 首页"
    >
      {/* 图标容器 */}
      <div className="relative">
        <FilmIcon 
          className={`h-8 w-8 transition-all duration-300 ${
            isScrolled 
              ? 'text-primary' 
              : 'text-cyan-300 group-hover:text-cyan-200'
          }`} 
        />
        <SparklesIcon 
          className={`absolute -top-1 -right-1 h-4 w-4 transition-all duration-300 ${
            isScrolled 
              ? 'text-primary/60' 
              : 'text-blue-200 animate-pulse'
          }`} 
        />
      </div>
      
      {/* 品牌文字 */}
      <div className="hidden sm:block">
        <div className={`font-bold text-lg leading-tight transition-all duration-300 ${
          isScrolled 
            ? 'text-base-content' 
            : 'text-white'
        }`}>
          <span className={`transition-all duration-300 ${
            isScrolled 
              ? 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent'
          }`}>
            ICE•ICE
          </span>
          <br />
          <span className={`text-sm font-medium transition-all duration-300 ${
            isScrolled 
              ? 'text-base-content/70' 
              : 'text-slate-200'
          }`}>
            FILM
          </span>
        </div>
      </div>
      
      {/* 移动端简化版本 */}
      <div className="sm:hidden">
        <span className={`font-bold text-lg transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent'
        }`}>
          ICE•ICE
        </span>
      </div>
    </Link>
  );
}
