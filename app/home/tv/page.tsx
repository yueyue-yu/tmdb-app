/**
 * 电视剧页面 - 重定向到默认分类
 */

import { redirect } from 'next/navigation';

export default function TvPage() {
  // 重定向到热门电视剧页面
  redirect('/home/tv/popular');
}
