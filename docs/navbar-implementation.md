# ICE•ICE FILM 浮动导航栏实现文档

## 概述

ICE•ICE FILM 采用了现代化的浮动导航栏设计，具有智能滚动检测、响应式布局和冰雪主题的视觉效果。导航栏会根据用户的滚动行为动态调整样式，在 Hero 区域显示透明效果，滚动后变为实心背景。

## 核心架构

### 1. 组件层次结构

```
FloatingNavbar (主容器)
├── NavbarLogo (品牌标识)
├── DesktopNavigation (桌面端导航)
├── MobileNavigation (移动端导航)
├── NavbarSearch (搜索功能)
└── UserActions (用户操作)
    ├── ThemeSelector (主题切换)
    ├── LanguageSelector (语言切换)
    └── UserMenu (用户菜单)
```

### 2. 文件结构

```
app/components/navigation/
├── FloatingNavbar.tsx          # 主导航容器
├── NavbarLogo.tsx             # Logo 组件
├── DesktopNavigation.tsx      # 桌面端导航
├── MobileNavigation.tsx       # 移动端导航
├── NavbarSearch.tsx           # 搜索组件
└── UserActions.tsx            # 用户操作组件

app/hooks/
└── useScrollPosition.ts       # 滚动检测 Hook

app/config/
└── navigation.ts              # 导航配置
```

## 核心实现逻辑

### 1. 滚动检测系统

#### useScrollPosition Hook

```typescript
interface ScrollPosition {
  scrollY: number;        // 当前滚动位置
  isScrolled: boolean;    // 是否已滚动超过阈值
  direction: 'up' | 'down' | null;  // 滚动方向
}
```

**实现细节：**
- **防抖优化**：使用 `setTimeout` 防抖，默认 10ms
- **阈值检测**：默认 100px 作为状态切换点
- **方向检测**：记录上次滚动位置，判断滚动方向
- **性能优化**：使用 `{ passive: true }` 监听器

#### useNavbarState Hook

```typescript
interface NavbarState {
  isScrolled: boolean;      // 是否显示实心背景
  isVisible: boolean;       // 导航栏是否可见
  shouldShowBackground: boolean;  // 是否显示背景
  shouldShowShadow: boolean;     // 是否显示阴影
}
```

**状态逻辑：**
- `isScrolled`：滚动超过阈值时为 true
- `isVisible`：向下滚动时隐藏，向上滚动时显示
- `shouldShowBackground`：控制背景透明度
- `shouldShowShadow`：控制阴影效果

### 2. 导航配置系统

#### 配置文件结构

```typescript
interface NavigationItem {
  key: string;                    // 翻译键
  path: string;                   // 路由路径
  icon: React.ComponentType;      // 图标组件
  requiresAuth?: boolean;         // 是否需要认证
  external?: boolean;             // 是否外部链接
}
```

#### 主导航配置

```typescript
export const MAIN_NAVIGATION: NavigationItem[] = [
  { key: 'home', path: '/', icon: HomeIcon },
  { key: 'movies', path: '/movie/popular', icon: FilmIcon },
  { key: 'tv', path: '/tv/popular', icon: TvIcon },
  { key: 'people', path: '/people', icon: UserGroupIcon },
  { key: 'search', path: '/search', icon: MagnifyingGlassIcon },
];
```

#### 路径激活检测

```typescript
export function isPathActive(currentPath: string, itemPath: string): boolean {
  if (itemPath === '/') {
    return currentPath === '/';  // 首页精确匹配
  }
  return currentPath.startsWith(itemPath);  // 其他页面前缀匹配
}
```

### 3. 响应式布局系统

#### 断点设计

- **移动端** (< 768px)：汉堡菜单 + 侧滑导航
- **平板端** (768px - 1023px)：部分折叠菜单
- **桌面端** (≥ 1024px)：完整水平导航

#### 移动端导航逻辑

```typescript
// 侧滑菜单状态管理
const [isMenuOpen, setIsMenuOpen] = useState(false);

// 路由变化时自动关闭菜单
useEffect(() => {
  closeMenu();
}, [pathname]);

// 阻止背景滚动
useEffect(() => {
  if (isMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, [isMenuOpen]);
```

### 4. 样式状态系统

#### 动态样式计算

```typescript
// 主容器样式
const containerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  isVisible ? 'translate-y-0' : '-translate-y-full'
}`;

// 背景样式
const backgroundClasses = shouldShowBackground
  ? 'bg-base-100/95 backdrop-blur-lg border-b border-base-300/50'
  : 'bg-gradient-to-b from-black/20 via-black/10 to-transparent backdrop-blur-md';

