'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU_ITEMS, type MenuItem } from '../../constant/navigation';

export default function Navigation() {
    const pathname = usePathname();

    const isActivePath = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <aside className="w-48 bg-base-100 border-r border-base-300 hidden lg:block overflow-y-auto">
            <ul className="menu p-4 w-full text-base-content space-y-2">
                {MENU_ITEMS.map((item: MenuItem) => {
                    const IconComponent = item.icon;
                    return (
                        <li key={item.path}>
                            <Link 
                                href={item.path} 
                                className={`${isActivePath(item.path) ? 'active' : ''} py-3 text-base font-medium`}
                            >
                                <IconComponent className="w-5 h-5" />
                                {item.text}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}
