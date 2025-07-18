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

  // 获取当前语言设置
  useEffect(() => {
    const locale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] || 'zh';
    setCurrentLocale(locale);
  }, []);

  // 切换语言
  const handleLanguageChange = async (locale: string) => {
    try {
      // 设置cookie
      document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      
      // 刷新页面以应用新语言
      window.location.reload();
    } catch (error) {
      console.error('切换语言失败:', error);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <LanguageIcon className="h-6 w-6" />
      </label>
      <div tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-100 rounded-box w-48">
        <div className="p-3 border-b border-base-300">
          <h3 className="font-bold text-sm text-base-content">{t('language')}</h3>
          <p className="text-xs text-base-content/60 mt-1">
            当前: {currentLanguage.flag} {currentLanguage.name}
          </p>
        </div>
        <div className="p-2">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`btn btn-sm w-full justify-start gap-2 mb-1 ${
                currentLocale === language.code ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
              {currentLocale === language.code && (
                <span className="ml-auto text-xs opacity-60">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
