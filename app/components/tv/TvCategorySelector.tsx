'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TV_CATEGORIES, type TvCategoryConfig } from '@/app/constant/tvCategories';
import type { TvCategory } from '@/app/lib/api/tvActions';

export default function TvCategorySelector() {
  const params = useParams();
  const currentCategory = params.category as TvCategory;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {TV_CATEGORIES.map((category: TvCategoryConfig) => {
        const IconComponent = category.icon;
        const isActive = currentCategory === category.key;
        
        return (
          <Link
            key={category.key}
            href={`/home/tv/${category.key}`}
            className={`
              btn btn-sm gap-2 transition-all duration-200
              ${isActive 
                ? `btn-primary ${category.color}` 
                : 'btn-outline hover:btn-primary'
              }
            `}
          >
            <IconComponent className="w-4 h-4" />
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}
