import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '主题测试',
  description: '主题系统测试页面，用于测试和预览所有可用的主题样式。',
  openGraph: {
    title: '主题测试 - TMDB',
    description: '主题系统测试页面',
  },
};

export default function TestThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
