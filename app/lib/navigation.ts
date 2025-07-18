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
    { key: 'movies', path: '/home/movie', icon: FilmIcon },
    { key: 'tv', path: '/home/tv', icon: TvIcon },
    { key: 'people', path: '/home/people', icon: UserIcon },
    { key: 'search', path: '/home/search', icon: MagnifyingGlassIcon },
    { key: 'favorites', path: '/home/favorites', icon: HeartIcon },
];
