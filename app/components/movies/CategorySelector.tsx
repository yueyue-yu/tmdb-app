/**
 * 分类选择器组件
 * 客户端组件，处理路由导航
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOVIE_CATEGORIES } from '@/app/constant/movieCategories';
import type { MovieCategory } from '@/app/lib/api/movieActions';

interface CategorySelectorProps {
  currentCategory: MovieCategory;
}

export default function CategorySelector({ currentCategory }: CategorySelectorProps) {
  const pathname = usePathname();

  return (
    <div className="mb-8">
      {/* 分类选择器 */}
      <div className="tabs tabs-boxed bg-base-100/50 backdrop-blur-sm">
        {MOVIE_CATEGORIES.map((category) => {
          const IconComponent = category.icon;
          const isActive = currentCategory === category.key;
          const href = `/home/movies/${category.key}`;

          return (
            <Link
              key={category.key}
              href={href}
              className={`tab gap-2 ${isActive ? 'tab-active' : ''}`}
              prefetch={true}
            >
              <span className={category.color}>
                <IconComponent className="w-5 h-5" />
              </span>
              <span className="hidden sm:inline">{category.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
