import Link from 'next/link';
import {
  FilmIcon,
  StarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';

export default async function Hero() {
    const t = await getTranslations('Hero');
    return (<div
        className="hero min-h-screen"
        style={{
            backgroundImage:
                "url(/hero.png)",
        }}
    >
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content text-neutral-content text-center">
            <div className="max-w-2xl">
                <div className="flex justify-center mb-6">
                    <FilmIcon className="h-16 w-16 text-primary" />
                </div>
                <h1 className="mb-5 text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-2xl">
                    {t('title')}
                </h1>
                <p className="mb-8 text-xl leading-relaxed drop-shadow-lg">
                    {t('subtitle')}
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <div className="badge badge-primary badge-lg">
                        <StarIcon className="h-4 w-4 mr-1" />
                        {t('millionResources')}
                    </div>
                    <div className="badge badge-accent badge-lg">
                        <PlayIcon className="h-4 w-4 mr-1" />
                        {t('realTimeUpdate')}
                    </div>
                    <div className="badge badge-secondary badge-lg">
                        {t('freeAccess')}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/home" className="btn btn-primary btn-lg">
                        <PlayIcon className="h-5 w-5 mr-2" />
                        {t('startExploring')}
                    </Link>
                    <Link href="/search" className="btn btn-outline btn-lg">
                        {t('searchMovies')}
                    </Link>
                </div>
            </div>
        </div>
    </div>)
}

