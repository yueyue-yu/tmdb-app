'use client';

import Link from 'next/link';
import { FilmIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface NavbarLogoProps {
  className?: string;
}

/**
 * 导航栏Logo组件
 * (移除了滚动状态的样式变化，采用固定样式)
 */
export default function NavbarLogo({ className = '' }: NavbarLogoProps) {
  return (
      <Link
          href="/"
          className={`flex items-center gap-2 group transition-all duration-300 ${className}`}
          aria-label="ICE•ICE FILM 首页"
      >
        {/* 图标容器 */}
        <div className="relative">
          <FilmIcon
              className="h-8 w-8 transition-all duration-300 text-primary"
          />
          <SparklesIcon
              className="absolute -top-1 -right-1 h-4 w-4 transition-all duration-300 text-primary/60"
          />
        </div>

        {/* 品牌文字 (桌面端) */}
        <div className="hidden sm:block">
          <div className="font-bold text-lg leading-tight transition-all duration-300 text-base-content">
          <span className="transition-all duration-300 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ICE•ICE
          </span>
            <br />
            <span className="text-sm font-medium transition-all duration-300 text-base-content/70">
            FILM
          </span>
          </div>
        </div>

        {/* 品牌文字 (移动端简化版本) */}
        <div className="sm:hidden">
        <span className="font-bold text-lg transition-all duration-300 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ICE•ICE
        </span>
        </div>
      </Link>
  );
}