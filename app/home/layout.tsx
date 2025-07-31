import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import ThemeSelector from '../components/layout/ThemeSelector';
import LanguageSelector from '../components/layout/LanguageSelector';
import SearchBar from '../components/layout/SearchBar';
import Navigation from '../components/layout/Navigation';
import MobileSidebar from '../components/layout/MobileSidebar';
import { getTranslations } from 'next-intl/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const t = await getTranslations('Layout');

    return (
        <div className="flex flex-col h-screen bg-base-200">
            {/* 1. Top Bar (Fixed) */}
            <header className="navbar bg-base-100 border-b border-base-300 shadow-sm fixed top-0 left-0 right-0 z-30 h-16">
                {/* Logo */}
                <div className="navbar-start">
                    {/* 移动端汉堡菜单按钮 */}
                    <MobileSidebar />

                    <div className="flex items-center justify-center gap-2 ml-2 lg:ml-0">
                        <span className="text-xl">🎭</span>
                        <h1 className="text-xl font-bold text-primary hidden sm:block">TMDB</h1>
                    </div>
                </div>

                {/* Search & Actions */}
                <div className="navbar-end gap-2">
                    <SearchBar />
                    <LanguageSelector />
                    <ThemeSelector />

                    {/* Notifications */}
                    <button className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <BellIcon className="h-6 w-6" />
                            <span className="badge badge-xs badge-primary indicator-item"></span>
                        </div>
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" alt="User Avatar" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a className="justify-between">{t('personalCenter')} <span className="badge">{t('new')}</span></a></li>
                            <li><a>{t('settings')}</a></li>
                            <li><a>{t('logout')}</a></li>
                        </ul>
                    </div>
                </div>
            </header>

            {/* Content Area below Top Bar */}
            <div className="flex flex-1 pt-16 overflow-hidden">
                <Navigation />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}