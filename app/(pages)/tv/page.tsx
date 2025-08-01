/**
 * 电视剧主页 - /tv
 * 重定向到默认分类
 */

import { redirect } from 'next/navigation';
import { DEFAULT_CATEGORY } from '@/app/lib/utils/categoryUtils';

export default function TvPage() {
  redirect(`/tv/${DEFAULT_CATEGORY}`);
}

// 生成静态路径
export function generateStaticParams() {
  return [];
}
