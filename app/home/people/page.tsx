import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '演员',
  description: '浏览知名演员和导演的详细信息，了解他们的作品和职业生涯。',
  openGraph: {
    title: '演员 - TMDB',
    description: '浏览知名演员和导演的详细信息',
  },
};

export default function PeoplePage() {
  return (

      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">演员</h1>
        <p className="text-lg">演员页面正在开发中...</p>
      </div>

  );
}
