'use client';

import { useState, useEffect } from 'react';
import { LanguageIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export default function LanguageSelector() {
  const t = useTranslations('Common');
  const [currentLocale, setCurrentLocale] = useState('zh');

  // 核心逻辑：从 cookie 初始化当前语言，保持不变
  useEffect(() => {
    const locale = document.cookie
        .split('; ')
        .find(row => row.startsWith('locale='))
        ?.split('=')[1] || 'zh';
    setCurrentLocale(locale);
  }, []);

  // 核心逻辑：处理语言切换（设置 cookie 并刷新），保持不变
  const handleLanguageChange = async (locale: string) => {
    try {
      document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      window.location.reload();
    } catch (error) {
      console.error('切换语言失败:', error);
    }
  };

  return (
      <div className="dropdown dropdown-end">
        {/* 触发器：使用 div role="button" 代替 label，语义更清晰 */}
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle group">
          <LanguageIcon className="h-6 w-6 text-base-content/70 group-hover:text-primary" />
        </div>

        {/* 下拉内容：使用更简洁的 ul > li > button 结构 */}
        <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-40">
          {languages.map((language) => (
              <li key={language.code}>
                <button
                    onClick={() => handleLanguageChange(language.code)}
                    // 使用 btn-active 来表示选中状态，更简洁
                    className={`btn btn-sm w-full justify-start gap-2 ${
                        currentLocale === language.code ? 'btn-active' : 'btn-ghost'
                    }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-sm">{language.name}</span>
                </button>
              </li>
          ))}
        </ul>
      </div>
  );
}