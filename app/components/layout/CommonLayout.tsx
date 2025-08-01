'use client';

import { ReactNode } from 'react';
import FloatingNavbar from '@/app/components/navigation/FloatingNavbar';

interface CommonLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * 通用布局组件
 * 为所有非首页页面提供统一的布局结构
 * 包含浮动导航栏和适当的内容区域样式
 */
export default function CommonLayout({ children, className = '' }: CommonLayoutProps) {
  return (
    <div className="min-h-screen bg-base-100">
      <FloatingNavbar />
      {/* 主要内容区域 */}
      <main className={`pt-16 ${className}`}>
        {children}
      </main>
    </div>
  );
}
