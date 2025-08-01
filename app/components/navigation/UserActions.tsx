// 文件: UserActions.jsx (完整修改版)

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    SunIcon,
    LanguageIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import ThemeSelector from '../layout/ThemeSelector';
import LanguageSelector from '../layout/LanguageSelector';

interface UserActionsProps {
    isMobile?: boolean;
    className?: string;
}

/**
 * 用户操作组件
 * 包含主题切换、语言切换、用户菜单等
 * (移除了滚动状态的样式变化，采用固定样式)
 */
export default function UserActions({ isMobile = false, className = '' }: UserActionsProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const t = useTranslations('Navigation');

    // 移动端版本 - 简化显示
    if (isMobile) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <ThemeSelector />
                <LanguageSelector />
            </div>
        );
    }

    // 桌面端版本 - 完整功能
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <ThemeSelector />
            <LanguageSelector />

            {/* 用户菜单 */}
            <div className="relative">
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 rounded-lg transition-all duration-300 text-base-content/70 hover:text-primary hover:bg-primary/5"
                    aria-label={t('userProfile')}
                >
                    <UserCircleIcon className="h-6 w-6" />
                </button>

                {/* 用户下拉菜单 */}
                {isUserMenuOpen && (
                    <>
                        {/* 遮罩层 */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsUserMenuOpen(false)}
                        />

                        {/* 菜单内容 */}
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50 bg-base-100 border-base-300">
                            <div className="py-2">
                                <button
                                    className="w-full px-4 py-2 text-left flex items-center gap-3 transition-all duration-300 text-base-content hover:bg-primary/5 hover:text-primary"
                                >
                                    <UserCircleIcon className="h-5 w-5" />
                                    {t('userProfile')}
                                </button>

                                <button
                                    className="w-full px-4 py-2 text-left flex items-center gap-3 transition-all duration-300 text-base-content hover:bg-primary/5 hover:text-primary"
                                >
                                    <Cog6ToothIcon className="h-5 w-5" />
                                    {t('settings')}
                                </button>

                                <hr className="my-2 border-base-300" />

                                <button
                                    className="w-full px-4 py-2 text-left flex items-center gap-3 transition-all duration-300 text-error hover:bg-error/5"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    {t('logout')}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}