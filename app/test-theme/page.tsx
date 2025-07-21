'use client';

import { useTheme } from '../hooks/useTheme';

// 注意：客户端组件不能直接导出 metadata，需要在父级服务端组件中设置

export default function TestThemePage() {
  const { currentTheme, setTheme, themes, currentThemeInfo, isInitialized } = useTheme();

  if (!isInitialized) {
    return <div className="p-8">Loading theme...</div>;
  }

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-base-content mb-8">
          主题系统测试页面
        </h1>
        
        <div className="card bg-base-200 shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">当前主题信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>主题名称:</strong> {currentTheme}</p>
              <p><strong>表情符号:</strong> {currentThemeInfo.emoji}</p>
              <p><strong>翻译键:</strong> {currentThemeInfo.labelKey}</p>
            </div>
            <div>
              <p><strong>初始化状态:</strong> {isInitialized ? '✅ 已初始化' : '❌ 未初始化'}</p>
              <p><strong>可用主题数量:</strong> {themes.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">快速主题切换</h2>
          <div className="flex flex-wrap gap-2">
            {['light', 'dark', 'cupcake', 'cyberpunk', 'synthwave', 'retro'].map((theme) => (
              <button
                key={theme}
                className={`btn btn-sm ${currentTheme === theme ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTheme(theme)}
              >
                {themes.find(t => t.name === theme)?.emoji} {theme}
              </button>
            ))}
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">所有可用主题</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.name}
                className={`btn btn-sm justify-start gap-2 ${
                  currentTheme === theme.name ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => setTheme(theme.name)}
              >
                <span>{theme.emoji}</span>
                <span className="text-xs truncate">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
