'use client';

import {
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

type UserMenuProps = {
    onLogout: () => void;
};

export default function UserMenu({ onLogout }: UserMenuProps) {
    const t = useTranslations('Navigation');

    const handleProfileClick = () => {
        console.log('Profile clicked');
    };

    const handleSettingsClick = () => {
        console.log('Settings clicked');
    };

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle group"
                aria-label={t('userProfile')}
            >
                <UserCircleIcon className="h-6 w-6 text-base-content/70" />
            </div>

            <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-4"
            >
                <li>
                    <a onClick={handleProfileClick}>
                        <UserCircleIcon className="h-5 w-5" />
                        {t('userProfile')}
                    </a>
                </li>
                <li>
                    <a onClick={handleSettingsClick}>
                        <Cog6ToothIcon className="h-5 w-5" />
                        {t('settings')}
                    </a>
                </li>
                <div className="divider my-1"></div>
                <li>
                    <a className="text-error hover:bg-error/10" onClick={onLogout}>
                        <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                        {t('logout')}
                    </a>
                </li>
            </ul>
        </div>
    );
}