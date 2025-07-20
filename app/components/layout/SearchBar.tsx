'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SearchBar() {
    const t = useTranslations('Search');
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');

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

    // 处理搜索提交
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) {
            // 如果没有输入内容，直接跳转到搜索页面
            router.push('/home/search');
            return;
        }

        // 跳转到搜索页面并传递查询参数
        const params = new URLSearchParams({
            q: query.trim(),
            type: 'all',
            page: '1'
        });

        router.push(`/home/search?${params.toString()}`);

        // 清空输入框并失去焦点
        setQuery('');
        searchInputRef.current?.blur();
    };

    // 处理输入框点击 - 如果没有内容则跳转到搜索页面
    const handleInputClick = () => {
        if (!query.trim()) {
            router.push('/home/search');
        }
    };

    return (
        <div className="form-control hidden md:block mr-4">
            <form onSubmit={handleSubmit}>
                <label className="input input-bordered flex items-center gap-2 w-72 cursor-pointer">
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
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onClick={handleInputClick}
                        className="grow cursor-pointer"
                        placeholder={t('placeholder')}
                        autoComplete="off"
                    />
                    <kbd className="kbd kbd-sm">⌘</kbd>
                    <kbd className="kbd kbd-sm">K</kbd>
                </label>
            </form>
        </div>
    );
}
