/**
 * 电影主页 - /movie
 * 重定向到默认分类
 */

import { redirect } from 'next/navigation';
import { DEFAULT_CATEGORY } from '@/app/lib/utils/categoryUtils';

export default function MoviePage() {
  redirect(`/movie/${DEFAULT_CATEGORY}`);
}

// 生成静态路径
export function generateStaticParams() {
  return [];
}
