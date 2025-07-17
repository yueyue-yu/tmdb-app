'use client';

import { useEffect, useRef } from 'react';

export default function SearchBar() {
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 键盘快捷键监听
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // ⌘K 或 Ctrl+K 快捷键
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="form-control hidden md:block mr-4">
            <label className="input input-bordered flex items-center gap-2 w-72">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input
                    ref={searchInputRef}
                    type="search"
                    className="grow"
                    placeholder="搜索..."
                />
                <kbd className="kbd kbd-sm">⌘</kbd>
                <kbd className="kbd kbd-sm">K</kbd>
            </label>
        </div>
    );
}
