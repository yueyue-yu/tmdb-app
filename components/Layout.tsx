'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  FilmIcon,
  TvIcon,
  UserIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  FireIcon,
  BellIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [currentTheme, setCurrentTheme] = useState('dark'); // 默认深色主题
  const pathname = usePathname();
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // DaisyUI 可用主题列表
  const themes = [
    { name: 'light', label: '浅色', emoji: '☀️' },
    { name: 'dark', label: '深色', emoji: '🌙' },
    { name: 'cupcake', label: '纸杯蛋糕', emoji: '🧁' },
    { name: 'bumblebee', label: '大黄蜂', emoji: '🐝' },
    { name: 'emerald', label: '翡翠', emoji: '💚' },
    { name: 'corporate', label: '商务', emoji: '🏢' },
    { name: 'synthwave', label: '合成波', emoji: '🌆' },
    { name: 'retro', label: '复古', emoji: '📻' },
    { name: 'cyberpunk', label: '赛博朋克', emoji: '🤖' },
    { name: 'valentine', label: '情人节', emoji: '💖' },
    { name: 'halloween', label: '万圣节', emoji: '🎃' },
    { name: 'garden', label: '花园', emoji: '🌻' },
    { name: 'forest', label: '森林', emoji: '🌲' },
    { name: 'aqua', label: '海洋', emoji: '🌊' },
    { name: 'lofi', label: 'Lo-fi', emoji: '🎵' },
    { name: 'pastel', label: '粉彩', emoji: '🎨' },
    { name: 'fantasy', label: '幻想', emoji: '🦄' },
    { name: 'wireframe', label: '线框', emoji: '📐' },
    { name: 'black', label: '纯黑', emoji: '⚫' },
    { name: 'luxury', label: '奢华', emoji: '💎' },
    { name: 'dracula', label: '德古拉', emoji: '🧛' },
    { name: 'cmyk', label: 'CMYK', emoji: '🖨️' },
    { name: 'autumn', label: '秋季', emoji: '🍂' },
    { name: 'business', label: '商业', emoji: '💼' },
    { name: 'acid', label: '酸性', emoji: '🧪' },
    { name: 'lemonade', label: '柠檬水', emoji: '🍋' },
    { name: 'night', label: '夜晚', emoji: '🌃' },
    { name: 'coffee', label: '咖啡', emoji: '☕' },
    { name: 'winter', label: '冬季', emoji: '❄️' },
    { name: 'dim', label: '昏暗', emoji: '🔅' },
    { name: 'nord', label: 'Nord', emoji: '🏔️' },
    { name: 'sunset', label: '日落', emoji: '🌅' },
  ];

  // DaisyUI 主题切换逻辑
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', currentTheme);
    // 保存到 localStorage
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // 页面加载时读取保存的主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes.find(t => t.name === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

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

  const menuItems: MenuItem[] = [
    { text: '首页', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { text: '热门电影', path: '/movies/popular', icon: <FireIcon className="w-5 h-5" /> },
    { text: '电影', path: '/movies', icon: <FilmIcon className="w-5 h-5" /> },
    { text: '电视剧', path: '/tv', icon: <TvIcon className="w-5 h-5" /> },
    { text: '演员', path: '/people', icon: <UserIcon className="w-5 h-5" /> },
    { text: '搜索', path: '/search', icon: <MagnifyingGlassIcon className="w-5 h-5" /> },
    { text: '收藏', path: '/favorites', icon: <HeartIcon className="w-5 h-5" /> },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
  };

  const currentThemeInfo = themes.find(t => t.name === currentTheme) || themes[1];

  return (
    <div className="flex flex-col h-screen bg-base-200">
      {/* 1. Top Bar (Fixed) */}
      <header className="navbar bg-base-100 border-b border-base-300 shadow-sm fixed top-0 left-0 right-0 z-30 h-16">
        {/* Logo */}
        <div className="navbar-start">
           <div className="flex items-center justify-center w-32 gap-2">
            <span className="text-xl">🎭</span>
            <h1 className="text-xl font-bold text-primary hidden sm:block">TMDB</h1>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="navbar-end gap-2">
          {/* Search Bar */}
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

          {/* Theme Selector */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <SwatchIcon className="h-6 w-6" />
            </label>
            <div tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-80 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-base-300">
                <h3 className="font-bold text-sm text-base-content">选择主题</h3>
                <p className="text-xs text-base-content/60 mt-1">当前: {currentThemeInfo.emoji} {currentThemeInfo.label}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    className={`btn btn-sm justify-start gap-2 ${
                      currentTheme === theme.name ? 'btn-primary' : 'btn-ghost'
                    }`}
                    onClick={() => handleThemeChange(theme.name)}
                  >
                    <span>{theme.emoji}</span>
                    <span className="text-xs">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <BellIcon className="h-6 w-6" />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>

          {/* User Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a className="justify-between">个人中心 <span className="badge">New</span></a></li>
              <li><a>设置</a></li>
              <li><a>退出</a></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Content Area below Top Bar */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* 2. Left Navbar */}
        <aside className="w-48 bg-base-100 border-r border-base-300 hidden lg:block overflow-y-auto">
          <ul className="menu p-4 w-full text-base-content space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className={`${isActivePath(item.path) ? 'active' : ''} py-3 text-base font-medium`}>
                  {item.icon}
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* 3. Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}