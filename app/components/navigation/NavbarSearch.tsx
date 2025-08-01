'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface NavbarSearchProps {
  className?: string;
}

/**
 * 移动端专用的导航栏搜索链接 (使用现代 Next.js <Link> API)。
 * 点击时会直接跳转到 /search 页面。
 */
export default function NavbarSearch({ className = '' }: NavbarSearchProps) {
  const t = useTranslations('Navigation');
  return (
      <Link
          href="/search"
          className={`p-2 rounded-lg transition-all duration-300 text-base-content/70 hover:text-primary hover:bg-primary/5 ${className}`}
          aria-label={t('search')}
          title={t('search')}
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </Link>
  );
}