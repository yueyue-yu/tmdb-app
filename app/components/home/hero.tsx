'use client';

import Link from 'next/link';
import {
  FilmIcon,
  StarIcon,
  PlayIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export default function Hero() {
    const t = useTranslations('Hero');

    // 滚动到内容区域的函数
    const scrollToContent = () => {
        const contentSection = document.getElementById('content');
        if (contentSection) {
            contentSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* 冰雪主题渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-600 to-sky-800">
                {/* 冰晶效果层 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-blue-500/20 to-indigo-500/10"></div>
                {/* 动态光效 */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-blue-600/10"></div>
            </div>

            {/* 装饰性冰晶元素 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-300/30 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-1 h-1 bg-blue-200/40 rounded-full animate-ping"></div>
                <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-indigo-300/20 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 right-1/3 w-1.5 h-1.5 bg-cyan-200/30 rounded-full animate-ping delay-500"></div>
            </div>

            {/* 主要内容区域 */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
                <div className="text-center max-w-4xl mx-auto">

                    {/* 品牌标识区域 */}
                    <div className="mt-10 mb-8 md:mb-12">
                        {/* 图标装饰 */}
                        <div className="flex justify-center mb-6 md:mb-8">
                            <div className="relative">
                                <FilmIcon className="h-16 w-16 md:h-20 md:w-20 text-cyan-300 drop-shadow-lg" />
                                <SparklesIcon className="absolute -top-2 -right-2 h-6 w-6 text-blue-200 animate-pulse" />
                            </div>
                        </div>

                        {/* 主标题 */}
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6">
                            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-2xl tracking-wider">
                                ICE•ICE
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-slate-200 bg-clip-text text-transparent drop-shadow-xl tracking-wide">
                                FILM
                            </span>
                        </h1>

                        {/* 标语 */}
                        <p className="text-lg md:text-xl text-cyan-100/90 font-light tracking-wide mb-2">
                            {t('tagline')}
                        </p>
                    </div>

                    {/* 特性徽章 */}
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16 md:mb-20 px-4">
                        <div className="backdrop-blur-sm bg-cyan-500/20 border border-cyan-300/30 rounded-full px-4 py-2 md:px-6 md:py-3">
                            <div className="flex items-center gap-2 text-cyan-100">
                                <StarIcon className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-sm md:text-base font-medium">{t('millionResources')}</span>
                            </div>
                        </div>
                        <div className="backdrop-blur-sm bg-blue-500/20 border border-blue-300/30 rounded-full px-4 py-2 md:px-6 md:py-3">
                            <div className="flex items-center gap-2 text-blue-100">
                                <FireIcon className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-sm md:text-base font-medium">{t('realTimeUpdate')}</span>
                            </div>
                        </div>
                        <div className="backdrop-blur-sm bg-indigo-500/20 border border-indigo-300/30 rounded-full px-4 py-2 md:px-6 md:py-3">
                            <div className="flex items-center gap-2 text-indigo-100">
                                <SparklesIcon className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-sm md:text-base font-medium">{t('premiumExperience')}</span>
                            </div>
                        </div>
                    </div>

                    {/* 滚动提示 */}
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-cyan-200/70 text-sm md:text-base font-light">
                            向上滑动探索更多
                        </p>
                        <button
                            onClick={scrollToContent}
                            className="animate-bounce hover:animate-none transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 rounded-full p-2"
                            aria-label="滚动到内容区域"
                        >
                            <svg
                                className="w-6 h-6 md:w-8 md:h-8 text-cyan-300/80 hover:text-cyan-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 14l5-5 5 5"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

