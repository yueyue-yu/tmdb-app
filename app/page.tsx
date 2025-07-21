import type { Metadata } from 'next';
import Hero from '@/app/components/home/hero';

export const metadata: Metadata = {
  title: '首页',
  description: '欢迎来到 TMDB 电影数据库，发现全球最新最热门的电影、电视剧和明星信息。探索无限精彩的影视世界，找到你的下一部最爱作品。',
  openGraph: {
    title: 'TMDB - 电影数据库首页',
    description: '发现全球最新最热门的电影、电视剧和明星信息',
  },
};

export default async function Home() {
    return (
      <Hero />
  );
}
