# 电影卡片组件重构指南

## 概述

本次重构将原有的 `MovieCardServer` 和 `MovieCardClient` 组件拆分为更小、更专注的组件，最大化利用了 React Server Components (RSC) 的优势。

## 🎯 重构目标

1. **组件拆分**: 将单体组件拆分为更小、更专注的组件
2. **RSC 优化**: 最大化利用服务端组件，将客户端组件限制在需要交互的"叶子"节点
3. **代码组织**: 将工具函数、常量和类型定义迁移到专用目录

## 📁 新的文件结构

```
app/
├── components/
│   ├── movie/                    # 新的电影组件目录
│   │   ├── index.ts             # 统一导出入口
│   │   ├── MovieCardServer.tsx  # 主服务端组件
│   │   ├── MovieCard.tsx        # 卡片主体组件
│   │   ├── MoviePoster.tsx      # 海报组件（客户端）
│   │   ├── MovieInfo.tsx        # 信息组件（服务端）
│   │   ├── PopularityBadge.tsx  # 受欢迎程度徽章
│   │   ├── RatingBadge.tsx      # 评分徽章
│   │   ├── LikeButton.tsx       # 喜欢按钮（客户端）
│   │   ├── PlayButton.tsx       # 播放按钮
│   │   ├── MovieStats.tsx       # 统计信息
│   │   ├── MovieActions.tsx     # 操作按钮区域
│   │   └── MoreActions.tsx      # 更多操作菜单（客户端）
│   ├── MovieCardServer.tsx      # 向后兼容 (deprecated)
│   └── MovieCardClient.tsx      # 向后兼容 (deprecated)
├── lib/
│   └── movieUtils.ts            # 电影相关工具函数
├── constant/
│   └── movieCard.ts             # 电影卡片常量
└── type/
    └── movieCard.ts             # 电影卡片类型定义
```

## 🔄 组件架构

### 服务端组件 (Server Components)
- `MovieCardServer.tsx` - 主要入口，负责数据预处理
- `MovieCard.tsx` - 卡片容器
- `MovieInfo.tsx` - 电影信息展示
- `PopularityBadge.tsx` - 受欢迎程度徽章
- `RatingBadge.tsx` - 评分徽章
- `PlayButton.tsx` - 播放按钮
- `MovieStats.tsx` - 统计信息
- `MovieActions.tsx` - 操作按钮容器

### 客户端组件 (Client Components)
- `MoviePoster.tsx` - 海报组件（需要图片加载状态）
- `LikeButton.tsx` - 喜欢按钮（需要交互）
- `MoreActions.tsx` - 更多操作菜单（需要交互）

## 📊 RSC 优化效果

| 组件类型 | 原有结构 | 重构后 | 优势 |
|---------|---------|-------|------|
| 服务端组件 | 1个 | 8个 | 更多静态渲染，更好的SEO |
| 客户端组件 | 1个 | 3个 | 减少JavaScript包大小 |
| 客户端边界 | 整个卡片 | 仅交互部分 | 最小化客户端代码 |

## 🚀 使用方式

### 新的推荐用法

```tsx
import { MovieCardServer } from '@/app/components/movie';

export default function MovieList({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((movie, index) => (
        <MovieCardServer 
          key={movie.id} 
          movie={movie} 
          index={index} 
        />
      ))}
    </div>
  );
}
```

### 向后兼容用法

原有的 `MovieCardServer` 和 `MovieCardClient` 仍然可以使用，但已标记为 deprecated：

```tsx
// 仍然可用，但建议迁移到新组件
import MovieCardServer from '@/app/components/MovieCardServer';
```

## 🛠 工具函数和常量

### 工具函数 (`lib/movieUtils.ts`)
- `getPosterUrl()` - 获取海报URL
- `getYear()` - 提取年份
- `getPopularityLevel()` - 计算受欢迎程度
- `getRatingBadgeClass()` - 获取评分徽章样式
- `formatVoteCount()` - 格式化投票数
- `truncateText()` - 截断文本

### 常量 (`constant/movieCard.ts`)
- `IMAGE_SIZES` - 图片尺寸配置
- `POPULARITY_THRESHOLDS` - 受欢迎程度阈值
- `RATING_THRESHOLDS` - 评分阈值
- `ANIMATION_DURATIONS` - 动画持续时间
- `DEFAULT_TEXTS` - 默认文本

### 类型定义 (`type/movieCard.ts`)
- 完整的TypeScript类型定义
- 支持严格的类型检查

## 🔧 迁移步骤

1. **立即使用**: 新组件已经可以使用，向后兼容现有代码
2. **逐步迁移**: 将现有的 `MovieCardServer` 导入替换为新的路径
3. **移除旧组件**: 在确认所有地方都已迁移后，可以删除旧的组件文件

## 🎉 收益总结

1. **更好的性能**: 最大化服务端渲染，减少客户端JavaScript
2. **更好的SEO**: 更多内容在服务端渲染
3. **更好的维护性**: 组件职责单一，易于测试和维护
4. **更好的类型安全**: 完整的TypeScript类型定义
5. **更好的代码组织**: 工具函数、常量和类型分离到专用目录
