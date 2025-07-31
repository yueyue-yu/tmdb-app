/**
 * 分类选择器组件
 * 客户端组件，处理路由导航
 */

'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getCategoryConfigs } from '@/app/lib/categoryUtils';
import {MediaCategoryKeys, MediaTypeEnum} from "@/app/type/movie";


interface CategorySelectorProps {
    currentCategoryKey: MediaCategoryKeys;
    mediaType:MediaTypeEnum;
}

export default function CategorySelector({currentCategoryKey,mediaType}: CategorySelectorProps) {
    const pathname = usePathname();
    const t = useTranslations('Categories');
    const categoryConfigs = getCategoryConfigs(mediaType);

    return (
        <div className="mb-8">
            {/* 分类选择器 */}
            <div className="tabs tabs-boxed bg-base-100/50 backdrop-blur-sm">
                {categoryConfigs.map((category) => {
                    const IconComponent = category.icon;
                    const isActive = currentCategoryKey === category.key;
                    const href = `/${mediaType}/${category.key}`;

                    return (
                        <Link
                            key={category.key}
                            href={href}
                            className={`tab gap-2 ${isActive ? 'tab-active' : ''}`}
                            prefetch={true}
                        >
              <span className={category.color}>
                <IconComponent className="w-5 h-5"/>
              </span>
                            <span className="hidden sm:inline">{t(category.labelKey as any)}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
