/**
 * 演员页面 - /people
 * 展示知名演员和导演信息
 */

import type { Metadata } from 'next';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: '演员 - ICE•ICE FILM',
  description: '浏览知名演员和导演的详细信息，了解他们的作品和职业生涯。',
  openGraph: {
    title: '演员 - ICE•ICE FILM',
    description: '浏览知名演员和导演的详细信息',
  },
};

export default function PeoplePage() {
  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <UserGroupIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                演员
              </h1>
              <p className="text-base-content/60 mt-1">
                探索知名演员和导演的精彩世界
              </p>
            </div>
          </div>
        </div>

        {/* 开发中提示 */}
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserGroupIcon className="h-12 w-12 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-base-content mb-4">
              演员页面开发中
            </h2>
            
            <p className="text-base-content/60 mb-8">
              我们正在努力为您打造一个精彩的演员信息页面，敬请期待！
            </p>
            
            <div className="space-y-4 text-left bg-base-200 rounded-lg p-6">
              <h3 className="font-semibold text-base-content">即将推出的功能：</h3>
              <ul className="space-y-2 text-sm text-base-content/70">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  热门演员排行榜
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  演员详细资料和作品列表
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  导演和制片人信息
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  演员搜索和筛选功能
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}
