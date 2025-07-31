import {
    HomeIcon,
    FilmIcon,
    TvIcon,
    UserIcon,
    MagnifyingGlassIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';

export interface MenuItem {
    key: string; // 翻译键
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const MENU_ITEMS: MenuItem[] = [
    { key: 'home', path: '/home', icon: HomeIcon },
    { key: 'movies', path: '/movie', icon: FilmIcon },
    { key: 'tv', path: '/tv', icon: TvIcon },
    { key: 'search', path: '/search', icon: MagnifyingGlassIcon },
];
