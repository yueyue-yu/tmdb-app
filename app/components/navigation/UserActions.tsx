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
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import UserMenu from "@/app/components/navigation/UserMenu";

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
            <UserMenu onLogout={function(): void {
                throw new Error('Function not implemented.');
            } } />
        </div>
    );
}