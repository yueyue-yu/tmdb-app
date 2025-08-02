'use client';

import { SwatchIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/app/lib/hooks/useTheme';
import { type Theme } from '../../lib/themeUtils';

export default function ThemeSelector() {
    const t = useTranslations('Theme');
    const themeT = useTranslations('Themes');
    const { currentTheme, setTheme, themes, isInitialized } = useTheme();

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(event.target.value);
    };

    if (!isInitialized) {
        return (
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <span className="skeleton h-6 w-6"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle group">
                <SwatchIcon className="h-6 w-6 text-base-content/70 group-hover:text-primary" />
            </div>

            <ul
                tabIndex={0}
                className="dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-40 max-h-96 overflow-y-auto"
            >
                {themes.map((theme: Theme) => (
                    <li key={theme.name}>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className={`theme-controller btn btn-sm btn-block justify-start
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