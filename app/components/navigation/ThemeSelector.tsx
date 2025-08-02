'use client';

import { SwatchIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/app/lib/hooks/useTheme';
import { type Theme } from '../../lib/themeUtils';

export default function ThemeSelector() {
    const t = useTranslations('Theme');
    const themeT = useTranslations('Themes');
    // 直接使用从 useTheme hook 中获取的状态
    const { currentTheme, setTheme, themes, isInitialized } = useTheme();

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // handleThemeChange 保持不变，它只负责调用全局的 setTheme
        setTheme(event.target.value);
    };

    // 骨架屏（当主题未初始化时显示）
    if (!isInitialized) {
        return (
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <span className="skeleton h-6 w-6"></span>
                </div>
            </div>
        );
    }

    // 主题选择器 UI
    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle group">
                <SwatchIcon className="h-6 w-6 text-base-content/70 group-hover:text-primary" />
            </div>

            <ul
                // 1. 核心改动：将 currentTheme 设置为 ul 元素的 key。
                //    当 currentTheme 的值从 'light' 变为 'dark' 时，
                //    这个 ul 元素及其所有子 li 都会被 React 销毁并重新创建。
                key={currentTheme}
                tabIndex={0}
                className="dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-40 max-h-96 overflow-y-auto"
            >
                {themes.map((theme: Theme) => (
                    <li key={theme.name}>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className={`theme-controller btn btn-sm btn-block justify-start
                                {/* 2. class 和 checked 的判断逻辑恢复原样，直接使用 currentTheme */}
                                ${currentTheme === theme.name ? 'btn-active' : 'btn-ghost'}
                            `}
                            aria-label={`${theme.emoji} ${themeT(theme.labelKey as any)}`}
                            value={theme.name}
                            checked={currentTheme === theme.name}
                            onChange={handleThemeChange}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}