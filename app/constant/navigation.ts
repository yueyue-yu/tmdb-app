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
    { text: '首页', path: '/home', icon: HomeIcon },
    { text: '电影', path: '/home/movies', icon: FilmIcon },
    { text: '电视剧', path: '/home/tv', icon: TvIcon },
    { text: '演员', path: '/home/people', icon: UserIcon },
    { text: '搜索', path: '/home/search', icon: MagnifyingGlassIcon },
    { text: '收藏', path: '/home/favorites', icon: HeartIcon },
];