// 阴影样式
const shadowClasses = shouldShowShadow ? 'shadow-lg' : '';
```

#### 冰雪主题装饰

```typescript
// 装饰性冰晶元素（仅在透明状态显示）
{!isScrolled && (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-4 left-1/4 w-1 h-1 bg-cyan-300/40 rounded-full animate-pulse" />
    <div className="absolute top-8 right-1/3 w-0.5 h-0.5 bg-blue-200/30 rounded-full animate-ping" />
    <div className="absolute top-6 left-3/4 w-1.5 h-1.5 bg-indigo-300/20 rounded-full animate-pulse delay-1000" />
  </div>
)}
```

### 5. 搜索功能实现

#### 搜索状态管理

```typescript
const [isExpanded, setIsExpanded] = useState(false);  // 展开状态
const [searchQuery, setSearchQuery] = useState('');   // 搜索内容
```

#### 响应式搜索设计

- **桌面端**：点击展开输入框，支持实时搜索
- **移动端**：图标按钮，点击跳转到搜索页面

#### 搜索提交逻辑

```typescript
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setIsExpanded(false);
  }
};
```

### 6. 国际化支持

#### 翻译键结构

```typescript
// messages/zh.json
{
  "Navigation": {
    "home": "首页",
    "movies": "电影",
    "tv": "电视剧",
    "people": "演员",
    "search": "搜索",
    "searchPlaceholder": "搜索电影、电视剧、演员...",
    // ... 更多翻译
  }
}
```

#### 动态翻译使用

```typescript
const t = useTranslations('Navigation');

// 在组件中使用
<span>{t(item.key as any)}</span>
```

## 性能优化策略

### 1. 滚动性能优化

- **防抖处理**：避免频繁的状态更新
- **被动监听**：使用 `{ passive: true }` 提高滚动性能
- **硬件加速**：使用 `transform` 和 `opacity` 进行动画

### 2. 组件渲染优化

- **条件渲染**：根据屏幕尺寸条件渲染组件
- **状态缓存**：避免不必要的重新计算
- **事件清理**：正确清理事件监听器

### 3. 样式优化

- **CSS 变量**：使用 Tailwind CSS 的动态类名
- **过渡动画**：统一的 300ms 过渡时间
- **层级管理**：合理的 z-index 层级设置

## 主题适配系统

### 1. 滚动状态主题

```typescript
// 透明状态（Hero 区域）
const transparentTheme = {
  text: 'text-white/80 hover:text-cyan-200',
  background: 'hover:bg-white/10',
  active: 'bg-white/20 text-cyan-200'
};

// 实心状态（内容区域）
const solidTheme = {
  text: 'text-base-content/70 hover:text-primary',
  background: 'hover:bg-primary/5',
  active: 'bg-primary/10 text-primary'
};
```

### 2. 冰雪主题元素

- **渐变背景**：深蓝到靛蓝的渐变
- **冰晶装饰**：动态的装饰性元素
- **玻璃拟态**：半透明的背景效果
- **冰蓝配色**：青色、蓝色、靛蓝的配色方案

## 无障碍访问支持

### 1. 键盘导航

- **Tab 顺序**：合理的 tabIndex 设置
- **焦点管理**：清晰的焦点指示器
- **快捷键**：支持 Enter 和 Space 键操作

### 2. 屏幕阅读器支持

- **ARIA 标签**：完整的 aria-label 属性
- **语义化标签**：使用正确的 HTML 语义
- **状态通知**：动态状态的无障碍通知

### 3. 移动端无障碍

- **触摸目标**：44px 最小触摸区域
- **手势支持**：滑动关闭菜单
- **对比度**：符合 WCAG 标准的颜色对比度

## 扩展性设计

### 1. 配置化菜单

- **动态菜单**：通过配置文件控制菜单项
- **权限控制**：支持基于权限的菜单显示
- **外部链接**：支持外部链接的菜单项

### 2. 插件化组件

- **组件插槽**：预留扩展点
- **事件系统**：支持自定义事件监听
- **主题定制**：支持自定义主题配色

### 3. 国际化扩展

- **多语言支持**：易于添加新语言
- **RTL 支持**：预留从右到左语言支持
- **本地化**：支持地区特定的功能

这个导航栏系统通过模块化设计、性能优化和用户体验考虑，为 ICE•ICE FILM 提供了一个现代化、可扩展、用户友好的导航解决方案。


---

*Your access expires in 0 days. [Purchase a subscription](https://app.augmentcode.com/account)*