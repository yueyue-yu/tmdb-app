import Hero from '@/app/components/hero';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('HomePage');
  const navT = await getTranslations('Navigation');
  const commonT = await getTranslations('Common');

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Translated Content */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-xl text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Navigation Demo */}
      <div className="bg-base-100 p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Navigation (Translated):</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="badge badge-primary">{navT('home')}</div>
          <div className="badge badge-secondary">{navT('movies')}</div>
          <div className="badge badge-accent">{navT('tv')}</div>
          <div className="badge badge-neutral">{navT('people')}</div>
          <div className="badge badge-info">{navT('search')}</div>
          <div className="badge badge-success">{navT('favorites')}</div>
        </div>
      </div>

      {/* Common Phrases Demo */}
      <div className="bg-base-100 p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Common Phrases:</h2>
        <div className="space-y-2">
          <p><strong>Loading:</strong> {commonT('loading')}</p>
          <p><strong>Error:</strong> {commonT('error')}</p>
          <p><strong>Retry:</strong> {commonT('retry')}</p>
        </div>
      </div>

      {/* Original Hero Component */}
      <Hero />
    </div>
  );
}
