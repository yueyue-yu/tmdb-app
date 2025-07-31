import {
    HomeIcon,
    FilmIcon,
    TvIcon,
    UserIcon,
    MagnifyingGlassIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';

export interface MenuItem {
    text: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const MENU_ITEMS: MenuItem[] = [
    { text: '首页', path: '/', icon: HomeIcon },
    { text: '电影', path: '/movie', icon: FilmIcon },
    { text: '电视剧', path: '/tv', icon: TvIcon },
    { text: '演员', path: '/people', icon: UserIcon },
    { text: '搜索', path: 'search', icon: MagnifyingGlassIcon },
];
