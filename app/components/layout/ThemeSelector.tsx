'use client';

import { SwatchIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useTheme } from '../../hooks/useTheme';
import { type Theme } from '../../lib/themeUtils';

interface ThemeSelectorProps {
    isScrolled?: boolean;
}

export default function ThemeSelector({ isScrolled = false }: ThemeSelectorProps) {
    const t = useTranslations('Theme');
    const themeT = useTranslations('Themes');
    const { currentTheme, setTheme, themes, currentThemeInfo, isInitialized } = useTheme();

    const handleThemeChange = (themeName: string) => {
        setTheme(themeName);
    };

    // 如果主题未初始化，显示加载状态（避免闪烁）
    if (!isInitialized) {
        return (
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className={`p-2 rounded-lg transition-all duration-300 ${
                    isScrolled
                        ? 'text-base-content/70 hover:text-primary hover:bg-primary/5'
                        : 'text-white/80 hover:text-cyan-200 hover:bg-white/10'
                }`}>
                    <SwatchIcon className="h-6 w-6" />
                </label>
            </div>
        );
    }

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className={`p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                    ? 'text-base-content/70 hover:text-primary hover:bg-primary/5'
                    : 'text-white/80 hover:text-cyan-200 hover:bg-white/10'
            }`}>
                <SwatchIcon className="h-6 w-6" />
            </label>
            <div tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-80 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-base-300">
                    <h3 className="font-bold text-sm text-base-content">{t('selectTheme')}</h3>
                    <p className="text-xs text-base-content/60 mt-1">
                        {t('current')}: {currentThemeInfo.emoji} {themeT(currentThemeInfo.labelKey as any)}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-2 p-3">
                    {themes.map((theme: Theme) => (
                        <button
                            key={theme.name}
                            className={`btn btn-sm justify-start gap-2 ${
                                currentTheme === theme.name ? 'btn-primary' : 'btn-ghost'
                            }`}
                            onClick={() => handleThemeChange(theme.name)}
                        >
                            <span>{theme.emoji}</span>
                            <span className="text-xs">{themeT(theme.labelKey as any)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
