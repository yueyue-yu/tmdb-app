'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {ChevronRightIcon, XMarkIcon} from '@heroicons/react/24/outline';
import { MAIN_NAVIGATION, USER_NAVIGATION, isPathActive } from '@/app/config/navigation';
import UserActions from './UserActions';



export default function SidebarContent() {
    const pathname = usePathname();
    const t = useTranslations('Navigation');

    return (
        <>
            {/* 菜单面板，使用不透明的 bg-base-200 或 bg-base-100 (如果你的 base-100 本身不透明) */}
            <div className="h-full w-80 max-w-[85vw] font-extrabold bg-base-100
                          z-50 backdrop-blur-2xl
                         lg:hidden"
            >
                {/* 菜单头部 */}
                <div className="flex items-center justify-between p-4 border-b border-base-300">
                    <div className="flex items-center gap-3">
                        <Link href="/"  className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">I</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-base-content">ICE•ICE FILM</h2>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 菜单内容区域，可滚动 */}
                <div className="h-[calc(100%-140px)] overflow-y-auto">
                    {/* 主导航 */}
                    <nav className="p-4">
                        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
                            主导航
                        </h3>
                        <ul className="space-y-1">
                            {MAIN_NAVIGATION.map((item) => {
                                // 假设 item.icon 是一个有效的 React 组件
                                const IconComponent = item.icon;
                                const isActive = isPathActive(pathname, item.path);

                                return (
                                    <li key={item.key}>
                                        <Link
                                            href={item.path}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-primary text-primary-content'
                                                    : 'text-base-content hover:bg-base-200/50' // 使用标准 hover 效果
                                            }`}

                                        >
                                            {IconComponent && <IconComponent className="h-5 w-5" />}
                                            <span className="font-medium flex-1">
                            {t(item.key as any)}
                          </span>
                                            {isActive && (
                                                <div className="w-2 h-2 bg-primary-content rounded-full" />
                                            )}
                                            <ChevronRightIcon className="h-4 w-4 opacity-50" />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* 个人中心导航 */}
                    {USER_NAVIGATION && USER_NAVIGATION.length > 0 && (
                        <nav className="p-4 border-t border-base-300">
                            <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-3">
                                个人中心
                            </h3>
                            <ul className="space-y-1">
                                {USER_NAVIGATION.map((item) => {
                                    const IconComponent = item.icon;
                                    const isActive = isPathActive(pathname, item.path);

                                    return (
                                        <li key={item.key}>
                                            <Link
                                                href={item.path}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                                                    isActive
                                                        ? 'bg-primary text-primary-content'
                                                        : 'text-base-content hover:bg-base-200/50'
                                                }`}

                                            >
                                                {IconComponent && <IconComponent className="h-5 w-5" />}
                                                <span className="font-medium flex-1">
                              {t(item.key as any)}
                            </span>
                                                {isActive && (
                                                    <div className="w-2 h-2 bg-primary-content rounded-full" />
                                                )}
                                                <ChevronRightIcon className="h-4 w-4 opacity-50" />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    )}
                </div>

                {/* 菜单底部 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-200">
                    <UserActions isMobile={true} />
                </div>
            </div>

        </>
    );
}