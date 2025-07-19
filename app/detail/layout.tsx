/**
 * 详情页面专用布局
 * 提供简洁的详情页面体验，不包含侧边栏和顶部栏
 */

import React from 'react';

export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-100">
      {children}
    </div>
  );
}
