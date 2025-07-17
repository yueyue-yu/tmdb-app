import { getTvCategoryConfig, type TvCategoryConfig } from '@/app/constant/tvCategories';
import type { TvCategory } from '@/app/lib/api/tvActions';

interface TvPageHeaderProps {
  category: TvCategory;
}

export default function TvPageHeader({ category }: TvPageHeaderProps) {
  const config: TvCategoryConfig = getTvCategoryConfig(category);
  const IconComponent = config.icon;

  return (
    <div className="mb-8">
      <div className={`bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white p-6 rounded-xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-2">
          <IconComponent className="w-8 h-8" />
          <h1 className="text-3xl font-bold">{config.label}</h1>
        </div>
        <p className="text-white/90 text-lg">{config.description}</p>
      </div>
    </div>
  );
}
