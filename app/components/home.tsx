'use client';

import Link from 'next/link';
import {
    FilmIcon,
    TvIcon,
    UserIcon,
    MagnifyingGlassIcon,
    CodeBracketSquareIcon,
    FireIcon,
    StarIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export default function Home() {
    const t = useTranslations('Features');
    const heroT = useTranslations('Hero');
    const features = [
        {
            title: t('popularMovies'),
            description: t('popularMoviesDesc'),
            icon: <FilmIcon className="h-8 w-8"/>,
            path: '/movies/popular',
            color: 'bg-red-500'
        },
        {
            title: t('tvShows'),
            description: t('tvShowsDesc'),
            icon: <TvIcon className="h-8 w-8"/>,
            path: '/tv',
            color: 'bg-blue-500'
        },
        {
            title: t('celebrities'),
            description: t('celebritiesDesc'),
            icon: <UserIcon className="h-8 w-8"/>,
            path: '/people',
            color: 'bg-green-500'
        },
        {
            title: t('smartSearch'),
            description: t('smartSearchDesc'),
            icon: <MagnifyingGlassIcon className="h-8 w-8"/>,
            path: '/search',
            color: 'bg-purple-500'
        },
        {
            title: t('apiTest'),
            description: t('apiTestDesc'),
            icon: <CodeBracketSquareIcon className="h-8 w-8"/>,
            path: '/api-test',
            color: 'bg-orange-500'
        }
    ];

    return (

        <div className="max-w-6xl mx-auto">
            <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl mb-12">
                <div className="hero-content text-center py-20">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold mb-6">
                            {heroT('title')}
                        </h1>
                        <p className="text-xl mb-8 opacity-90">
                            {heroT('subtitle')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            <div className="badge badge-accent badge-lg">
                                <StarIcon className="h-4 w-4 mr-1"/>
                                {heroT('millionResources')}
                            </div>
                            <div className="badge badge-accent badge-lg">
                                <FireIcon className="h-4 w-4 mr-1"/>
                                {heroT('realTimeUpdate')}
                            </div>
                            <div className="badge badge-accent badge-lg">
                                <CodeBracketSquareIcon className="h-4 w-4 mr-1"/>
                                API 支持
                            </div>
                        </div>
                        <Link href="/search" className="btn btn-accent btn-lg">
                            <PlayIcon className="h-5 w-5 mr-2"/>
                            {heroT('startExploring')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Welcome Card */}
            <div className="card bg-base-200 shadow-xl mb-12">
                <div className="card-body p-8">
                    <div className="flex items-center mb-6">
                        <div className="avatar">
                            <div className="w-16 rounded-full bg-primary">
                                <span className="text-2xl">🎬</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h2 className="card-title text-2xl">电影数据库管理系统</h2>
                            <p className="text-base-content/70">基于 TMDB API 构建的现代化电影信息平台</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <FilmIcon className="h-8 w-8"/>
                            </div>
                            <div className="stat-title">电影资源</div>
                            <div className="stat-value text-primary">100万+</div>
                            <div className="stat-desc">覆盖全球电影</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <TvIcon className="h-8 w-8"/>
                            </div>
                            <div className="stat-title">电视剧</div>
                            <div className="stat-value text-secondary">50万+</div>
                            <div className="stat-desc">精彩剧集内容</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-accent">
                                <UserIcon className="h-8 w-8"/>
                            </div>
                            <div className="stat-title">明星信息</div>
                            <div className="stat-value text-accent">200万+</div>
                            <div className="stat-desc">演员导演资料</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">探索功能</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="card-body">
                                <div
                                    className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="card-title">{feature.title}</h3>
                                <p className="text-base-content/70 mb-4">{feature.description}</p>
                                <div className="card-actions">
                                    <Link href={feature.path} className="btn btn-primary btn-sm">
                                        探索
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}
