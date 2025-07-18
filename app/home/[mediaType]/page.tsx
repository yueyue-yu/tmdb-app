/**
 * 动态媒体类型页面 - /home/[mediaType]
 * 重定向到默认分类
 */

import { redirect } from 'next/navigation';
import { MediaTypeEnum } from '@/app/type/movie';
import { DEFAULT_CATEGORY } from '@/app/lib/categoryUtils';

interface PageProps {
  params: Promise<{
    mediaType: string;
  }>;
}

export default async function MediaTypePage({ params }: PageProps) {
  const { mediaType } = await params;

  // 验证媒体类型是否有效
  const isValidMediaType = Object.values(MediaTypeEnum).includes(mediaType as MediaTypeEnum);

  if (!isValidMediaType) {
    redirect('/home/movie/popular'); // 默认重定向到电影
  }

  redirect(`/home/${mediaType}/${DEFAULT_CATEGORY}`);
}

// 生成静态路径
export function generateStaticParams() {
  return Object.values(MediaTypeEnum).map((mediaType) => ({
    mediaType,
  }));
}
